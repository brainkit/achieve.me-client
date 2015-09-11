(function () {
    'use strict';
    //
    var serverName = "http://pixelweb.tmweb.ru/";
    var hashKey = "$2y$10$MPO7P1iQjxtHewmnOO.GK.XJcwvGI7cLDkKaACISc8yI.Sfi9np1O";
    var deviceId = "6u3254165";
    var hash = localStorage.getItem('hash');
    //var achievements = localStorage.getItem('achievements');
    
    /*
     * инициализируем модуль который используется на элементе html
     * inject в него необходимые дополнительные модули
     */
    var Onsen = angular.module('achieveMeApp',
                [   'onsen.directives',     //модуль для работы с UI
                    'angularFileUpload',    //модуль для работы с файлами
                    'ngRoute',              //module provides routing and deeplinking services and directives for angular apps
                    'ngTouch',              //module provides touch events and other helpers for touch-enabled devices
                    'ngResource',           //module provides interaction support with RESTful services
                    'LocalStorageModule',   //module that gives you access to the browsers local storage
                    'ngCordova'             //модуль Cordova
                ],
                function ($httpProvider){
                    // Используем x-www-form-urlencoded Content-Type
                    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

                    // Переопределяем дефолтный transformRequest в $http-сервисе
                    $httpProvider.defaults.transformRequest = [function (data){
                        /**
                         * рабочая лошадка; преобразует объект в x-www-form-urlencoded строку.
                         * @param {Object} obj
                         * @return {String}
                         */
                        var param = function (obj){
                            var query = '';
                            var name, value, fullSubName, subValue, innerObj, i;

                            for (name in obj){
                                value = obj[name];

                                if (value instanceof Array){
                                    for (i = 0; i < value.length; ++i){
                                        subValue = value[i];
                                        fullSubName = name + '[' + i + ']';
                                        innerObj = {};
                                        innerObj[fullSubName] = subValue;
                                        query += param(innerObj) + '&';
                                    }
                                }else{
                                    if (value instanceof Object){
                                        for (subName in value){
                                            subValue = value[subName];
                                            fullSubName = name + '[' + subName + ']';
                                            innerObj = {};
                                            innerObj[fullSubName] = subValue;
                                            query += param(innerObj) + '&';
                                        }
                                    }else{
                                        if (value !== undefined && value !== null){
                                            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                                        }
                                    }
                                }
                            }
                            return query.length ? query.substr(0, query.length - 1) : query;
                        };

                        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
                    }];
                });

     /*
     * задаем контроллер для body - главный контроллер, все остальные вложенные в него
     * для модуля Onsen
     * область действия $scope body
     */
    Onsen.controller('BodyCtrl', function ($scope, $rootScope, $http) {
        //$scope.animation = 'slide';
        $rootScope.hideTabs = true;
        
        $scope.screenNavPushPage = function (id, animation) {
            if(typeof animation == "undefined" && !animation){
                animation = 'fade';
            }
            $('#screenTabs').attr('animation', animation);
            screenNav.pushPage(id, { animation: animation});
        }
        
        $scope.tabbarLoadPage = function (id) {
            screenTabs.loadPage(id)
        }
        
        $scope.alertDialog = function(title, message) {
            ons.notification.alert({'title': title, 'message': message});
        }
        
        $scope.getUserProfileSettings = function() {
            $scope.tabbarLoadPage('profile-settings.html');
        }
        
        $scope.goToStart = function() {
            /*$('#screenTabs').removeClass('ng-hide').removeAttr('ng-hide');
            var tabBar = $('#screenTabs')
                .removeClass('screen__tabs-hidden')
                .find('.tab-bar');
            tabBar
                .removeClass('ng-hide')
                .fadeIn();
*/
            $rootScope.hideTabs = false;
            screenTabs.setActiveTab(0);
        }
    })
    
    /*
     * задаем контроллер для навигатора
     * для модуля Onsen
     * область действия $scope ons-navigator
     */
    Onsen.controller('NavCtrl', function ($scope) {
        $scope.userPhoto = 'images/user-placeholder.png';//заглушка аватарки по умолчанию
        ons.ready(function (){
            FastClick.attach(document.body);
            if(hash != null){
                $scope.goToStart();
            }else{
                $scope.tabbarLoadPage('startup.html');
            }
        }); 
        
    })
    
    /*
     * задаем контроллер для таббара
     * для модуля Onsen
     * область действия $scope ons-tabbar
     */
    Onsen.controller('TabBarCtrl', function ($scope, $rootScope) {
        $scope.logoutProfile = function () {
            localStorage.removeItem('hash');
            $rootScope.hideTabs = true;
            $scope.tabbarLoadPage('startup.html');
        }
    })

    /*
     * задаем контроллер для представления startup.html
     * для модуля Onsen
     * область действия $scope .register-login-page
     */
    Onsen.controller('RegisterLoginFormCtrl', function ($scope, $http) {
        $scope.register = function () {
            var url = serverName + "api/user";
            //?hash=
            // console.log("jsonp->"); 
            $http
                .post(url, {hash: hashKey, email: $scope.email, password: $scope.password, deviceId: deviceId})
                .success(function (data){
                    if (data.hash){
                        hash = data.hash;
                        localStorage.setItem('hash', data.hash);
                        $scope.alertDialog('Поздравляем!','Вы успешно зарегистрировались!');
                        $scope.goToStart();
                    }
                })
                .error(function (data) {
                    console.log(data);
                });
        }
        $scope.login = function () {
            var url = serverName + "auth";
            $http
                .post(url, {email: $scope.email, password: $scope.password})
                .success(function (data){
                    if (data.message){
                        switch (data.message){
                            case 'Unauthorized':
                                $scope.alertDialog('Ошибка!','Логин или пароль введен неверно!');
                                break;
                            case 'user autorized':
                                $scope.alertDialog('Здравствуйте!','Вы успешно прошли авторизацию!');
                                break; 
                            default :
                                $scope.alertDialog('Ошибка!', data.message);
                                break;
                        }
                    }
                    if (data.hash){
                        hash = data.hash;
                        localStorage.setItem('hash', data.hash);
                        $scope.goToStart();
                    }
                    
                })
                .error(function (data) {
                    console.log(data);
                });
        }
    });
    
    /*
     * задаем контроллер для представления home.html
     * для модуля Onsen
     * область действия $scope .home-page
     */
    Onsen.controller('HomeCtrl', function ($scope, $http) {
        var url = serverName + "api/user-settings?hash=" + hash;
        $scope.userName = 'Новый пользователь';//заглушка аватарки по умолчанию
        //для тулбара нужно перейти в родительский скопе
        $scope.$parent.userName = $scope.userName;
        $scope.userPhoto = 'images/user-placeholder.png';//заглушка аватарки по умолчанию
        $scope.userLevel = 1;
        $scope.userSubsCount = 0;
        $scope.userSubscriberCount = 0;
        $scope.countAch = 0;
        $http.get(url).success(function (data){
            //console.log('data.name '+data.name);
            if(data.name.trim() != ''){
                $scope.userName = data.name;
                $scope.$parent.userName = $scope.userName;
            }
            if(data.photo.trim() != ''){
                $scope.userPhoto = data.photo;
            }
        }).error(function () {
            //alert("error!");
        });

        var url = serverName + "api/user-achievements?hash=" + hash;
        $http.get(url).success(function (data){
            $scope.itemAch = data.data;
            $scope.itemAch = [
                    {title:"Тестовая цель один", description:'описание цели один'},
                    {title:"Тестовая цель два", description:'описание цели два'}
                ]
        }).error(function () {
            //alert("error!");
        });

        var url = serverName + "api/user-achievements-count?hash=" + hash;
        $http.get(url).success(function (data){
            $scope.countAch = parseInt(data);
        }).error(function () {
            //alert("error!");
        });
    });
    
    /*
     * задаем контроллер для представления profile-settings.html
     * для модуля Onsen
     * область действия $scope .profile-settings-page
     */
    Onsen.controller('EditProfileCtrl', function ($scope, $http, $upload) {
        var url = serverName + "api/user-settings?hash=" + hash;
        $scope.userPhoto = 'images/user-placeholder.png';//заглушка аватарки по умолчанию
        
        $http.get(url).success(function (data){
            $scope.userName = data.name;
            $scope.userPhoto = serverName + data.photo;
        }).error(function () {
            // alert("Логин или пароль введен неверно!");
            //alert("error!");
        });

        $scope.changeName = function(){
            var url = serverName + "api/user-settings/update";
            $http.post(url, {hash: hash, name: $scope.userName}).success(function (){
                // console.log(data);
            }).error(function(){
                // alert("Логин или пароль введен неверно!");
            });
        };

        $scope.changePhoto = function($files){
            var url = serverName + "api/user-settings/update";
            var file = $files[0];
            $scope.upload = $upload.upload({
                url: url, //upload.php script, node.js route, or servlet url
                method: 'POST',
                //headers: {'header-key': 'header-value'},
                //withCredentials: true,
                data: {myObj: $scope.uploadPhoto, hash: hash},
                file: file, // or list of files ($files) for html5 only
                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                // customize file formData name ('Content-Disposition'), server side file variable name. 
                fileFormDataName: "photo", //or a list of names for multiple files (html5). Default is 'file' 
                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                //formDataAppender: function(formData, key, val){}
            }).progress(function (evt){
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                var percent = parseInt(100.0 * evt.loaded / evt.total);
                $scope.uploadStatus = "Загрузка: " + percent + "%";
            }).success(function (data, status, headers, config) {
                $scope.uploadStatus = "Аватар загружен!";
            });
        };
    });
})();
