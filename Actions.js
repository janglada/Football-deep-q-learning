/**
 * Created by joan on 2/20/16.
 */


var Actions = (function() {
    var c = 0;
    return {

        PASS_0  : c++,
        PASS_1  : c++,
        PASS_2  : c++,
        PASS_3  : c++,
        PASS_4  : c++,

/*
        PLAYER0_FORWARD  : c++,
        PLAYER1_FORWARD  : c++,
        PLAYER2_FORWARD  : c++,
        PLAYER3_FORWARD  : c++,
        PLAYER4_FORWARD  : c++,

        PLAYER0_BACKWARD  : c++,
        PLAYER1_BACKWARD  : c++,
        PLAYER2_BACKWARD  : c++,
        PLAYER3_BACKWARD  : c++,
        PLAYER4_BACKWARD  : c++,

        PLAYER0_LEFT  : c++,
        PLAYER1_LEFT  : c++,
        PLAYER2_LEFT  : c++,
        PLAYER3_LEFT  : c++,
        PLAYER4_LEFT  : c++,


        PLAYER0_RIGHT  : c++,
        PLAYER1_RIGHT  : c++,
        PLAYER2_RIGHT  : c++,
        PLAYER3_RIGHT  : c++,
        PLAYER4_RIGHT  : c++,
*/
        SHOOT   : c++
    }
})();


Actions.label = {}
Actions.label[Actions.PASS_0] = "PASS_0";
Actions.label[Actions.PASS_1] = "PASS_1";
Actions.label[Actions.PASS_2] = "PASS_2";
Actions.label[Actions.PASS_3] = "PASS_3";
Actions.label[Actions.PASS_4] = "PASS_4";
Actions.label[Actions.SHOOT]  = "SHOOT";