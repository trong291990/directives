$app = angular.module("App",[]);
$app.directive('ngSearch', [function() {

	var tmp = ['<form>',
		'<div><input ng-model="localSearchText" type="text" /></div>',
		'<div>',
		'<button ng-click="clearSearch()" class="btn btn-small">Limpar</button>',
		'<button ng-click="doSearch()" class="btn btn-small">Pesquisar</button>',
		'</div>',
		'<div ng-show="showLoad">',
		'<img ng-show="showLoad" src="http://loadinggif.com/images/image-selection/3.gif" />',
		'Pesquisando...',
		'</div>',
		'</form>'
	];

	return {
		restrict: 'E',
		transclude: false,
		scope: {
			searchText: '=',
			showLoad: '='
		},
		controller: function($scope) {
			$scope.localSearchText = '';
			$scope.clearSearch = function() {
				$scope.searchText = "";
				$scope.localSearchText = "";
			};
			$scope.doSearch = function() {
				$scope.searchText = $scope.localSearchText;
			};
		},
		replace: true,
		template: tmp.join('')
	};
}]);

$app.directive('ngSearchResult', [function() {
	var tmp = ['<div ng-hide="showLoad">',
		'<h4 ng-show="searchResults">Foram encontrado(s) {{searchResults.length}} resultado(s) com o texto: "{{searchText}}"</h4>',
		'<ul ng-show="searchResults">',
		'<li ng-repeat="searchResult in searchResults | filter:x">',
		'{{searchResult}}',
		'</li>',
		'</ul>',
		'</div>'
	];

	return {
		restrict: 'E',
		transclude: true,
		scope: {
			showLoad: '=',
			searchResults: '=',
			searchText: '='
		},
		replace: true,
		template: tmp.join('')
	};
}]);

$app.filter('checkSource',[function(){
	return function(items,searchText) {
		var filtered = [];
		for (var i = 0; i < items.length; i++) {
			if (items[i].indexOf(searchText) != -1){
				filtered.push(items[i]);
			}
		}
		return filtered;
	};
}]);