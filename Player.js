/**
 * Created by joan on 2/20/16.
 */

"use strict";

// --- Pure math utilities (no instance state dependency) ---

function _smoothstep(min, max, x) {
    x = Math.max(0.0, Math.min(1.0, (x - min) / (max - min)));
    return x * x * (3 - 2 * x);
}

function _distance(x0, y0, x1, y1) {
    var dx = x0 - x1, dy = y0 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// ---------------------------------------------------------

function Player(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.pitch_width  = width;
    this.pitch_height = height;
}

Player.prototype = {
    getX: function () { return this.x; },
    getY: function () { return this.y; },

    getShootReward: function () {
        // Reward increases the closer the shooter is to the opponent goal.
        var goalX = this.pitch_width / 2;
        var goalY = this.pitch_height;
        var d = _distance(this.x, this.y, goalX, goalY);
        return 1 - _smoothstep(0, this.pitch_height, d);
    },

    // from_player: the player currently holding the ball (passing to `this`).
    // Sparse scheme: passes carry no reward; credit is assigned entirely through
    // the discounted shoot reward propagated back by the Bellman equation.
    getPassReward: function (from_player) {
        return 0;
    }
};
