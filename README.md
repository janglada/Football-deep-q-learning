# Football Deep Q-Learning

A browser-based simulation that trains a football team to pass and shoot using [Karpathy's reinforcejs](https://github.com/karpathy/reinforcejs) Deep Q-Network implementation.

## What it does

Five players (Goalkeeper, Defense, Left Wing, Right Wing, Forward) are positioned at fixed coordinates on a 20×40 pitch. They share a single DQN agent that learns optimal passing and shooting strategies.

At each step, the environment provides a **State Vector**:
- A **5-element one-hot vector** indicating which player currently has the ball.

The agent selects one of **six discrete actions**:
- **PASS_0 through PASS_4**: Transfer possession to the corresponding player.
- **SHOOT**: Attempt a shot at the goal located at `(10, 40)`.

## Reward System

The agent's behavior is shaped by a reward function designed to encourage short, safe passes and moving the ball toward the opponent's goal:

| Action | Reward Formula | Description |
|--------|----------------|-------------|
| **Valid Pass** | `0.5 * (1 - smoothstep(0, 40, distance))` | Rewards shorter passes between teammates. |
| **Invalid Pass** | `-10.0` | Penalty for attempting to pass to the player who already has the ball. |
| **Shoot** | `1.0 * (1 - smoothstep(0, 40, distance_to_goal))` | Rewards shooting from a position close to the goal (e.g., from the Forward). |

*Note: After a SHOOT action, the simulation resets and possession returns to the Goalkeeper (Player 0).*

## Architecture

The system uses a **Deep Q-Learning (DQN)** agent with the following specifications:

- **Neural Network**: A feed-forward network with:
  - **Input Layer**: 5 neurons (one-hot state).
  - **Hidden Layer**: 50 neurons (using ReLU or Tanh activation).
  - **Output Layer**: 6 neurons (Q-values for each action).
- **Training Mechanics**:
  - **Experience Replay**: Stores the last 1,000 transitions to break correlation between consecutive samples.
  - **Target Network**: Updated every 100 steps to provide stable Q-value targets.
  - **Exploration**: $\epsilon$-greedy strategy, decaying from 1.0 to 0.05 over time.

```
football.html          — UI: D3 pitch, Highcharts reward chart, controls
│
├── World.js           — Web Worker: training loop, DQN agent, message bus
│   ├── Pitch.js       — Environment: state, actions, rewards
│   ├── Player.js      — Player geometry and reward helpers
│   ├── Actions.js     — Action constants
│   └── lib/rtl.js     — Karpathy's reinforcejs (DQNAgent)
```

### Worker optimisations

- **MessageChannel self-scheduler** — replaces `setInterval`. In fast mode the worker signals itself via `MessageChannel` with no ≥4 ms timer floor, maximising CPU throughput.
- **Reduced postMessage frequency** — in fast mode stats are serialised and sent to the main thread only every 10 training batches.
- **Parallel workers + population sync** — one worker is spawned per logical CPU core (max 4). Every 50 messages the best-performing agent's weights are broadcast to all others.

## Getting started

```bash
npm install
npm start        # serves on http://localhost:3000
```

Open `http://localhost:3000/football.html`, click **Start**, and watch the reward curve climb.

## Controls

| Control | Description |
|---------|-------------|
| Start / Stop | Begin or pause all training workers |
| Slow / Normal / Fast | Adjust steps-per-tick and UI update rate |
| Epsilon override | Manually set the exploration rate on all workers |
| Save Model | Serialise worker 0's network weights to `localStorage` |
| Load Model | Restore saved weights and broadcast to all workers |

## Dependencies

| Package | Purpose |
|---------|---------|
| [highcharts](https://www.highcharts.com/) v4 | Reward chart |
| [d3](https://d3js.org/) (bundled in `external/`) | Pitch SVG visualisation |
| [reinforcejs](https://github.com/karpathy/reinforcejs) (bundled in `lib/`) | DQN agent |
