/// <reference path="jquery-3.1.1.js" />

(function () {
    this.starInstanceNameSpace = this.starInstanceNameSpace || {};
    var ns = this.starInstanceNameSpace;

    ns.get_UU_Aur = function () {
        var checkStar = new starTemplateNamespace.CheckStar('57', '', '', 5.683);

        var compStar2 = new starTemplateNamespace.CompStar(2, '50', 4.974);
        var compStar3 = new starTemplateNamespace.CompStar(3, '60', 6.016);
        var compStar1 = new starTemplateNamespace.CompStar(1, '50', 5.020);
        var compStar4 = new starTemplateNamespace.CompStar(4, '62', 6.206);
        var compStar5 = new starTemplateNamespace.CompStar(5, '65', 6.483);
        var compStar6 = new starTemplateNamespace.CompStar(6, '66', 6.626);

        var varStar = new starTemplateNamespace.VarStar('uu_aur', 'UU Aur', '06:36', '+38:26', starTemplateNamespace.CheckStar
            , new Array(compStar1, compStar2, compStar3, compStar4, compStar5, compStar6));

        return varStar;
    }
})();

//function get_UU_Aur() {
//    var stns = starTemplateNamespace;

//    var checkStar = new stns.CheckStar('57', '', '', 5.683);

//    var compStar2 = new stns.CompStar(2, '50', 4.974);
//    var compStar3 = new stns.CompStar(3, '60', 6.016);
//    var compStar1 = new stns.CompStar(1, '50', 5.020);
//    var compStar4 = new stns.CompStar(4, '62', 6.206);
//    var compStar5 = new stns.CompStar(5, '65', 6.483);
//    var compStar6 = new stns.CompStar(6, '66', 6.626);

//    var varStar = new stns.VarStar('uu_aur', 'UU Aur', '06:36', '+38:26', stns.CheckStar
//        , new Array(compStar1, compStar2, compStar3, compStar4, compStar5, compStar6));

//    return varStar;
//}

function get_hello() {
    return "Hello";
}


(function () {
    this.starTemplateNamespace = this.starTemplateNamespace || {};
    var ns = this.starTemplateNamespace;

    ns.VarStar = function () {
    }

    ns.VarStar = function (id, name, ra, de, check, comps) {
        this.id = id;
        this.name = name;
        this.ra = ra;
        this.de = de;
        this.check = check;
        this.comps = comps
    }

    ns.VarStar.prototype = {
        id: '',
        name: '',
        ra: '',
        de: '',
        //check: new ns.CheckStar(),
        //comps: new Array(new ns.CompStar())
    }

    ns.CheckStar = function () {
    }

    ns.CheckStar = function (label, ra, de, vcat) {
        this.label = label;
        this.ra = ra;
        this.de = de;
        this.vcat = vcat
    }

    ns.CheckStar.prototype = {
        label: '',
        ra: '',
        de: '',
        vcat: 0.0
    };

    ns.CompStar = function () {
    }

    ns.CompStar = function (sn, label, vcat) {
        this.sn = sn;
        this.label = label;
        this.vcat = vcat
    }

    ns.CompStar.prototype = {
        sn: 0,
        label: '',
        vcat: 0.0
    }

})();