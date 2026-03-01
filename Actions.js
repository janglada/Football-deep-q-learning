/**
 * Created by joan on 2/20/16.
 */

"use strict";

// Actions are encoded as integers:
//   0 … NUM_PLAYERS-1  →  pass to that player index
//   NUM_PLAYERS         →  shoot
//
// This is the single source of truth for team size and action count.
// Pitch.js derives num_players from Actions.NUM_PLAYERS to stay in sync.
var Actions = (function () {
    var NUM_PLAYERS = 11;
    return {
        NUM_PLAYERS: NUM_PLAYERS,
        SHOOT: NUM_PLAYERS,
        isPass: function (action) { return action >= 0 && action < NUM_PLAYERS; },
        label: function (action) {
            if (action === NUM_PLAYERS) return "SHOOT";
            return "PASS_" + action;
        }
    };
})();
