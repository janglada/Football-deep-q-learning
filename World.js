/**
 * Created by joan on 2/20/16.
 */


self.importScripts("lib/rtl.js", "Actions.js", "Player.js", "Pitch.js");

function World(chart) {

    this.sid = -1;
    this.chart_sid = -1;
    this.env =  new Pitch();


    // create the DQN agent
    var spec = { alpha: 0.01 }; // see full options on DQN page
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.005; // value function learning rate
    spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
    spec.experience_size = 1000; // size of experience
    spec.learning_steps_per_iteration = 5;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 50
    this.agent = new RL.DQNAgent(this.env, spec);

    this.running = false;
    this.step = 0;
    this.chart =  chart;
    this.numSteps = 250;
}

World.prototype = {

    getAgent: function() {
      return this.agent;
    },

    start: function() {
        this.sid = setInterval(this._run.bind(this), 0);

        this.running = true;
    },
    stop: function() {
        clearInterval(this.sid);
        clearInterval(this.chart_sid);
        this.running = false;
    },

    _run: function() {
        //console.log(this)
        var avg_reward = 0;
        var actionFreq = [0,0,0,0,0,0];
        var shooter_is_forward = 0;
        //var steps_before_goal = 0;
       // var avg_steps_before_goal = 0;
        for (var j = 0; j < this.numSteps; j++) {

            var state = this.env.getState();

            var action = this.agent.act(state); // state is an array of length 5
            actionFreq[action]++;
            //console.log("ACTION" , Actions.label[action])
            if (action == Actions.SHOOT) {
                if (this.env.getState()[4] == 1)
                    shooter_is_forward++;
            }


           // if (action = )
            var reward = this.env.performAction(action);

            //... execute action in environment and get the reward
            this.agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float

            this.step++;
            avg_reward += reward;
        }


        postMessage([this.step, avg_reward/this.numSteps]);
           // console.log(this.env.getState())
        //this.chart.series[0].addPoint([this.step, avg_reward/this.numSteps], false, false);


        //console.log("actionFreq", shooter_is_forward/actionFreq[Actions.SHOOT]);
       // console.log( "avg", avg_reward/this.numSteps);
    },

    isRunning: function() {
        return this.running;
    }
}

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
    }

}

