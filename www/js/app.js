(function () {
    'use strict';
    var serverName = "http://pixelweb.tmweb.ru/";
    var hashKey = "$2y$10$MPO7P1iQjxtHewmnOO.GK.XJcwvGI7cLDkKaACISc8yI.Sfi9np1O";
    var deviceId = "6u3254165";
    var hash = localStorage.getItem('hash');
    //var achievements = localStorage.getItem('achievements');
    
    
    var Onsen = angular.module('myApp', ['onsen.directives', 'angularFileUpload', 'ngTouch', 'ngResource','ngCordova'], function ($httpProvider)
    {
        // Используем x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        // Переопределяем дефолтный transformRequest в $http-сервисе
        $httpProvider.defaults.transformRequest = [function (data)
            {
                /**
                 * рабочая лошадка; преобразует объект в x-www-form-urlencoded строку.
                 * @param {Object} obj
                 * @return {String}
                 */
                var param = function (obj)
                {
                    var query = '';
                    var name, value, fullSubName, subValue, innerObj, i;

                    for (name in obj)
                    {
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

    
    Onsen.controller('StartUp', function ($scope) {
        //$scope.greeting = "Good Night!";
        $scope.startText = "Пара слов о том, что за приложение. Коротко, ясно, просто. И слоган :)";

        if (hash != null)
        {
            ons.ready(function () {
                gotoStart();
            });
        }
    });


    Onsen.controller('formRegister', function ($scope, $http) {
        $scope.submit = function () {
            var url = serverName + "/api/user";
            //?hash=
            // console.log("jsonp->"); 
            $http.post(url, {hash: hashKey, email: $scope.email, password: $scope.password, deviceId: deviceId})
                    .success(function (data)
                    {
                        if (data.hash)
                        {
                            hash = data.hash;
                            localStorage.setItem('hash', data.hash);
                            alert("Вы успешно зарегистрировались!");
                            gotoStart();
                        }

                    });
        }

        /* $scope.register = function () {
         // alert(1);
         $scope.msg = 'clicked';
         }*/
    });

    Onsen.controller('formLogin', function ($scope, $http) {
        $scope.submit = function () {
            //   alert(1);
            var url = serverName + "/auth";
            $http.post(url, {email: $scope.email, password: $scope.password})
                    .success(function (data)
                    {
                        if (data.hash)
                        {
                            hash = data.hash;
                            localStorage.setItem('hash', data.hash);
                            gotoStart();
                        }
                    })
                    .error(function () {
                        alert("Логин или пароль введен неверно!");
                    });
        }

    });

})();
