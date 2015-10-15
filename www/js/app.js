
/********/
(function () {
    'use strict';

    var serverName = "http://pixelweb.tmweb.ru";
    var hashKey = "$2y$10$WrSg4Qt2COjvnVhgMHTyAekZOtdUcnThxh3Yj2JO9BurcE36I3P0K";
    var deviceId = "6u3254165";
    var hash = localStorage.getItem('hash');
    //var achievements = localStorage.getItem('achievements');
    var alreadyPageLoad = false;
    /*
     * инициализируем модуль который используется на элементе html
     * inject в него необходимые дополнительные модули
     */
    var Onsen = angular.module('achieveMeApp',
                [   'onsen.directives',     //модуль для работы с UI
                    //'angularFileUpload',    //модуль для работы с файлами
                    'ngFileUpload',    //модуль для работы с файлами
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

        $rootScope.serverName = serverName;
        
        $rootScope.hideTabs = true;
        $scope.alertDialog = function(title, message) {
            ons.notification.alert({'title': title, 'message': message});
        }
        
        /*
         * Метод отображения страницы настройки профиля
         */
        $scope.getUserProfileSettings = function(push) {
            if(push){
                $rootScope.screenNavPushPage('profile-settings.html', 'slide');
            }else{
                screenTabs.setActiveTab(5);
            }
        }
        
        /*
         * Метод скрытия панели с кнопками
         */
        $scope.hideTabBar = function() {
            $rootScope.hideTabs = true;
            $('.navigation-bar__left').css({'visibility':'hidden'});
            $('.navigation-bar__right').css({'visibility':'hidden'});
        }
        
        /*
         * Метод отображения панели с кнопками
         */
        $scope.showTabBar = function() {
            $rootScope.hideTabs = false;
            $('.navigation-bar__left').css({'visibility':'visible'});
            $('.navigation-bar__right').css({'visibility':'visible'});
        }
        
        /*
         * Метод вызываемый, когда имя пользователя невведено (скрывает табы и выводит сообщение)
         */
        $scope.noUserName = function() {
            $scope.hideTabBar();
            $scope.alertDialog('Внимание!','Перед началом использования приложения Вам необходимо ввести свое имя и при возможности добавить аватар для узнаваемости');
        }
        
        $rootScope.userPhotoDefault = 'images/user-placeholder.png';//заглушка аватарки по умолчанию
        // инициализация настроек пользователя
        $rootScope.userName = '';
        $rootScope.userPhoto = $rootScope.userPhotoDefault;
        $rootScope.created_at = '';
        $rootScope.deleted_at = null;
        $rootScope.updated_at = '';
        $rootScope.interests = '';
        $rootScope.rating = 0;
        $rootScope.social_integration = 0;
        $rootScope.user_id = 0;
        
        $scope.goToHomePage = function() {
            if(hash){
                var url = serverName + "/api/user-settings?hash=" + hash;
                $http.get(url).success(function (data){
                    $rootScope.created_at = data.created_at;
                    $rootScope.deleted_at = data.deleted_at;
                    $rootScope.updated_at = data.updated_at;
                    $rootScope.interests = data.interests;
                    $rootScope.rating = data.rating;
                    $rootScope.social_integration = data.social_integration;
                    $rootScope.user_id = data.user_id;
                    if(data.name != ''){
                        $rootScope.userName = data.name;
                        $scope.showTabBar();
                        screenTabs.setActiveTab(0);
                    }else{
                        $rootScope.userName = '';
                        $scope.noUserName();
                        $scope.getUserProfileSettings(false);
                    }
                    if((data.photo != '') && (data.photo != (serverName+'/'))){
                        $rootScope.userPhoto = serverName + data.photo;
                    }else{
                        $rootScope.userPhoto = $rootScope.userPhotoDefault;
                    }
                }).error(function () {
                    //alert("error!");
                });
            }else{
               screenTabs.setActiveTab(4);
            }
        }
        
        ons.ready(function (){
            FastClick.attach(document.body);
            $scope.goToHomePage();
        });
 
    })
    
    /*
     * задаем контроллер для навигатора
     * для модуля Onsen
     * область действия $scope ons-navigator
     */
    Onsen.controller('NavCtrl', function ($scope, $rootScope) {
        /*
         * Метод листания стрниц (есть возможность навигации)
         */
        $rootScope.screenNavPushPage = function (id, animation) {
            if(typeof animation == "undefined" && !animation){
                animation = 'slide';
            }
            $('#screenTabs').attr('animation', animation);
            screenNav.pushPage(id, { animation: animation});
        }
    })
    
    /*
     * задаем контроллер для таббара
     * для модуля Onsen
     * область действия $scope ons-tabbar
     */
    Onsen.controller('TabBarCtrl', function ($scope, $rootScope) {
        /*
         * Метод подгрузки стрницы
         */
        /*$rootScope.tabbarLoadPage = function (id) {
            screenTabs.loadPage(id);
        }*/
        
        /*$scope.setActiveTab = function (page, tabId) {
            $rootScope.tabbarLoadPage(page);
            screenTabs.setActiveTab(tabId);
        }*/
        $scope.logoutProfile = function () {
            localStorage.removeItem('hash');
            hash = null;
            $rootScope.hideTabs = true;
        }
    })

    /*
     * задаем контроллер для представления startup.html
     * для модуля Onsen
     * область действия $scope .startup-page
     */
    Onsen.controller('StartupCtrl', function ($scope, $rootScope, $http) {
        $scope.register = function () {
            var url = serverName + "/api/user";
            $http
                .post(url, {hash: hashKey, email: $scope.email, password: $scope.password, deviceId: deviceId})
                .success(function (data){
                    if (data.hash){
                        hash = data.hash;
                        localStorage.setItem('hash', data.hash);
                        $scope.alertDialog('Поздравляем! Вы успешно зарегистрировались!','Перед началом использования приложения Вам необходимо ввести свое имя и при возможности добавить аватар для узнаваемости');
                        $scope.goToHomePage();
                    }
                })
                .error(function (data) {
                    //console.log(data);
                });
        }
        $scope.login = function () {
            var url = serverName + "/auth";
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
                        $scope.goToHomePage();
                    }
                })
                .error(function (data) {
                    //console.log(data);
                });
        }
    });
    
    /*
     * задаем контроллер для представления profile.html
     * для модуля Onsen
     * область действия $scope .profile-page
     */
    Onsen.controller('ProfileCtrl', function ($scope, $rootScope, $http) {
        
        $scope.userLevel = 1;
        $scope.userSubsCount = 0;
        $scope.userSubscriberCount = 0;
        $scope.countAch = 0;

        var url = serverName + "/api/user-achievements?hash=" + hash;
        $http.get(url).success(function (data){
            $scope.itemAch = data.data;
            $scope.itemAch = [
                    {title:"Тестовая цель один", description:'описание цели один'},
                    {title:"Тестовая цель два", description:'описание цели два'}
                ]
        }).error(function () {
            //alert("error!");
        });

        var url = serverName + "/api/user-achievements-count?hash=" + hash;
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
    Onsen.controller('ProfileSettingsCtrl', function ($scope, $rootScope, $timeout, $http, Upload) {
        $scope.showUploadStatus = false;
   
        $scope.changeName = function(){
            $scope.showUploadStatus = false;
            if($rootScope.userName != ''){
                $scope.showTabBar();
            }else{
                $scope.noUserName();
            }
            var url = serverName + "/api/user-settings/update";
            $http.post(url, {hash: hash, name: $rootScope.userName}).success(function (data){
                //console.log(data);
            }).error(function(){
                alert("Логин или пароль введен неверно!");
            });
        };
        
        $scope.uploadAvatar = function (file) {
            $scope.showUploadStatus = true;
            if (file != null) {
                var url = serverName + "/api/user-settings/update";
                $scope.uploadStatusClass = "upload";
                file.upload = Upload.upload({
                    url: url,
                    resumeSizeUrl: null,
                    resumeChunkSize: null,
                    headers: {
                        'optional-header': 'header-value'
                    },
                    data: {hash: hash, photo: file}
                });
                file.upload.progress(function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    $scope.uploadStatus = "Загрузка: " + file.progress + "%";
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data.photo;
                        $scope.uploadStatus = "Аватар загружен!";
                        $scope.uploadStatusClass = "right";
                        $rootScope.userPhoto = serverName + file.result+'?'+Date.now();
                    });
                }, function (response) {
                    if (response.error){
                        $scope.uploadStatus = 'Ошибка загрузки аватара!';
                        $scope.uploadStatusClass = "error";
                    }
                });

                file.upload.xhr(function (xhr) {
                    // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
                });
            }else{
                $scope.uploadStatus = 'Вы не выбрали новый аватар!';
                $scope.uploadStatusClass = "error";
            }
        };
    });
    
    /*
     * задаем контроллер для ленты обновлений пользователя
     * для модуля Onsen
     * область действия $scope .feed-page
     */
    Onsen.controller('FeedCtrl', function ($scope, $rootScope, $http) {
        $scope.showEmptyFeedPart = false;
        $scope.showNotEmptyFeedPart = false;
        
        $scope.getUserFeed = function(userId){
            var url = serverName + "/api/users/subs/achievements/"+userId+"?hash=" + hash;
            $http.get(url).success(function (data){
                //console.log(data);
                if(data.achievements.length > 0){
                    $scope.showEmptyFeedPart = false;
                    $scope.showNotEmptyFeedPart = true;
                }else{
                    $scope.showEmptyFeedPart = true;
                    $scope.showNotEmptyFeedPart = false;
                }
            }).error(function(){
                //alert("error");
            });
        };
        
        $scope.getSubscriptionsPage = function(type){
            $rootScope.subscriptionsPageType = type;
            $rootScope.screenNavPushPage('subscriptions.html', 'slide');
        };
        
        $scope.getUserFeed($rootScope.user_id);
        
    });
    
    /*
     * задаем контроллер для страницы подписчиков/поиска
     * для модуля Onsen
     * область действия $scope .subscriptions-page
     */
    Onsen.controller('SubscriptionsCtrl', function ($scope, $rootScope, $http) {
        
        $scope.showSearchField = false;
        var title = '';
        switch ($rootScope.subscriptionsPageType){
            case 'userSearch':
                title = 'Поиск по имени или email';
                $scope.showSearchField = true;
                break;
            case 'userSocial':
                title = 'Друзья из соц. сетей';
                break;
            case 'userRecomend':
                title = 'Рекомендуемые пользователи';
                break;
            default :
               title = 'Подписчики';
               break;
        }
        $scope.subscriptionsPageTitle = title;
        $scope.subscriptionsList = [];
        $scope.getUserSearch = function(searchString){
            var url = serverName + "/api/user-search/"+searchString+"?hash=" + hash;
            $http.get(url).success(function (data){
                console.log(data);
                $scope.subscriptionsList = data[0];
            }).error(function(){
                //alert("error");
            });
        };
    });
})();
