/**
 * Created by joan on 2/20/16.
 */

"use strict";
function Player(x, y, shoot_reward) {
    this.x = x;
    this.y = y;
    this.shoot_reward = shoot_reward;
    this.vx = 0;
    this.vy = 0;
    this.ball = false;

}

Player.prototype = {
    getX: function() {
        return this.x;
    },

    getY: function() {
        return this.y;
    },

    getVX: function() {
        return this.vx;
    },

    getVY: function() {
        return this.vy;
    },

    getAngle: function() {

    },

    setHasBall: function(hasball) {
        this.ball = hasball;
    },

    hasBall: function() {
        return this.ball;
    },

    getReward: function() {
        var x = 10, y = 40;
        var dx = x-this.x;
        var dy = y-this.y;
        return 100/(dx*dx + dy*dy);
    },

    distanceTo: function(other_player) {
        var dx = other_player.getX()-this.x;
        var dy = other_player.getY()-this.y;
        return 10/(dx*dx + dy*dy);
    },

    performAction: function() {

    }

};