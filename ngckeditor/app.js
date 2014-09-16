/**
* ngCkeditor
*
* @author Douglas Lira <douglas.lira.web@gmail.com>
* @url https://github.com/douglaslira/directives/ngckeditor/
*/

$app = angular.module("App",[]);
$app.directive('ngCkeditor', function($parse) {
    CKEDITOR.disableAutoInline = true;
    var contador = 0,
    prefix = '__htmlEDITOR_';
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var gets = $parse(attrs.ngCkeditor), sets = gets.assign, type = attrs.editorType, options = {}, mustRefreshEditor = true;
            attrs.$set('contenteditable', true);
            if (!attrs.id) {
                attrs.$set('id', prefix + (++contador));
            }

            if(type == "simple") {
                options.toolbarGroups = [
                    {name:'document', groups: ['mode', 'document','shSCAYT','image']}
                ]
            }

            options.disableNativeSpellChecker = true;
            options.extraPlugins = 'dialog,scayt,wsc,image';
            // UPLOAD URL
            options.filebrowserImageUploadUrl = 'index.php';

            options.on = {
                "change": function (e) {
                    if (e.editor.checkDirty()) {
                        var ckValue = e.editor.getData();
                        scope.$apply(function () {
                            mustRefreshEditor = false;
                            sets(scope, ckValue);
                        });
                        ckValue = null;
                        e.editor.resetDirty();
                    }
                }
            };

            // Initialize
            var editorTextoAngular = CKEDITOR.replace(element[0], options);
            scope.$watch(attrs.ngCkeditor, function (value) {
                if (mustRefreshEditor) {
                    editorTextoAngular.setData(value);
                } else {
                    mustRefreshEditor = true;
                }
            });
        }
    }
});
