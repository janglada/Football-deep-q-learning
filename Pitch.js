/**
 * Created by joan on 2/20/16.
 */

"use strict";

function Pitch() {
    this.width  = 20;
    this.height = 40;

    this.num_players = 5;
    this.players = [];

    this.players.push(new Player(10, 0,  this.width, this.height));  // goal keeper
    this.players.push(new Player(10, 5,  this.width, this.height));  // defense
    this.players.push(new Player(5,  15, this.width, this.height));  // left wing
    this.players.push(new Player(15, 15, this.width, this.height));  // right wing
    this.players.push(new Player(10, 30, this.width, this.height));  // forward

    // one-hot: which player currently has the ball
    this.state = [1, 0, 0, 0, 0];
}

Pitch.prototype = {

    getNumStates: function() {
        return 5;
    },

    getMaxNumActions: function() {
        return 6;
    },

    getState: function() {
        return this.state;
    },

    getPlayersAsJson: function() {
        return this.players.map(function(player, idx) {
            return {
                x: player.getX(),
                y: player.getY(),
                ball: this.state[idx]
            };
        }, this);
    },

    performAction: function(action) {
        var reward = 0;

        switch (action) {
            case Actions.PASS_0:
            case Actions.PASS_1:
            case Actions.PASS_2:
            case Actions.PASS_3:
            case Actions.PASS_4:
                var player_w_ball_idx = this.state.indexOf(1);
                if (this.state[action] === 0) {
                    reward += this.players[action].getPassReward(this.players[player_w_ball_idx]);
                    this.state[0] = 0;
                    this.state[1] = 0;
                    this.state[2] = 0;
                    this.state[3] = 0;
                    this.state[4] = 0;
                    this.state[action] = 1;
                } else {
                    reward = -10; // penalty for passing to self
                }
                break;

            case Actions.SHOOT:
                for (var i = 0; i < this.num_players; i++) {
                    if (this.state[i] === 1) {
                        reward += this.players[i].getShootReward();
                    }
                    // reset ball to goalkeeper after shot
                    this.state[i] = (i === 0) ? 1 : 0;
                }
                break;

            default:
                throw new Error("Unknown action [" + action + "]");
        }

        return reward;
    }
};
