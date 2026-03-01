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
    getPassReward: function (from_player) {
        var d = _distance(this.x, this.y, from_player.getX(), from_player.getY());
        // Safety: penalise long/risky passes.
        var safety   = 1 - _smoothstep(0, this.pitch_height, d);
        // Progress: reward passing the ball forward toward the opponent goal.
        var progress = Math.max(0, this.y - from_player.getY()) / this.pitch_height;
        return 0.4 * safety + 0.6 * progress;
    }
};
