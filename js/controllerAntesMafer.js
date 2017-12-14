angular.element(function() {
    angular.bootstrap(document, ['Solicitudes']);
});

angular.module('Solicitudes', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularFileUpload', 'darthwade.loading', 'ngTagsInput', 'ui.select', 'angular-js-xlsx'])

        .directive('angularCurrency', [function () {
            'use strict';

            return {
                'require': '?ngModel',
                'restrict': 'A',
                'scope': {
                    angularCurrency: '=',
                    variableOptions: '='
                },
                'compile': compile
            };

            function compile(tElem, tAttrs) {
                var isInputText = tElem.is('input:text');

                return function(scope, elem, attrs, controller) {
                    var updateElement = function (newVal) {
                        elem.autoNumeric('set', newVal);
                    };

                    elem.autoNumeric('init', scope.angularCurrency);
                    if (scope.variableOptions === true) {
                        scope.$watch('angularCurrency', function(newValue) {
                            elem.autoNumeric('update', newValue);
                        });
                    }

                    if (controller && isInputText) {
                        scope.$watch(tAttrs.ngModel, function () {
                            controller.$render();
                        });

                        controller.$render = function () {
                            updateElement(controller.$viewValue);
                        };

                        elem.on('keyup', function () {
                            scope.$applyAsync(function () {
                                controller.$setViewValue(elem.autoNumeric('get'));
                            });
                        });
                        elem.on('change', function () {
                            scope.$applyAsync(function () {
                                controller.$setViewValue(elem.autoNumeric('get'));
                            });
                        });
                    } else {
                        if (isInputText) {
                            attrs.$observe('value', function (val) {
                                updateElement(val);
                            });
                        }
                    }
                };
            }
        }])

        .factory('mySharedService', function($rootScope) {
            var sharedService = {};
            sharedService.prepForBroadcast = function () {
                this.broadcastItem();
            };
            sharedService.broadcastItem = function() {
                $rootScope.$broadcast('handleBroadcast');
            };
            return sharedService;
        })

        .controller('ctrlLogin', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {
          $scope.Login = function () {
              if ($scope.Usuario.trim() == '' || $scope.Contrasena.trim() == '') {
                  swal("", "Combinaci\u00f3n de usuario y/o contrase\u00f1a incorrectas.");
                  return 0;
              };
              var Data = {};
              Data.Usuario = $scope.Usuario;
              Data.Contrasena = $scope.Contrasena;
              $loading.start('myloading');
              $http({
                  method: 'POST',
                  url: '/Login',
                  headers: { 'Content-Type': 'application/json' },
                  data: Data
              }).then(function successCallback(response) {
                  $loading.finish('myloading');
                  if (response.data.Login == true) {
                      localStorage.UserConnected = $scope.Usuario;
                      window.location.href = '/cuenta_proveedor.html';
                  }
                  else {
                      swal("Licitaciones Proenfar", "Combinación de usuario y/o contraseña incorrectas.");
                  }
              }, function errorCallback(response) {
                  alert(response.statusText);
              });
          }
          $scope.ValidateEmail = function validateEmail(email) {
              var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(email);
          }
        }])

        .controller('ctrlLicitacion', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {
          // S�lo para validar n�meros
          $scope.options = {
              aSign: '',
              mDec: '0',
              vMin: '0'
          };
          $scope.options2 = {
              aSign: '',
              mDec: '2',
              vMin: '0'
          };
          $scope.options3 = {
              aSign: '',
              mDec: '5',
              vMin: '0'
          };
          // Fin s�lo para validar n�meros
          // Actualiza las modalidades para éste proveedores
          $scope.UpdateModalidades = function () {
            var Data = {};
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.ModalidadesProveedor = $scope.ModalidadesProveedor;
            $http({
                method: 'POST',
                url: '/UpdateModalidadesProveedor',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                console.log('La data fue actualizada');
            }, function errorCallback(response) {
                console.log(response);
            });
          }
          // Obtiene los valores de modalidades para éste proveedor
          $scope.GetModalidadesProveedor = function () {
            var Data = {};
            $loading.start('myloading');
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.Email = localStorage.UserConnected;
            $http({
                method: 'POST',
                url: '/GetModalidadesProveedor',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                $scope.ModalidadesProveedor = response.data.ModalidadesProveedor;
                console.log($scope.ModalidadesProveedor);
            }, function errorCallback(response) {
              console.log(response);
            });
          }
          $scope.GetModalidadesProveedor();
          $scope.SaveUsuarioComplete = function () {
            if (!$scope.bookmarkFormProv.$valid)
            {
              swal("Licitaciones Proenfar", "Hay valores inválidos. Por favor revisar el formulario.");
              return 0
            }
            var Data = {};
            $loading.start('myloading');
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.Usuario = $scope.Proveedor;
            $http({
                method: 'POST',
                url: '/SaveUsuarioComplete',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                if (response.data.Result == 'Ok'){
                  $scope.QuantityFiles = $scope.uploader.queue.length;
                  if ($scope.QuantityFiles > 0) {
                      $scope.uploader.uploadAll();
                  }
                  else {
                      $loading.finish('myloading');
                      swal("Licitaciones Proenfar", "Los datos del proveedor fueron actualizados.");
                  }
                }
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
          $scope.uploader = new FileUploader();
          $scope.uploader.url = "/api/uploadFile";
          $scope.uploader.onBeforeUploadItem = function (item) {
              var Data = {};
              Data.Nit = $scope.Proveedor.Nit;
              Data.RazonSocial = $scope.Proveedor.RazonSocial;
              item.formData.push(Data);
          };
          $scope.uploader.onSuccessItem = function (item, response) {
              if ($scope.QuantityFiles == 1) {
                  $scope.uploader.clearQueue();
                  $loading.finish('myloading');
                  swal("Licitaciones Proenfar", "Los datos del proveedor fueron actualizados.");
              }
              $scope.QuantityFiles--;
          }
        }])

        .controller('ctrlEditarProveedor', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {
          $scope.GetUsuario = function () {
            var Data = {};
            $loading.start('myloading');
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.Email = localStorage.UserConnected;
            $http({
                method: 'POST',
                url: '/GetUsuario',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                $scope.Proveedor = response.data.data[0];
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
          $scope.GetUsuario();
          $scope.SaveUsuarioComplete = function () {
            if (!$scope.bookmarkFormProv.$valid)
            {
              swal("Licitaciones Proenfar", "Hay valores inválidos. Por favor revisar el formulario.");
              return 0
            }
            var Data = {};
            $loading.start('myloading');
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.Usuario = $scope.Proveedor;
            $http({
                method: 'POST',
                url: '/SaveUsuarioComplete',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                if (response.data.Result == 'Ok'){
                  $scope.QuantityFiles = $scope.uploader.queue.length;
                  if ($scope.QuantityFiles > 0) {
                      $scope.uploader.uploadAll();
                  }
                  else {
                      $loading.finish('myloading');
                      swal("Licitaciones Proenfar", "Los datos del proveedor fueron actualizados.");
                  }
                }
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
          $scope.uploader = new FileUploader();
          $scope.uploader.url = "/api/uploadFile";
          $scope.uploader.onBeforeUploadItem = function (item) {
              var Data = {};
              Data.Nit = $scope.Proveedor.Nit;
              Data.RazonSocial = $scope.Proveedor.RazonSocial;
              item.formData.push(Data);
          };
          $scope.uploader.onSuccessItem = function (item, response) {
              if ($scope.QuantityFiles == 1) {
                  $scope.uploader.clearQueue();
                  $loading.finish('myloading');
                  swal("Licitaciones Proenfar", "Los datos del proveedor fueron actualizados.");
              }
              $scope.QuantityFiles--;
          }
        }])

        .controller('MyController', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', function ($scope, $http, $uibModal, $log, $document, $loading) {
            $scope.Perfil = JSON.parse(localStorage.Perfil);
            $scope.$on('handleBroadcast', function () {
                $scope.GetSolicitudes();
            });
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();
            $scope.clear = function () {
                $scope.dt = null;
            };
            $scope.inlineOptions = {
                customClass: getDayClass,
                minDate: new Date(),
                showWeeks: true
            };
            $scope.dateOptions = {
                dateDisabled: disabled,
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };
            // Disable weekend selection
            function disabled(data) {
                var date = data.date,
                  mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }
            $scope.toggleMin = function () {
                $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
            };
            $scope.toggleMin();
            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };
            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };
            $scope.setDate = function (year, month, day) {
                $scope.dt = new Date(year, month, day);
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];
            $scope.altInputFormats = ['M!/d!/yyyy'];
            $scope.popup1 = {
                opened: false
            };
            $scope.popup2 = {
                opened: false
            };
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 1);
            $scope.events = [
              {
                  date: tomorrow,
                  status: 'full'
              },
              {
                  date: afterTomorrow,
                  status: 'partially'
              }
            ];
            function getDayClass(data) {
                var date = data.date,
                  mode = data.mode;
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            }
            $scope.Estatus = [{ Id: 0, Name: 'Todos' }, { Id: 1, Name: 'En Proceso' }, { Id: 2, Name: 'Elaborada' }, { Id: 3, Name: 'Cancelada' }]
            $scope.selectedEstatus = $scope.Estatus[0];
            $scope.txtStartDate = new Date();
            $scope.txtEndDate = new Date();
            $scope.NotificacionesPendienteMsg = 'Notificaciones por revisar';
            $scope.NotificacionesPendienteNro = 5;
            $scope.Restart = function () {
                $scope.selectedEstatus = $scope.Estatus[0];
                $scope.txtStartDate = new Date();
                $scope.txtEndDate = new Date();
                $scope.GetSolicitudes();
            }
            $scope.GetSolicitudes = function () {
                var Data = {};
                $loading.start('myloading');
                Data.txtStartDate = new Date($scope.txtStartDate.getFullYear(), $scope.txtStartDate.getMonth(), $scope.txtStartDate.getDate(), 0, 0);
                Data.txtEndDate = new Date($scope.txtEndDate.getFullYear(), $scope.txtEndDate.getMonth(), $scope.txtEndDate.getDate(), 23, 59)
                Data.selectedEstatus = $scope.selectedEstatus;
                $http({
                    method: 'POST',
                    url: '/GetSolicitudes',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.Solicitudes = response.data.Solicitudes;
                    $scope.User = response.data.User;
                    if ($scope.User.Level == 1) {
                        $scope.NotificacionesPendienteNro = $scope.Solicitudes.filter(function (element) { return element.Comentarios.filter(function (element) { return element.LeidoAdmin == 'No' }).length > 0; }).length;
                    }
                    else {
                        $scope.NotificacionesPendienteNro = $scope.Solicitudes.filter(function (element) { return element.Comentarios.filter(function (element) { return element.LeidoUser == 'No' }).length > 0; }).length;
                    }
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.closeSession = function () {
                $http({
                    method: 'POST',
                    url: '/closeSession',
                    headers: { 'Content-Type': 'application/json' },
                    data: {}
                }).then(function successCallback(response) {
                    window.location.href = '/index.html';
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.NotificacionesPendientes = function () {
                if ($scope.User.Level == 1) {
                    $scope.Solicitudes = $scope.Solicitudes.filter(function (element) { return element.Comentarios.filter(function (element) { return element.LeidoAdmin == 'No' }).length > 0; });
                }
                else {
                    $scope.Solicitudes = $scope.Solicitudes.filter(function (element) { return element.Comentarios.filter(function (element) { return element.LeidoUser == 'No' }).length > 0; });
                }
            }
            $scope.GetSolicitudes();
            $scope.DateDiff = function (date1) {
                var date2 = new Date();
                date1 = new Date(date1);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                return (Math.ceil(timeDiff / (1000 * 3600 * 24)))
            }
            $scope.DataModalComentario = {};
            $scope.animationsEnabled = true;
            $scope.open = function (size, Solicitud, parentSelector) {
                $scope.DataModalComentario.Solicitud = Solicitud;
                $scope.DataModalComentario.User = $scope.User;
                var parentElem = parentSelector ?
                  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'modalcomentario.html',
                    controller: 'ModalInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: size,
                    appendTo: parentElem,
                    resolve: {
                        DataModalComentario: function () {
                            return $scope.DataModalComentario;
                        }
                    }
                });
            };
            $scope.ActiveUserModal = {};
            $scope.openChangePassword = function (size, parentSelector) {
                $scope.ActiveUserModal = $scope.User;
                var parentElem = parentSelector ?
                  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'modalchangepassword.html',
                    controller: 'ModalInstanceCtrlChangePassword',
                    controllerAs: '$ctrl',
                    size: size,
                    appendTo: parentElem,
                    resolve: {
                        ActiveUserModal: function () {
                            return $scope.ActiveUserModal;
                        }
                    }
                });
            };

        }])

        .controller('CtrlSubirFile', ['$scope', '$http', '$loading', 'FileUploader', '$uibModal', function ($scope, $http, $loading, FileUploader, $uibModal) {
          $scope.txtUrl = '';
          $scope.txtUrlValidacion = '';
          // Data de carga selects
          $scope.GetEmpleadosData = function () {
              $loading.start('myloading');
              $http({
                  method: 'POST',
                  url: '/GetEmpleadosNomina',
                  headers: { 'Content-Type': 'application/json' },
                  data: {}
              }).then(function successCallback(response) {
                  $scope.Nominas = response.data.Nominas;
                  $scope.Empleados = [];
                  $scope.tEmpleados = response.data.tEmpleados;
                  $scope.tEmpleadosFiltered = [];
                  $scope.User = response.data.User;
                  $scope.txtComentarios = '';
                  $loading.finish('myloading');
              }, function errorCallback(response) {
                  alert(response.statusText);
              });
          }
          $scope.GetEmpleadosData();
          $scope.SetPeriodosEmpleados = function(){
            $scope.Periodos = _.orderBy(_.uniqBy($scope.tEmpleados, 'Periodo'), ['Periodo'], ['asc']).filter(function (el) { return el.Periodo.trim() != '' });
            $scope.Empleados = _.orderBy(_.uniqBy($scope.tEmpleados, 'NombreCompleto'), ['NombreCompleto'], ['asc']).filter(function (el) { return el.NombreCompleto.trim() != '' });
            $scope.Periodos = $scope.Periodos.filter(function(el){
                return el.Nomina == $scope.selectedNomina.Name
            })
            $scope.Empleados = $scope.Empleados.filter(function(el){
                return el.Nomina == $scope.selectedNomina.Name
            })
            $scope.tEmpleadosFiltered2 = $scope.tEmpleados;
            $scope.tEmpleadosFiltered2 = $scope.tEmpleadosFiltered2.filter(function(el){
                return el.Nomina == $scope.selectedNomina.Name
            })
            $scope.EmpleadosTodos = $scope.tEmpleadosFiltered2;
            $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered2;
          }
          // Fin data de carga selects
          // Cargar file txt

          $scope.uploader3 = new FileUploader();
          $scope.uploader3.url = "/procesarTxtEmpleados";
          $scope.uploader3.onBeforeUploadItem = function (item) {
              $loading.start('myloading');
          };
          $scope.uploader3.onAfterAddingFile = function (item /*{File|FileLikeObject}*/, filter, options) {
              $scope.uploader3.uploadAll();
          };
          $scope.uploader3.onSuccessItem = function (item, response) {
              $loading.finish('myloading');
              $scope.uploader3.clearQueue();
              swal("Mensaje de la aplicacion de recibos", "Tu archivo fue cargado con exito.");
          };


          $scope.uploader2 = new FileUploader();
          $scope.uploader2.url = "/procesarpdfRecibo";
          $scope.uploader2.onBeforeUploadItem = function (item) {
              var Data = {};
              Data.selectedPeriodo = $scope.selectedPeriodo.Periodo;
              Data.selectedNomina = $scope.selectedNomina.Name;
              item.formData.push(Data);
              $loading.start('myloading');
          };
          $scope.uploader2.onAfterAddingFile = function (item /*{File|FileLikeObject}*/, filter, options) {
            if (typeof $scope.selectedPeriodo == 'undefined'){
              swal("Mensaje de la aplicacion de recibos", "Debe seleccionar nómina y período.");
              return 0;
            }
              $scope.uploader2.uploadAll();
          };
          $scope.uploader2.onSuccessItem = function (item, response) {
              $loading.finish('myloading');
              $scope.uploader2.clearQueue();
              if (response.Result == 'norfc'){
                swal("Mensaje de la aplicacion de recibos", "No existe empleado con el rfc del archivo para la nómina y el periodo seleccionado.");
                return 0;
              }
              swal("Mensaje de la aplicacion de recibos", "Tu archivo fue cargado con exito.");
          };
          // Fin cargar file Txt
          $scope.ReadGoogleSheet = function(){
            if ($scope.txtUrl.trim() == '' || $scope.txtUrlValidacion.trim() == ''){
              swal("Mensaje de la aplicacion de recibos", "Debe llenar las URL de plantillas.");
              return 0;
            }
            var Data = {};
            Data.url = $scope.txtUrl;
            Data.urlValidacion = $scope.txtUrlValidacion;
            $loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ReadGoogleSheet',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
              $loading.finish('myloading');
              if (response.data.Result == 'sd'){
                swal("Mensaje de la aplicacion de recibos", "El archivo que subió no tiene data.");
                return 0;
              }
              if (response.data.Result == 'notxt'){
                swal("Mensaje de la aplicacion de recibos", "Falta subir archivo txt.");
                return 0;
              }
              if (response.data.Result == 'err'){
                $scope.Errores = {};
                $scope.showErrores = function (size, parentSelector) {
                    $scope.Errores = response.data.Errors.errores;
                    var parentElem = parentSelector ?
                      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'modalerrores.html',
                        controller: 'ModalErrores',
                        controllerAs: '$ctrl',
                        size: size,
                        appendTo: parentElem,
                        resolve: {
                            Errores: function () {
                                return $scope.Errores;
                            }
                        }
                    });
                };
                $scope.showErrores();
                return 0;
              }
              if (response.data.EmpleadosErrores.length == 0){
                swal("Mensaje de la aplicacion de recibos", "La data fue cargada exito.");
              }
              else{
                $scope.Errores = {};
                $scope.showErrores = function (size, parentSelector) {
                    $scope.Errores = response.data.EmpleadosErrores;
                    var parentElem = parentSelector ?
                      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'modalerrores.html',
                        controller: 'ModalErrores',
                        controllerAs: '$ctrl',
                        size: size,
                        appendTo: parentElem,
                        resolve: {
                            Errores: function () {
                                return $scope.Errores;
                            }
                        }
                    });
                };
                $scope.showErrores();
                return 0;
              }
            }, function errorCallback(response) {
              alert(response.statusText);
            });
          }
          $scope.uploader = new FileUploader();
          $scope.uploader.url = "/processNomina";
          $scope.uploader.onBeforeUploadItem = function (item) {
            $loading.start('myloading');
            var Data = {};
            item.formData.push(Data);
          };
          $scope.uploader.onAfterAddingFile = function (item /*{File|FileLikeObject}*/, filter, options) {
              $scope.uploader.uploadAll();
          };
          $scope.uploader.onSuccessItem = function (item, response) {
              $loading.finish('myloading');
              $scope.uploader.clearQueue();

              if (response.Result == 'sd'){
                swal("Mensaje de la aplicacion de recibos", "El archivo que subió no tiene data.");
                return 0;
              }

              if (response.Result == 'err'){
                $scope.Errores = {};
                $scope.showErrores = function (size, parentSelector) {
                    $scope.Errores = response.Errors.errores;
                    var parentElem = parentSelector ?
                      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'modalerrores.html',
                        controller: 'ModalErrores',
                        controllerAs: '$ctrl',
                        size: size,
                        appendTo: parentElem,
                        resolve: {
                            Errores: function () {
                                return $scope.Errores;
                            }
                        }
                    });
                };
                $scope.showErrores();
                return 0;
              }

              swal("Mensaje de la aplicacion de recibos", "Tu archivo fue cargado con exito.");
          };
        }])

        .controller('MyController2', ['$scope', '$http', '$loading', function ($scope, $http, $loading) {
          $scope.GetEmpleadosData = function () {
              $loading.start('myloading');
              $http({
                  method: 'POST',
                  url: '/GetEmpleadosNomina',
                  headers: { 'Content-Type': 'application/json' },
                  data: {}
              }).then(function successCallback(response) {
                  $scope.Nominas = response.data.Nominas;
                  $scope.Empleados = [];
                  $scope.tEmpleados = response.data.tEmpleados;
                  $scope.tEmpleadosFiltered = [];
                  $scope.User = response.data.User;
                  $scope.txtComentarios = '';
                  $loading.finish('myloading');
              }, function errorCallback(response) {
                  alert(response.statusText);
              });
          }
          $scope.GetEmpleadosData();
          $scope.SetPeriodosEmpleados = function(){
            $scope.Periodos = _.orderBy(_.uniqBy($scope.tEmpleados, 'Periodo'), ['Periodo'], ['asc']).filter(function (el) { return el.Periodo.trim() != '' });
            $scope.Empleados = _.orderBy(_.uniqBy($scope.tEmpleados, 'NombreCompleto'), ['NombreCompleto'], ['asc']).filter(function (el) { return el.NombreCompleto.trim() != '' });
            $scope.Periodos = $scope.Periodos.filter(function(el){
                return el.Nomina == $scope.selectedNomina.Name
            })
            $scope.Empleados = $scope.Empleados.filter(function(el){
                return el.Nomina == $scope.selectedNomina.Name
            })
            $scope.tEmpleadosFiltered2 = $scope.tEmpleados;
            $scope.tEmpleadosFiltered2 = $scope.tEmpleadosFiltered2.filter(function(el){
                return el.Nomina == $scope.selectedNomina.Name
            })
            $scope.EmpleadosTodos = $scope.tEmpleadosFiltered2;
            $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered2;
          }
          $scope.filterempleados = function () {
              $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered2;
              if ($scope.selectedPeriodo.Periodo != ' Todos') {
                  $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered.filter(function (o1) {
                      return (o1.Periodo == $scope.selectedPeriodo.Periodo);
                  });
                  $scope.Empleados = $scope.EmpleadosTodos;
                  $scope.Empleados = $scope.Empleados.filter(function (el){
                    return (el.Periodo == $scope.selectedPeriodo.Periodo);
                  })
              }
              if ($scope.selectedEmpleado.NombreCompleto != ' Todos') {
                  $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered.filter(function (o1) {
                      return (o1.NombreCompleto == $scope.selectedEmpleado.NombreCompleto);
                  });
              }
          }
            $scope.Perfil = JSON.parse(localStorage.Perfil);
            // $scope.cargarEmpleados = function (query) {
            //     var tmpEmpleados = [];
            //     $scope.Empleados.forEach(
            //         function (item, index, arr) {
            //             var tmpEmpleado = { "text": item.Name };
            //             tmpEmpleados.push(tmpEmpleado);
            //         }
            //     )
            //     tmpEmpleados = tmpEmpleados.filter(function (el) {
            //         return (el.text.toUpperCase().indexOf(query.toUpperCase()) > -1)
            //     });
            //     return tmpEmpleados
            // };
            $scope.Tipos = [{ Id: 0, Name: 'Solicitud de nuevo usuario' }, { Id: 1, Name: 'Solicitar recibos' }, { Id: 2, Name: 'Reportar cambios o inconsistencias' }, { Id: 3, Name: 'Proyecto' }, { Id: 4, Name: 'Empleado' }]
            // $scope.NewSolicitud = function () {
            //     // $loading.start('myloading');
            //     // $http({
            //     //     method: 'POST',
            //     //     url: '/GetEmpleadosData',
            //     //     headers: { 'Content-Type': 'application/json' },
            //     //     data: {}
            //     // }).then(function successCallback(response) {
            //     //     // $scope.Nominas = response.data.Nominas;
            //     //     // $scope.Periodos = response.data.Periodos;
            //     //     // $scope.Empleados = response.data.Empleados;
            //     //     // console.log($scope.Empleados);
            //     //     // $scope.selectedTipo = $scope.Tipos[0];
            //     //     // $scope.selectedNomina = $scope.Nominas[0];
            //     //     // $scope.selectedPeriodo = $scope.Periodos[0];
            //     //     // $scope.selectedEmpleado = $scope.Empleados[0];
            //     //     $scope.txtComentarios = '';
            //     //     $scope.User = response.data.User;
            //     //     $scope.tagempleados = [];
            //     //     $loading.finish('myloading');
            //     // }, function errorCallback(response) {
            //     //     alert(response.statusText);
            //     // });
            // }
            // $scope.NewSolicitud();
            $scope.AddSolicitud = function () {
                if ($scope.txtComentarios.trim() == '') {
                    swal("Mensaje de la aplicacion de recibos", "Debe llenar el campo de comentarios.");
                    return 0;
                }
                if (typeof $scope.selectedEmpleado == 'undefined') {
                    swal("Mensaje de la aplicacion de recibos", "Debe seleccionar un(1) empleado.");
                    return 0;
                }
                var Data = {};
                Data.Solicitud = $scope.txtComentarios;
                Data.Tipo = $scope.selectedTipo.Name;
                Data.ActiveUser = $scope.User.Email;
                Data.Nomina = $scope.selectedNomina.Name;
                Data.Periodo = $scope.selectedPeriodo.Periodo;
                Data.Empleado = $scope.selectedEmpleado.NombreCompleto;
                $http({
                    method: 'POST',
                    url: '/AddSolicitud',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    swal("Mensaje de la aplicacion de recibos", "Tu solicitud fue generada.");
                    window.location.href = '/Solicitudes';
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
        }])

        .controller('MyController3', ['$scope', '$http', '$loading', '$location', function ($scope, $http, $loading, $location) {
          var url = $location.absUrl();
          if (url.search("error") > 0) {
              swal("", "El usuario google conectado no es un usuario del sistema.");
          }
            $scope.Usuario = 'admin@gmail.com';
            $scope.Contrasena = '123';
            $scope.Login = function () {
                if ($scope.Usuario.trim() == '' || $scope.Contrasena.trim() == '') {return};
                var Data = {};
                Data.Usuario = $scope.Usuario;
                Data.Contrasena = $scope.Contrasena;
                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/Login',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                  $loading.finish('myloading');
                    if (response.data.Login == true) {
                        localStorage.Perfil = JSON.stringify(response.data.Perfil);
                        localStorage.ActiveUser = $scope.Usuario;
                        window.location.href = '/Solicitudes';
                    }
                    else {
                        swal("Mensaje de la aplicacion de recibos", "Datos de acceso incorrectos.");
                    }
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.ValidateEmail = function validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
            $scope.ForgotPassword = function () {
                if ($scope.ValidateEmail($scope.Usuario) == false) {
                    swal("Mensaje de la aplicacion de recibos", "Coloca un correo valido.");
                    return 0;
                }
                var Data = {};
                Data.Email = $scope.Usuario;
                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/RecoverPassword',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    if (response.data.Result == 'Ok') {
                        swal("Mensaje de la aplicacion de recibos", "Una nueva clave fue generada y enviada a tu correo electronico.");
                    }
                    else {
                        swal("Mensaje de la aplicacion de recibos", "No se pudo generar nueva clave. Usuario no encontrado");
                    }
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
        }])

        .controller('ctrlRecibosAsimilados', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', function ($scope, $http, $uibModal, $log, $document, $loading) {
            $scope.GetEmpleadosData = function () {
                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/GetEmpleadosNomina',
                    headers: { 'Content-Type': 'application/json' },
                    data: {}
                }).then(function successCallback(response) {
                    $scope.Nominas = response.data.Nominas;
                    $scope.Empleados = [];
                    $scope.tEmpleados = response.data.tEmpleados;
                    $scope.tEmpleadosFiltered = [];
                    $scope.User = response.data.User;
                    $loading.finish('myloading');
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.GetEmpleadosData();
            $scope.SetPeriodosEmpleados = function(){
              $scope.Periodos = _.orderBy(_.uniqBy($scope.tEmpleados, 'Periodo'), ['Periodo'], ['asc']).filter(function (el) { return el.Periodo.trim() != '' });
              $scope.Empleados = _.orderBy(_.uniqBy($scope.tEmpleados, 'NombreCompleto'), ['NombreCompleto'], ['asc']).filter(function (el) { return el.NombreCompleto.trim() != '' });
              $scope.Periodos = $scope.Periodos.filter(function(el){
                  return el.Nomina == $scope.selectedNomina.Name
              })
              $scope.Empleados = $scope.Empleados.filter(function(el){
                  return el.Nomina == $scope.selectedNomina.Name
              })
              $scope.tEmpleadosFiltered2 = $scope.tEmpleados;
              $scope.tEmpleadosFiltered2 = $scope.tEmpleadosFiltered2.filter(function(el){
                  return el.Nomina == $scope.selectedNomina.Name
              })
              $scope.EmpleadosTodos = $scope.tEmpleadosFiltered2;
              $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered2;
              $scope.Periodos.push({ Periodo: ' Todos' });
              $scope.Empleados.push({ NombreCompleto: ' Todos' });
              $scope.selectedPeriodo = $scope.Periodos.filter(function (o1) {
                  return (o1.Periodo == ' Todos');
              })[0];
              $scope.selectedEmpleado = $scope.Empleados.filter(function (o1) {
                  return (o1.NombreCompleto == ' Todos');
              })[0];
            }
            $scope.filterempleados = function () {
                $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered2;
                if ($scope.selectedPeriodo.Periodo != ' Todos') {
                    $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered.filter(function (o1) {
                        return (o1.Periodo == $scope.selectedPeriodo.Periodo);
                    });
                    $scope.Empleados = $scope.EmpleadosTodos;
                    $scope.Empleados = $scope.Empleados.filter(function (el){
                      return (el.Periodo == $scope.selectedPeriodo.Periodo);
                    })
                }
                if ($scope.selectedEmpleado.NombreCompleto != ' Todos') {
                    $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered.filter(function (o1) {
                        return (o1.NombreCompleto == $scope.selectedEmpleado.NombreCompleto);
                    });
                }
            }
            $scope.findfile = function (PeriodoFile, RfcValido) {
              if (RfcValido == false){
                swal("Mensaje de la aplicacion de recibos", "El empleado seleccionado tiene un RFC invalido.");
                return 0;
              }
              var iFileName = PeriodoFile;
              window.open("/downloadanybyname?filename=" + iFileName,'_blank');
            }
        }])

        .controller('MyController4', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', function ($scope, $http, $uibModal, $log, $document, $loading) {
            $scope.GetEmpleadosData = function () {
                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/GetEmpleadosData',
                    headers: { 'Content-Type': 'application/json' },
                    data: {}
                }).then(function successCallback(response) {
                    $scope.Nominas = response.data.Nominas;
                    $scope.Periodos = response.data.Periodos;
                    $scope.Empleados = response.data.Empleados;
                    $scope.tEmpleados = response.data.tEmpleados;
                    $scope.tEmpleadosFiltered = $scope.tEmpleados;
                    $scope.Nominas.push({ Name: ' Todos' });
                    $scope.Periodos.push({ Name: ' Todos' });
                    $scope.Empleados.push({ Name: ' Todos' });
                    $scope.User = response.data.User;
                    $scope.selectedNomina = $scope.Nominas.filter(function (o1) {
                        return (o1.Name == ' Todos');
                    })[0];
                    $scope.selectedPeriodo = $scope.Periodos.filter(function (o1) {
                        return (o1.Name == ' Todos');
                    })[0];
                    $scope.selectedEmpleado = $scope.Empleados.filter(function (o1) {
                        return (o1.Name == ' Todos');
                    })[0];
                    $loading.finish('myloading');
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.GetEmpleadosData();
            $scope.filterempleados = function () {
                $scope.tEmpleadosFiltered = $scope.tEmpleados;
                if ($scope.selectedNomina.Name != ' Todos') {
                    $scope.tEmpleadosFiltered = $scope.tEmpleados.filter(function (o1) {
                        return (o1.Nomina == $scope.selectedNomina.Name);
                    });
                }
                if ($scope.selectedPeriodo.Name != ' Todos') {
                    $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered.filter(function (o1) {
                        return (o1.Periodo == $scope.selectedPeriodo.Name);
                    });
                }
                if ($scope.selectedEmpleado.Name != ' Todos') {
                    $scope.tEmpleadosFiltered = $scope.tEmpleadosFiltered.filter(function (o1) {
                        return (o1.Empleado == $scope.selectedEmpleado.Name);
                    });
                }
            }
            $scope.findfile = function (nomina, periodo, empleado) {
                var Data = {};
                Data.Nomina = nomina;
                Data.Periodo = periodo;
                Data.Empleado = empleado;
                $http({
                    method: 'POST',
                    url: '/GetEmpleadoFileId',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    window.open(
                    '/download2?fileid=' + response.data.FileId,
                    '_blank'
                    );
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
        }])

        .controller('ctrlRights', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', function ($scope, $http, $uibModal, $log, $document, $loading) {
            $scope.optionRights = ['E', 'A', 'V', 'N'];
            $scope.GetRights = function () {
                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/GetRights',
                    headers: { 'Content-Type': 'application/json' },
                    data: {}
                }).then(function successCallback(response) {
                    $scope.Rights = response.data.Rights;
                    $loading.finish('myloading');
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.UpdateRights = function () {
                $loading.start('myloading');
                var Data = {};
                Data.Rights = $scope.Rights;
                $http({
                    method: 'POST',
                    url: '/UpdateRights',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.GetRights();
        }])

        .controller('ctrlNuevoUsuario', ['$scope', '$http', '$loading', function ($scope, $http, $loading) {

           $scope.DeleteNomina = function(Name){
             $scope.NominasEmpleado = $scope.NominasEmpleado.filter(function(el){
               return el.Name != Name
             })
           }

             $scope.GetEmpleadosData = function () {
               $loading.start('myloading');
               var Data = {};
               Data.EditUser = localStorage.User;
             $http({
                   method: 'POST',
                   url: '/GetEmpleadosdata',
                   headers: { 'Content-Type': 'application/json' },
                   data: Data
               }).then(function successCallback(response) {
                 $loading.finish('myloading');
                 if (localStorage.User != '')
                 {
                     $scope.username = response.data.Usuario.Name;
                     $scope.email = response.data.Usuario.Email;
                     $scope.password = response.data.Usuario.Password;
                     $scope.user = response.data.Usuario.User;
                     $scope.selectedPerfil = $scope.Perfiles.filter(function (el) { return el.id == response.data.Usuario.Perfil })[0];


                          if ($scope.selectedPerfil.id == 3) {
                           $scope.Show1 = false;
                           $scope.Show2 = true;
                           $scope.nit = response.data.Usuario.Nit;
                           $scope.phone = response.data.Usuario.Phone;
                           }

                   }
                 $loading.finish('myloading');
               }, function errorCallback(response) {
                   alert(response.statusText);
               });
           }

             $scope.GetEmpleadosData();


        $scope.Perfiles = [{ id: 0, Name: 'Seleccione el perfil' }, { id: 1, Name: 'Comercio Exterior' }, {id: 2, Name: 'Logistica' }, { id: 3, Name: 'Proveedor' }];

             $scope.Searchperfil = function () {
                  if ($scope.selectedPerfil.id == 3)
                 {
                        $scope.Show1 = false;
                        $scope.Show2 = true;
                 }
                 else
                 {
                     $scope.Show1 = true;
                     $scope.Show2 = false;
                 } }

                      $scope.GoCancell = function () {
                 window.location.href = '/usuarios.html';
             }

              $scope.selectedPerfil = $scope.Perfiles[0];



            $scope.NewUser = function () {
                 $scope.username = '';
                 $scope.phone = '';
                 $scope.nit = '';
                 $scope.email = '';
                 $scope.user = '';
                 $scope.password = '';
                 $scope.repeatpassword = '';
                 $scope.selectedPerfil = $scope.Perfiles[0];
                 $scope.NominasEmpleado = [];
             }
             $scope.ValidateEmail = function validateEmail(email) {
                 var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                 return re.test(email);
             }
             $scope.SaveUser = function () {

                 if ($scope.ValidateEmail($scope.email) == false) {
                     swal("Mensaje de la aplicacion de recibos", "Debe ingresar un email valido.");
                     return 0;
                 }

                   if ($scope.username.trim() == '') {
                     swal("Mensaje de la aplicacion de recibos", "Debe colocar un nombre de usuario.");
                     return 0;
                 }

                 if ($scope.selectedPerfil.id == 0) {
                     swal("Mensaje de la aplicacion de recibos", "Debe seleccionar un perfil.");
                     return 0;
                 }

                 if ($scope.user.trim() == '') {
                     swal("Mensaje de la aplicacion de recibos", "Debe ingresar usuario.");
                     return 0;
                 }

                 if ($scope.password.trim() == '') {
                     swal("Mensaje de la aplicacion de recibos", "Debe ingresar un password.");
                     return 0;
                 }

                 $loading.start('myloading');
                 var Data = {};
                 Data.Email = $scope.email;
                 Data.Password = $scope.password;
                 Data.User=$scope.user;
                 Data.Nit=$scope.nit;
                 Data.Phone=$scope.phone;
                 Data.Perfil = $scope.selectedPerfil.id;
                 Data.NombrePerfil = $scope.selectedPerfil.Name;
                 Data.EditUser = localStorage.User;
                 Data.UserName = $scope.username;
                 $http({
                     method: 'POST',
                     url: '/SaveUser',
                     headers: { 'Content-Type': 'application/json' },
                     data: Data
                 }).then(function successCallback(response) {
                     $loading.finish('myloading');

                     if (response.data.Result == 'ex') {
                         swal("Mensaje de la aplicacion de recibos", "Ya existe un usuario con ese correo.");
                         return 0;
                     }
                     if (localStorage.User == '') {
                         swal("Mensaje de la aplicacion de recibos", "Tu usuario fue creado.");
                         $scope.NewUser();
                     }
                     else {
                         swal("Mensaje de la aplicacion de recibos", "Tu usuario fue actualizado.");
                        window.location.href = '/usuarios.html';
                     }
                 }, function errorCallback(response) {
                     alert(response.statusText);
                 });
             }

         }])



        .controller('ModalErrores', function ($uibModalInstance, Errores, $http, FileUploader, $loading, mySharedService) {
            var $ctrl = this;
            $ctrl.Errores = Errores;
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })

        .controller('ModalInstanceCtrlChangePassword', function ($uibModalInstance, ActiveUserModal, $http, FileUploader, $loading, mySharedService) {
            var $ctrl = this;
            $ctrl.ActiveUserModal = ActiveUserModal;
            $ctrl.uploader = new FileUploader();
            $ctrl.uploader.url = "/upload";
            $ctrl.ok = function () {
                $uibModalInstance.close();
            };
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $ctrl.ChangePassword = function () {
                if ($ctrl.NewPassword.trim() != $ctrl.RepeatPassword.trim()) {
                    swal("Mensaje de la aplicacion de recibos", "No coinciden los password.");
                    return 0;
                }
                var Data = {};
                Data.Password = $ctrl.NewPassword.trim();
                $http({
                    method: 'POST',
                    url: '/updatePassword',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    if (response.data.Result == 'Ok') {
                        swal("Mensaje de la aplicacion de recibos", "Tu password fue cambiado.");
                    }
                    else {
                        swal("Mensaje de la aplicacion de recibos", "Tu usuario fue actualizado.");
                    }
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            };
        })

        .controller('ModalInstanceCtrl', function ($uibModalInstance, DataModalComentario, $http, FileUploader, $loading, mySharedService) {
            var $ctrl = this;
            $ctrl.User = DataModalComentario.User;
            $ctrl.uploader = new FileUploader();
            $ctrl.uploader.url = "/upload";
            $ctrl.uploader.onBeforeUploadItem = function (item) {
                $loading.start('myloading');
                item.formData.push(DataModalComentario.Solicitud);
            };
            $ctrl.uploader.onAfterAddingFile = function (item /*{File|FileLikeObject}*/, filter, options) {
                $ctrl.uploader.uploadAll();
            };
            $ctrl.uploader.onSuccessItem = function (item, response) {
                $loading.finish('myloading');
                swal("Mensaje de la aplicacion de recibos", "Tu archivo fue cargado con exito.");
            };
            $ctrl.ok = function () {
                $uibModalInstance.close();
            };
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $ctrl.ShowComments = function () {
                $ctrl.Comentarios = DataModalComentario.Solicitud.Comentarios;
                if ($ctrl.User.Level == 1) {
                    DataModalComentario.Solicitud.Comentarios.forEach(function UpdateRead(element, index, array) { element.LeidoAdmin = 'Si' });
                }
                else {
                    DataModalComentario.Solicitud.Comentarios.forEach(function UpdateRead(element, index, array) { element.LeidoUser = 'Si' });
                }
                var Data = {};
                Data._id = DataModalComentario.Solicitud._id;
                Data.Estatus = "En Proceso";
                Data.Comentarios = DataModalComentario.Solicitud.Comentarios;
                $http({
                    method: 'POST',
                    url: '/UpdateComment',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $ctrl.User = response.data.User;
                    mySharedService.prepForBroadcast();
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $ctrl.ShowComments();
            $ctrl.AddComment = function (Estatus) {
                $ctrl.Comentarios.push({ "Fecha": new Date(), "LeidoAdmin": "No", "LeidoUser": "No", "Comentario": $ctrl.txtComment, "Usuario": $ctrl.User.Email })
                var Data = {};
                Data._id = DataModalComentario.Solicitud._id;
                Data.Estatus = Estatus;
                Data.Comentarios = $ctrl.Comentarios;
                $http({
                    method: 'POST',
                    url: '/UpdateComment',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $ctrl.txtComment = '';
                    mySharedService.prepForBroadcast();
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
        })

        .controller('ctrlProveedor', ['$scope', '$http', '$loading',  function ($scope, $http, $loading) {

         var editform= 0;

         $scope.Usuario={};

         $scope.Show1 = true;
         $scope.Show2 = false;
         $scope.Show3 = false;
         $scope.Showf1 = function () {
           $scope.Show1 = true;
           $scope.Show2 = false;
           $scope.Show3 = false;
         };
         $scope.Showf2 = function () {
           $scope.Show1 = false;
           $scope.Show2 = true;
           $scope.Show3 = false;
         };
         $scope.Showf3 = function () {
           $scope.Show1 = false;
           $scope.Show2 = false;
           $scope.Show3 = true;
         };


         $scope.GetUsuarioProveedor = function () {
           var Data = {};
           $loading.start('myloading');
           // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
           Data.NombrePerfil = 'Proveedor';
           Data.Email = localStorage.User
           $http({
               method: 'POST',
               url: '/GetUsuarioProveedor',
               headers: { 'Content-Type': 'application/json' },
               data: Data
           }).then(function successCallback(response) {
               $loading.finish('myloading');
               if (editform != '')
                {

                    $scope.username = response.data.data.Name;
                    $scope.email = response.data.data.Email;
                    $scope.nit = response.data.data.Nit;
                    $scope.user = response.data.data.User;
                    $scope.phone = response.data.data.Perfil;
                  }
                  else
                  {

              //$scope.UsuariosOriginal = response.data.Usuarios;
              // $scope.Usuarios = response.data.Usuarios;
              $scope.Usuarios = response.data.data;}
           }, function errorCallback(response) {
               alert(response.statusText);
           });
         }

         $scope.GetUsuarioProveedor();



          $scope.NewUser = function () {
               $scope.username = '';
               $scope.phone = '';
               $scope.nit = '';
               $scope.email = '';
               $scope.user = '';
               $scope.password = '';
               $scope.repeatpassword = '';
               $scope.selectedPerfil = $scope.Perfiles[0];
               $scope.NominasEmpleado = [];
           }

           $scope.ValidateEmail = function validateEmail(email) {
               var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
               return re.test(email);
           }


           $scope.SaveUser = function () {

               if ($scope.ValidateEmail($scope.email) == false) {
                  // swal("Mensaje de la aplicacion de recibos", "Debe ingresar un email valido.");
                   return 0;
               }

                 if ($scope.username.trim() == '') {
                  // swal("Mensaje de la aplicacion de recibos", "Debe colocar un nombre de contacto.");
                   return 0;
               }

                  if ($scope.nit.length == 0) {
                  // swal("Mensaje de la aplicacion de recibos", "Debe ingresar numero de nit.");
                   return 0;
               }

               if ($scope.phone.length == 0) {
                  // swal("Mensaje de la aplicacion de recibos", "Debe ingresar un numero contacto.");
                   return 0;
               }


               if ($scope.user.trim() == '') {
                  // swal("Mensaje de la aplicacion de recibos", "Debe ingresar usuario.");
                   return 0;
               }


                 $loading.start('myloading');
                var Data = {};
                Data.Email = $scope.email;
                Data.Password = $scope.password;
                Data.User=$scope.user;
                Data.Nit=$scope.nit;
                Data.Phone=$scope.phone;
                Data.EditUser = localStorage.User;
                Data.NombrePerfil ='Proveedor';
                Data.UserName = $scope.username;
                $http({
                    method: 'POST',
                    url: '/SaveUser',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');

                    if (response.data.Result == 'ex') {
                        swal("Mensaje de la aplicacion de recibos", "Ya existe un proveedor con ese correo.");
                        return 0;
                    }
                    if (localStorage.User == '') {
                        swal("Mensaje de la aplicacion de recibos", "Proveedor fue creado.");
                         window.location.href = '/proveedores.html';
                        //$scope.NewUser();
                    }

                }, function errorCallback(response) {
                    alert(response.statusText);
                });
             }

              $scope.DeleteUser = function (Email) {
                   $loading.start('myloading');
             if (localStorage.ActiveUser == Email) {
                 swal("", "No puede eliminar el propio usuario.");
                 return 0;
             }
             swal({
                 title: "Seguro de  eliminar el usuario?",
                 text: "",
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonColor: "#DD6B55",
                 confirmButtonText: "Aceptar",
                 closeOnConfirm: true
             },
             function () {

               var Data = {};
               Data.Email = Email;
               $http({
                   method: 'POST',
                   url: '/DeleteUser',
                   headers: { 'Content-Type': 'application/json' },
                   data: Data
               }).then(function successCallback(response) {
                  $loading.finish('myloading');
                   $scope.GetUsuarioProveedor();
               }, function errorCallback(response) {
                   alert(response.statusText);
               });

             });
           }

          $scope.GotoUser = function (email) {
            localStorage.User = email;
            $('#nuevoProveedor').modal('show');
            if (localStorage.User != ''){
              scope.GetUsuarioProveedor();
            }
          }

       }])

        .controller('ctrlWarrantyLogin', ['$scope', '$http', '$loading',  function ($scope, $http, $loading) {

          $scope.Usuario={};
          $scope.Usuarios = [];

          $scope.Show1 = true;
          $scope.Show2 = false;
          $scope.Show3 = false;
          $scope.Showf1 = function () {
            $scope.Show1 = true;
            $scope.Show2 = false;
            $scope.Show3 = false;
          };
          $scope.Showf2 = function () {
            $scope.Show1 = false;
            $scope.Show2 = true;
            $scope.Show3 = false;
          };
          $scope.Showf3 = function () {
            $scope.Show1 = false;
            $scope.Show2 = false;
            $scope.Show3 = true;
          };

          $scope.EnviarEmailProveedores = function () {
            if ($scope.Usuarios.length == 0){
              swal("Licitaciones Proenfar", "Debe escoger a menos un proveedor.");
              return 0;
            }
            $loading.start('myloading');
            var Data = {}
            Data.Proveedores = $scope.Usuarios;
            Data.Mensaje = $scope.Mensaje;
            $http({
                method: 'POST',
                url: '/EnviarEmailProveedores',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                if (response.data.Result == 'Ok'){
                  swal("Licitaciones Proenfar", "Se enviaron las licitaciones a todos los proveedores.");
                }
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }

           $scope.NewUser = function () {
                $scope.username = '';
                $scope.phone = '';
                $scope.nit = '';
                $scope.email = '';
                $scope.user = '';
                $scope.password = '';
                $scope.repeatpassword = '';
                $scope.selectedPerfil = $scope.Perfiles[0];
                $scope.NominasEmpleado = [];
            }

            $scope.Proveedores= [];

            $scope.bkproveedor= function() {
              $scope.Proveedores.push($scope.Usuario.selected);
              $scope.Usuario.selected='';
            }

            $scope.dtproveedor= function(dato) {
              var pos = $scope.Proveedores.indexOf(dato);
              $scope.Proveedores.splice(pos);
            }

           $scope.cargarproveedoresTodos = function () {
             $loading.start('myloading');
             var params = { params: { usuario: ''} };
             $http({
                 method: 'POST',
                 url: '/GetBuscarUsuario',
                 headers: { 'Content-Type': 'application/json' },
                 data: params
             }).then(function successCallback(response) {
                 $loading.finish('myloading');
                 $scope.Proveedores = response.data.Usuarios;
             }, function errorCallback(response) {
                 alert(response.statusText);
             });
           }

            $scope.refreshUsuarios = function (usuario) {
                 // swal("por aqui");
              if (usuario.length < 3) return 0;
              var params = { usuario: usuario };
              $loading.start('myloading');
              return $http.post('/GetBuscarUsuario', { params: params })
                .then(function (response) {
                    $loading.finish('myloading');
                        $scope.Usuarios = response.data.Usuarios;

                });
            };

            $scope.ValidateEmail = function validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
            $scope.SaveUserProveedor = function () {

                if ($scope.ValidateEmail($scope.email) == false) {
                    swal("Mensaje de la aplicacion de recibos", "Debe ingresar un email valido.");
                    return 0;
                }

                  if ($scope.username.trim() == '') {
                    swal("Mensaje de la aplicacion de recibos", "Debe colocar un nombre de contacto.");
                    return 0;
                }

                if ($scope.phone.length == 0) {
                    swal("Mensaje de la aplicacion de recibos", "Debe ingresar un numero contacto.");
                    return 0;
                }


                if ($scope.user.trim() == '') {
                    swal("Mensaje de la aplicacion de recibos", "Debe ingresar usuario.");
                    return 0;
                }

                if ($scope.password.trim() == '') {
                    swal("Mensaje de la aplicacion de recibos", "Debe ingresar un password.");
                    return 0;
                }
            }

        }])

        .controller('ctrlUsuarioAdmin', ['$scope', '$http', '$loading', function ($scope, $http, $loading) {

          $scope.read = function (workbook) {
            console.log(workbook);
            console.log(workbook.Sheets["ADUA AEREO MARIT TERRESTRE 2015"]);
            var a = XLSX.utils.sheet_to_json(workbook.Sheets["ADUA AEREO MARIT TERRESTRE 2015"], {raw: true});
            console.log(a);
          }

          $scope.error = function (e) {
            console.log(e);
          }

          $scope.Show1 = true;
          $scope.Show2 = false;
          $scope.Show3 = false;
          $scope.Showf1 = function () {
            $scope.Show1 = true;
            $scope.Show2 = false;
            $scope.Show3 = false;
          };
          $scope.Showf2 = function () {
            $scope.Show1 = false;
            $scope.Show2 = true;
            $scope.Show3 = false;
          };
          $scope.Showf3 = function () {
            $scope.Show1 = false;
            $scope.Show2 = false;
            $scope.Show3 = true;
          };

          $scope.Llamar = function () {
            $('#nuevoProveedor').modal('show');
          };

            $scope.SearchUser = function () {

                $scope.Usuarios = $scope.UsuariosOriginal.filter(function (el) { return el.Name.toUpperCase().includes($scope.SearchText.toUpperCase()); })
            };
            $scope.GetUsuarios = function () {
                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/GetUsuarios',
                    headers: { 'Content-Type': 'application/json' },
                    data: {}
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.UsuariosOriginal = response.data.Usuarios;
                    $scope.Usuarios = response.data.Usuarios;
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
            $scope.DeleteUser = function (Email) {
              if (localStorage.ActiveUser == Email) {
                  swal("", "No puede eliminar el propio usuario.");
                  return 0;
              }
              swal({
                  title: "Seguro de querer eliminar el usuario?",
                  text: "",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Aceptar",
                  closeOnConfirm: true
              },
              function () {

                var Data = {};
                Data.Email = Email;
                $http({
                    method: 'POST',
                    url: '/DeleteUser',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $scope.GetUsuarios();
                }, function errorCallback(response) {
                    alert(response.statusText);
                });

              });
            }
            $scope.GotoUser = function (email) {
                localStorage.User = email;
                window.location.href = '/nuevo_usuario.html';
            }


            $scope.GetUsuarios();
        }]);
