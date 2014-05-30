/**
* ngSpinner
*
* @author Douglas Lira <douglas.lira.web@gmail.com>
* @url https://github.com/douglaslira/directives/ngspinner/
*/

$app = angular.module("App",[]);
$app.factory('maskCheck', function() {
	var maskID = {
		new: function(m,v) {

			if(m == '###.###.###-##|##.###.###/####-##'){
				if(v.length>14){
					return maskID.new('##.###.###/####-##', v);
				}else{
					return maskID.new('###.###.###-##', v);
				}
			}

			if(m == '## ####-####|## #####-####'){
				if(v.length>12){
					return maskID.new('## #####-####', v);
				}else{
					return maskID.new('## ####-####', v);
				}
			}

			var tv = "";
			var ret = "";
			var character = "#";
			var separator = "|";
			var maskUse = "";
			v = maskID.empty(v);
			if (v == ""){
				return v
			};
			var temp = m.split(separator);
			var dif = 1000;

			var vm = v;
		    // removing the mask value existing
		    for (var i = 0; i < v.length;i++){
		    	if (!isNaN(v.substr(i,1))){
		    		tv = tv + v.substr(i,1);
		    	}
		    }

		    v = tv;

			// dynamic format mask
			for (i = 0; i<temp.length;i++){
				var mult = "";
				var validate = 0;
				for (var j=0;j<temp[i].length;j++){
					if (temp[i].substr(j,1) == "]"){
						temp[i] = temp[i].substr(j+1);
						break;
					}
					if (validate == 1)mult = mult + temp[i].substr(j,1);
					if (temp[i].substr(j,1) == "[")validate = 1;
				}
				for (var j=0;j<v.length;j++){
					temp[i] = mult + temp[i];
				}
			}

			// check which masks use
			if (temp.length == 1){
				maskUse = temp[0];
				var cleanMask = "";
				for (var j=0;j<maskUse.length;j++){
					if (maskUse.substr(j,1) == character){
						cleanMask = cleanMask + character;
					}
				}
				var tam = cleanMask.length;
			}else{
				// clean different characters of the character of the mask
				for (i=0;i<temp.length;i++){
					var cleanMask = "";
					for (var j=0;j<temp[i].length;j++){
						if (temp[i].substr(j,1) == character){
							cleanMask = cleanMask + character;
						}
					}
					if (v.length > cleanMask.length){
						if (dif > (v.length - cleanMask.length)){
							dif = v.length - cleanMask.length;
							maskUse = temp[i];
							tam = cleanMask.length;
						}
					}else if (v.length < cleanMask.length){
						if (dif > (cleanMask.length - v.length)){
							dif = cleanMask.length - v.length;
							maskUse = temp[i];
							tam = cleanMask.length;
						}
					}else{
						maskUse = temp[i];
						tam = cleanMask.length;
						break;
					}
				}
			}

			// validating mask size according to the size of the value
			if (v.length > tam){
				v = v.substr(0,tam);
			}else if (v.length < tam){
				var masct = "";
				var j = v.length;
				for (var i = maskUse.length-1;i>=0;i--){
					if (j == 0) break;
					if (maskUse.substr(i,1) == character){
						j--;
					}
					masct = maskUse.substr(i,1) + masct;
				}
				maskUse = masct;
			}

			// Apply mask
			j = maskUse.length -1;
			for (var i = v.length - 1;i>=0;i--){
				if (maskUse.substr(j,1) != character){
					ret = maskUse.substr(j,1) + ret;
					j--;
				}
				ret = v.substr(i,1) + ret;
				j--;
			}
			return ret;
		},

		empty: function(v) {
			var vclean ="";
			var len = v.length;
			for (var i = 0; i < 30;i++){
				if(v.substr(i,1)==" "){
				} else {
					vclean = vclean + v.substr(i,1);
				}
			}
			return vclean;
		}
	};

	return maskID;
});

$app.directive('ngSpinner',['maskCheck', function(maskCheck) {

	var tmpl = [
	'<a href="javascript:void(0);" style="text-decoration:none" ng-click="spinnerInc();"><b>&nbsp;+&nbsp;</b></a>',
	'<input type="text" ng-keyup="update($event);" ng-model="ngModel">',
	'<a href="javascript:void(0);" style="text-decoration:none" ng-click="spinnerDec();"><b>&nbsp;-&nbsp;</b></a>',
	]

	return {
		restrict: 'E',
		scope: {
			ngModel: "=",
			spinnerMax: "@",
			spinnerMin: "@"
		},
		template: tmpl.join(""),
		link: function(scope, elem, attrs) {
			var newValue = 0;

			scope.update = function(e){
				scope.ngModel = maskCheck.new('[#]', e.currentTarget.value);
				var newModel = parseInt(scope.ngModel);
				var newMax = (!scope.spinnerMax ? (newModel + 1) : parseInt(scope.spinnerMax));
				var newMin = (!scope.spinnerMin ? 0 : parseInt(scope.spinnerMin));
				if (newModel > newMin && newModel < newMax) {
					scope.ngModel = newModel;
					newValue = parseInt(scope.ngModel);
				} else if(newModel < newMin) {
					scope.ngModel = newMin;
					newValue = newMin;
				} else if(newModel > newMax) {
					scope.ngModel = newMax;
					newValue = newMax;
				}
			}

			scope.spinnerInc = function() {
				var newModel = parseInt(scope.ngModel);
				var newMax = (!scope.spinnerMax ? (newModel + 1) : parseInt(scope.spinnerMax));
				var newMin = (!scope.spinnerMin ? 0 : parseInt(scope.spinnerMin));
				if(newModel < newMax && newMax != 0){
					scope.ngModel = ++newValue;
				} else if(newMax == 0) {
					scope.ngModel = ++newValue;
				}
			};
			scope.spinnerDec = function() {
				var newModel = parseInt(scope.ngModel);
				var newMax = (!scope.spinnerMax ? (newModel + 1) : parseInt(scope.spinnerMax));
				var newMin = (!scope.spinnerMin ? 0 : parseInt(scope.spinnerMin));
				if(newModel > newMin && newMin != 0){
					scope.ngModel = --newValue;
				} else if(newMin == 0 && newValue != newMin) {
					scope.ngModel = --newValue;
				}
			};

		}
	}
}]);