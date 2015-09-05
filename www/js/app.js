(function () {
    'use strict';
    //localStorage.removeItem('hash');
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

                                if (value instanceof Array)
                                {
                                    for (i = 0; i < value.length; ++i)
                                    {
                                        subValue = value[i];
                                        fullSubName = name + '[' + i + ']';
                                        innerObj = {};
                                        innerObj[fullSubName] = subValue;
                                        query += param(innerObj) + '&';
                                    }
                                }
                                else if (value instanceof Object)
                                {
                                    for (subName in value)
                                    {
                                        subValue = value[subName];
                                        fullSubName = name + '[' + subName + ']';
                                        innerObj = {};
                                        innerObj[fullSubName] = subValue;
                                        query += param(innerObj) + '&';
                                    }
                                }
                                else if (value !== undefined && value !== null)
                                {
                                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                                }
                            }

                            return query.length ? query.substr(0, query.length - 1) : query;
                        };

                        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
                    }];
                });

    /*
     * задаем контроллер для навигатора
     * для модуля Onsen
     * область действия $scope ons-navigator
     */
    Onsen.controller('mainCtrl', function ($scope, $http) {
        $scope.userPhoto = 'images/user-placeholder.png';//заглушка аватарки по умолчанию
        
        if(hash != null){
            ons.ready(function (){
                gotoStart();
            });
        }else{
            screenNaPushPage('startup.html');
        }
    })

    /*
     * задаем контроллер для представления startup.html
     * для модуля Onsen
     * область действия $scope body
     */
    Onsen.controller('RegisterLoginFormCtrl', function ($scope, $http) {
        $scope.register = function () {
            var url = serverName + "/api/user";
            //?hash=
            // console.log("jsonp->"); 
            $http
                .post(url, {hash: hashKey, email: $scope.email, password: $scope.password, deviceId: deviceId})
                .success(function (data){
                    if (data.hash){
                        hash = data.hash;
                        localStorage.setItem('hash', data.hash);
                        alert("Вы успешно зарегистрировались!");
                        gotoStart();
                    }
                })
                .error(function (data) {
                    console.log(data);
                });
        }
        $scope.login = function () {
            var url = serverName + "/auth";
            $http
                .post(url, {email: $scope.email, password: $scope.password})
                .success(function (data){
                    if (data.hash){
                        hash = data.hash;
                        localStorage.setItem('hash', data.hash);
                        gotoStart();
                    }
                })
                .error(function (data) {
                    console.log(data);
                    alert("Логин или пароль введен неверно!");
                });
        }
    });
    
    /*
     * задаем контроллер для представления home.html
     * для модуля Onsen
     * область действия $scope body
     */
    Onsen.controller('HomeCtrl', function ($scope, $http) {
        var url = serverName + "/api/user-settings?hash=" + hash;
        $scope.userName = 'Новый пользователь';//заглушка аватарки по умолчанию
        //для тулбара нужно перейти в родительский скопе
        $scope.$parent.userName = $scope.userName;
        $scope.userPhoto = 'images/user-placeholder.png';//заглушка аватарки по умолчанию
        $scope.userLevel = 1;
        $scope.userSubsCount = 0;
        $scope.userSubscriberCount = 0;
        $scope.countAch = 0;
        console.log($scope);
        $http.get(url).success(function (data){
            console.log('user-settings '+data);
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

        var url = serverName + "/api/user-achievements?hash=" + hash;
        $http.get(url).success(function (data){
            console.log('user-achievements '+data);
            $scope.itemAch = data.data;
            $scope.itemAch = [{title:"Тестовая цель один", description:'описание цели один'},{title:"Тестовая цель два", description:'описание цели два'}]
        }).error(function () {
            //alert("error!");
        });

        var url = serverName + "/api/user-achievements-count?hash=" + hash;
        $http.get(url).success(function (data){
            console.log('user-achievements-count '+data);
            $scope.countAch = parseInt(data);
        }).error(function () {
            //alert("error!");
        });
    });
})();
