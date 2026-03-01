# Football Deep Q-Learning

A browser-based simulation that trains a football team to pass and shoot using [Karpathy's reinforcejs](https://github.com/karpathy/reinforcejs) Deep Q-Network implementation.

## What it does

Five players on a 20×40 pitch share a single DQN agent. At each step the agent observes which player holds the ball (a 5-element one-hot state vector) and selects one of six actions:

| Action | Effect |
|--------|--------|
| PASS\_0 … PASS\_4 | Transfer the ball to that player. Reward scales with pass safety (shorter = higher). Passing to yourself gives −10. |
| SHOOT | Shoot at goal. Reward scales with proximity to the opponent goal. Ball resets to the goalkeeper. |

The agent learns via experience replay and a target network, decaying ε-greedy exploration from 1 → 0.05 over time.

## Architecture

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
