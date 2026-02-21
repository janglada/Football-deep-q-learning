/**
 * Created by joan on 2/20/16.
 */

var Actions = (function() {
    var c = 0;
    return {
        PASS_0: c++,
        PASS_1: c++,
        PASS_2: c++,
        PASS_3: c++,
        PASS_4: c++,
        SHOOT:  c++
    };
})();

Actions.label = {};
Actions.label[Actions.PASS_0] = "PASS_0";
Actions.label[Actions.PASS_1] = "PASS_1";
Actions.label[Actions.PASS_2] = "PASS_2";
Actions.label[Actions.PASS_3] = "PASS_3";
Actions.label[Actions.PASS_4] = "PASS_4";
Actions.label[Actions.SHOOT]  = "SHOOT";
