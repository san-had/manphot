/// <reference path="jquery-3.1.1.js" />

$(document).ready(function () {
    mapRotateNamespace.initialize();
});

(function () {
    this.mapRotateNamespace = this.mapRotateNamespace || {};
    var ns = this.mapRotateNamespace;

    var degree = 0;

    ns.initialize = function () {
        $('#btnPlus').on('click', rotatePlus);
        $('#btnMinus').on('click', rotateMinus);
        $('#imgMap').on('click', rotatePlus);
        $('#txtDegree').val(30);

        var mapName = getQueryVariable("mapName");
        if (mapName === undefined) {
            mapName = "UU_Aur.png";
        }

        loadMapImage(mapName);
    };

    function rotatePlus() {
        degree += Number($('#txtDegree').val());
        $('#imgMap').css('transform', 'rotate(' + degree + 'deg)');
    }

    function rotateMinus() {
        degree -= Number($('#txtDegree').val());
        $('#imgMap').css('transform', 'rotate(' + degree + 'deg');
    }

    function loadMapImage(mapName) {
        $("#imgMap").attr('src', "maps/" + mapName);
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    }
})();