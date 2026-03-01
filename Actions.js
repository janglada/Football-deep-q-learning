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
        PASS_5: c++,
        PASS_6: c++,
        PASS_7: c++,
        PASS_8: c++,
        PASS_9: c++,
        PASS_10: c++,
        SHOOT:  c++
    };
})();

Actions.label = {};
for (var i = 0; i <= 10; i++) {
    Actions.label[Actions["PASS_" + i]] = "PASS_" + i;
}
Actions.label[Actions.SHOOT]  = "SHOOT";
