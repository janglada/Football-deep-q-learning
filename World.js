/**
 * Created by joan on 2/20/16.
 */

self.importScripts("lib/rtl.js", "Actions.js", "Player.js", "Pitch.js");

// MessageChannel-based self-scheduler: avoids the browser's >=4ms setInterval floor.
// Signalling port2 wakes port1 immediately (microtask-level priority, no timer clamping),
// enabling maximum training throughput in fast mode.
var scheduler = new MessageChannel();

function World() {

    this.env = new Pitch();

    // create the DQN agent
    var spec = {};
    spec.update = 'qlearn';         // qlearn | sarsa
    spec.gamma = 0.99;               // discount factor — raised for sparse rewards so
                                    // credit propagates back across multi-step pass chains
    spec.epsilon = 1;               // initial epsilon for epsilon-greedy policy
    spec.epsilon_min = 0.05;        // minimum epsilon after decay
    spec.epsilon_decay = 0.9999995;    // multiplicative decay applied each step
    spec.alpha = 0.005;             // value function learning rate
    spec.experience_add_every = 10;  // steps between replay buffer insertions
    spec.experience_size = 5000;    // larger buffer needed for sparse reward credit assignment
    spec.learning_steps_per_iteration = 5;
    spec.tderror_clamp = 1.0;       // Huber loss clamp
    spec.num_hidden_units = 50;
    spec.target_update_every = 100; // steps between target network syncs

    this.agent = new RL.DQNAgent(this.env, spec);

    this.running = false;
    this.step = 0;
    this.numSteps = 1500;
    this.delay = 0;
    this._runCount = 0;
}

World.prototype = {

    setFast: function () {
        this.numSteps = 300;
        this.delay = 0;
    },
    setSlow: function () {
        this.numSteps = 1;
        this.delay = 500;
    },
    setNormal: function () {
        this.numSteps = 100;
        this.delay = 500;
    },

    getAgent: function () {
        return this.agent;
    },

    start: function () {
        this.running = true;
        this._schedule();
    },

    stop: function () {
        this.running = false;
    },

    _schedule: function () {
        if (!this.running) return;
        if (this.delay === 0) {
            // Immediate tick via MessageChannel — no >=4ms timer floor
            scheduler.port2.postMessage(null);
        } else {
            var self = this;
            setTimeout(function () { scheduler.port2.postMessage(null); }, self.delay);
        }
    },

    // Returns a [numPlayers][numActions] matrix of Q-values computed by a
    // pure forward pass — no side effects on agent state or learning.
    queryQValues: function () {
        var ns = this.env.getNumStates();
        var result = [];
        for (var i = 0; i < ns; i++) {
            var s = new R.Mat(ns, 1); // column vector, all zeros
            s.w[i] = 1;              // one-hot: player i holds the ball
            var qmat = this.agent.forwardQ(this.agent.net, s, false);
            result.push(Array.prototype.slice.call(qmat.w));
        }
        return result;
    },

    _run: function () {
        if (!this.running) return;

        var avg_reward = 0;
        for (var j = 0; j < this.numSteps; j++) {
            var state = this.env.getState();
            var action = this.agent.act(state);
            var reward = this.env.performAction(action);
            this.agent.learn(reward);
            this.step++;
            avg_reward += reward;
        }

        // In fast mode (delay=0) only post every 10 runs to reduce serialization
        // overhead. In slow/normal modes post every run for responsive UI updates.
        this._runCount++;
        if (this.delay > 0 || this._runCount % 10 === 0) {
            postMessage([
                this.step,
                avg_reward / this.numSteps,
                this.env.getPlayersAsJson(),
                this.agent.tderror,
                this.agent.epsilon
            ]);
        }

        this._schedule();
    }
};

var world = new World();

// Drive the training loop from the private scheduler port
scheduler.port1.onmessage = function () {
    world._run();
};

self.onmessage = function (e) {
    switch (e.data[0]) {
        case "start":
            world.start();
            break;
        case "stop":
            world.stop();
            break;
        case "epsilon":
            world.getAgent().epsilon = e.data[1];
            break;
        case "speed":
            var speed = e.data[1];
            world.stop();
            switch (speed) {
                case "slow": world.setSlow(); break;
                case "normal": world.setNormal(); break;
                case "fast": world.setFast(); break;
            }
            world.start();
            break;
        case "save":
            postMessage({ type: 'model', data: world.getAgent().toJSON() });
            break;
        case "sync":
            // Internal: returns weights for population sync (not saved to localStorage)
            postMessage({ type: 'sync_model', data: world.getAgent().toJSON() });
            break;
        case "load":
            world.getAgent().fromJSON(e.data[1]);
            break;
        case "query":
            postMessage({ type: 'qvalues', data: world.queryQValues() });
            break;
    }
};
