
angular.module('ngCordova', [
  'ngCordova.plugins'
]);
angular.module('ngCordova.plugins', [	 'deviceMotion',	 'module',	 'sqlite',	 'statusbar',	 'keyboard',	 'device',	 'file',	 'localNotification',	 'appAvailability',	 'push',	 'socialSharing']);//#### Begin Individual Plugin Code ####// install   :     cordova plugin add org.apache.cordova.device-motion
// link      :     https://github.com/apache/cordova-plugin-device-motion/blob/master/doc/index.md

angular.module('ngCordova.plugins.deviceMotion', [])

  .factory('$cordovaDeviceMotion', ['$q', function ($q) {

    return {
      getCurrentAcceleration: function () {
        var q = $q.defer();

        navigator.accelerometer.getCurrentAcceleration(function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      },

      watchAcceleration: function (options) {
        var q = $q.defer();

        var watchID = navigator.accelerometer.watchAcceleration(function (result) {
          q.notify(result);
        }, function (err) {
          q.reject(err);
        }, options);

        q.promise.cancel = function () {
          navigator.accelerometer.clearWatch(watchID);
        };

        q.promise.clearWatch = function (id) {
          navigator.accelerometer.clearWatch(id || watchID);
        };

        q.promise.watchID = watchID;

        return q.promise;
      },

      clearWatch: function (watchID) {
        return navigator.accelerometer.clearWatch(watchID);
      }
    };
  }]);
angular.module('ngCordova.plugins', [
  'ngCordova.plugins.actionSheet',
  'ngCordova.plugins.adMob',
  'ngCordova.plugins.appAvailability',
  'ngCordova.plugins.appRate',
  'ngCordova.plugins.appVersion',
  'ngCordova.plugins.backgroundGeolocation',
  'ngCordova.plugins.badge',
  'ngCordova.plugins.barcodeScanner',
  'ngCordova.plugins.batteryStatus',
  'ngCordova.plugins.ble',
  'ngCordova.plugins.bluetoothSerial',
  'ngCordova.plugins.brightness',
  'ngCordova.plugins.calendar',
  'ngCordova.plugins.camera',
  'ngCordova.plugins.capture',
  'ngCordova.plugins.clipboard',
  'ngCordova.plugins.contacts',
  'ngCordova.plugins.datePicker',
  'ngCordova.plugins.device',
  'ngCordova.plugins.deviceMotion',
  'ngCordova.plugins.deviceOrientation',
  'ngCordova.plugins.dialogs',
  'ngCordova.plugins.emailComposer',
  'ngCordova.plugins.facebook',
  'ngCordova.plugins.facebookAds',
  'ngCordova.plugins.file',
  'ngCordova.plugins.fileTransfer',
  'ngCordova.plugins.fileOpener2',
  'ngCordova.plugins.flashlight',
  'ngCordova.plugins.flurryAds',
  'ngCordova.plugins.ga',
  'ngCordova.plugins.geolocation',
  'ngCordova.plugins.globalization',
  'ngCordova.plugins.googleAds',
  'ngCordova.plugins.googleAnalytics',
  'ngCordova.plugins.googleMap',
  'ngCordova.plugins.healthKit',
  'ngCordova.plugins.httpd',
  'ngCordova.plugins.iAd',
  'ngCordova.plugins.imagePicker',
  'ngCordova.plugins.inAppBrowser',
  'ngCordova.plugins.keyboard',
  'ngCordova.plugins.keychain',
  'ngCordova.plugins.localNotification',
  'ngCordova.plugins.media',
  'ngCordova.plugins.mMediaAds',
  'ngCordova.plugins.mobfoxAds',
  'ngCordova.plugins.mopubAds',
  'ngCordova.plugins.nativeAudio',
  'ngCordova.plugins.network',
  'ngCordova.plugins.oauth',
  'ngCordova.plugins.oauthUtility',
  'ngCordova.plugins.pinDialog',
  'ngCordova.plugins.prefs',
  'ngCordova.plugins.printer',
  'ngCordova.plugins.progressIndicator',
  'ngCordova.plugins.push',
  'ngCordova.plugins.sms',
  'ngCordova.plugins.socialSharing',
  'ngCordova.plugins.spinnerDialog',
  'ngCordova.plugins.splashscreen',
  'ngCordova.plugins.sqlite',
  'ngCordova.plugins.statusbar',
  'ngCordova.plugins.toast',
  'ngCordova.plugins.touchid',
  'ngCordova.plugins.vibration',
  'ngCordova.plugins.videoCapturePlus',
  'ngCordova.plugins.zip'
]);
// install   :      cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
// link      :      https://github.com/brodysoft/Cordova-SQLitePlugin/blob/master/README.md

angular.module('ngCordova.plugins.sqlite', [])

  .factory('$cordovaSQLite', ['$q', '$window', function ($q, $window) {

    return {
      openDB: function (dbName, background) {

        if (typeof background === 'undefined') {
          background = 0;
        }

        return $window.sqlitePlugin.openDatabase({
          name: dbName,
          bgType: background
        });
      },

      execute: function (db, query, binding) {
        var q = $q.defer();
        db.transaction(function (tx) {
          tx.executeSql(query, binding, function (tx, result) {
              q.resolve(result);
            },
            function (transaction, error) {
              q.reject(error);
            });
        });
        return q.promise;
      },

      insertCollection: function (db, query, bindings) {
        var q = $q.defer();
        var coll = bindings.slice(0); // clone collection

        db.transaction(function (tx) {
          (function insertOne() {
            var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
            try {
              tx.executeSql(query, record, function (tx, result) {
                if (coll.length === 0) {
                  q.resolve(result);
                } else {
                  insertOne();
                }
              }, function (transaction, error) {
                q.reject(error);
                return;
              });
            } catch (exception) {
              q.reject(exception);
            }
          })();
        });
        return q.promise;
      },

      nestedExecute: function (db, query1, query2, binding1, binding2) {
        var q = $q.defer();

        db.transaction(function (tx) {
            tx.executeSql(query1, binding1, function (tx, result) {
              q.resolve(result);
              tx.executeSql(query2, binding2, function (tx, res) {
                q.resolve(res);
              });
            });
          },
          function (transaction, error) {
            q.reject(error);
          });

        return q.promise;
      },

      deleteDB: function (dbName) {
        var q = $q.defer();

        $window.sqlitePlugin.deleteDatabase(dbName, function (success) {
          q.resolve(success);
        }, function (error) {
          q.reject(error);
        });

        return q.promise;
      }
    };
  }]);
// install   :      cordova plugin add org.apache.cordova.statusbar
// link      :      https://github.com/apache/cordova-plugin-statusbar/blob/master/doc/index.md

angular.module('ngCordova.plugins.statusbar', [])

  .factory('$cordovaStatusbar', [function () {

    return {
      overlaysWebView: function (bool) {
        return StatusBar.overlaysWebView(!!bool);
      },

      style: function (style) {
        switch (style) {
          // Default
          case 0:
            return StatusBar.styleDefault();

          // LightContent
          case 1:
            return StatusBar.styleLightContent();

          // BlackTranslucent
          case 2:
            return StatusBar.styleBlackTranslucent();

          // BlackOpaque
          case 3:
            return StatusBar.styleBlackOpaque();

          default:
            return StatusBar.styleDefault();
        }
      },

      // supported names:
      // black, darkGray, lightGray, white, gray, red, green,
      // blue, cyan, yellow, magenta, orange, purple, brown
      styleColor: function (color) {
        return StatusBar.backgroundColorByName(color);
      },

      styleHex: function (colorHex) {
        return StatusBar.backgroundColorByHexString(colorHex);
      },

      hide: function () {
        return StatusBar.hide();
      },

      show: function () {
        return StatusBar.show();
      },

      isVisible: function () {
        return StatusBar.isVisible;
      }
    };
  }]);
// install   :      cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git
// link      :      https://github.com/driftyco/ionic-plugins-keyboard

//TODO: add support for native.keyboardshow + native.keyboardhide

angular.module('ngCordova.plugins.keyboard', [])

  .factory('$cordovaKeyboard', [function () {

    return {
      hideAccessoryBar: function (bool) {
        return cordova.plugins.Keyboard.hideKeyboardAccessoryBar(bool);
      },

      close: function () {
        return cordova.plugins.Keyboard.close();
      },

      disableScroll: function (bool) {
        return cordova.plugins.Keyboard.disableScroll(bool);
      },

      isVisible: function () {
        return cordova.plugins.Keyboard.isVisible;
      }
    };
  }]);
// install   :     cordova plugin add org.apache.cordova.device
// link      :     https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md

angular.module('ngCordova.plugins.device', [])

  .factory('$cordovaDevice', [function () {

    return {
      /**
       * Returns the whole device object.
       * @see https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md
       * @returns {Object} The device object.
       */
      getDevice: function () {
        return device;
      },

      /**
       * Returns the Cordova version.
       * @see https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md#devicecordova
       * @returns {String} The Cordova version.
       */
      getCordova: function () {
        return device.cordova;
      },

      /**
       * Returns the name of the device's model or product.
       * @see https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md#devicemodel
       * @returns {String} The name of the device's model or product.
       */
      getModel: function () {
        return device.model;
      },

      /**
       * @deprecated device.name is deprecated as of version 2.3.0. Use device.model instead.
       * @returns {String}
       */
      getName: function () {
        return device.name;
      },

      /**
       * Returns the device's operating system name.
       * @see https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md#deviceplatform
       * @returns {String} The device's operating system name.
       */
      getPlatform: function () {
        return device.platform;
      },

      /**
       * Returns the device's Universally Unique Identifier.
       * @see https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md#deviceuuid
       * @returns {String} The device's Universally Unique Identifier
       */
      getUUID: function () {
        return device.uuid;
      },

      /**
       * Returns the operating system version.
       * @see https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md#deviceversion
       * @returns {String}
       */
      getVersion: function () {
        return device.version;
      }
    };
  }]);
// install   :     cordova plugin add org.apache.cordova.file
// link      :     https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md

angular.module('ngCordova.plugins.file', [])

  .constant("$cordovaFileError", {
    1: 'NOT_FOUND_ERR',
    2: 'SECURITY_ERR',
    3: 'ABORT_ERR',
    4: 'NOT_READABLE_ERR',
    5: 'ENCODING_ERR',
    6: 'NO_MODIFICATION_ALLOWED_ERR',
    7: 'INVALID_STATE_ERR',
    8: 'SYNTAX_ERR',
    9: 'INVALID_MODIFICATION_ERR',
    10: 'QUOTA_EXCEEDED_ERR',
    11: 'TYPE_MISMATCH_ERR',
    12: 'PATH_EXISTS_ERR'
  })

  .provider('$cordovaFile', [function () {

    this.$get = ['$q', '$window', '$cordovaFileError', function ($q, $window, $cordovaFileError) {

      return {
        checkDir: function (path, dir) {
          var q = $q.defer();

          if ((/^\//.test(dir))) {
            q.reject("directory cannot start with \/")
          }

          try {
            var directory = path + dir;
            $window.resolveLocalFileSystemURL(directory, function (fileSystem) {
              if (fileSystem.isDirectory === true) {
                q.resolve(fileSystem);
              } else {
                q.reject({code: 13, message: "input is not a directory"});
              }
            }, function (error) {
              error.message = $cordovaFileError[error.code];
              q.reject(error);
            });
          } catch (err) {
            err.message = $cordovaFileError[err.code];
            q.reject(err);
          }

          return q.promise;
        },


        checkFile: function (path, file) {
          var q = $q.defer();

          if ((/^\//.test(file))) {
            q.reject("directory cannot start with \/")
          }

          try {
            var directory = path + file;
            $window.resolveLocalFileSystemURL(directory, function (fileSystem) {
              if (fileSystem.isFile === true) {
                q.resolve(fileSystem);
              } else {
                q.reject({code: 13, message: "input is not a file"});
              }
            }, function (error) {
              error.message = $cordovaFileError[error.code];
              q.reject(error);
            });
          } catch (err) {
            err.message = $cordovaFileError[err.code];
            q.reject(err);
          }

          return q.promise;
        },

        createDir: function (path, dirName, replaceBool) {
          var q = $q.defer();

          if ((/^\//.test(dirName))) {
            q.reject("directory cannot start with \/")
          }

          replaceBool = replaceBool ? false : true;

          var options = {
            create: true,
            exclusive: replaceBool
          };

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getDirectory(dirName, options, function (result) {
                q.resolve(result);
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }

          return q.promise;
        },

        createFile: function (path, fileName, replaceBool) {
          var q = $q.defer();

          if ((/^\//.test(fileName))) {
            q.reject("file-name cannot start with \/")
          }

          replaceBool = replaceBool ? false : true;

          var options = {
            create: true,
            exclusive: replaceBool
          };

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(fileName, options, function (result) {
                q.resolve(result);
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }
          return q.promise;
        },


        removeDir: function (path, dirName) {
          var q = $q.defer();

          if ((/^\//.test(dirName))) {
            q.reject("file-name cannot start with \/")
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getDirectory(dirName, {create: false}, function (dirEntry) {
                dirEntry.remove(function () {
                  q.resolve({success: true, fileRemoved: dirEntry});
                }, function (error) {
                  error.message = $cordovaFileError[error.code];
                  q.reject(error);
                });
              }, function (err) {
                err.message = $cordovaFileError[err.code];
                q.reject(err);
              });
            }, function (er) {
              er.message = $cordovaFileError[er.code];
              q.reject(er);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }
          return q.promise;
        },

        removeFile: function (path, fileName) {
          var q = $q.defer();

          if ((/^\//.test(fileName))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(fileName, {create: false}, function (fileEntry) {
                fileEntry.remove(function () {
                  q.resolve({success: true, fileRemoved: fileEntry});
                }, function (error) {
                  error.message = $cordovaFileError[error.code];
                  q.reject(error);
                });
              }, function (err) {
                err.message = $cordovaFileError[err.code];
                q.reject(err);
              });
            }, function (er) {
              er.message = $cordovaFileError[er.code];
              q.reject(er);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }
          return q.promise;
        },

        removeRecursively: function (path, dirName) {
          var q = $q.defer();

          if ((/^\//.test(dirName))) {
            q.reject("file-name cannot start with \/")
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getDirectory(dirName, {create: false}, function (dirEntry) {
                dirEntry.removeRecursively(function () {
                  q.resolve({success: true, fileRemoved: dirEntry});
                }, function (error) {
                  error.message = $cordovaFileError[error.code];
                  q.reject(error);
                });
              }, function (err) {
                err.message = $cordovaFileError[err.code];
                q.reject(err);
              });
            }, function (er) {
              er.message = $cordovaFileError[er.code];
              q.reject(er);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }
          return q.promise;
        },

        writeFile: function (path, fileName, text, replaceBool) {
          var q = $q.defer();

          if ((/^\//.test(fileName))) {
            q.reject("file-name cannot start with \/");
          }

          replaceBool = replaceBool ? false : true;

          var options = {
            create: true,
            exclusive: replaceBool
          };

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(fileName, options, function (fileEntry) {
                fileEntry.createWriter(function (writer) {
                  if (options.append === true) {
                    writer.seek(writer.length);
                  }

                  if (options.truncate) {
                    writer.truncate(options.truncate);
                  }

                  writer.onwriteend = function (evt) {
                    if (this.error) {
                      q.reject(this.error);
                    }
                    else {
                      q.resolve(evt);
                    }
                  };

                  writer.write(text);

                  q.promise.abort = function () {
                    writer.abort();
                  };
                });
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }

          return q.promise;
        },


        writeExistingFile: function (path, fileName, text) {
          var q = $q.defer();

          if ((/^\//.test(fileName))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(fileName, {create: false}, function (fileEntry) {
                fileEntry.createWriter(function (writer) {
                  writer.seek(writer.length);

                  writer.onwriteend = function (evt) {
                    if (this.error) {
                      q.reject(this.error);
                    }
                    else {
                      q.resolve(evt);
                    }
                  };

                  writer.write(text);

                  q.promise.abort = function () {
                    writer.abort();
                  };
                });
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }

          return q.promise;
        },


        readAsText: function (path, file) {
          var q = $q.defer();

          if ((/^\//.test(file))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(file, {create: false}, function (fileEntry) {
                fileEntry.file(function (fileData) {
                  var reader = new FileReader();

                  reader.onloadend = function (evt) {
                    if (evt.target._result !== undefined || evt.target._result !== null) {
                      q.resolve(evt.target._result);
                    }
                    else if (evt.target._error !== undefined || evt.target._error !== null) {
                      q.reject(evt.target._error);
                    }
                    else {
                      q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                    }
                  };

                  reader.readAsText(fileData);
                });
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }

          return q.promise;
        },


        readAsDataURL: function (path, file) {
          var q = $q.defer();

          if ((/^\//.test(file))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(file, {create: false}, function (fileEntry) {
                fileEntry.file(function (fileData) {
                  var reader = new FileReader();
                  reader.onloadend = function (evt) {
                    if (evt.target._result !== undefined || evt.target._result !== null) {
                      q.resolve(evt.target._result);
                    }
                    else if (evt.target._error !== undefined || evt.target._error !== null) {
                      q.reject(evt.target._error);
                    }
                    else {
                      q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                    }
                  };
                  reader.readAsDataURL(fileData);
                });
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }

          return q.promise;
        },

        readAsBinaryString: function (path, file) {
          var q = $q.defer();

          if ((/^\//.test(file))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(file, {create: false}, function (fileEntry) {
                fileEntry.file(function (fileData) {
                  var reader = new FileReader();
                  reader.onloadend = function (evt) {
                    if (evt.target._result !== undefined || evt.target._result !== null) {
                      q.resolve(evt.target._result);
                    }
                    else if (evt.target._error !== undefined || evt.target._error !== null) {
                      q.reject(evt.target._error);
                    }
                    else {
                      q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                    }
                  };
                  reader.readAsBinaryString(fileData);
                });
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }

          return q.promise;
        },

        readAsArrayBuffer: function (path, file) {
          var q = $q.defer();

          if ((/^\//.test(file))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(file, {create: false}, function (fileEntry) {
                fileEntry.file(function (fileData) {
                  var reader = new FileReader();
                  reader.onloadend = function (evt) {
                    if (evt.target._result !== undefined || evt.target._result !== null) {
                      q.resolve(evt.target._result);
                    }
                    else if (evt.target._error !== undefined || evt.target._error !== null) {
                      q.reject(evt.target._error);
                    }
                    else {
                      q.reject({code: null, message: 'READER_ONLOADEND_ERR'});
                    }
                  };
                  reader.readAsArrayBuffer(fileData);
                });
              }, function (error) {
                error.message = $cordovaFileError[error.code];
                q.reject(error);
              });
            }, function (err) {
              err.message = $cordovaFileError[err.code];
              q.reject(err);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }

          return q.promise;
        },


        moveFile: function (path, fileName, newPath, newFileName) {
          var q = $q.defer();

          newFileName = newFileName || fileName;

          if ((/^\//.test(fileName)) || (/^\//.test(newFileName))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(fileName, {create: false}, function (fileEntry) {
                $window.resolveLocalFileSystemURL(newPath, function (newFileEntry) {
                  fileEntry.moveTo(newFileEntry, newFileName, function (result) {
                    q.resolve(result);
                  }, function (error) {
                    q.reject(error);
                  });
                }, function (err) {
                  q.reject(err);
                });
              }, function (err) {
                q.reject(err);
              });
            }, function (er) {
              q.reject(er);
            });
          } catch (e) {
            q.reject(e);
          }
          return q.promise;
        },

        moveDir: function (path, dirName, newPath, newDirName) {
          var q = $q.defer();

          newDirName = newDirName || dirName;

          if (/^\//.test(dirName) || (/^\//.test(newDirName))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getDirectory(dirName, {create: false}, function (dirEntry) {
                $window.resolveLocalFileSystemURL(newPath, function (newDirEntry) {
                  dirEntry.moveTo(newDirEntry, newDirName, function (result) {
                    q.resolve(result);
                  }, function (error) {
                    q.reject(error);
                  });
                }, function (erro) {
                  q.reject(erro);
                });
              }, function (err) {
                q.reject(err);
              });
            }, function (er) {
              q.reject(er);
            });
          } catch (e) {
            q.reject(e);
          }
          return q.promise;
        },


        copyDir: function (path, dirName, newPath, newDirName) {
          var q = $q.defer();

          newDirName = newDirName || dirName;

          if (/^\//.test(dirName) || (/^\//.test(newDirName))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getDirectory(dirName, {create: false, exclusive: false}, function (dirEntry) {

                $window.resolveLocalFileSystemURL(newPath, function (newDirEntry) {
                  dirEntry.copyTo(newDirEntry, newDirName, function (result) {
                    q.resolve(result);
                  }, function (error) {
                    error.message = $cordovaFileError[error.code];
                    q.reject(error);
                  });
                }, function (erro) {
                  erro.message = $cordovaFileError[erro.code];
                  q.reject(erro);
                });
              }, function (err) {
                err.message = $cordovaFileError[err.code];
                q.reject(err);
              });
            }, function (er) {
              er.message = $cordovaFileError[er.code];
              q.reject(er);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }
          return q.promise;
        },

        copyFile: function (path, fileName, newPath, newFileName) {
          var q = $q.defer();

          newFileName = newFileName || fileName;

          if ((/^\//.test(fileName))) {
            q.reject("file-name cannot start with \/");
          }

          try {
            $window.resolveLocalFileSystemURL(path, function (fileSystem) {
              fileSystem.getFile(fileName, {create: false, exclusive: false}, function (fileEntry) {

                $window.resolveLocalFileSystemURL(newPath, function (newFileEntry) {
                  fileEntry.copyTo(newFileEntry, newFileName, function (result) {
                    q.resolve(result);
                  }, function (error) {
                    error.message = $cordovaFileError[error.code];
                    q.reject(error);
                  });
                }, function (erro) {
                  erro.message = $cordovaFileError[erro.code];
                  q.reject(erro);
                });
              }, function (err) {
                err.message = $cordovaFileError[err.code];
                q.reject(err);
              });
            }, function (er) {
              er.message = $cordovaFileError[er.code];
              q.reject(er);
            });
          } catch (e) {
            e.message = $cordovaFileError[e.code];
            q.reject(e);
          }
          return q.promise;
        }

        /*
         listFiles: function (path, dir) {

         },

         listDir: function (path, dirName) {
         var q = $q.defer();

         try {
         $window.resolveLocalFileSystemURL(path, function (fileSystem) {
         fileSystem.getDirectory(dirName, options, function (parent) {
         var reader = parent.createReader();
         reader.readEntries(function (entries) {
         q.resolve(entries);
         }, function () {
         q.reject('DIR_READ_ERROR : ' + path + dirName);
         });
         }, function (error) {
         error.message = $cordovaFileError[error.code];
         q.reject(error);
         });
         }, function (err) {
         err.message = $cordovaFileError[err.code];
         q.reject(err);
         });
         } catch (e) {
         e.message = $cordovaFileError[e.code];
         q.reject(e);
         }

         return q.promise;
         },

         readFileMetadata: function (filePath) {
         //return getFile(filePath, {create: false});
         }
         */
      };

    }];
  }]);
// install   :  cordova plugin add de.appplant.cordova.plugin.local-notification
// link      :  https://github.com/katzer/cordova-plugin-local-notifications/

angular.module('ngCordova.plugins.localNotification', [])

  .factory('$cordovaLocalNotification', ['$q', '$window', '$rootScope', '$timeout', function ($q, $window, $rootScope, $timeout) {
    document.addEventListener("deviceready", function () {
      if ($window.plugin && $window.plugin.notification) {
        $window.plugin.notification.local.oncancel = function (id, state, json) {
          var notification = {
            id: id,
            state: state,
            json: json
          };
          $timeout(function () {
            $rootScope.$broadcast("$cordovaLocalNotification:canceled", notification);
          });
        };

        $window.plugin.notification.local.onclick = function (id, state, json) {
          var notification = {
            id: id,
            state: state,
            json: json
          };
          $timeout(function () {
            $rootScope.$broadcast("$cordovaLocalNotification:clicked", notification);
          });
        };

        $window.plugin.notification.local.ontrigger = function (id, state, json) {
          var notification = {
            id: id,
            state: state,
            json: json
          };
          $timeout(function () {
            $rootScope.$broadcast("$cordovaLocalNotification:triggered", notification);
          });
        };

        $window.plugin.notification.local.onadd = function (id, state, json) {
          var notification = {
            id: id,
            state: state,
            json: json
          };
          $timeout(function () {
            $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
          });
        };
      }
    }, false);
    return {
      add: function (options, scope) {
        var q = $q.defer();
        scope = scope || null;
        $window.plugin.notification.local.add(options, function (result) {
          q.resolve(result);
        }, scope);
        return q.promise;
      },

      cancel: function (id, scope) {
        var q = $q.defer();
        scope = scope || null;
        $window.plugin.notification.local.cancel(id, function (result) {
          q.resolve(result);
        }, scope);
        return q.promise;
      },

      cancelAll: function (scope) {
        var q = $q.defer();
        scope = scope || null;
        $window.plugin.notification.local.cancelAll(function (result) {
          q.resolve(result);
        }, scope);
        return q.promise;
      },

      isScheduled: function (id, scope) {
        var q = $q.defer();
        scope = scope || null;
        $window.plugin.notification.local.isScheduled(id, function (result) {
          q.resolve(result);
        }, scope);

        return q.promise;
      },

      hasPermission: function (scope) {
        var q = $q.defer();
        $window.plugin.notification.local.hasPermission(function (result) {
          result ? q.resolve(result) : q.reject(result);
        }, scope);
        return q.promise;
      },

      promptForPermission: function () {
        var q = $q.defer();
        $window.plugin.notification.local.promptForPermission(function (result) {
          result ? q.resolve(result) : q.reject(result);
        });
        return q.promise;
      },

      registerPermission: function () {
        var q = $q.defer();
        $window.plugin.notification.local.registerPermission(function (result) {
          result ? q.resolve(result) : q.reject(result);
        });
        return q.promise;
      },

      getScheduledIds: function (scope) {
        var q = $q.defer();
        $window.plugin.notification.local.getScheduledIds(function (result) {
          q.resolve(result);
        }, scope);
        return q.promise;
      },

      isTriggered: function (id, scope) {
        var q = $q.defer();
        $window.plugin.notification.local.isTriggered(id, function (result) {
          q.resolve(result);
        }, scope);
        return q.promise;
      },

      getTriggeredIds: function (scope) {
        var q = $q.defer();
        $window.plugin.notification.local.getTriggeredIds(function (result) {
          q.resolve(result);
        }, scope);
        return q.promise;
      },

      getDefaults: function () {
        return $window.plugin.notification.local.getDefaults();
      },

      setDefaults: function (Object) {
        $window.plugin.notification.local.setDefaults(Object);
      }
    };
  }]);
// install  :     cordova plugin add https://github.com/ohh2ahh/AppAvailability.git
// link     :     https://github.com/ohh2ahh/AppAvailability

angular.module('ngCordova.plugins.appAvailability', [])

  .factory('$cordovaAppAvailability', ['$q', function ($q) {

    return {
      check: function (urlScheme) {
        var q = $q.defer();

        appAvailability.check(urlScheme, function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        });

        return q.promise;
      }
    };
  }]);
// install   :      cordova plugin add https://github.com/phonegap-build/PushPlugin.git
// link      :      https://github.com/phonegap-build/PushPlugin

angular.module('ngCordova.plugins.push', [])

  .factory('$cordovaPush', ['$q', '$window', '$rootScope', '$timeout', function ($q, $window, $rootScope, $timeout) {
    return {
      onNotification: function (notification) {
        $timeout(function () {
          $rootScope.$broadcast('$cordovaPush:notificationReceived', notification);
        });
      },

      register: function (config) {
        var q = $q.defer();
        var injector;
        if (config !== undefined && config.ecb === undefined) {
          if (document.querySelector('[ng-app]') == null) {
            injector = "document.body";
          }
          else {
            injector = "document.querySelector('[ng-app]')";
          }
          config.ecb = "angular.element(" + injector + ").injector().get('$cordovaPush').onNotification";
        }

        $window.plugins.pushNotification.register(function (token) {
          q.resolve(token);
        }, function (error) {
          q.reject(error);
        }, config);

        return q.promise;
      },

      unregister: function (options) {
        var q = $q.defer();
        $window.plugins.pushNotification.unregister(function (result) {
          q.resolve(result);
        }, function (error) {
          q.reject(error);
        }, options);

        return q.promise;
      },

      // iOS only
      setBadgeNumber: function (number) {
        var q = $q.defer();
        $window.plugins.pushNotification.setApplicationIconBadgeNumber(function (result) {
          q.resolve(result);
        }, function (error) {
          q.reject(error);
        }, number);
        return q.promise;
      }
    };
  }]);
// install   :      cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
// link      :      https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin

// NOTE: shareViaEmail -> if user cancels sharing email, success is still called
// TODO: add support for iPad

angular.module('ngCordova.plugins.socialSharing', [])

  .factory('$cordovaSocialSharing', ['$q', '$window', function ($q, $window) {

    return {
      share: function (message, subject, file, link) {
        var q = $q.defer();
        subject = subject || null;
        file = file || null;
        link = link || null;
        $window.plugins.socialsharing.share(message, subject, file, link, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      shareViaTwitter: function (message, file, link) {
        var q = $q.defer();
        file = file || null;
        link = link || null;
        $window.plugins.socialsharing.shareViaTwitter(message, file, link, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      shareViaWhatsApp: function (message, file, link) {
        var q = $q.defer();
        file = file || null;
        link = link || null;
        $window.plugins.socialsharing.shareViaWhatsApp(message, file, link, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      shareViaFacebook: function (message, file, link) {
        var q = $q.defer();
        message = message || null;
        file = file || null;
        link = link || null;
        $window.plugins.socialsharing.shareViaFacebook(message, file, link, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      shareViaFacebookWithPasteMessageHint: function (message, file, link, pasteMessageHint) {
        var q = $q.defer();
        file = file || null;
        link = link || null;
        $window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(message, file, link, pasteMessageHint, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      shareViaSMS: function (message, commaSeparatedPhoneNumbers) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaSMS(message, commaSeparatedPhoneNumbers, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      shareViaEmail: function (message, subject, toArr, ccArr, bccArr, fileArr) {
        var q = $q.defer();
        toArr = toArr || null;
        ccArr = ccArr || null;
        bccArr = bccArr || null;
        fileArr = fileArr || null;
        $window.plugins.socialsharing.shareViaEmail(message, subject, toArr, ccArr, bccArr, fileArr, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      shareVia: function (via, message, subject, file, link) {
        var q = $q.defer();
        message = message || null;
        subject = subject || null;
        file = file || null;
        link = link || null;
        $window.plugins.socialsharing.shareVia(via, message, subject, file, link, function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      canShareViaEmail: function () {
        var q = $q.defer();
        $window.plugins.socialsharing.canShareViaEmail(function () {
          q.resolve(true);
        }, function () {
          q.reject(false);
        });
        return q.promise;
      },

      canShareVia: function (via, message, subject, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.canShareVia(via, message, subject, file, link, function (success) {
          q.resolve(success);
        }, function (error) {
          q.reject(error);
        });
        return q.promise;
      },

      available: function () {
        var q = $q.defer();
        window.plugins.socialsharing.available(function (isAvailable) {
          if (isAvailable) {
            q.resolve();
          }
          else {
            q.reject();
          }
        });
      }
    };
  }]);
