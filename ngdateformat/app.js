/**
* ngDateFormat
*
* @author Douglas Lira <douglas.lira.web@gmail.com>
* @url https://github.com/douglaslira/directives/ngdateformat/
*/

$app = angular.module("App",[]);
$app.directive('ngFormatDate',formatDate);
function formatDate(){
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, modelCtrl) {
            modelCtrl.$formatters.push(function(modelValue){
                return new Date(modelValue);
            })
        }
    }
}