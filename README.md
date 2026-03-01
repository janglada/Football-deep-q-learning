# Football Deep Q-Learning

A browser-based simulation that trains a football team to pass and shoot using [Karpathy's reinforcejs](https://github.com/karpathy/reinforcejs) Deep Q-Network implementation.

## What it does

Eleven players in a **3-4-3 formation** are positioned at fixed coordinates on a 20×40 pitch. They share a single DQN agent that must discover, through trial and error, that building up play through the midfield and shooting from the forward line produces better outcomes than shooting from deep.

| Role | Players | Positions (x, y) |
|------|---------|-----------------|
| GK | 1 | (10, 0) |
| DF | 3 | (5,8) (10,8) (15,8) |
| MF | 4 | (2,18) (7,18) (13,18) (18,18) |
| FW | 3 | (4,28) (10,28) (16,28) |

At each step the environment provides an **11-element one-hot state vector** indicating which player holds the ball. The agent selects one of **12 discrete actions**: pass to any of the 11 players, or shoot.

## Reward system

The scheme is **sparse**: passes carry no reward. The only signal comes from shooting.

| Action | Reward | Notes |
|--------|--------|-------|
| Valid pass | `0` | No intermediate reward — credit propagates back via Bellman |
| Self-pass | `−1` | Penalty scaled to the maximum possible shoot reward |
| Shoot | `1 − smoothstep(0, 40, dist_to_goal)` | ~0.78 from the forward line, ~0 from the GK position |

After every SHOOT the ball resets to the goalkeeper.

The agent must learn by itself that passing forward before shooting yields higher discounted returns than shooting immediately from deep. No hand-crafted incentive tells it this.

## Architecture

```
football.html          — UI: D3 pitch + arrows, two Highcharts, controls
│
├── World.js           — Web Worker: training loop, DQN agent, message bus
│   ├── Pitch.js       — Environment: state, actions, rewards
│   ├── Player.js      — Player geometry and reward helpers
│   ├── Actions.js     — Single source of truth for team size and action encoding
│   └── lib/rtl.js     — Karpathy's reinforcejs (DQNAgent)
```

### DQN hyperparameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `gamma` | 0.99 | High discount so shoot reward propagates back across multi-step pass chains |
| `epsilon` decay | 0.9999995 | Slow decay — sparse rewards need sustained exploration |
| `epsilon_min` | 0.05 | |
| `alpha` | 0.005 | |
| `experience_size` | 5000 | Larger buffer ensures rare rewarding transitions survive long enough to be replayed |
| `experience_add_every` | 10 | |
| `learning_steps_per_iteration` | 5 | |
| `target_update_every` | 100 | |
| `num_hidden_units` | 50 | |

### Action encoding

`Actions.js` is the **single source of truth** for team size. Action index `i ∈ [0, NUM_PLAYERS)` means "pass to player i"; action `NUM_PLAYERS` means shoot. `Pitch.js` derives `num_players` from `Actions.NUM_PLAYERS` so the two can never drift out of sync.

### Worker optimisations

- **MessageChannel self-scheduler** — in fast mode the worker signals itself via `MessageChannel` (no ≥4 ms timer floor), maximising CPU throughput.
- **Reduced postMessage frequency** — in fast mode stats are serialised and sent to the main thread only every 10 training batches.
- **Parallel workers + population sync** — one worker is spawned per logical CPU core (max 5). Every 50 messages the worker with the highest 5-message rolling average reward broadcasts its weights to all others.

## Visualisations

### Pitch (D3)
Players are drawn as coloured circles (blue = GK, green = DF, red = MF, orange = FW). The ball holder is highlighted in red.

### Policy arrows
Every 30 training messages the UI requests the agent's current Q-value matrix via a side-effect-free forward pass. One arrow is drawn per player pointing at the `argmax Q` target — another player (pass) or the goal at `(10, 40)` (shoot).

**What to look for:**
- **Early**: arrows point randomly.
- **Converging**: arrows form a chain — GK → DF → MF → FW → goal.
- **Pathology**: all arrows point to the same player, indicating a shortcut rather than genuine strategy.

### Reward chart (Highcharts)
Average reward per training batch from worker 0, plotted against step count.

### Q-value traces (Highcharts)
Four key state-action values sampled every 30 messages:

| Series | Expected behaviour |
|--------|--------------------|
| Q(GK → shoot) | Stays near 0 — shooting from deep has low discounted value |
| Q(GK → best pass) | Rises as the agent learns that passing forward is preferable |
| Q(FW → shoot) | Climbs toward ~0.78 — the primary learning signal |
| Q(FW → best pass) | Stays low — no benefit in passing away from the goal |

The crossover where `Q(GK → best pass)` overtakes `Q(GK → shoot)` marks the step at which strategy emerges.

## Getting started

```bash
npm install
npm start        # serves on http://localhost:3000
```

Open `http://localhost:3000/football.html`, click **Start**, and select **Fast** to accelerate training.

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
| [highcharts](https://www.highcharts.com/) v4 | Reward and Q-value charts |
| [d3](https://d3js.org/) (bundled in `external/`) | Pitch SVG visualisation |
| [reinforcejs](https://github.com/karpathy/reinforcejs) (bundled in `lib/`) | DQN agent |
