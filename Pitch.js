/**
 * Created by joan on 2/20/16.
 */

"use strict";


function Pitch() {
    this.width  = 20;
    this.height = 40;

    this.num_players = 5;
    this.players = [];

    this.players.push(new Player(10, 0,  0));       // goal keeper
    this.players.push(new Player(10, 5,  0.001));    // defense
    this.players.push(new Player(5,  15, 0.01));    // left wing
    this.players.push(new Player(15, 15, 0.01));    // right wing
    this.players.push(new Player(10, 30, 2));       // forward

    this.state = new Array(5);

    this.state[0] = 1;
    this.state[1] = 0;
    this.state[2] = 0;
    this.state[3] = 0;
    this.state[4] = 0;


}


Pitch.prototype = {

    /**
     * enviroment interface
     */
    getNumStates : function() {
        return 5;
    },

    /**
     * enviroment interface
     */
    getMaxNumActions : function() {
        return 6;
    },

    /**
     *
     */
    getState: function() {
        return this.state;
    },

    /**
     *
     */
    performAction: function(action)
    {
        var reward = 0;



        // calculate reward
        switch (action) {
            case Actions.PASS_0:
            case Actions.PASS_1:
            case Actions.PASS_2:
            case Actions.PASS_3:
            case Actions.PASS_4:
                if (this.state[action] == 0) {
                    reward += 0.001;
                    this.state[0] = 0;
                    this.state[1] = 0;
                    this.state[2] = 0;
                    this.state[3] = 0;
                    this.state[4] = 0;

                    this.state[action] = 1;

                }
                break;

            case Actions.SHOOT:
                for(var i = 0; i < this.num_players; i++) {
                    if (this.state[i] == 1) {
                        reward += this.players[i].getReward();
                    }
                    this.state[i] = (i == 0)? 1 : 0;
                }
                break;
            default:
                throw  new Error("Uknown action [" +  action +"]")
        }



        return reward;
    },


    run: function() {

    }
};
