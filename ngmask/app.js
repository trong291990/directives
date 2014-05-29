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

			// Aqui foi um pulo do gato que achei pra validar
			// telefones com nove dígitos!!
			if(m == '## ####-####|## #####-####'){
				if(v.length>12){
					return maskID.new('## #####-####', v);
				}else{
					return maskID.new('## ####-####', v);
				}
			}

			var tv = "";
			var ret = "";
			var caracter = "#";
			var separador = "|";
			var mascara_utilizar = "";
			v = maskID.empty(v);
			if (v == ""){
				return v
			};
			var temp = m.split(separador);
			var dif = 1000;

			var vm = v;
		    //tirando mascara do valor já existente
		    for (var i = 0; i < v.length;i++){
		    	if (!isNaN(v.substr(i,1))){
		    		tv = tv + v.substr(i,1);
		    	}
		    }

		    v = tv;

			//formatar mascara dinamica
			for (i = 0; i<temp.length;i++){
				var mult = "";
				var validar = 0;
				for (var j=0;j<temp[i].length;j++){
					if (temp[i].substr(j,1) == "]"){
						temp[i] = temp[i].substr(j+1);
						break;
					}
					if (validar == 1)mult = mult + temp[i].substr(j,1);
					if (temp[i].substr(j,1) == "[")validar = 1;
				}
				for (var j=0;j<v.length;j++){
					temp[i] = mult + temp[i];
				}
			}

			//verificar qual mascara utilizar
			if (temp.length == 1){
				mascara_utilizar = temp[0];
				var mascara_limpa = "";
				for (var j=0;j<mascara_utilizar.length;j++){
					if (mascara_utilizar.substr(j,1) == caracter){
						mascara_limpa = mascara_limpa + caracter;
					}
				}
				var tam = mascara_limpa.length;
			}else{
				//limpar caracteres diferente do caracter da máscara
				for (i=0;i<temp.length;i++){
					var mascara_limpa = "";
					for (var j=0;j<temp[i].length;j++){
						if (temp[i].substr(j,1) == caracter){
							mascara_limpa = mascara_limpa + caracter;
						}
					}
					if (v.length > mascara_limpa.length){
						if (dif > (v.length - mascara_limpa.length)){
							dif = v.length - mascara_limpa.length;
							mascara_utilizar = temp[i];
							tam = mascara_limpa.length;
						}
					}else if (v.length < mascara_limpa.length){
						if (dif > (mascara_limpa.length - v.length)){
							dif = mascara_limpa.length - v.length;
							mascara_utilizar = temp[i];
							tam = mascara_limpa.length;
						}
					}else{
						mascara_utilizar = temp[i];
						tam = mascara_limpa.length;
						break;
					}
				}
			}

			//validar tamanho da mascara de acordo com o tamanho do valor
			if (v.length > tam){
				v = v.substr(0,tam);
			}else if (v.length < tam){
				var masct = "";
				var j = v.length;
				for (var i = mascara_utilizar.length-1;i>=0;i--){
					if (j == 0) break;
					if (mascara_utilizar.substr(i,1) == caracter){
						j--;
					}
					masct = mascara_utilizar.substr(i,1) + masct;
				}
				mascara_utilizar = masct;
			}

			//mascarar
			j = mascara_utilizar.length -1;
			for (var i = v.length - 1;i>=0;i--){
				if (mascara_utilizar.substr(j,1) != caracter){
					ret = mascara_utilizar.substr(j,1) + ret;
					j--;
				}
				ret = v.substr(i,1) + ret;
				j--;
			}
			return ret;
		},

		empty: function(v) {
			var vclean ="";
			var tamanho = v.length;
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

$app.directive('ngMask',['maskCheck', function(maskCheck) {

	return {
		restrict: 'A',
		scope: {
			ngModel: '=',
			mask: '@',
			valueMax: '@'
		},
		link: function(scope, elem, attrs) {
			var newMask = (!scope.mask ? '[#]' : scope.mask);
			var newCheck = (!scope.valueMax ? "" : parseFloat(scope.valueMax.replace('.','').replace(',','')));
			scope.ngModel = maskCheck.new(newMask, scope.ngModel.replace('.',''));
			if(scope.ngModel) {
				scope.ngModel = maskCheck.new(newMask, scope.ngModel); 
			}
			elem.bind("keyup", function() {
				scope.$apply(function() {
					scope.ngModel = maskCheck.new(newMask, scope.ngModel);
					var newValue = parseFloat(scope.ngModel.replace('.','').replace(',',''));
					if(newCheck) {
						if(newValue > newCheck){
							scope.ngModel = maskCheck.new(newMask, scope.valueMax);
						}
					} else {
						scope.ngModel = maskCheck.new(newMask, scope.ngModel);
					}
				});
			});
		}
	}
}]);