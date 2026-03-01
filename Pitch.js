/**
 * Created by joan on 2/20/16.
 */

"use strict";

function Pitch() {
    this.width = 20;
    this.height = 40;

    this.num_players = Actions.NUM_PLAYERS; // keep in sync with Actions.js
    this.players = [];

    // GK
    this.players.push(new Player(10, 0, this.width, this.height));

    // DF (3-4-3: 3 Defenders)
    this.players.push(new Player(5, 8, this.width, this.height));
    this.players.push(new Player(10, 8, this.width, this.height));
    this.players.push(new Player(15, 8, this.width, this.height));

    // MF (3-4-3: 4 Midfielders)
    this.players.push(new Player(2, 18, this.width, this.height));
    this.players.push(new Player(10, 13, this.width, this.height));
    this.players.push(new Player(10, 23, this.width, this.height));
    this.players.push(new Player(18, 18, this.width, this.height));

    // FW (3-4-3: 3 Forwards)
    this.players.push(new Player(4, 28, this.width, this.height));
    this.players.push(new Player(10, 31, this.width, this.height));
    this.players.push(new Player(16, 28, this.width, this.height));

    // one-hot: which player currently has the ball
    this.state = new Array(this.num_players).fill(0);
    this.state[0] = 1; // possession starts with GK
}

Pitch.prototype = {

    getNumStates: function () {
        return this.num_players;
    },

    getMaxNumActions: function () {
        return this.num_players + 1; // Passes + Shoot
    },

    getState: function () {
        return this.state;
    },

    getPlayersAsJson: function () {
        return this.players.map(function (player, idx) {
            return {
                x: player.getX(),
                y: player.getY(),
                ball: this.state[idx]
            };
        }, this);
    },

    performAction: function (action) {
        var reward = 0;
        var current_idx = this.state.indexOf(1);

        if (Actions.isPass(action)) {
            var target_idx = action;
            if (current_idx !== target_idx) {
                reward = this.players[target_idx].getPassReward(this.players[current_idx]);
                this.state.fill(0);
                this.state[target_idx] = 1;
            } else {
                reward = -1; // penalty for passing to self (scaled to match max shoot reward of 1.0)
            }
        } else if (action === Actions.SHOOT) {
            reward = this.players[current_idx].getShootReward();
            // reset ball to goalkeeper after shot
            this.state.fill(0);
            this.state[0] = 1;
        } else {
            throw new Error("Unknown action [" + action + "]");
        }

        return reward;
    }
};
