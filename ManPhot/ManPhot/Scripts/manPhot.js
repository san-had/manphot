/// <reference path="jquery-3.1.1.js" />

$(document).ready(function () {
    manPhotNamespace.initialize();
});

(function () {
    this.manPhotNamespace = this.manPhotNamespace || {};
    var ns = this.manPhotNamespace;

    ns.initialize = function () {
        //$('#btnRefresh').on('click', ns.testLinearRegression);
        $('#btnRefresh').click(ns.load_UU_Aur);
        $('#varSelector').change(ns.getVariable);
    }

    ns.load_UU_Aur = function () {
        var vstar = starInstanceNameSpace.get_UU_Aur();
        alert(vstar.name);
        alert(vstar.comps[0].label);
        //var hello = get_hello();
        //alert(hello);
    }

    ns.getVariable = function () {
        var selectedVal = this.value;
        alert('selectedVal: ' + selectedVal);
        starInstanceNameSpace.fetchJSONFile('/vars/vv_cep.txt', ns.loadVariable);
    }

    ns.loadVariable = function (data) {
        alert(data.varStar.name);
    }

    ns.testLinearRegression = function () {
        var known_x = [5.020, 4.974, 6.016, 6.206, 6.483, 6.626];
        var known_y = [-13.287, -13.349, -12.229, -12.063, -11.744, -11.592];

        var lr = ns.linearRegression(known_y, known_x);
        $('#slope').html(lr.slope);
        $('#intercept').html(lr.intercept);
        $('#r2').html(lr.r2);
    }

    ns.linearRegression = function (y, x) {

        var lr = {};

        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {
            sum_x += Number(x[i]);
            sum_y += y[i];
            sum_xy += (x[i] * y[i]);
            sum_xx += (x[i] * x[i]);
            sum_yy += (y[i] * y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        return lr;
    }

})();