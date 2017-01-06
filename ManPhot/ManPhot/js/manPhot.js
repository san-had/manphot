/// <reference path="jquery-3.1.1.js" />

$(document).ready(function () {
    manPhotNamespace.initialize();
});

(function () {
    this.manPhotNamespace = this.manPhotNamespace || {};
    var ns = this.manPhotNamespace;

    ns.initialize = function () {
        //$('#btnRefresh').on('click', ns.testLinearRegression);
        $('#btnRefresh').click(ns.testLinearRegression);
        $('#varSelector').change(ns.getVariable);
    }

    ns.load_UU_Aur = function () {
        var vstar = starInstanceNameSpace.get_UU_Aur();
        alert(vstar.name);
        alert(vstar.comps[0].label);
        //var hello = get_hello();
        //alert(hello);
    };

    ns.getVariable = function () {
        var selectedVal = this.value;
        var path = "/vars/" + selectedVal + ".txt";
        alert('path: ' + path);
        starInstanceNameSpace.fetchJSONFile(path, ns.loadTarget);
    }

    ns.loadTarget = function (data) {
        alert(data.varStar.name);
        var html = '';
        html += '<tr><td>' + data.varStar.name + '</td>';
        html += '<td>' + data.varStar.ra + '</td>';
        html += '<td>' + data.varStar.de + '</td>';
        html += '<td id="target_imag></td>';
        html += '<td id="target_vmag></td>';
        html += '<td id="target_ferr></td></tr>';

        $('#target tbody').html(html);

        html = '<tr>';
        for (var i = 0; i < data.varStar.maps.length; i++) {
            var path = "map.html?mapName=";
            var mapName = data.varStar.maps[i];
            path = path + mapName;
            html += '<td><a href="' + path + '" target="_blank">' + mapName + '</a></td>';
        }
        html += '</tr>';
        $('#maps tbody').html(html);

        ns.loadCheck(data.varStar.checkstar);

        ns.loadComparisons(data.varStar.compstars);
    }

    ns.loadCheck = function (data) {
        alert(data.label);
        alert(data.vcat);
        var html = '';
        html += '<tr><td>' + data.label + '</td>';
        html += '<td>' + data.ra + '</td>';
        html += '<td>' + data.de + '</td>';
        html += '<td id="check_vcat">' + data.vcat + '</td>';
        html += '<td id="check_imag"></td>';
        html += '<td id="check_vmag"></td>';
        html += '<td id="check_ferr"></td></tr>';

        $('#check tbody').html(html);
    }

    ns.loadComparisons = function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var comp_id = 'comp_' + data[i].sn;
            html += '<tr><td>' + data[i].sn + '</td>';
            html += '<td>' + data[i].label + '</td>';
            html += '<td>' + data[i].ra + '</td>';
            html += '<td>' + data[i].de + '</td>';
            html += '<td id="' + comp_id + '_vcat">' + data[i].vcat + '</td>';
            html += '<td id="' + comp_id + '_imag"></td>';
            html += '<td id="' + comp_id + '_vmag"></td>';
            html += '<td id="' + comp_id + '_err"></td>';
            html += '<td id="' + comp_id + '_ferr"></td></tr>';
        }

        $('#comparison tbody').html(html);
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