/**
 * Created by joan on 2/20/16.
 */

"use strict";
function Player(x, y, width, height) {
    this.x = x;
    this.y = y;
    // pitch dimensions
    this.pitch_width=  width;
    this.pitch_height = height;
    this.vx = 0;
    this.vy = 0;
    this.ball = false;

}

Player.prototype = {
    getX: function () {
        return this.x;
    },

    getY: function () {
        return this.y;
    },

    getVX: function () {
        return this.vx;
    },

    getVY: function () {
        return this.vy;
    },

    getAngle: function () {

    },

    setHasBall: function (hasball) {
        this.ball = hasball;
    },

    hasBall: function () {
        return this.ball;
    },

    getShootReward: function () {
        // goal pos
        var x  =10, y = 40;
        var distance = this.__distance(this.x, this.y, x,y)
        return 1-this.smoothstep(0, this.pitch_height, distance );
    },

    getPassReward: function (other_player) {
        var distance = this.__distance(this.x, this.y, other_player.getX(), other_player.getY())

        return 0.5*(1-this.smoothstep(0, this.pitch_height, distance));
    },


    __distanceSquared: function (x0, y0, x1, y1) {
        var dx = x0 - x1;
        var dy = y0 - y1;
        return dx * dx + dy * dy;
    },

    __distance: function (x0, y0, x1, y1) {
        return Math.sqrt(this.__distanceSquared(x0, y0, x1, y1));
    },

    __p: (function () {
        var two_PI_SQRT = 1 / Math.sqrt(2 * Math.PI);
        return function (x, mu, sigma) {
            var dx = (x - mu);
            return two_PI_SQRT * sigma * Math.exp(-(dx * dx) / (2 * sigma * sigma))
        }
    })(),

    clamp: function (x, min, max) {
        if (x < min)
            return min;
        else if (x > max)
            return max;

        return x;
    },


    smoothstep: function(min, max, x)
    {
        // Scale, bias and saturate x to 0..1 range
        x = this.clamp((x - min)/(max - min), 0.0, 1.0);
        // Evaluate polynomial
        return x*x*(3 - 2*x);
    },

    performAction: function() {

    }

};