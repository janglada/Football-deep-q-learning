/**
 * Created by joan on 2/20/16.
 */

"use strict";


function Pitch() {
    this.width  = 20;
    this.height = 40;

    this.num_players = 5;
    this.players = [];

    this.players.push(new Player(10, 0,  this.width, this.height));     // goal keeper
    this.players.push(new Player(10, 5,  this.width, this.height));     // defense
    this.players.push(new Player(5,  15, this.width, this.height));     // left wing
    this.players.push(new Player(15, 15, this.width, this.height));     // right wing
    this.players.push(new Player(10, 30, this.width, this.height));      // forward

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
     * @returns {Array}
     */
    getPlayersAsJson: function() {
        return this.players.map(function(player, idx) {
            return {
                x: player.getX(),
                y: player.getY(),
                ball: this.state[idx]

            }
        }, this);
    },


    /**
     *
     */
    performAction: function(action)
    {
        var reward = 0;



        // calculate reward
        switch (action)
        {
            case Actions.PASS_0:
            case Actions.PASS_1:
            case Actions.PASS_2:
            case Actions.PASS_3:
            case Actions.PASS_4:

                var player_w_ball_idx = this.state.indexOf(1);
                if (this.state[action] == 0) {
                    reward += this.players[action].getPassReward(this.players[player_w_ball_idx], this.height/2);
                    //console.log("pass reward", reward)
                    //console.log("PASS REWARD", reward)
                    this.state[0] = 0;
                    this.state[1] = 0;
                    this.state[2] = 0;
                    this.state[3] = 0;
                    this.state[4] = 0;

                    this.state[action] = 1;

                } else {
                    reward = -10;
                }
                break;
            /*
            case PLAYER0_FORWARD  :
                break;
            case PLAYER1_FORWARD  :
                break;
            case PLAYER2_FORWARD  :
                break;
            case PLAYER3_FORWARD  :
                break;
            case PLAYER4_FORWARD  :

                break;
            case PLAYER0_BACKWARD  :
                break;
            case PLAYER1_BACKWARD  :
                break;
            case PLAYER2_BACKWARD  :
                break;
            case PLAYER3_BACKWARD  :
                break;
            case PLAYER4_BACKWARD  :

                break;
            case PLAYER0_LEFT  :
                break;
            case PLAYER1_LEFT  :
                break;
            case PLAYER2_LEFT  :
                break;
            case PLAYER3_LEFT  :
                break;
            case PLAYER4_LEFT  :


                break;
            case PLAYER0_RIGHT  :
                break;
            case PLAYER1_RIGHT  :
                break;
            case PLAYER2_RIGHT  :
                break;
            case PLAYER3_RIGHT  :
                break;
            case PLAYER4_RIGHT  :

                break;
            */
            case Actions.SHOOT:
                for(var i = 0; i < this.num_players; i++) {
                    if (this.state[i] == 1) {
                        reward += this.players[i].getShootReward();
                        //console.log("SHOT REWARD", reward)

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
