/**
 * Created by joan on 2/20/16.
 */

self.importScripts("lib/rtl.js", "Actions.js", "Player.js", "Pitch.js");

function World() {

    this.sid = -1;
    this.env = new Pitch();

    // create the DQN agent
    var spec = {};
    spec.update = 'qlearn';         // qlearn | sarsa
    spec.gamma = 0.9;               // discount factor, [0, 1)
    spec.epsilon = 1;               // initial epsilon for epsilon-greedy policy
    spec.epsilon_min = 0.05;        // minimum epsilon after decay
    spec.epsilon_decay = 0.9995;    // multiplicative decay applied each step
    spec.alpha = 0.005;             // value function learning rate
    spec.experience_add_every = 5;  // steps between replay buffer insertions
    spec.experience_size = 1000;    // replay buffer capacity
    spec.learning_steps_per_iteration = 5;
    spec.tderror_clamp = 1.0;       // Huber loss clamp
    spec.num_hidden_units = 50;
    spec.target_update_every = 100; // steps between target network syncs

    this.agent = new RL.DQNAgent(this.env, spec);

    this.running = false;
    this.step = 0;
    this.numSteps = 500;
    this.delay = 0;
}

World.prototype = {

    setFast: function() {
        this.numSteps = 1000;
        this.delay = 0;
    },
    setSlow: function() {
        this.numSteps = 1;
        this.delay = 500;
    },
    setNormal: function() {
        this.numSteps = 100;
        this.delay = 500;
    },

    getAgent: function() {
        return this.agent;
    },

    start: function() {
        this.sid = setInterval(this._run.bind(this), this.delay);
        this.running = true;
    },

    stop: function() {
        clearInterval(this.sid);
        this.running = false;
    },

    _run: function() {
        var avg_reward = 0;
        var actionFreq = [0, 0, 0, 0, 0, 0];

        for (var j = 0; j < this.numSteps; j++) {
            var state = this.env.getState();
            var action = this.agent.act(state);
            actionFreq[action]++;
            var reward = this.env.performAction(action);
            this.agent.learn(reward);
            this.step++;
            avg_reward += reward;
        }

        postMessage([
            this.step,
            avg_reward / this.numSteps,
            this.env.getPlayersAsJson(),
            this.agent.tderror,
            this.agent.epsilon
        ]);
    }
};

var world = new World();

self.onmessage = function(e) {
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
                case "slow":   world.setSlow();   break;
                case "normal": world.setNormal(); break;
                case "fast":   world.setFast();   break;
            }
            world.start();
            break;
        case "save":
            postMessage({ type: 'model', data: world.getAgent().toJSON() });
            break;
        case "load":
            world.getAgent().fromJSON(e.data[1]);
            break;
    }
};
