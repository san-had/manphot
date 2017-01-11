﻿/// <reference path="jquery-3.1.1.js" />

$(document).ready(function () {
    manPhotNamespace.initialize();
});

(function () {
    this.manPhotNamespace = this.manPhotNamespace || {};
    var ns = this.manPhotNamespace;

    ns.initialize = function () {
        //$('#btnRefresh').on('click', ns.testLinearRegression);
        //$('#btnRefresh').click(ns.testLinearRegression);
        $('#btnRefresh').click(ns.refreshData);
        $('#btnReset').click(function () {
            var proceed = confirm('Are you sure?');
            if (proceed) {
                ns.reset();
            }
        });
        $('#varSelector').change(function () {
            var selectedVal = this.value;
            ns.loadVariable(selectedVal);
        });
        ns.loadVariable($('#varSelector').val());        
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
       // alert('path: ' + path);
        starInstanceNameSpace.fetchJSONFile(path, ns.loadTarget);
    }

    ns.loadVariable = function (selectedVal) {
        var path = "/vars/" + selectedVal + ".txt";
        starInstanceNameSpace.fetchJSONFile(path, ns.loadTarget);
    }

    ns.loadTarget = function (data) {
        //alert(data.varStar.name);
        var html = '';
        html += '<tr><td id="targetStar">' + data.varStar.name + '</td>';
        html += '<td class="cord">' + data.varStar.ra + '</td>';
        html += '<td class="cord">' + data.varStar.de + '</td>';
        html += '<td><input type="text" id="target_imag"/></td>';
        html += '<td id="target_vmag"  class="vmag"></td>';
        html += '<td id="target_err" class="targetError"></td></tr>';

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

        ns.dataEntry();
    }

    ns.loadCheck = function (data) {
        //alert(data.label);
        //alert(data.vcat);
        var html = '';
        html += '<tr><td class="star">' + data.label + '</td>';
        html += '<td class="cord">' + data.ra + '</td>';
        html += '<td class="cord">' + data.de + '</td>';
        html += '<td id="check_vcat" class="vcat">' + data.vcat + '</td>';
        html += '<td><input type="text" id="check_imag"/></td>';
        html += '<td id="check_vmag"  class="vmag"></td>';
        html += '<td id="check_err" class="error"></td></tr>';

        $('#check tbody').html(html);
    }

    ns.loadComparisons = function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var comp_id = 'comp_' + data[i].sn;
            html += '<tr><td class="id">' + data[i].sn + '</td>';
            html += '<td class="star">' + data[i].label + '</td>';
            html += '<td class="cord">' + data[i].ra + '</td>';
            html += '<td class="cord">' + data[i].de + '</td>';
            html += '<td id="' + comp_id + '_vcat" class="vcatComp">' + data[i].vcat + '</td>';
            html += '<td><input type="text" id="comp_imag_' + data[i].sn + '"/></td>';
            html += '<td id="' + comp_id + '_vmag" class="fvmag"></td>';
            html += '<td id="' + comp_id + '_err" class="error"></td>';
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

    ns.refreshData = function () {
        ns.calcLinearRegression();        
        ns.calcFitValues();
    }

    ns.calcLinearRegression = function () {
        var arrayImags = new Array();
        var arrayVmags = new Array();
        var failure = false;

        $("input[id^='comp_imag_'").each(function (i, el) {
            if ($(el).val() != '') {
                var comp_id = '#comp_' + $(el).attr('id').substr(10) + "_vcat";
                var imag = $(el).val().replace(',', '.');
                if (isNaN(imag)) {
                    alert("Wrong Imag value: " + imag + " at index: " + i);
                    failure = true;
                } else {
                    arrayImags.push(Number(imag));
                }
                var vcat = $(comp_id).html().replace(',', '.');
                if (isNaN(vcat)) {
                    alert("Wrong VCat value: " + vcat + " at index: " + i);
                    failure = true;
                } else {
                    arrayVmags.push(Number(vcat));
                }
            }
        });

        if (failure) {
            alert("Wrong data entry, no calculation performed!");
            return failure;
        }

        if ( arrayImags.length < 2 ) {
            alert("Few data entry, add more Imag values!");
            return failure;
        }

        if (arrayVmags.length < 2) {
            alert("Few Vcat data, define more Vcat values!");
            return failure;
        }

        var lr = ns.linearRegression(arrayImags, arrayVmags);
        $('#slope').html(lr.slope);
        $('#intercept').html(lr.intercept);
        $('#r2').html(lr.r2);

        return failure;
    }

    ns.calcFitValues = function () {
        var slope = $('#slope').html();
        var intercept = $('#intercept').html();
        var failure;
        var summ_error = 0;
        var num = 0;

        $("input[id^='comp_imag_'").each(function (i, el) {
            failure = false;
            if ($(el).val() != '') {
                var comp_id = '#comp_' + $(el).attr('id').substr(10) + "_vcat";
                var fit_id = '#comp_' + $(el).attr('id').substr(10) + "_vmag";
                var error_id = '#comp_' + $(el).attr('id').substr(10) + "_err";
                var imag = $(el).val().replace(',', '.');
                if (isNaN(imag)) {
                    failure = true;
                } 
                var vcat = $(comp_id).html().replace(',', '.');
                if (isNaN(vcat)) {
                    failure = true;
                }
                if (!failure) {
                    var fitValue = (imag - intercept) / slope;
                    fitValue = Math.round(fitValue * 1000) / 1000;
                    $(fit_id).html(fitValue);

                    var error = fitValue - vcat;
                    error = Math.round(error * 1000) / 1000;
                    $(error_id).html(error);
                    summ_error += Math.abs(error);
                    num += 1;
                }
                else {
                    ns.resetSlopeValues();
                }
            }
        });

        if (!failure) {
            var checkVcat = $('#check_vcat').html();
            var checkImag = $('#check_imag').val().replace(',', '.');
            var checkVmag = (checkImag - intercept) / slope;
            checkVmag = Math.round(checkVmag * 1000) / 1000;
            $('#check_vmag').html(checkVmag);
            var checkError = checkVmag - checkVcat;
            checkError = Math.round(checkError * 1000) / 1000;
            $('#check_err').html(checkError);

            var targetImag = $('#target_imag').val().replace(',', '.');
            var targetVmag = (targetImag - intercept) / slope;
            targetVmag = Math.round(targetVmag * 1000) / 1000;
            $('#target_vmag').html(targetVmag);

            var targetError = summ_error / num;
            targetError = Math.round(targetError * 1000) / 1000;
            $('#target_err').html(targetError);

        }
    }

    ns.dataEntry = function () {
        $('#comp_imag_1').val('-13.500');
        $('#comp_imag_2').val('-13.000');
        $('#comp_imag_3').val('-12.950');

        $('#check_imag').val('-12.980');
        $('#target_imag').val('-12.957');

    }

    ns.resetSlopeValues = function () {
        $('#slope').html('');
        $('#intercept').html('');
        $('#r2').html('');
    }

    ns.reset = function () {
        ns.resetSlopeValues();

        $("input[id^='comp_imag_'").each(function (i, el) {
            $(el).val('');
        });
        $('.fvmag').each(function (i, el) {
            $(el).html('');
        });
        $('.err').each(function (i, el) {
            $(el).html('');
        });

        $('#check_imag').val('');
        $('#check_vmag').html('');
        $('#check_err').html('');

        $('#target_imag').val('');
        $('#target_vmag').html('');
        $('#target_err').html('');
    }

    ns.linearRegression = function (y, x) {         //y: imags, x: vmags

        var lr = {};

        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {
            sum_x += Number(x[i]);
            sum_y += Number(y[i]);
            sum_xy += (Number(x[i]) * Number(y[i]));
            sum_xx += (Number(x[i]) * Number(x[i]));
            sum_yy += (Number(y[i]) * Number(y[i]));
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        lr['slope'] = Math.round(lr.slope * 1000) / 1000;
        lr['intercept'] = Math.round(lr.intercept * 1000) / 1000;
        lr['r2'] = Math.round(lr.r2 * 100000) / 100000;

        return lr;
    }

})();