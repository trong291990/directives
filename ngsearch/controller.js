// Example 01
$app.controller('UserController',['$scope', '$timeout', '$filter', function($scope, $timeout, $filter){
	$scope.$watch("username", function(username) {
		if(username) {
			$scope.userSearchSource = ['Douglas','Suissa','Klederson','Rodrigo','Taller', 'Reginaldo'];
			$scope.result = [];
			$scope.showload = true;
			$timeout(function() {
				$scope.showload = false;
				$scope.result = $filter('checkSource')($scope.userSearchSource,username);
			}, 1000);
		} else {
			$scope.showload = false;
			$scope.result = [];
		}
	});
}]);