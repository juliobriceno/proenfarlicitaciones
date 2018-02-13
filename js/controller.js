angular.element(function() {
    angular.bootstrap(document, ['Solicitudes']);
});

angular.module('Solicitudes', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularFileUpload', 'darthwade.loading', 'ngTagsInput', 'ui.select', 'angular-js-xlsx', 'ui.mask'])

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

        .controller('ctrlPreguntas', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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


              $scope.UserNameConnected = localStorage.UserNameConnected;

              ///////////////Preguntas y Respuestas ///////////////

                 $scope.Modalidades = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFCL' }, { id: 4, Name: 'MritimasLCL' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

                 $scope.selectedModalidad = $scope.Modalidades[0];


                  $scope.GetPreguntas = function () {
                    var Data={};
                $loading.start('myloading');
                Data.Modalidad='Bodegajes';
                $http({
                    method: 'POST',
                    url: '/GetPreguntas',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.Preguntas = response.data.Preguntas;
                    $scope.preguntas= '';
                    $scope.respuestas= '';
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
                $scope.GetPreguntas();


              $scope.SavePreguntas = function () {
                if ($scope.preguntas.trim() == '')
                {
                  swal("Licitaciones Proenfar", "Debe colocar la pregunta.");
                  return 0
                }
                if ($scope.respuestas.trim() == '')
                {
                  swal("Licitaciones Proenfar", "Debe colocar la respuesta.");
                  return 0
                }
                 $loading.start('myloading');
                 var Data = {};
                 Data.Modalidad = 'Bodegajes';
                 Data.Preguntas = $scope.preguntas;
                 Data.Respuestas=$scope.respuestas;
                 console.log($scope.selectedModalidad.Name);
                  console.log($scope.preguntas);
                  console.log($scope.respuestas);
                  $http({
                     method: 'POST',
                     url: '/SavePreguntas',
                     headers: { 'Content-Type': 'application/json' },
                     data: Data
                 }).then(function successCallback(response) {
                     $loading.finish('myloading');
                    $scope.GetPreguntas();
                 }, function errorCallback(response) {
                     alert(response.statusText);
                 })
                 ;
             }

            $scope.Deletepregunta = function (Modalidad, Pregunta) {


              swal({
                title: "Seguro de  eliminar la pregunta?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
              },
              function () {

                $loading.start('myloading');
                var Data = {};
                Data.Modalidad = Modalidad;
                Data.Preguntas = Pregunta;
                 $http({
                     method: 'POST',
                     url: '/DeletePregunta',
                     headers: { 'Content-Type': 'application/json' },
                     data: Data
                 }).then(function successCallback(response) {
                    $loading.finish('myloading');
                     $scope.GetPreguntas();
                 }, function errorCallback(response) {
                     alert(response.statusText);
                 });

              });

           }

              }])

          .controller('ctrlRequisitos', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {

            // Llama a HTML Modal que permite cambiar passwor de la app
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
            // Fin Llama a HTML Modal que permite cambiar passwor de la app

            $scope.UserNameConnected = localStorage.UserNameConnected;

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


              ///////////////Preguntas y Respuestas ///////////////

                 $scope.Modalidades = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFCL' }, { id: 4, Name: 'MritimasLCL' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

                 $scope.selectedModalidad = $scope.Modalidades[0];


                  $scope.GetRequisitos = function () {
                    var Data={};
                $loading.start('myloading');
                Data.Modalidad='Bodegajes';
                $http({
                    method: 'POST',
                    url: '/GetRequisitos',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.Requisitos = response.data.Requisitos;
                    $scope.requisitos = '';
                    $scope.soportes = '';
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
                $scope.GetRequisitos();

              $scope.SaveRequisitos = function () {
                if ($scope.requisitos.trim() == '')
                {
                  swal("Licitaciones Proenfar", "Debe colocar los requisitos.");
                  return 0
                }
                if ($scope.soportes.trim() == '')
                {
                  swal("Licitaciones Proenfar", "Debe colocar los soportes.");
                  return 0
                }
                 $loading.start('myloading');
                 var Data = {};
                 Data.Modalidad = 'Bodegajes';
                 Data.Requisitos = $scope.requisitos;
                 Data.Soportes=$scope.soportes;
                 console.log($scope.selectedModalidad.Name);
                  console.log($scope.requisitos);
                  console.log($scope.soportes);
                  $http({
                     method: 'POST',
                     url: '/SaveRequisitos',
                     headers: { 'Content-Type': 'application/json' },
                     data: Data
                 }).then(function successCallback(response) {
                     $loading.finish('myloading');
                    $scope.GetRequisitos();
                 }, function errorCallback(response) {
                     alert(response.statusText);
                 })
                 ;
             }

            $scope.Deleterequisito = function (Modalidad, Requisito) {

              swal({
                title: "Seguro de  eliminar el requisito?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
              },
              function () {

                $loading.start('myloading');
                var Data = {};
                Data.Modalidad = Modalidad;
                Data.Requisitos = Requisito;
                 $http({
                     method: 'POST',
                     url: '/DeleteRequisito',
                     headers: { 'Content-Type': 'application/json' },
                     data: Data
                 }).then(function successCallback(response) {
                    $loading.finish('myloading');
                     $scope.GetRequisitos();
                 }, function errorCallback(response) {
                     alert(response.statusText);
                 });

              });

           }


              }])

        .controller('ctrlContactoModalidad', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

          $scope.Modalidades = [{name: 'Bodegaje'}, {name: 'Aduana'}, {name: 'OTM'}, {name: 'Maritimas FCL'}, {name: 'Maritimas LCL'}, {name: 'Terrestre Nacional'}, {name: 'Terrestre Urbano'}, {name: 'Aéreas'}];
          $scope.AgregarModalidad = function(){
            var tmpContactoModalidad = $scope.contactomodalidad.modalidades.filter(function(el){
              return el.modalidad == $scope.contactomodalidad.modalidad;
            })
            if (tmpContactoModalidad.length > 0){
              swal("Licitaciones Proenfar", "Ya agregó ésta modalidad.");
              return 0
            }
            $scope.contactomodalidad.modalidades.push({modalidad: $scope.contactomodalidad.modalidad});
          }
          $scope.EliminarModalidad = function(modalidad){
            $scope.contactomodalidad.modalidades = $scope.contactomodalidad.modalidades.filter(function(el){
              return el.modalidad.name != modalidad;
            })
          }
          $scope.GetContactoPorModalidades = function () {
            // Si es usuario nuevo inicializa todos los campos
            if (localStorage.ContactoPorModalidadEmail == ''){
              $scope.contactomodalidad = {};
              $scope.contactomodalidad.modalidad = $scope.Modalidades[0];
              $scope.contactomodalidad.modalidades = [];
              $scope.contactomodalidad.nombre = '';
              $scope.contactomodalidad.direccion = '';
              $scope.contactomodalidad.email = '';
              $scope.contactomodalidad.ciudad = '';
              $scope.contactomodalidad.telefonofijo = '';
              $scope.contactomodalidad.celular = '';
              $scope.contactomodalidad.cargo = '';
              $scope.contactomodalidad.Proveedor = localStorage.UserConnected;
            }
            else {
              var Data = {};
              Data.Email = localStorage.ContactoPorModalidadEmail;
              $http({
                  method: 'POST',
                  url: '/GetContactoModalidad',
                  headers: { 'Content-Type': 'application/json' },
                  data: Data
              }).then(function successCallback(response) {
                $scope.contactomodalidad = response.data.contactomodalidad;
                $scope.contactomodalidad.modalidad = $scope.Modalidades.filter(function(el){
                  return el.name == $scope.contactomodalidad.modalidad.name
                })[0];
              }, function errorCallback(response) {
                  alert(response.statusText);
              });
            }
          }
          $scope.GetContactoPorModalidades();
          $scope.GotToGridContactosModalidades = function () {
            window.location.href = '/contactos_modalidad.html';
          }
          $scope.SaveContactoModalidad = function () {
            if (!$scope.bookmarkFormProv.$valid)
            {
              swal("Licitaciones Proenfar", "Hay valores inválidos. Por favor revisar el formulario.");
              return 0
            }
            if ($scope.contactomodalidad.modalidades.length == 0)
            {
              swal("Licitaciones Proenfar", "El contacto debe tener a menos una modalidad.");
              return 0
            }
              var Data = {};
              Data.contactomodalidad = $scope.contactomodalidad;
              Data.ContactoPorModalidadEmail = localStorage.ContactoPorModalidadEmail;
              $loading.start('myloading');
              $http({
                  method: 'POST',
                  url: '/SaveContactoModalidad',
                  headers: { 'Content-Type': 'application/json' },
                  data: Data
              }).then(function successCallback(response) {
                  $loading.finish('myloading');
                  if (response.data.Result == 'ex') {
                      swal("Licitaciones Proenfar", "Ya existe un contacto con ese correo.");
                      return 0;
                  }
                  if (localStorage.ContactoPorModalidadEmail == '') {
                      swal("Licitaciones Proenfar", "El contacto fue creado.");
                      window.location.href = '/contactos_modalidad.html';
                  }
                  else {
                      swal("Licitaciones Proenfar", "El contacto fue actualizado.");
                      window.location.href = '/contactos_modalidad.html';
                  }
              }, function errorCallback(response) {
                  alert(response.statusText);
              });
          }
        }])

        .controller('ctrlContactosModalidad', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

          $scope.GotoContacto = function (email) {
            localStorage.ContactoPorModalidadEmail = email;
            window.location.href = '/nuevo_contacto.html';
          }
          $scope.GetContactosPorModalidades = function () {
            var Data = {};
            Data.Proveedor = localStorage.UserConnected;
            $http({
                method: 'POST',
                url: '/GetContactosPorModalidades',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
              $scope.contactosmodalidades = response.data.contactosmodalidades;
              $scope.contactosmodalidades.forEach(function(element) {
                if (typeof element.modalidades != 'undefined'){
                  element.modalidadestext = '';
                  element.modalidades.forEach(function(modalidadinterna) {
                    element.modalidadestext += modalidadinterna.modalidad.name + ' '
                  });
                }
              });
              $scope.contactosmodalidadesfiltered = $scope.contactosmodalidades;
            }, function errorCallback(response) {
              alert(response.statusText);
            });
          }
          $scope.GetContactosPorModalidades();
          $scope.filtercontactos = function(){
            $scope.contactosmodalidadesfiltered = $scope.contactosmodalidades;
            $scope.contactosmodalidadesfiltered = $scope.contactosmodalidadesfiltered.filter(function (el) {
                return el.nombre.toUpperCase().indexOf($scope.strSerachContacto.toUpperCase()) > -1 || el.email.toUpperCase().indexOf($scope.strSerachContacto.toUpperCase()) > -1
            })
          }
          $scope.DeleteContacto = function (Email) {
            swal({
              title: "Seguro de  eliminar el contacto?",
              text: "",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Aceptar",
              closeOnConfirm: true
            },
            function () {
              $loading.start('myloading');
              var Data = {};
              Data.Email = Email;
              $http({
                method: 'POST',
                url: '/DeleteContacto',
                headers: { 'Content-Type': 'application/json' },
                data: Data
                }).then(function successCallback(response) {
                  $scope.GetContactosPorModalidades();
                  $loading.finish('myloading');
              }, function errorCallback(response) {
                alert(response.statusText);
              });

            });
          }
        }])

        .controller('ctrlLogin', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

          $scope.Usuario = '' ;
          $scope.Contrasena = '';

          $scope.RecoverPassword = function () {
            if ($scope.Usuario.trim() == '') {
                swal("Licitaciones Proenfar", "Coloque el usuario al que desea recuperar la clave.");
                return 0;
            };
            var Data = {};
            Data.Usuario = $scope.Usuario;
            $loading.start('myloading');
            $http({
                method: 'POST',
                url: '/RecoverPassword',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                console.log(response.data.Result);
                if (response.data.Result == 'No') {
                  swal("Licitaciones Proenfar", "No existe el usuario suministrado.");
                  return 0;
                }
                if (response.data.Result == 'Ok') {
                  swal("Licitaciones Proenfar", "Se ha generado una nueva clave y se ha enviado al email.");
                  return 0;
                }
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
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
                    localStorage.UserNameConnected = response.data.Name;
                      if (response.data.Perfil == 1) {
                        window.location.href = '/notificaciones.html';
                      }
                      else {
                        window.location.href = '/cuenta_proveedor.html';
                      }
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


        .controller('ctrlLicitacion', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader','$interval', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader,$interval) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

                        $scope.options4 = {
                           aSign: '',
                            mDec: '0',
                            vMin: '0',
                            vMax: '50'
                        };


                        // Fin s�lo para validar n�meros

                            // Mostrar modalidades mensjaes
                      $scope.ModalidadesMostrar = {
                        Bodegajes: true,
                        Aduanas: true,
                        OTM: true,
                        MaritimasFcl: true,
                        MaritimasLcl: true,
                        TerrestreNacional: true,
                        TerrestreUrbano: true,
                        Aereas: true,
                        BodegajesP: true,
                        AduanasP: true,
                        OTMP: true,
                        MaritimasFclP: true,
                        MaritimasLclP: true,
                        TerrestreNacionalP: true,
                        TerrestreUrbanoP: true,
                        AereasP: true,
                        BodegajesR: true,
                        AduanasR: true,
                        OTMR: true,
                        MaritimasFclR: true,
                        MaritimasLclR: true,
                        TerrestreNacionalR: true,
                        TerrestreUrbanoR: true,
                        AereasR: true
                        }
                        $scope.ModalidadesMostrarActual = 'Bodegajes';

                      $scope.CambiarVisionModalidades = function (ModalidadesMostrar) {
                        var nbmodalidades=ModalidadesMostrar;

                        if ($scope.ModalidadesMostrarActual == 'Bodegajes'){
                          $scope.ModalidadesMostrar.Bodegajes = false;
                        }
                        if ($scope.ModalidadesMostrarActual == 'Aduanas'){
                          $scope.ModalidadesMostrar.Aduanas = false;
                        }
                        if ($scope.ModalidadesMostrarActual == 'OTM'){
                          $scope.ModalidadesMostrar.OTM = false;
                        }
                        if ($scope.ModalidadesMostrarActual == 'MaritimasFcl'){
                          $scope.ModalidadesMostrar.MaritimasFcl = false;
                        }
                        if ($scope.ModalidadesMostrarActual == 'MaritimasLcl'){
                          $scope.ModalidadesMostrar.MaritimasLcl = false;
                        }
                        if ($scope.ModalidadesMostrarActual == 'TerrestreNacional'){
                          $scope.ModalidadesMostrar.TerrestreNacional = false;
                        }
                        if ($scope.ModalidadesMostrarActual == 'TerrestreUrbano'){
                          $scope.ModalidadesMostrar.TerrestreUrbano = false;
                        }
                        if ($scope.ModalidadesMostrarActual == 'Aereas'){
                          $scope.ModalidadesMostrar.Aereas = false;
                        }
                        /*if (ModalidadesMostrar == 'Bodegajes'){
                          if ($scope.ModalidadesMostrar.BodegajesP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'Bodegajes'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'Bodegajes';
                          }
                        }
                        if (ModalidadesMostrar == 'Aduanas'){
                          if ($scope.ModalidadesMostrar.AduanasP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'Aduanas'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'Aduanas';
                          }
                        }
                        if (ModalidadesMostrar == 'OTM'){
                          if ($scope.ModalidadesMostrar.OTMP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'Otms'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'Otms';
                          }
                        }
                        if (ModalidadesMostrar == 'MaritimasFcl'){
                          if ($scope.ModalidadesMostrar.MaritimasFclP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'MaritimasFCL'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'MaritimasFCL';
                          }
                        }
                        if (ModalidadesMostrar == 'MaritimasLcl'){
                          if ($scope.ModalidadesMostrar.MaritimasLclP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'MaritimasLCL'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'MaritimasLCL';
                          }
                        }
                        if (ModalidadesMostrar == 'TerrestreNacional'){
                          if ($scope.ModalidadesMostrar.TerrestreNacionalP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'Terrestre Nacional'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'Terrestre Nacional';
                          }
                        }
                        if (ModalidadesMostrar == 'TerrestreUrbano'){
                          if ($scope.ModalidadesMostrar.TerrestreUrbanoP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'Terrestre Urbano'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'Terrestre Urbano';
                          }
                        }
                        if (ModalidadesMostrar == 'Areas'){
                          if ($scope.ModalidadesMostrar.AreasP == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacionSaved;
                            $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              return el.Modalidad == 'Aereas'
                            })
                            $('#preguntas').modal('show');
                            $scope.PreguntasMostrando = 'Aereas';
                          }
                        }

                        if (ModalidadesMostrar == 'Bodegajes'){
                          if ($scope.ModalidadesMostrar.BodegajesR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'Bodegajes'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'Bodegajes';
                          }
                        }
                        if (ModalidadesMostrar == 'Aduanas'){
                          if ($scope.ModalidadesMostrar.AduanasR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'Aduanas'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'Aduanas';
                          }
                        }
                        if (ModalidadesMostrar == 'OTM'){
                          if ($scope.ModalidadesMostrar.OTMR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'Otms'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'Otms';
                          }
                        }
                        if (ModalidadesMostrar == 'MaritimasFcl'){
                          if ($scope.ModalidadesMostrar.MaritimasFclR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'MaritimasFcl'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'MaritimasFcl';
                          }
                        }
                        if (ModalidadesMostrar == 'MaritimasLcl'){
                          if ($scope.ModalidadesMostrar.MaritimasLclR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'MaritimasLcl'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'MaritimasLcl';
                          }
                        }
                        if (ModalidadesMostrar == 'TerrestreNacional'){
                          if ($scope.ModalidadesMostrar.TerrestreNacionalR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'Terrestre Nacional'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'Terrestre Nacional';
                          }
                        }
                        if (ModalidadesMostrar == 'TerrestreUrbano'){
                          if ($scope.ModalidadesMostrar.TerrestreUrbanoR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'Terrestre Urbano'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'Terrestre Urbano';
                          }
                        }
                        if (ModalidadesMostrar == 'Areas'){
                          if ($scope.ModalidadesMostrar.AreasR == true){
                            // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacionSaved;
                            $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                              return el.Modalidad == 'Aereas'
                            })
                            $('#requisitos').modal('show');
                            $scope.RequisitosMostrando = 'Aereas';
                          }
                        }*/

                          $scope.ModalidadesMostrarActual = ModalidadesMostrar;

                          // Actualiza si puede editar la modalidad actualizada
                          $scope.Estatusproveedor();

                        }


                        // Mostrar modalidades mensjaes

                        ////////CRea Plantilla Excel /////////////////////////

                        $scope.GetTemplateBodegaje = function () {
                          console.log("pora qui");
                               $loading.start('myloading');
                              var URLTemplateParameter = '/GetTemplateBodegaje'
                              window.location = URLTemplateParameter;
                                $loading.finish('myloading');
                            }


                        ////////CRea Plantilla Excel Aduana/////////////////////////

                        $scope.GetTemplateAduana = function () {
                          console.log("pora qui");
                          $loading.start('myloading');
                          var URLTemplateParameter = '/GetTemplateAduana'
                          window.location = URLTemplateParameter;
                          $loading.finish('myloading');
                            }

                       ////////CRea Plantilla Excel OTM/////////////////////////

                        $scope.GetTemplateOTM = function () {
                          console.log("pora qui");
                          $loading.start('myloading');
                          var URLTemplateParameter = '/GetTemplateOTM'
                          window.location = URLTemplateParameter;
                          $loading.finish('myloading');
                            }

                        ////////CRea Plantilla Excel MaritimasFcl/////////////////////////

                        $scope.GetTemplateMariFcl = function () {
                          console.log("pora qui");
                          $loading.start('myloading');
                          var URLTemplateParameter = '/GetTemplateMariFcl'
                          window.location = URLTemplateParameter;
                          $loading.finish('myloading');
                            }

                        ////////CRea Plantilla Excel MaritimasLcl/////////////////////////

                        $scope.GetTemplateMariLcl = function () {
                          console.log("pora qui");
                          $loading.start('myloading');
                          var URLTemplateParameter = '/GetTemplateMariLcl'
                          window.location = URLTemplateParameter;
                          $loading.finish('myloading');
                            }

                        ////////CRea Plantilla Excel TerrestreNacional/////////////////////////

                        $scope.GetTemplateTerreNacional = function () {
                          console.log("pora qui");
                          $loading.start('myloading');
                          var URLTemplateParameter = '/GetTemplateTerreNacional'
                          window.location = URLTemplateParameter;
                          $loading.finish('myloading');
                            }

                        ////////CRea Plantilla Excel TerrestreUrbano/////////////////////////

                        $scope.GetTemplateTerreUrbano = function () {
                          console.log("pora qui");
                          $loading.start('myloading');
                          var URLTemplateParameter = '/GetTemplateTerreUrbano'
                          window.location = URLTemplateParameter;
                          $loading.finish('myloading');
                            }

                         ////////CRea Plantilla Excel Aereas/////////////////////////

                        $scope.GetTemplateAerea = function () {
                          console.log("pora qui");
                          $loading.start('myloading');
                          var URLTemplateParameter = '/GetTemplateAerea'
                          window.location = URLTemplateParameter;
                          $loading.finish('myloading');
                            }


                ///////////////////carga en Excel ////////////////////

                      $scope.read = function (workbook) {
                       console.log(workbook);
                        console.log($scope.ModalidadesMostrarActual);
                         var result = {};
                         var resultado = {};
                         var Data={};
                         var repeatadu={};
                         $loading.start('myloading');
                         $scope.erroresimportacion = [];//
                         var pattern = /^\d+(\.\d+)?$/; ///^\d+$/;
                         var pattern2 = /^-?(\d+\.?\d*)$|(\d*\.?\d+)$/;


                         workbook.SheetNames.forEach(function(sheetName) {
                         var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw: true});
                             if(roa.length) result[sheetName] = roa;
                                 });
                         var exceljson = JSON.stringify(result, 2, 2);
                         var data = angular.fromJson(exceljson);
                         console.log(data);
                 ////////////////////////////Bodegajes_Aduanero ////////////////////////////////////////////
                      if($scope.ModalidadesMostrarActual=='Bodegajes'){
                          angular.forEach(data.Aduanero, function(aduanero) {
                        ////////////////////////////valida si es numerico o null ///////////////
                              if ( ( typeof aduanero["Tarifa Valor/FOB"] == 'undefined' ) || pattern.test(aduanero["Tarifa Valor/FOB"])){
                                  $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaValor = aduanero["Tarifa Valor/FOB"];
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='Aduanero_Tarifa Valor/FOB';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }

                             if( ( typeof aduanero["Tarifa Minima"] == 'undefined' ) || pattern.test(aduanero["Tarifa Minima"])){
                                 $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaMinima = aduanero["Tarifa Minima"];
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='Aduanero_Tarifa Minima';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }

                              if( ( typeof aduanero.Otros == 'undefined' ) || pattern.test(aduanero.Otros)){
                               $scope.ModalidadesProveedor.Bodegajes.Aduanero.Otros = aduanero.Otros;
                                 // $scope.$apply();

                                }
                                else
                                {
                                  var valor='Aduanero_Otros';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }

                           });


                     ////////////////////////////Bodegajes_Maquinaria ////////////////////////////////////////////
                         angular.forEach(data.Maquinaria , function(maquinaria) {
                           if( ( typeof maquinaria.Tarifa == 'undefined' ) || pattern.test(maquinaria.Tarifa)){
                            $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Tarifa = maquinaria.Tarifa;
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='Maquinaria_Tarifa';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }

                            if( ( typeof maquinaria["Tarifa Minima"] == 'undefined' ) || pattern.test(maquinaria["Tarifa Minima"])){
                                 $scope.ModalidadesProveedor.Bodegajes.Maquinaria.TarifaMinima = maquinaria["Tarifa Minima"];
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='Maquinaria Tarifa Minima';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }

                           if( (typeof maquinaria.FMM == 'undefined' ) || pattern.test(maquinaria.FMM)){
                             $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Fmm = maquinaria.FMM;
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='Maquinaria FMM';
                                 $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }

                             });

                     ////////////////////////////Bodegajes_Materia_Prima ////////////////////////////////////////////
                         angular.forEach(data.Materia_Prima , function(materiaprima) {
                          //////////////////////valida si es numerico o null ///////////////
                           if( ( typeof materiaprima.Tarifa == 'undefined' ) || pattern.test(materiaprima.Tarifa)){
                             $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Tarifa = materiaprima.Tarifa;
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='MateriaPrima_Tarifa';
                                   $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }

                           if( ( typeof materiaprima["Tarifa Minima"] == 'undefined' ) || pattern.test(materiaprima["Tarifa Minima"])){
                            $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.TarifaMinima = materiaprima["Tarifa Minima"];
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='MateriaPrima_Tarifa Minima';
                                 $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                }

                            if( ( typeof materiaprima.FMM == 'undefined' ) || pattern.test(materiaprima.FMM)){
                               $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Fmm = materiaprima.FMM;
                                  //$scope.$apply();

                                }
                                else
                                {
                                  var valor='MateriaPrima_FMM';
                                 $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                 //$scope.AbrirModal(valor);
                                }

                             });

                       if ($scope.erroresimportacion.length == 0){
                          $scope.UpdateModalidades();
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                            $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaValor = null;
                            $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaMinima = null;
                            $scope.ModalidadesProveedor.Bodegajes.Aduanero.Otros = null;
                            $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Tarifa = null;
                            $scope.ModalidadesProveedor.Bodegajes.Maquinaria.TarifaMinima = null;
                            $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Fmm = null;
                            $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Tarifa = null;
                            $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.TarifaMinima = null;
                            $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Fmm = null;
                          $scope.AbrirModal();

                          $scope.$apply();
                        }

                             //console.log($scope.data.Aduanas);
                           if (typeof data.Aduanero == 'undefined') {
                              swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                            }
                        }

                   ///////////////////Aduana ////////////////////////////////////////////
                        if($scope.ModalidadesMostrarActual=='Aduanas') {
                        var filaTarifa=1;
                         var filaMinima=1;
                         var filaGastosAdicionales=1;
                         var filaConceptosAdicionales=1;
                         var filaGastosAdicionalesdos=1;
                         var filaConceptosAdicionalesdos=1;
                         var filaGastosAdicionalestres=1;
                         var filaConceptosAdicionalestres=1;
                         var filaCostoPlanificacionCaja=1;
                         var filaOtros=1;


                           angular.forEach(data.Aduanas , function(aduana) {
                             /////////////Tarifa////////////////////////////////////
                              if ( ( typeof aduana["Tarifa % Advalorem/ FOB"] == 'undefined' ) || pattern.test(aduana["Tarifa % Advalorem/ FOB"])){
                                   filaTarifa=filaTarifa +1;
                                   //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                  // $scope.$apply();
                                }
                                else
                                {

                                filaTarifa=filaTarifa +1;
                                  var valor='Tarifa % Advalorem/ FOB';
                                  $scope.erroresimportacion.push({fila: filaTarifa, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);

                                 }
                            //////////////////Minima//////////////////////////
                             if( ( typeof aduana.Minima == 'undefined' ) || pattern.test(aduana.Minima)){
                                   filaMinima=filaMinima +1;
                                  // $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                  console.log('paso por aqui minima');
                                filaMinima=filaMinima +1;
                                  var valor='Minima';
                                  $scope.erroresimportacion.push({fila: filaMinima, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                            //////////////////GastosAdicionales//////////////////////////
                             if( ( typeof aduana["Gastos Adicionales"] == 'undefined' ) || pattern.test(aduana["Gastos Adicionales"])){
                                   filaGastosAdicionales=filaGastosAdicionales +1;
                                   //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosAdicionales=filaGastosAdicionales +1;
                                  var valor='Gastos Adicionales';
                                  $scope.erroresimportacion.push({fila: filaGastosAdicionales, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////ConceptosAdicionales//////////////////////////
                            filaConceptosAdicionales=filaConceptosAdicionales +1;
                             /*if( ( typeof aduana["Conceptos Adicionales"] == 'undefined' ) || pattern.test(aduana["Conceptos Adicionales"])){
                                   filaConceptosAdicionales=filaConceptosAdicionales +1;
                                   //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                  //$scope.$apply();
                                  }
                                else
                                {
                                filaConceptosAdicionales=filaConceptosAdicionales +1;
                                  var valor='Conceptos Adicionales';
                                  $scope.erroresimportacion.push({fila: filaConceptosAdicionales, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }*/
                        //////////////////GastosAdicionalesdos//////////////////////////
                                if( ( typeof aduana["Gastos Adicionales dos"] == 'undefined' ) || pattern.test(aduana["Gastos Adicionales dos"])){
                                  filaGastosAdicionalesdos=filaGastosAdicionalesdos +1;
                                   //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosAdicionalesdos=filaGastosAdicionalesdos +1;
                                  var valor='Gastos Adicionales dos';
                                  $scope.erroresimportacion.push({fila: filaGastosAdicionalesdos, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////ConceptosAdicionales2//////////////////////////
                            filaConceptosAdicionalesdos=filaConceptosAdicionalesdos +1;
                                /*if( ( typeof aduana["Conceptos Adicionales dos"] == 'undefined' ) || pattern.test(aduana["Conceptos Adicionales dos"])){
                                  filaConceptosAdicionalesdos=filaConceptosAdicionalesdos +1;
                                   //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaConceptosAdicionalesdos=filaConceptosAdicionalesdos +1;
                                  var valor='Conceptos Adicionales dos';
                                  $scope.erroresimportacion.push({fila: filaConceptosAdicionalesdos, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }*/
                          //////////////////GastosAdicionalestres//////////////////////////
                                if( ( typeof aduana["Gastos Adicionales tres"] == 'undefined' ) || pattern.test(aduana["Gastos Adicionales tres"])){
                                  filaGastosAdicionalestres=filaGastosAdicionalestres +1;
                                   //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosAdicionalestres=filaGastosAdicionalestres +1;
                                  var valor='Gastos Adicionales tres';
                                  $scope.erroresimportacion.push({fila: filaGastosAdicionalestres, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////ConceptosAdicionalestres//////////////////////////
                              filaConceptosAdicionalestres=filaConceptosAdicionalestres +1;
                                /*if( ( typeof aduana["Conceptos Adicionales tres"] == 'undefined' ) || pattern.test(aduana["Conceptos Adicionales tres"])){
                                  filaConceptosAdicionalestres=filaConceptosAdicionalestres +1;
                                  // $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaConceptosAdicionalestres=filaConceptosAdicionalestres +1;
                                  var valor='Conceptos Adicionales tres';
                                  $scope.erroresimportacion.push({fila: filaConceptosAdicionalestres, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }*/
                            //////////////////CostoPlanificacionCaja//////////////////////////
                                if( ( typeof aduana["Costo Planificacion Caja"] == 'undefined' ) || pattern.test(aduana["Costo Planificacion Caja"])){
                                   filaCostoPlanificacionCaja=filaCostoPlanificacionCaja +1;
                                   //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaCostoPlanificacionCaja=filaCostoPlanificacionCaja +1;
                                  var valor='Costo Planificacion Caja';
                                  $scope.erroresimportacion.push({fila: filaCostoPlanificacionCaja, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////Otros/////////////////////////////////////////
                             if( ( typeof aduana.Otros == 'undefined' ) || pattern.test(aduana.Otros)){
                                   filaOtros=filaOtros +1;
                                  //$scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaOtros=filaOtros +1;
                                  var valor='Otros';
                                  $scope.erroresimportacion.push({fila: filaOtros, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }

                        });

                       if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                          $scope.UpdateModalidades();
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                          $scope.AbrirModal();
                          $scope.$apply();
                        }


                      //console.log($scope.data.Aduanas);
                      if (typeof data.Aduanas == 'undefined') {
                        swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                      }
                }

                ///////////////////OTM ////////////////////////////////////////////
                         if($scope.ModalidadesMostrarActual=='OTM'){
                         var filacveintecuatroconcinco=1;
                         var filacveinteoocho=1;
                         var filacveintendiez=1;
                         var filacveintendiezsiete=1;
                         var filacveintendieznueve=1;
                         var filacveinteveinte=1;
                         var filacveinteveinteyuno=1;
                         var filacveinteveinteycinco=1;
                         var filaccuarentaquince=1;
                         var filaccuarentadiezyseis=1;
                         var filaccuarentadiezysiete =1;
                         var filaccuarentadiezysiete2 =1;
                         var filaccuarentaveinte=1;
                         var filaccuarentaveinteyuno=1;
                         var filaccuarentaveinteydos=1;
                         var filaccuarentatreinta=1;
                         var filadevolucionveinteestandar=1;
                         var filadevolucioncuarentaestandar=1;
                         var filadevolucionveinteexpreso=1;
                         var filadevolucioncuarentaexpreso=1;


                           angular.forEach(data.OTM , function(otm) {
                             /////////////C_20_hasta_4_5_Ton////////////////////////////////////
                             if( ( typeof otm["C 20 hasta 4-5 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 4-5 Ton"])){
                                    filacveintecuatroconcinco=filacveintecuatroconcinco +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintecuatroconcinco=filacveintecuatroconcinco +1;
                                  var valor='C 20 hasta 4-5 Ton';
                                  $scope.erroresimportacion.push({fila: filacveintecuatroconcinco, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////C_20_hasta_8_Ton//////////////////////////
                              if( ( typeof otm["C 20 hasta 8 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 8 Ton"])){
                                    filaCcveinteoocho=filacveinteoocho +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteoocho=filacveinteoocho +1;
                                  var valor='C 20 hasta 8 Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteoocho, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////cveintendiez//////////////////////////
                                if( ( typeof otm["C 20 hasta 10 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 10 Ton"])){
                                  filacveintendiez=filacveintendiez +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintendiez=filacveintendiez +1;
                                  var valor='C 20 hasta 10 Ton';
                                  $scope.erroresimportacion.push({fila: filacveintendiez, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////cveintendiezsiete//////////////////////////
                                 if( ( typeof otm["C 20 hasta 17 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 17 Ton"])){
                                  filacveintendiezsiete=filacveintendiezsiete +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintendiezsiete=filacveintendiezsiete +1;
                                  var valor='C 20 hasta 17 Ton';
                                  $scope.erroresimportacion.push({fila: filacveintendiezsiete, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                        //////////////////cveintendieznueve//////////////////////////
                                 if( ( typeof otm["C 20 hasta 19 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 19 Ton"])){
                                  filacveintendieznueve=filacveintendieznueve +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintendieznueve=filacveintendieznueve +1;
                                  var valor='C 20 hasta 19 Ton';
                                  $scope.erroresimportacion.push({fila: filacveintendieznueve, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////cveinteveinte//////////////////////////
                                 if( ( typeof otm["C 20 hasta 20 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 20 Ton"])){
                                  filacveinteveinte=filacveinteveinte +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteveinte=filacveinteveinte +1;
                                  var valor='C 20 hasta 20 Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteveinte, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                          //////////////////cveinteveinteyuno//////////////////////////
                                if( ( typeof otm["C 20 hasta 21 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 21 Ton"])){
                                  filacveinteveinteyuno=filacveinteveinteyuno +1;
                                  // $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteveinteyuno=filacveinteveinteyuno +1;
                                  var valor='C 20 hasta 21 Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteveinteyuno, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////cveinteveinteycinco//////////////////////////
                                if( ( typeof otm["C 20 hasta 25 Ton"] == 'undefined' ) || pattern.test(otm["C 20 hasta 25 Ton"])){
                                  filacveinteveinteycinco=filacveinteveinteycinco +1;
                                   //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteveinteycinco=filacveinteveinteycinco +1;
                                  var valor='C 20 hasta 25 Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteveinteycinco, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentaquince//////////////////////////
                                 if( ( typeof otm["C 40 hasta 15 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 15 Ton"])){
                                  filaccuarentaquince=filaccuarentaquince +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaquince=filaccuarentaquince +1;
                                  var valor='C 40 hasta 15 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaquince, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentadiezyseis/////////////////////////////////////////
                               if( ( typeof otm["C 40 hasta 16 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 16 Ton"])){
                                  filaccuarentadiezyseis=filaccuarentadiezyseis +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentadiezyseis=filaccuarentadiezyseis +1;
                                  var valor='C 40 hasta 16 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentadiezyseis, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                                      //////////////////ccuarentadiezysiete//////////////////////////
                                if( ( typeof otm["C 40 hasta 17 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 17 Ton"])){
                                  filaccuarentadiezysiete=filaccuarentadiezysiete +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentadiezysiete=filaccuarentadiezysiete +1;
                                  var valor='C 40 hasta 17 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentadiezysiete, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentaveinte/////////////////////////////////////////
                               if( ( typeof otm["C 40 hasta 17-18 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 17-18 Ton"])){
                                  filaccuarentadiezysiete2=filaccuarentadiezysiete2 +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentadiezysiete2=filaccuarentadiezysiete2 +1;
                                  var valor='C 40 hasta 17-18 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentadiezysiete2, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             //////////////////ccuarentaveinteyuno//////////////////////////
                               if( ( typeof otm["C 40 hasta 20 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 20 Ton"])){
                                  filaccuarentaveinte=filaccuarentaveinte +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinte=filaccuarentaveinte +1;
                                  var valor='C 40 hasta 20 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinte, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentaveinteydos/////////////////////////////////////////
                                if( ( typeof otm["C 40 hasta 21 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 21 Ton"])){
                                  filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;
                                   // $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;
                                  var valor='C 40 hasta 21 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinteyuno, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                           //////////////////ccuarentatreinta//////////////////////////
                               if( ( typeof otm["C 40 hasta 22 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 22 Ton"])){
                                  filaccuarentaveinteydos=filaccuarentaveinteydos +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinteydos=filaccuarentaveinteydos +1;
                                  var valor='C 40 hasta 22 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinteydos, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                                   //////////////////ccuarentatreinta//////////////////////////
                               if( ( typeof otm["C 40 hasta 30 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 30 Ton"])){
                                  filaccuarentatreinta=filaccuarentatreinta +1;
                                   // $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentatreinta=filaccuarentatreinta +1;
                                  var valor='C 40 hasta 30 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentatreinta, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////devolucionveinteestandar/////////////////////////////////////////
                                if( ( typeof otm["Devolucion 20$ estandar"] == 'undefined' ) || pattern.test(otm["Devolucion 20$ estandar"])){
                                    filadevolucionveinteestandar=filadevolucionveinteestandar +1;
                                   // $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filadevolucionveinteestandar=filadevolucionveinteestandar +1;
                                  var valor='Devolucion 20$ estandar';
                                  $scope.erroresimportacion.push({fila: filadevolucionveinteestandar, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                            //////////////////devolucioncuarentaestandar//////////////////////////
                                 if( ( typeof otm["Devolucion 40$ estandar"] == 'undefined' ) || pattern.test(otm["Devolucion 40$ estandar"])){
                                  filadevolucioncuarentaestandar=filadevolucioncuarentaestandar +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filadevolucioncuarentaestandar=filadevolucioncuarentaestandar +1;
                                  var valor='Devolucion 40$ estandar';
                                  $scope.erroresimportacion.push({fila: filadevolucioncuarentaestandar, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////devolucionveinteexpreso/////////////////////////////////////////
                                 if( ( typeof otm["Devolucion 20$ expreso"] == 'undefined' ) || pattern.test(otm["Devolucion 20$ expreso"])){
                                  filadevolucionveinteexpreso=filadevolucionveinteexpreso +1;
                                   // $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filadevolucionveinteexpreso=filadevolucionveinteexpreso +1;
                                  var valor='Devolucion 20$ expreso';
                                  $scope.erroresimportacion.push({fila: filadevolucionveinteexpreso, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////devolucioncuarentaexpreso/////////////////////////////////////////
                               if( ( typeof otm["Devolucion 40$ expreso"] == 'undefined' ) || pattern.test(otm["Devolucion 40$ expreso"])){
                                  filadevolucioncuarentaexpreso=filadevolucioncuarentaexpreso +1;
                                   // $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filadevolucioncuarentaexpreso=filadevolucioncuarentaexpreso +1;
                                  var valor='Devolucion 40$ expreso';
                                  $scope.erroresimportacion.push({fila: filadevolucioncuarentaexpreso, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }

                        });

                         if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                          $scope.UpdateModalidades();
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                          $scope.AbrirModal();
                          $scope.$apply();
                        }

                       if (typeof data.OTM == 'undefined') {
                       swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                      }
                     }

                 ///////////////////MaritimasFcl ////////////////////////////////////////////
                        if($scope.ModalidadesMostrarActual=='MaritimasFcl'){
                         var filaC20=1;
                         var filaBaf20=1;
                         var filaC40=1;
                         var filaBaf40=1;
                         var filaC40HC=1;
                         var filaBaf40HC=1;
                         var filaObservacionesmf=1;
                         var filaGastosEmbarquemf=1;
                         var filaTimemf=1;
                         var filaNavierafcl=1;
                         var filaFrecuenciafcl=1;

                           angular.forEach(data.MaritimasFcl , function(maritimasfcl) {
                             /////////////C20////////////////////////////////////
                               if( ( typeof maritimasfcl["C 20"] == 'undefined' ) || pattern.test(maritimasfcl["C 20"])){
                                   filaC20=filaC20 +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.C20= data.MaritimasFcl.C20;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaC20=filaC20 +1;
                                  var valor='C 20';
                                  $scope.erroresimportacion.push({fila: filaC20, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////Baf20////////////////////////////////////
                                if( ( typeof maritimasfcl["Baf 20"] == 'undefined' ) || pattern.test(maritimasfcl["Baf 20"])){
                                   filaBaf20=filaBaf20 +1;
                                  //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  // $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Baf20= data.MaritimasFcl.Baf20;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaBaf20=filaBaf20 +1;
                                  var valor='Baf 20';
                                  $scope.erroresimportacion.push({fila: filaBaf20, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                             /////////////C40////////////////////////////////////
                               if( ( typeof maritimasfcl["C 40"] == 'undefined' ) || pattern.test(maritimasfcl["C 40"])){
                                   filaC40=filaC40 +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.C40= data.MaritimasFcl.C40;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaC40=filaC40 +1;
                                  var valor='C 40';
                                  $scope.erroresimportacion.push({fila: filaC40, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                               /////////////Baf40////////////////////////////////////
                                if( ( typeof maritimasfcl["Baf 40"] == 'undefined' ) || pattern.test(maritimasfcl["Baf 40"])){
                                   filaBaf40=filaBaf40 +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Baf40= data.MaritimasFcl.Baf40;
       ;                           //$scope.$apply();
                                  }
                                else
                                {
                                filaBaf40=filaBaf40 +1;
                                  var valor='Baf 40';
                                  $scope.erroresimportacion.push({fila: filaBaf40, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                              /////////////C40HC////////////////////////////////////
                                 if( ( typeof maritimasfcl["C 40HC"] == 'undefined' ) || pattern.test(maritimasfcl["C 40HC"])){
                                   filaC40HC=filaC40HC +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.atoria_C40HC= data.MaritimasFcl.C40HC;

                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaC40HC=filaC40HC +1;
                                  var valor='C 40HC';
                                  $scope.erroresimportacion.push({fila: filaC40HC, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                               /////////////Baf40HC////////////////////////////////////
                               if( ( typeof maritimasfcl["Baf 40HC"] == 'undefined' ) || pattern.test(maritimasfcl["Baf 40HC"])){
                                   filaBaf40HC=filaBaf40HC +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.SBaf40HC= data.MaritimasFcl.Baf40HC;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaBaf40HC=filaBaf40HC +1;
                                  var valor='Baf 40HC';
                                  //$scope.erroresimportacion.push({fila: filaBaf40HC, campo:valor, error:'Valor NO numérico'});
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Observaciones= data.MaritimasFcl.Observacione;
                                  //$scope.AbrirModal(valor);
                                 }

                               /////////////Observaciones////////////////////////////////////
                                  filaObservacionesmf=filaObservacionesmf +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.$apply();

                            /////////////GastosEmbarque////////////////////////////////////
                             if( ( typeof maritimasfcl["Gastos Embarque"] == 'undefined' ) || pattern.test(maritimasfcl["Gastos Embarque"])){
                                   filaGastosEmbarquemf=filaGastosEmbarquemf +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  // $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.GastosEmbarque= data.MaritimasFcl.GastosEmbarque;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarquemf=filaGastosEmbarquemf +1;
                                  var valor='Gastos Embarque';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarquemf, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////Time////////////////////////////////////
                            console.log(maritimasfcl["Lead Time(dias)"]);
                             if( pattern.test(maritimasfcl["Lead Time(dias)"]) &&  maritimasfcl["Lead Time(dias)"] < 51 &&  maritimasfcl["Lead Time(dias)"] > 0){
                                   filaTimemf=filaTimemf +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Lead_TimeDias= data.MaritimasFcl.Lead_TimeDias;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimemf=filaTimemf +1;
                                  var valor='Lead Time(dias)';
                                  $scope.erroresimportacion.push({fila: filaTimemf, campo:valor, error:'Debe ser un número entre 1 y 50'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////Naviera////////////////////////////////////
                             filaNavierafcl=filaNavierafcl +1;
                             /*if( ( typeof maritimasfcl.Naviera == 'undefined' ) || pattern.test(maritimasfcl.Naviera)){
                                  filaNavierafcl=filaNavierafcl +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  // $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Naviera= data.MaritimasFcl.Naviera;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaNavierafcl=filaNavierafcl +1;
                                  var valor='Naviera';
                                  $scope.erroresimportacion.push({fila: filaNavierafcl, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }*/
                            /////////////FrecuenciaSemanal////////////////////////////////////
                                if(maritimasfcl["Frecuencia Semanal"]=='X') {
                                 maritimasfcl["Frecuencia Semanal"]=true;
                                  //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                  }
                                else
                                {
                                 maritimasfcl["Frecuencia Semanal"]=false;
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                 }
                             /////////////FrecuenciaQuincenal////////////////////////////////////
                                if(maritimasfcl["Frecuencia Quincenal"]=='X')  {
                                  maritimasfcl["Frecuencia Quincenal"]=true;
                                  //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                  }
                                else
                                {
                                  maritimasfcl["Frecuencia Quincenal"]=false;
                                  ////$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                }
                            /////////////FrecuenciaMensual////////////////////////////////////
                               if(maritimasfcl["Frecuencia Mensual"]=='X') {
                                 maritimasfcl["Frecuencia Mensual"]=true;
                                  //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                  }

                                else
                                {
                                  maritimasfcl["Frecuencia Mensual"]=false;
                                  //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                 }
                           /////////////SUMATORIA C20 + Baf 20 + Ge////////////////////////////////////
                                var sumatoria=0;
                                sumatoria=parseFloat(maritimasfcl["C 20"]) + parseFloat(maritimasfcl["Baf 20"]) + parseFloat(maritimasfcl["Gastos Embarque"]);
                                maritimasfcl["C 20 + Baf 20 + Gastos Embarque"] = parseFloat(sumatoria);
                                console.log(parseFloat(sumatoria));
                                //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                //$scope.$apply();
                           /////////////SUMATORIA C40 + Baf 40 + Ge////////////////////////////////////
                                var sumatoria1=0;
                                sumatoria1=parseFloat(maritimasfcl["C 40"]) + parseFloat(maritimasfcl["Baf 40"])+ parseFloat(maritimasfcl["Gastos Embarque"]);
                                maritimasfcl["C 40 + Baf 40 + Gastos Embarque"] = sumatoria1;
                                //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                //$scope.$apply();
                           /////////////SUMATORIA C40HC + Baf 40HC + Ge////////////////////////////////////
                                var sumatoria2=0;
                                sumatoria2=parseFloat(maritimasfcl["C 40HC"]) + parseFloat(maritimasfcl["Baf 40HC"]) + parseFloat(maritimasfcl["Gastos Embarque"]);
                                maritimasfcl["C 40HC + Baf 40HC + Gastos Embarque"] = sumatoria2;
                                //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                               // $scope.$apply();
                               //$scope.$apply();*/
                              });

                      if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                          $scope.UpdateModalidades(data.MaritimasFcl);
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                          $scope.AbrirModal();
                          $scope.$apply();
                        }

                      if (typeof data.MaritimasFcl == 'undefined') {
                          swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                      }
                          }

                 ///////////////////MaritimasLcl ////////////////////////////////////////////
                       if($scope.ModalidadesMostrarActual=='MaritimasLcl'){
                         var filaMinima=1;
                         var filaton15=1;
                         var filaton58=1;
                         var filaton812=1;
                         var filaton1218=1;
                         var filaObservacionesml=1;
                         var filaGastosEmbarqueml=1;
                         var filaTimeml=1;
                         var filaNavieralcl=1;
                         var filaFrecuencialcl=1;

                           angular.forEach(data.MaritimasLcl , function(maritimaslcl) {

                             /////////////C20////////////////////////////////////
                             if( ( typeof maritimaslcl.Minima == 'undefined' ) || pattern.test(maritimaslcl.Minima)){
                                   filaMinima=filaMinima +1;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaMinima=filaMinima +1;
                                  var valor='Minima';
                                  $scope.erroresimportacion.push({fila: filaMinima, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////ton15////////////////////////////////////
                                if( ( typeof maritimaslcl["1-5 ton/M3"] == 'undefined' ) || pattern.test(maritimaslcl["1-5 ton/M3"])){
                                   filaton15=filaton15 +1;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton15=filaton15 +1;
                                  var valor='1-5 ton/M3';
                                  $scope.erroresimportacion.push({fila: filaton15, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////ton58////////////////////////////////////
                               if( ( typeof maritimaslcl["5-8 ton/M3"] == 'undefined' ) || pattern.test(maritimaslcl["5-8 ton/M3"])){
                                   filaton58=filaton58 +1;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton58=filaton58 +1;
                                  var valor='5-8 ton/M3';
                                  $scope.erroresimportacion.push({fila: filaton58, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                               /////////////ton812////////////////////////////////////
                                if( ( typeof maritimaslcl["8-12 ton/M3"] == 'undefined' ) || pattern.test(maritimaslcl["8-12 ton/M3"])){
                                   filaton812=filaton812 +1;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton812=filaton812 +1;
                                  var valor='8-12 ton/M3';
                                  $scope.erroresimportacion.push({fila: filaton812, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                               /////////////ton1218////////////////////////////////////
                                if( ( typeof maritimaslcl["12-18 ton/M3"] == 'undefined' ) || pattern.test(maritimaslcl["12-18 ton/M3"])){
                                   filaton1218=filaton1218 +1;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton1218=filaton1218 +1;
                                  var valor='12-18 ton/M3';
                                  $scope.erroresimportacion.push({fila: filaton1218, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                              /////////////GastosEmbarque////////////////////////////////////
                              if( ( typeof maritimaslcl["Gastos Embarque"] == 'undefined' ) || pattern.test(maritimaslcl["Gastos Embarque"])){
                                   filaGastosEmbarqueml=filaGastosEmbarqueml +1;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarqueml=filaGastosEmbarqueml +1;
                                  var valor='Gastos Embarque';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarqueml, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                }
                               /////////////Observaciones////////////////////////////////////
                                   filaObservacionesml=filaObservacionesml +1;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();

                               /////////Time////////////////////////////////////
                                 if( pattern.test(maritimaslcl["Lead time(dias)"]) &&  maritimaslcl["Lead time(dias)"] < 51 &&  maritimaslcl["Lead time(dias)"] > 0){
                                   filaTimeml=filaTimeml +1;
                                 // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimeml=filaTimeml +1;
                                  var valor='Lead time(dias)';
                                  $scope.erroresimportacion.push({fila: filaTimeml, campo:valor, error:'Debe ser un número entre 1 y 50'});
                                  //$scope.AbrirModal(valor);
                                 }
                                   /////////////Naviera////////////////////////////////////
                                    filaNavieralcl=filaNavieralcl +1;
                               /* if( ( typeof maritimaslcl.Naviera == 'undefined' ) || pattern.test(maritimaslcl.Naviera)){
                                   filaNavieralcl=filaNavieralcl +1;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaNavieralcl=filaNavieralcl +1;
                                  var valor='Naviera';
                                  $scope.erroresimportacion.push({fila: filaNavieralcl, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }*/
                          /////////////FrecuenciaLunes////////////////////////////////////
                                if(maritimaslcl["Frecuencia Dia Lunes"]=='X') {
                                    maritimaslcl["Frecuencia Dia Lunes"]=true;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl["Frecuencia Dia Lunes"]=false;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                          /////////////FrecuenciaMartes////////////////////////////////////
                                if(maritimaslcl["Frecuencia Dia Martes"]=='X') {
                                   maritimaslcl["Frecuencia Dia Martes"]=true;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl["Frecuencia Dia Martes"]=false;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                           /////////////FrecuenciaMiercoles////////////////////////////////////
                                  if(maritimaslcl["Frecuencia Dia Miercoles"]=='X') {
                                   maritimaslcl["Frecuencia Dia Miercoles"]=true;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl["Frecuencia Dia Miercoles"]=false;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                            //////////FrecuenciaJueves////////////////////////////////////

                                  if(maritimaslcl["Frecuencia Dia Jueves"]=='X') {
                                   maritimaslcl["Frecuencia Dia Jueves"]=true;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl["Frecuencia Dia Jueves"]=false;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaViernes////////////////////////////////////
                                if(maritimaslcl["Frecuencia Dia Viernes"]=='X') {
                                   maritimaslcl["Frecuencia Dia Viernes"]=true;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                  //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl["Frecuencia Dia Viernes"]=false;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaSabado////////////////////////////////////
                                if(maritimaslcl["Frecuencia Dia Sabado"]=='X') {
                                   maritimaslcl["Frecuencia Dia Sabado"]=true;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl["Frecuencia Dia Sabado"]=false;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                             /////////////FrecuenciaDominfo////////////////////////////////////
                                   if(maritimaslcl["Frecuencia Dia Domingo"]=='X') {
                                   maritimaslcl["Frecuencia Dia Domingo"]=true;
                                   //$scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl["Frecuencia Dia Domingo"]=false;
                                  // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                            });

                      if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                          $scope.UpdateModalidades();
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                          $scope.AbrirModal();
                          $scope.$apply();
                        }


                          //console.log($scope.data.Aduanas);
                            if (typeof data.MaritimasLcl == 'undefined') {
                            swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                             }
                       }

                 ///////////////////Terrestre Nacional ////////////////////////////////////////////
                         if($scope.ModalidadesMostrarActual=='TerrestreNacional'){
                         var filaEstandarna=1;
                         var filaEspecialna=1;

                           angular.forEach(data.Terrestre_Nacional, function(terrestrenacional) {

                             /////////////Turbo_Standar_150Cajas////////////////////////////////////

                              if( ( typeof terrestrenacional["Turbo Standar (150Cajas)"] == 'undefined' ) || pattern.test(terrestrenacional["Turbo Standar (150Cajas)"])){
                                   filaEstandarna=filaEstandarna +1;
                                   //$scope.ModalidadesProveedor.TerreNacional.TerresNacional= data.Terrestre_Nacional;
                                   //console.log('Terrenacional por aqui');
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandarna=filaEstandarna +1;
                                  var valor='Turbo Standar (150Cajas)';
                                  $scope.erroresimportacion.push({fila: filaEstandarna, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////Especial////////////////////////////////////
                              if( ( typeof terrestrenacional["Turbo Especial"] == 'undefined' ) || pattern.test(terrestrenacional["Turbo Especial"])){
                                   filaEspecialna=filaEspecialna +1;
                                   //console.log('Terrenacional por aqui 2');
                                   //$scope.ModalidadesProveedor.TerreNacional.TerresNacional= data.Terrestre_Nacional;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialna=filaEspecialna +1;
                                  var valor='Turbo Especial';
                                  $scope.erroresimportacion.push({fila: filaEspecialna, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }

                        });


                   ///////////////////Terrestre Nacional Sencillo////////////////////////////////////////////
                         var filaEstandarnasen=1;
                         var filaEspecialnasen=1;

                           angular.forEach(data.Terrestre_Nacional_Sencillo, function(terrestrenacionalsencillo) {
                             /////////////Sencillo_240Cajass////////////////////////////////////
                              if( ( typeof terrestrenacionalsencillo['Sencillo Standar (150Cajas)'] == 'undefined' ) || pattern.test(terrestrenacionalsencillo['Sencillo Standar (150Cajas)'])){
                                   filaEstandarnasen=filaEstandarnasen +1;
                                   //$scope.ModalidadesProveedor.TerreNacionalSencillo.TerresNacionalSencillo= data.Terrestre_Nacional_Sencillo;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandarnasen=filaEstandarnasen +1;
                                  var valor='Sencillo Standar (150Cajas)';
                                  $scope.erroresimportacion.push({fila: filaEstandarnasen, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////Sencillo_Especial////////////////////////////////////
                              if( ( typeof terrestrenacionalsencillo["Sencillo Especial"] == 'undefined' ) || pattern.test(terrestrenacionalsencillo["Sencillo Especial"])){
                                   filaEspecialnasen=filaEspecialnasen +1;
                                   //$scope.ModalidadesProveedor.TerreNacionalSencillo.TerresNacionalSencillo= data.Terrestre_Nacional_Sencillo;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialnasen=filaEspecialnasen +1;
                                  var valor='Sencillo Especial';
                                  $scope.erroresimportacion.push({fila: filaEspecialnasen, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }

                        });

                     ///////////////////Terrestre Nacional Patineta////////////////////////////////////////////
                         var filaEstandarnapat=1;
                         var filaEspecialnapat=1;

                           angular.forEach(data.Terrestre_Nacional_Patineta, function(terrestrenacionalpatineta) {
                             /////////////Minimula////////////////////////////////////
                              if( ( typeof terrestrenacionalpatineta.Minimula == 'undefined' ) || pattern.test(terrestrenacionalpatineta.Minimula)){
                                   filaEstandarnapat=filaEstandarnapat +1;
                                   //$scope.ModalidadesProveedor.TerreNacionalPatineta.TerresNacionalPatineta= data.Terrestre_Nacional_Patineta;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandarnapat=filaEstandarnapat +1;
                                  var valor='Minimula';
                                  $scope.erroresimportacion.push({fila: filaEstandarnapat, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                             /////////////GranDanes////////////////////////////////////
                                if( ( typeof terrestrenacionalpatineta['Gran Danes'] == 'undefined' ) || pattern.test(terrestrenacionalpatineta['Gran Danes'])){
                                   filaEspecialnapat=filaEspecialnapat +1;
                                   //

                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaEspecialnapat=filaEspecialnapat +1;
                                  var valor='Gran Danes';
                                  $scope.erroresimportacion.push({fila: filaEspecialnapat, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }

                             });

                        if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.TerreNacionalSencillo.TerresNacionalSencillo= data.Terrestre_Nacional_Sencillo;
                          $scope.ModalidadesProveedor.TerreNacional.TerresNacional= data.Terrestre_Nacional;
                          $scope.ModalidadesProveedor.TerreNacionalPatineta.TerresNacionalPatineta= data.Terrestre_Nacional_Patineta;
                          $scope.UpdateModalidades();
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                          $scope.AbrirModal();
                          $scope.$apply();
                        }

                           if (typeof data.Terrestre_Nacional == 'undefined') {
                             swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                           }
                     }

               ///////////////////Terrestre Urbano ////////////////////////////////////////////
                      if($scope.ModalidadesMostrarActual=='TerrestreUrbano'){
                         var filaEstandartu=1;
                         var filaEspecialtu=1;
                         var filaEspecialtusen240=1;
                         var filaEspecialtusen300=1;
                         var filaEspecialtumini=1;
                         var filaEspecialtugran=1;


                           angular.forEach(data.Terrestre_Urbano_Dia, function(terrestreurbano) {
                             /////////////Turbo_150Cajas////////////////////////////////////
                             if( ( typeof terrestreurbano["Turbo (150Cajas)"] == 'undefined' ) || pattern.test(terrestreurbano["Turbo (150Cajas)"])){
                                   filaEstandartu=filaEstandartu +1;
                                   //$scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandartu=filaEstandartu +1;
                                  var valor='Turbo (150Cajas) Urbano Dia';
                                  $scope.erroresimportacion.push({fila: filaEstandartu, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////ETurbo_Especial_200Cajas////////////////////////////////////
                             if( ( typeof terrestreurbano["Turbo Especial (200Cajas)"] == 'undefined' ) || pattern.test(terrestreurbano["Turbo Especial (200Cajas)"])){
                                   filaEspecialtu=filaEspecialtu +1;
                                   //$scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtu=filaEspecialtu +1;
                                  var valor='Turbo Especial (200Cajas) Urbano Dia';
                                  $scope.erroresimportacion.push({fila: filaEspecialtu, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_240Cajas////////////////////////////////////
                           if( ( typeof terrestreurbano["Sencillo (240Cajas)"] == 'undefined' ) || pattern.test(terrestreurbano["Sencillo (240Cajas)"])){
                                   filaEspecialtusen240=filaEspecialtusen240 +1;
                                   //$scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.TerrestreUrbano;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen240=filaEspecialtusen240 +1;
                                  var valor='Sencillo (240Cajas) Urbano Dia';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen240, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_Especial_300Cajas////////////////////////////////////
                          if( ( typeof terrestreurbano["Sencillo Especial (300Cajas)"] == 'undefined' ) || pattern.test(terrestreurbano["Sencillo Especial (300Cajas)"])){
                                   filaEspecialtusen300=filaEspecialtusen300 +1;
                                   //$scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen300=filaEspecialtusen300 +1;
                                  var valor='Sencillo Especial (300Cajas) Urbano Dia';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen300, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////Minimula////////////////////////////////////
                             if( ( typeof terrestreurbano.Minimula == 'undefined' ) || pattern.test(terrestreurbano.Minimula)){
                                   filaEspecialtumini=filaEspecialtumini +1;
                                   //$scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.TerrestreUrbano;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtumini=filaEspecialtumini +1;
                                  var valor='Minimula Urbano Dia';
                                  $scope.erroresimportacion.push({fila: filaEspecialtumini, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////GranDanes////////////////////////////////////
                             if( ( typeof terrestreurbano["Gran Danes"] == 'undefined' ) || pattern.test(terrestreurbano["Gran Danes"])){
                                   filaEspecialtugran=filaEspecialtugran +1;
                                   //$scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                  //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtugran=filaEspecialtugran +1;
                                  var valor='Gran Danes Urbano Dia';
                                  $scope.erroresimportacion.push({fila: filaEspecialtugran, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                                 $scope.$apply();
                        });

               ///////////////////Terrestre Urbano Viaje ////////////////////////////////////////////
                         var filaEstandartuvia=1;
                         var filaEspecialtuvia=1;
                         var filaEspecialtusen240via=1;
                         var filaEspecialtusen300via=1;
                         var filaEspecialtuminivia=1;
                         var filaEspecialtugranvia=1;


                           angular.forEach(data.Terrestre_Urbano_Viaje, function(terrestreurbanoviaje) {
                             /////////////Turbo_150Cajas////////////////////////////////////
                             if( ( typeof terrestreurbanoviaje["Turbo (150Cajas)"] == 'undefined' ) || pattern.test(terrestreurbanoviaje["Turbo (150Cajas)"])){
                                   filaEstandartuvia=filaEstandartuvia +1;
                                  //$scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandartuvia=filaEstandartuvia +1;
                                  var valor='Turbo (150Cajas) Urbano Viaje';
                                  $scope.erroresimportacion.push({fila: filaEstandartuvia, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////ETurbo_Especial_200Cajas////////////////////////////////////
                               if( ( typeof terrestreurbanoviaje["Turbo Especial (200Cajas)"] == 'undefined' ) || pattern.test(terrestreurbanoviaje["Turbo Especial (200Cajas)"])){
                                   filaEspecialtuvia=filaEspecialtuvia +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtuvia=filaEspecialtuvia +1;
                                  var valor='Turbo Especial (200Cajas) Urbano Viaje';
                                  $scope.erroresimportacion.push({fila: filaEspecialtuvia, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_240Cajas////////////////////////////////////
                          if( ( typeof terrestreurbanoviaje["Sencillo (240Cajas)"] == 'undefined' ) || pattern.test(terrestreurbanoviaje["Sencillo (240Cajas)"])){
                                   filaEspecialtusen240via=filaEspecialtusen240via +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen240via=filaEspecialtusen240via +1;
                                  var valor='Sencillo (240Cajas) Urbano Viaje';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen240via, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_Especial_300Cajas////////////////////////////////////
                          if( ( typeof terrestreurbanoviaje["Sencillo Especial (300Cajas)"] == 'undefined' ) || pattern.test(terrestreurbanoviaje["Sencillo Especial (300Cajas)"])){
                                   filaEspecialtusen300via=filaEspecialtusen300via +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen300via=filaEspecialtusen300via +1;
                                  var valor='Sencillo Especial (300Cajas) Urbano Viaje';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen300via, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////Minimula////////////////////////////////////
                            if( ( typeof terrestreurbanoviaje.Minimula == 'undefined' ) || pattern.test(terrestreurbanoviaje.Minimula)){
                                   filaEspecialtuminivia=filaEspecialtuminivia +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtuminivia=filaEspecialtuminivia +1;
                                  var valor='Minimula Urbano Viaje';
                                  $scope.erroresimportacion.push({fila: filaEspecialtuminivia, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////GranDanes////////////////////////////////////
                            if( ( typeof terrestreurbanoviaje["Gran Danes"] == 'undefined' ) || pattern.test(terrestreurbanoviaje["Gran Danes"])){
                                   filaEspecialtugranvia=filaEspecialtugranvia +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtugranvia=filaEspecialtugranvia +1;
                                  var valor='Gran Danes';
                                  $scope.erroresimportacion.push({fila: filaEspecialtugranvia, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }

                        });

               ///////////////////Terrestre Urbano Tonelada ////////////////////////////////////////////
                         var filaEstandartuviatone=1;
                         var filaEspecialtuviatone=1;
                         var filaEspecialtuviasentone=1;
                         var filaEspecialtusen300viatone=1;
                         var filaEspecialtuminiviatone=1;
                         var filaEspecialtugranviatone=1;
                         var filaEspecialtutracto=1;


                           angular.forEach(data.Terrestre_Urbano_Tonelada, function(terrestreurbanotonelada) {
                             /////////////Turbo////////////////////////////////////
                               if( ( typeof terrestreurbanotonelada.Turbo == 'undefined' ) || pattern.test(terrestreurbanotonelada.Turbo)){
                                   filaEstandartuviatone=filaEstandartuviatone +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada= data.Terrestre_Urbano_Tonelada;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandartuviatone=filaEstandartuviatone +1;
                                  var valor='Turbo Urbano Tonelada';
                                  $scope.erroresimportacion.push({fila: filaEstandartuviatone, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////Sencillo////////////////////////////////////
                              if( ( typeof terrestreurbanotonelada.Sencillo == 'undefined' ) || pattern.test(terrestreurbanotonelada.Sencillo)){
                                   filaEspecialtuviasentone=filaEspecialtuviasentone +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada= data.Terrestre_Urbano_Tonelada;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtuviasentone=filaEspecialtuviasentone +1;
                                  var valor='Sencillo Urbano Tonelada';
                                  $scope.erroresimportacion.push({fila: filaEspecialtuviasentone, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                          /////////////Tractomula////////////////////////////////////
                           if( ( typeof terrestreurbanotonelada.Tractomula == 'undefined' ) || pattern.test(terrestreurbanotonelada.Tractomula)){
                                   filaEspecialtutracto=filaEspecialtutracto +1;
                                   //$scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada= data.Terrestre_Urbano_Tonelada;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtutracto=filaEspecialtutracto +1;
                                  var valor='Tractomula Urbano Tonelada';
                                  $scope.erroresimportacion.push({fila: filaEspecialtutracto, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }

                             });


                        if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                          $scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                          $scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada= data.Terrestre_Urbano_Tonelada;
                          $scope.UpdateModalidades();
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                          $scope.AbrirModal();
                          $scope.$apply();
                        }

                              //console.log($scope.data.Aduanas);
                        if (typeof data.Terrestre_Urbano_Dia == 'undefined') {
                          swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                      }
                         }

                 ///////////////////Aereas Carguero////////////////////////////////////////////
                        if($scope.ModalidadesMostrarActual=='Aereas'){
                         var filaMinimaca=1;
                         var filaaerea45=1;
                         var filaaerea100=1;
                         var filaaerea300=1;
                         var filaaerea500=1;
                         var filaaerea1000=1;
                         var filaFSmin=1;
                         var filaFskg=1;
                         var filaGastosEmbarqueca=1;
                         var filaObservacionesca=1;
                         var filaTimeca=1;
                         var filaVia=1;
                         var filaFrecuenciaac=1;

                           angular.forEach(data.Aerea_Carguero, function(aereacarguero) {
                             /////////////Minima////////////////////////////////////
                              if( ( typeof aereacarguero.Minima == 'undefined' ) || pattern.test(aereacarguero.Minima)){
                                  filaMinimaca=filaMinimaca +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaMinimaca=filaMinimaca +1;
                                  var valor='Minima_Carguero';
                                  $scope.erroresimportacion.push({fila: filaMinimaca, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                             /////////////aerea45////////////////////////////////////
                              if( ( typeof aereacarguero["45"] == 'undefined' ) || pattern.test(aereacarguero["45"])){
                                  filaaerea45=filaaerea45 +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea45=filaaerea45 +1;
                                  var valor='45_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea45, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////aerea100////////////////////////////////////
                            if( ( typeof aereacarguero["+100"] == 'undefined' ) || pattern.test(aereacarguero["+100"])){
                                 filaaerea100=filaaerea100 +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea100=filaaerea100 +1;
                                  var valor='+100_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea100, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                               /////////////aerea300////////////////////////////////////
                                if( ( typeof aereacarguero["+300"] == 'undefined' ) || pattern.test(aereacarguero["+300"])){
                                   filaaerea300=filaaerea300 +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea300=filaaerea300 +1;
                                  var valor='+300_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea300, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                           /////////////aerea500////////////////////////////////////
                                if( ( typeof aereacarguero["+500"] == 'undefined' ) || pattern.test(aereacarguero["+500"])){
                                   filaaerea500=filaaerea500 +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaaerea500=filaaerea500 +1;
                                  var valor='+500_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea500, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////aerea1000////////////////////////////////////
                                if( ( typeof aereacarguero["+1000"] == 'undefined' ) || pattern.test(aereacarguero["+1000"])){
                                   filaaerea1000=filaaerea1000 +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea1000=filaaerea1000 +1;
                                  var valor='+1000_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea1000, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////FSmin////////////////////////////////////
                             if( ( typeof aereacarguero["FS min"] == 'undefined' ) || pattern.test(aereacarguero["FS min"])){
                                  filaFSmin=filaFSmin +1;
                                 //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaFSmin=filaFSmin +1;
                                  var valor='FS min_Carguero';
                                  $scope.erroresimportacion.push({fila: filaFSmin, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                                       /////////////Fskg////////////////////////////////////
                                if( ( typeof aereacarguero["Fs/kg"] == 'undefined' ) || pattern.test(aereacarguero["Fs/kg"])){
                                  filaFskg=filaFskg +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaFskg=filaFskg +1;
                                  var valor='Fs/kg_Carguero';
                                  $scope.erroresimportacion.push({fila: filaFskg, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////GastosEmbarque////////////////////////////////////
                            if( ( typeof aereacarguero["Gastos Embarque"] == 'undefined' ) || pattern.test(aereacarguero["Gastos Embarque"])){
                                  filaGastosEmbarqueca=filaGastosEmbarqueca +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarqueca=filaGastosEmbarqueca +1;
                                  var valor='Gastos Embarque_Carguero';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarqueca, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                              /////////////Observaciones////////////////////////////////////
                                  filaObservacionesca=filaObservacionesca +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();

                             /////////////Time////////////////////////////////////
                              if( pattern.test(aereacarguero["Lead Time (dias)"]) && aereacarguero["Lead Time (dias)"] < 51 && aereacarguero["Lead Time (dias)"] > 0 ){
                                  filaTimeca=filaTimeca +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimeca=filaTimeca +1;
                                  var valor='Lead Time (dias)_Carguero';
                                  $scope.erroresimportacion.push({fila: filaTimeca, campo:valor, error:'Debe ser un número entre 1 y 50'});
                                 // $scope.AbrirModal(valor);
                                 }
                            /////////////Naviera////////////////////////////////////
                            filaVia=filaVia +1;
                            /*if( ( typeof aereacarguero.Naviera == 'undefined' ) || pattern.test(aereacarguero.Naviera)){
                                  filaVia=filaVia +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaVia=filaVia +1;
                                  var valor='Via_Carguero';
                                  $scope.erroresimportacion.push({fila: filaVia, campo:naviera, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }*/
                          /////////////FrecuenciaLunes////////////////////////////////////
                                  if(aereacarguero["Frecuencia Dia Lunes"]=='X') {
                                   aereacarguero["Frecuencia Dia Lunes"]=true;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero["Frecuencia Dia Lunes"]=false;
                                  // $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }
                          /////////////FrecuenciaMartes////////////////////////////////////
                                if(aereacarguero["Frecuencia Dia Martes"]=='X') {
                                   aereacarguero["Frecuencia Dia Martes"]=true;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero["Frecuencia Dia Martes"]=false;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  // $scope.$apply();
                                 }
                           /////////////FrecuenciaMiercoles////////////////////////////////////
                                 if(aereacarguero["Frecuencia Dia Miercoles"]=='X') {
                                   aereacarguero["Frecuencia Dia Miercoles"]=true;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero["Frecuencia Dia Miercoles"]=false;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                            //////////FrecuenciaJueves////////////////////////////////////
                               if(aereacarguero["Frecuencia Dia Jueves"]=='X') {
                                   aereacarguero["Frecuencia Dia Jueves"]=true;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero["Frecuencia Dia Jueves"]=false;
                                  // $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaViernes////////////////////////////////////
                                if(aereacarguero["Frecuencia Dia Viernes"]=='X') {
                                   aereacarguero["Frecuencia Dia Viernes"]=true;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero["Frecuencia Dia Viernes"]=false;
                                  // $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaSabado////////////////////////////////////
                                 if(aereacarguero["Frecuencia Dia Sabado"]=='X') {
                                   aereacarguero["Frecuencia Dia Sabado"]=true;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero["Frecuencia Dia Sabado"]=false;
                                   //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                             /////////////FrecuenciaDominfo////////////////////////////////////
                                if(aereacarguero["Frecuencia Dia Domingo"]=='X') {
                                   aereacarguero["Frecuencia Dia Domingo"]=true;
                                  // $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero["Frecuencia Dia Domingo"]=false;
                                  // $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  // $scope.$apply();
                                 }
                           /////////////Sumatoria_T100_FS_Ge////////////////////////////////////
                                var sumatoria=0;
                                sumatoria=parseFloat(aereacarguero["+100"]) + parseFloat(aereacarguero["Fs/kg"]) + parseFloat(aereacarguero["Gastos Embarque"]);
                                aereacarguero["+100 + Fs/kg + Gastos Embarque"] = sumatoria;
                                //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                           /////////////Sumatoria_T300_FS_Ge////////////////////////////////////
                                var sumatoria1=0;
                                sumatoria1=parseFloat(aereacarguero["+300"]) + parseFloat(aereacarguero["Fs/kg"]) + parseFloat(aereacarguero["Gastos Embarque"]);
                                aereacarguero["+300 + Fs/kg + Gastos Embarque"] = sumatoria1;
                                //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                           /////////////Sumatoria_T500_FS_Ge////////////////////////////////////
                                var sumatoria2=0;
                                sumatoria2=parseFloat(aereacarguero["+500"]) + parseFloat(aereacarguero["Fs/kg"]) + parseFloat(aereacarguero["Gastos Embarque"]);
                                aereacarguero["+500 + Fs/kg + Gastos Embarque"] = sumatoria2;
                                //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                            /////////////Sumatoria_T1000_FS_Ge////////////////////////////////////
                                var sumatoria3=0;
                                sumatoria3=parseFloat(aereacarguero["+1000"]) + parseFloat(aereacarguero["Fs/kg"]) + parseFloat(aereacarguero["Gastos Embarque"]);
                                aereacarguero["+1000 + Fs/kg + Gastos Embarque"] = sumatoria3;
                                //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                               // $scope.$apply();

                        });

                 ///////////////////Aereas Pasajero////////////////////////////////////////////
                         var filaMinimapa=1;
                         var filaaerea45=1;
                         var filaaerea100=1;
                         var filaaerea300=1;
                         var filaaerea500=1;
                         var filaaerea1000=1;
                         var filaFSmin=1;
                         var filaFskg=1;
                         var filaGastosEmbarquepa=1;
                         var filaObservacionespa=1;
                         var filaTimepa=1;
                         var filaVia=1;
                         var filaFrecuenciaaap=1;

                           angular.forEach(data.Aerea_Pasajero, function(aereapasajero) {
                             /////////////Minima////////////////////////////////////
                             if( ( typeof aereapasajero.Minima == 'undefined' ) || pattern.test(aereapasajero.Minima)){
                                  filaMinimapa=filaMinimapa +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaMinimapa=filaMinimapa +1;
                                  var valor='Minima_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaMinimapa, campo:valor, error:'Valor NO numérico'});
                                  7/$scope.AbrirModal(valor);
                                 }
                             /////////////aerea45////////////////////////////////////
                             if( ( typeof aereapasajero["45"] == 'undefined' ) || pattern.test(aereapasajero["45"])){
                                  filaaerea45=filaaerea45 +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea45=filaaerea45 +1;
                                  var valor='45 Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea45, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////aerea100////////////////////////////////////
                            if( ( typeof aereapasajero["+100"] == 'undefined' ) || pattern.test(aereapasajero["+100"])){
                                  filaaerea100=filaaerea100 +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_100= data.Aerea_Pasajero.T_100;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea100=filaaerea100 +1;
                                  var valor='+100_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea100, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                               /////////////aerea300////////////////////////////////////
                                 if( ( typeof aereapasajero["+300"] == 'undefined' ) || pattern.test(aereapasajero["+300"])){
                                   filaaerea300=filaaerea300 +1;
                                 // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_300= data.Aerea_Pasajero.T_300;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea300=filaaerea300 +1;
                                  var valor='+300 Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea300, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
                           /////////////aerea500////////////////////////////////////
                                 if( ( typeof aereapasajero["+500"] == 'undefined' ) || pattern.test(aereapasajero["+500"])){
                                   filaaerea500=filaaerea500 +1;
                                 // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_500= data.Aerea_Pasajero.T_500;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea500=filaaerea500 +1;
                                  var valor='+500 Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea500, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////aerea1000////////////////////////////////////
                                 if( ( typeof aereapasajero["+1000"] == 'undefined' ) || pattern.test(aereapasajero["+1000"])){
                                   filaaerea1000=filaaerea1000 +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_1000= data.Aerea_Pasajero.T_1000;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea1000=filaaerea1000 +1;
                                  var valor='+1000 Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea1000, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             /////////////FSmin////////////////////////////////////
                              if( ( typeof aereapasajero["FS min"] == 'undefined' ) || pattern.test(aereapasajero["FS min"])){
                                  filaFSmin=filaFSmin +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaFSmin=filaFSmin +1;
                                  var valor='FS min_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaFSmin, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                                       /////////////Fskg////////////////////////////////////
                                if( ( typeof aereapasajero["Fs/kg"] == 'undefined' ) || pattern.test(aereapasajero["Fs/kg"])){
                                 filaFskg=filaFskg +1;
                                 //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaFskg=filaFskg +1;
                                  var valor='Fs/kg_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaFskg, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            /////////////GastosEmbarque////////////////////////////////////
                            if( ( typeof aereapasajero["Gastos Embarque"] == 'undefined' ) || pattern.test(aereapasajero["Gastos Embarque"])){
                                 filaGastosEmbarquepa=filaGastosEmbarquepa +1;
                                 //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarquepa=filaGastosEmbarquepa +1;
                                  var valor='Gastos Embarque_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarquepa, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                              /////////////Observaciones////////////////////////////////////
                                  filaObservacionespa=filaObservacionespa +1;
                                 // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();

                            /////////////Time////////////////////////////////////
                            if( pattern.test(aereapasajero["Lead time (dias)"]) && aereapasajero["Lead time (dias)"] < 51 && aereapasajero["Lead time (dias)"] > 0){
                                  filaTimepa=filaTimepa +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimepa=filaTimepa +1;
                                  var valor='Lead Time (dias)_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaTimepa, campo:valor, error:'Debe ser un número entre 1 y 50'});
                                 // $scope.AbrirModal(valor);
                                 }
                            /////////////Naviera////////////////////////////////////
                            filaVia=filaVia +1;
                            
                            /*if( ( typeof aereapasajero.Naviera == 'undefined' ) || pattern.test(aereapasajero.Naviera)){
                                  filaTimeca=filaVia +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaVia=filaVia +1;
                                  var valor='Via_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaVia, campo:naviera, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }*/
                           /////////////FrecuenciaLunes////////////////////////////////////
                                 if(aereapasajero["Frecuencia Dia Lunes"]=='X') {
                                   aereapasajero["Frecuencia Dia Lunes"]=true;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero["Frecuencia Dia Lunes"]=false;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                          /////////////FrecuenciaMartes////////////////////////////////////
                               if(aereapasajero["Frecuencia Dia Martes"]=='X') {
                                   aereapasajero["Frecuencia Dia Martes"]=true;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero["Frecuencia Dia Martes"]=false;
                                   //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                           /////////////FrecuenciaMiercoles////////////////////////////////////
                                 if(aereapasajero["Frecuencia Dia Miercoles"]=='X') {
                                   aereapasajero["Frecuencia Dia Miercoles"]=true;
                                   //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero["Frecuencia Dia Miercoles"]=false;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }
                            //////////FrecuenciaJueves////////////////////////////////////

                                 if(aereapasajero["Frecuencia Dia Jueves"]=='X') {
                                   aereapasajero["Frecuencia Dia Jueves"]=true;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero["Frecuencia Dia Jueves"]=false;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaViernes////////////////////////////////////
                                 if(aereapasajero["Frecuencia Dia Viernes"]=='X') {
                                   aereapasajero["Frecuencia Dia Viernes"]=true;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero["Frecuencia Dia Viernes"]=false;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaSabado////////////////////////////////////
                                  if(aereapasajero["Frecuencia Dia Sabado"]=='X') {
                                   aereapasajero["Frecuencia Dia Sabado"]=true;
                                   //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero["Frecuencia Dia Sabado"]=false;
                                   //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                             /////////////FrecuenciaDomingo////////////////////////////////////
                                if(aereapasajero["Frecuencia Dia Domingo"]=='X') {
                                   aereapasajero["Frecuencia Dia Domingo"]=true;
                                   //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero["Frecuencia Dia Domingo"]=false;
                                  // $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }
                           /////////////Sumatoria_T100_FS_Ge////////////////////////////////////
                               var sumatoriap=0;
                                sumatoriap=parseFloat(aereapasajero["+100"]) + parseFloat(aereapasajero["Fs/kg"]) + parseFloat(aereapasajero["Gastos Embarque"]);
                                aereapasajero["+100 + Fs/kg"] = sumatoriap;
                                //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                           /////////////Sumatoria_T300_FS_Ge////////////////////////////////////
                                var sumatoria1p=0;
                                sumatoria1p=parseFloat(aereapasajero["+300"]) + parseFloat(aereapasajero["Fs/kg"]) + parseFloat(aereapasajero["Gastos Embarque"]);
                                aereapasajero["+300 + Fs/kg"] = sumatoria1p;
                                //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                           /////////////Sumatoria_T500_FS_Ge////////////////////////////////////
                                var sumatoria2p=0;
                                sumatoria2p=parseFloat(aereapasajero["+500"]) + parseFloat(aereapasajero["Fs/kg"]) + parseFloat(aereapasajero["Gastos Embarque"]);
                                aereapasajero["+500 + Fs/kg"] = sumatoria2p;
                               //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                            /////////////Sumatoria_T1000_FS_Ge////////////////////////////////////
                                var sumatoria3p=0;
                               sumatoria3p=parseFloat(aereapasajero["+1000"]) + parseFloat(aereapasajero["Fs/kg"]) + parseFloat(aereapasajero["Gastos Embarque"]);
                                aereapasajero["+1000 + Fs/kg"] = sumatoria3p;
                                //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                        });

                      if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                          $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                          $scope.UpdateModalidades(data.Aerea_Carguero);
                          $scope.UpdateModalidades(data.Aerea_Pasajero);
                          swal("Licitaciones Proenfar", "Finalizó la carga de datos.");
                          $scope.$apply();
                        }
                       else
                        {
                          $scope.AbrirModal();
                          $scope.$apply();
                        }
                          //console.log($scope.data.Aduanas);
                            if (typeof data.Aerea_Carguero == 'undefined') {
                              swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                            }

                  }

                       /* if($scope.erroresimportacion.length=0){
                          $scope.GetModalidadesProveedor();
                        }*/


                        $loading.finish('myloading');
                          };


                        $scope.error = function (e) {
                          console.log(e);
                        }

                         $scope.AbrirModal = function(){
                          $loading.start('myloading');
                          // Julio 20171218 Lo comenté, si va a mostrar la modal de errores creo que no tiene sentido llamar añ servidor
                          // para buscar éstos datos
                          // $scope.GetModalidadesProveedor();
                          //if ($scope.erroresimportacion.length > 0){
                            $('#error-importacion-excel').modal('show');
                            return 0;
                          //}
                            $loading.finish('myloading');
                          }

                          


                          

                           $scope.FinalizarModalidad = function (Email){  
                             swal({
                                 title: "Seguro de finalizar el proceso para la modalidad: " + $scope.ModalidadesMostrarActual + "?",
                                 text: "",
                                 type: "warning",
                                 showCancelButton: true,
                                 confirmButtonColor: "#DD6B55",
                                 confirmButtonText: "Aceptar",
                                 closeOnConfirm: true
                             },
                             function () {
                               $scope.UpdateData = true;
                               UpdateModalidadesTime();

                               var Data = {};
                               Data.Email = localStorage.UserConnected;
                               Data.Modalidad = $scope.ModalidadesMostrarActual;

                               $loading.start('myloading');

                                $http({
                                 method: 'POST',
                                 url: '/GetFinalizarModalidades',
                                 headers: { 'Content-Type': 'application/json' },
                                 data: Data
                             }).then(function successCallback(response) {
                                 $scope.Estatusproveedor();
                                 $loading.finish('myloading');
                                }, function errorCallback(response) {
                                 console.log(response);
                             });

                             });

                        }

                           $scope.FinalizarModalidadTodas = function (Email){

                          swal({
                              title: "Seguro de finalizar el proceso para todas las modalidades?",
                              text: "",
                              type: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#DD6B55",
                              confirmButtonText: "Aceptar",
                              closeOnConfirm: true
                          },
                          function () {
                               $scope.UpdateData = true;
                               UpdateModalidadesTime();

                             var bBodegajes = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'Bodegajes', Cerrado: true, Diligenciada: false };
                             var bAduanas = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'Aduanas', Cerrado: true, Diligenciada: false  };
                             var bOtms = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'OTM', Cerrado: true, Diligenciada: false  };
                             var bMaritimasFcl = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'MaritimasFcl', Cerrado: true, Diligenciada: false  };
                             var bMaritimasLcl = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'MaritimasLcl', Cerrado: true, Diligenciada: false  };
                             var bTerrestreNacional = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'TerrestreNacional', Cerrado: true, Diligenciada: false  };
                             var bTerrestreUrbano = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'TerrestreUrbano', Cerrado: true, Diligenciada: false  };
                             var bAereas = { Email: localStorage.UserConnected, Bloqueado: true, Modalidad: 'Aereas', Cerrado: true, Diligenciada: false  };

                            // Al finalizar todas las modalidades coloca cero en los campos donde esté null y en blanco
                            // de todas las modalidades. Adicional la función verifica en las modalidades si hubo inserción de datos
                            // para ponerlo como diligenciadas
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.Aduana.Aduanas, bAduanas);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.Aerea.Aereas, bAereas);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros, bAereas);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.Bodegajes.Aduanero, bBodegajes);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.Bodegajes.Maquinaria, bBodegajes);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.Bodegajes.MateriaPrima, bBodegajes);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl, bMaritimasFcl);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl, bMaritimasLcl);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.Otm.Otms, bOtms);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.TerreNacional.TerresNacional, bTerrestreNacional);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.TerreNacionalPatineta.TerresNacionalPatineta, bTerrestreNacional);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.TerreNacionalSencillo.TerresNacionalSencillo, bTerrestreNacional);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.TerreUrbano.TerresUrbano, bTerrestreUrbano);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada, bTerrestreUrbano);
                            $scope.SetZeroInNull($scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje, bTerrestreUrbano);
                            // Guarda Modalidades (OJO se debe mejorar ya que llama a guardar asíncrono y no se asehura)
                            $scope.UpdateModalidadeslicitaciontodas();

                            // Objeto de bloqueo
                            var lockObject = [];
                            lockObject.push(bBodegajes);
                            lockObject.push(bAduanas);
                            lockObject.push(bOtms);
                            lockObject.push(bMaritimasFcl);
                            lockObject.push(bMaritimasLcl);
                            lockObject.push(bTerrestreNacional);
                            lockObject.push(bTerrestreUrbano);
                            lockObject.push(bAereas);


                            var Data = {};
                            Data.Email = localStorage.UserConnected;
                            Data.lockObject = lockObject;
                            console.log(lockObject);
                            
                            $loading.start('myloading');

                             $http({
                              method: 'POST',
                              url: '/GetFinalizarModalidadesTodas',
                              headers: { 'Content-Type': 'application/json' },
                              data: Data
                          }).then(function successCallback(response) {

                             if (response.data.Result == 'nofiles'){
                               $loading.finish('myloading');
                               swal("Licitaciones Proenfar", "No puede cerrar la licitación por que no ha cargado archivos necesarios para licitar.");
                               return 0
                             }
                             else
                             {
                              $scope.Estatusproveedortodas=true;
                             }

                              $scope.Estatusproveedor();
                              $loading.finish('myloading');
                             }, function errorCallback(response) {
                              console.log(response);
                          });

                          });

                     }

                         $scope.Estatusproveedor = function(){
                             var Data = {};
                            Data.Email = localStorage.UserConnected;
                            Data.Modalidad = $scope.ModalidadesMostrarActual;

                            $loading.start('myloading');

                             $http({
                              method: 'POST',
                              url: '/GetEstatusproveedor',
                              headers: { 'Content-Type': 'application/json' },
                              data: Data
                          }).then(function successCallback(response) {
                              $loading.finish('myloading');
                              if (typeof response.data.LicitacionProveedor == 'undefined'){
                                  $scope.EstatusproveedorModalidad = false;
                              }
                              else{
                                $scope.EstatusproveedorModalidad = response.data.LicitacionProveedor.Bloqueado;                          
                              }
                          }, function errorCallback(response) {
                              console.log(response);
                          });
                        }

                        //  Ésta función recibe un array recorre rodos los objetos del array y a cada propiedad
                        // del objeto coloca cero por null -menos a las propiedades que se llamen
                        // $$hashKey ó _id
                            $scope.SetZeroInNull = function (object, lockobject) {
                            var intFila = 0;
                          // Si es un array chequea cada fila, si es un objeto cada campo
                            if (Array.isArray(object)){
                            // Cada fila del array
                              object.forEach(function(fila) {
                              // Cada campo del objeto
                              var Encabezados = Object.keys(fila);
                              Encabezados.forEach(function(campo) {
                                if (campo != '_id' && campo != '$$hashKey')
                                  if (!fila[campo]){
                                    object[intFila][campo] = 0;
                                  }
                                  else{
                                    if(campo != 'Via' && campo != 'Aeropuerto' && campo != 'Pais' && campo != 'PaisDestino' && campo != 'PuertoOrigen' && campo != 'PuertoDestino' && campo != 'PaisDestino' && campo != 'Origen' && campo != 'Destino' && campo != 'PaisOrigen'){
                                      lockobject.Diligenciada = true;
                                    }
                                  }
                              });
                              intFila++
                            });
                          }
                          else{
                            var Encabezados = Object.keys(object);
                            Encabezados.forEach(function(campo) {
                              if (campo != '_id' && campo != '$$hashKey')
                                if (!object[campo]){
                                  object[campo] = 0;
                                }
                                else{
                                  if(campo != 'Via' && campo != 'Aeropuerto' && campo != 'Pais' && campo != 'PaisDestino' && campo != 'PuertoOrigen' && campo != 'PuertoDestino' && campo != 'PaisDestino' && campo != 'Origen' && campo != 'Destino' && campo != 'PaisOrigen'){
                                    lockobject.Diligenciada = true;
                                  }
                                }
                            });
                          }
                        }

                        // Ejecutará el guardar modalidades cada 5 segundos
                        $interval(UpdateModalidadesTime, 5000);

                         function UpdateModalidadesTime() {
                            console.log("paso por aqui updatemodalidad2");
                          if ($scope.UpdateData == false) {return 0}
                          $scope.UpdateData = false;
                         var Data = {};       // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree

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


                        // Actualiza las modalidades para éste proveedores
                      $scope.UpdateModalidades = function (Modali) {
                        console.log("paso por aqui updatemodalidad1");

                        if ($scope.ModalidadesMostrarActual=='MaritimasFcl'){  
                        //console.log(parseFloat(Modali["C 20"]));                    
                            if (Modali["C 20"]=='' || Modali["C 20"]=='undefined') {Modali["C 20"]=parseFloat(0);}
                            if (Modali["C 40"]=='') {Modali["C 40"]=parseFloat(0);}
                            if (Modali["Baf 20"]=='' ) {Modali["Baf 20"]=parseFloat(0);}
                            if (Modali["Baf 40"]=='') {Modali["Baf 40"]=parseFloat(0);}
                            if (Modali["C 40HC"]=='') {Modali["C 40HC"]=parseFloat(0);}
                            if (Modali["Baf 40HC"]=='') {Modali["Baf 40HC"]=parseFloat(0);}
                            if (Modali["Gastos Embarque"]=='') {Modali["Gastos Embarque"]=parseFloat(0);}

                           Modali["C 20 +Baf 20 + Gastos Embarque"]= parseFloat(Modali["C 20"]) + parseFloat(Modali["Baf 20"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["C 40 + Baf 40 + Gastos Embarque"]= parseFloat(Modali["C 40"]) + parseFloat(Modali["Baf 40"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["C 40HC + Baf 40HC + Gastos Embarque"]= parseFloat(Modali["C 40HC"]) + parseFloat(Modali["Baf 40HC"]) + parseFloat(Modali["Gastos Embarque"]);
                           //console.log(parseFloat(Modali["C 20"]) + parseFloat(Modali["Baf 20"]) + parseFloat(Modali["Gastos Embarque"])); 
                         }

                          if ($scope.ModalidadesMostrarActual=='Aereas'){ 
                            if (Modali["+100"]=='') {Modali["+100"]=parseFloat(0);}
                            if (Modali["+300"]=='') {Modali["+300"]=parseFloat(0);}
                            if (Modali["+500"]=='') {Modali["+500"]=parseFloat(0);}
                            if (Modali["+1000"]=='') {Modali["+1000"]=parseFloat(0);}
                            if (Modali["Fs/kg"]=='') {Modali["Fs/kg"]=parseFloat(0);}
                            if (Modali["Gastos Embarque"]=='') {Modali["Gastos Embarque"]=parseFloat(0);}
                           
                           
                           Modali["+100 + Fs/kg + Gastos Embarque"]= parseFloat(Modali["+100"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["+300 + Fs/kg + Gastos Embarque"]= parseFloat(Modali["+300"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["+500 + Fs/kg + Gastos Embarque"]= parseFloat(Modali["+500"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["+1000 + Fs/kg"]= parseFloat(Modali["+1000"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);                          
                           Modali["+100 + Fs/kg"]= parseFloat(Modali["+100"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["+300 + Fs/kg"]= parseFloat(Modali["+300"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["+500 + Fs/kg"]= parseFloat(Modali["+500"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);
                           Modali["+1000 + Fs/kg"]= parseFloat(Modali["+1000"]) + parseFloat(Modali["Fs/kg"]) + parseFloat(Modali["Gastos Embarque"]);                          
                         
                           } 
                      
                      
                        $scope.UpdateData = true;

                                               //  var Data = {};
                        
                       // // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
                       //
                       //  Data.ModalidadesProveedor = $scope.ModalidadesProveedor;
                       //
                       //
                       //
                       //  $http({
                       //      method: 'POST',
                       //      url: '/UpdateModalidadesProveedor',
                       //      headers: { 'Content-Type': 'application/json' },
                       //      data: Data
                       //  }).then(function successCallback(response) {
                       //      console.log('La data fue actualizada');
                       //  }, function errorCallback(response) {
                       //      console.log(response);
                       //  });
                      }

                          /*var Data = {};
                         // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree

                          // Actualiza las modalidades para éste proveedores
                        $scope.UpdateModalidades = function () {
                          $scope.UpdateData = true;
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
                          });*/

                          $scope.UpdateModalidadeslicitaciontodas = function() {
                             $scope.UpdateData = true;
                          }

                        // Obtiene los valores de modalidades para éste proveedor
                        $scope.GetModalidadesProveedor = function () {
                          var Data = {};
                          $loading.start('myloading');
                          // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
                          Data.Email = localStorage.UserConnected; //localStorage.UserConnected;
                          $http({
                              method: 'POST',
                              url: '/GetModalidadesProveedor',
                              headers: { 'Content-Type': 'application/json' },
                              data: Data
                          }).then(function successCallback(response) {
                              $loading.finish('myloading');
                              $scope.ModalidadesProveedor = response.data.ModalidadesProveedor;

                              // Preguntas y requisitos por modalidasdes
                              $scope.PreguntasLicitacion = response.data.Preguntas;
                              $scope.RequisitosLicitacion = response.data.Requisitos;
                              // Para salvar las preguntas
                              $scope.PreguntasLicitacionSaved = response.data.Preguntas;
                              $scope.RequisitosLicitacionSaved = response.data.Requisitos;

                              // Carga las pantallas de preguntas frecuentes y requisitos para Bodegajes
                              $scope.RequisitosLicitacion = $scope.RequisitosLicitacion.filter(function (el){
                                return el.Modalidad == 'Bodegajes'
                              })
                             // $('#requisitos').modal('show');
                             // $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                              //  return el.Modalidad == 'Bodegajes'
                             // })
                             // $('#preguntas').modal('show');
                              // Carga modal de ayuda de forma de cargar
                             // $('#modal-tips').modal('show');

                          $scope.GetFormularioVisto = function () {
                             var Data = {};
                             $loading.start('myloading');
                             Data.Formulario = 'AyudaCargar';
                             Data.User = localStorage.UserConnected;

                            $http({
                            method: 'POST',
                            url: '/GetFormularioVisto',
                            headers: { 'Content-Type': 'application/json' },
                            data: Data
                            }).then(function successCallback(response) {
                            $loading.finish('myloading');
                            $scope.Estatusproveedor();
                            $scope.Formulario = response.data.Formularios;
                           console.log($scope.Formulario.length);
                              if ($scope.Formulario.length == 0){
                                 $('#modal-tips').modal('show');
                               }
                           }, function errorCallback(response) {
                           alert(response.statusText);
                            });
                          }
                     $scope.GetFormularioVisto();

                              $scope.PreguntasMostrando = 'Bodegajes';
                              $scope.RequisitosMostrando = 'Bodegajes';

                              //console.log($scope.ModalidadesProveedor);
                          }, function errorCallback(response) {
                            console.log(response);
                          });
                        }

                        $scope.GetModalidadesProveedor();


                ////////// Menu Ayuda//////////////////


                      $scope.CloseAyudaCarga = function(){
                         $('#modal-tips').modal('hide');
                           }

                       $scope.AceptarAyudacarga = function(){
                       var Data={};
                        $loading.start('myloading');
                        Data.Formulario = 'AyudaCargar';
                        Data.User = localStorage.UserConnected;

                        // Data.Modalidad= 'Bodegajes';
                         $http({
                         method: 'POST',
                         url: '/GetAceptarAyudacarga',
                         headers: { 'Content-Type': 'application/json' },
                         data: Data
                        }).then(function successCallback(response) {
                         $('#modal-tips').modal('hide');
                         $loading.finish('myloading');
                         }, function errorCallback(response) {
                         alert(response.statusText);
                });
            }


                        // Cerrar requisitos y preguntas sin aceptar
                        $scope.CloseRequisito = function(){
                          $('#requisitos').modal('hide');
                        }
                        $scope.ClosePregunta = function(){
                          $('#preguntas').modal('hide');
                        }
                        // Fin Cerrar requisitos y preguntas sin aceptar
                        // Cerrar requisitos y preguntas aceptando
                        $scope.AceptarRequisito = function(){

                          $('#requisitos').modal('hide');
                        }
                        $scope.AceptarPregunta = function(){
                         /* if ($scope.PreguntasMostrando == 'Bodegajes'){
                            $scope.ModalidadesMostrar.BodegajesP = false;
                          }
                          if ($scope.PreguntasMostrando == 'Aduanas'){
                            $scope.ModalidadesMostrar.AduanasP = false;
                          }
                          if ($scope.PreguntasMostrando == 'Otms'){
                            $scope.ModalidadesMostrar.OTMP = false;
                          }
                          if ($scope.PreguntasMostrando == 'MaritimasFCL'){
                            $scope.ModalidadesMostrar.MaritimasFclP = false;
                          }
                          if ($scope.PreguntasMostrando == 'MaritimasLCL'){
                            $scope.ModalidadesMostrar.MaritimasLclP = false;
                          }
                          if ($scope.PreguntasMostrando == 'Terrestre Nacional'){
                            $scope.ModalidadesMostrar.TerrestreNacionalP = false;
                          }
                          if ($scope.PreguntasMostrando == 'Terrestre Urbano'){
                            $scope.ModalidadesMostrar.TerrestreUrbanoP = false;
                          }
                          if ($scope.PreguntasMostrando == 'Aereas'){
                            $scope.ModalidadesMostrar.AreasP = false;
                          }*/
                          $('#preguntas').modal('hide');
                        }


                        // Fin Cerrar requisitos y preguntas aceptando

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
                          swal("por aqui");
                            var Data = {};
                            Data.Nit = $scope.Proveedor.Nit;
                            Data.RazonSocial = $scope.Proveedor.RazonSocial;
                            item.formData.push(Data);
                        };
                        $scope.uploader.onSuccessItem = function (item, response) {
                            if ($scope.QuantityFiles == 1) {
                               swal("por aqui2");
                                $scope.uploader.clearQueue();
                                $loading.finish('myloading');
                                swal("Licitaciones Proenfar", "Los datos del proveedor fueron actualizados.");
                            }
                             swal("por aqui3");
                            $scope.QuantityFiles--;
                        }
                      }])

        .controller('ctrlEditarProveedor', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

          $scope.GetUsuario = function () {
            var Data = {};
            $loading.start('myloading');
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.User = localStorage.UserConnected;
            $http({
                method: 'POST',
                url: '/GetUsuario',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                $scope.Proveedor = response.data.data[0];
                $scope.ProveedorFiles = response.data.ProveedorFiles;

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
          $scope.GetUsuario();

          // Descarga el archivo
          $scope.DownloadFileById = function (Id) {
            window.location.href = '/downloadanybyid?fileid=' + Id;
          }

          $scope.DeleteFileId = function (Id) {
            var Data = {};
            $loading.start('myloading');
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.fileid = Id;

            $http({
                method: 'POST',
                url: '/deletefilebyid',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                if (response.data.Result == 'Ok'){
                  $scope.ProveedorFiles = $scope.ProveedorFiles.filter(function(el){
                    return el.Id != Id
                  })
                  swal("Licitaciones Proenfar", "Se eliminó el archivo.");
                  return 0
                }

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }

       ///////////// /// Menu Ayuda//////////////////
                      $scope.FormularioVisto = function () {
                      var Data = {};
                      $loading.start('myloading');
                      Data.Formulario = 'Requisitos';
                      Data.User = localStorage.UserConnected;

                       $http({
                       method: 'POST',
                      url: '/GetFormularioVisto',
                      headers: { 'Content-Type': 'application/json' },
                       data: Data
                      }).then(function successCallback(response) {
                       $loading.finish('myloading');
                       $scope.Formulario = response.data.Formularios;
                        if ($scope.Formulario.length == 0){
                          $('#requisitos').modal('show');
                          }
                        }, function errorCallback(response) {
                       alert(response.statusText);
                        });
                        }
                     $scope.FormularioVisto();

         ////////////////////Requisitos////////////////////////////

                  $scope.GetRequisitos = function () {
                    var Data={};
                $loading.start('myloading');
                console.log('Pasaporaquivale');
                Data.Modalidad= 'Bodegajes';
                $http({
                    method: 'POST',
                    url: '/GetRequisitos',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.Requisitoscuenta = response.data.Requisitos;
                 }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
                $scope.GetRequisitos();

        ///////////////Preguntas/////////////////////////////////

         $scope.GetPreguntas = function () {
                    var Data={};
                $loading.start('myloading');
                Data.Modalidad='Bodegajes';
                $http({
                    method: 'POST',
                    url: '/GetPreguntas',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.Preguntascuenta = response.data.Preguntas;
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
                $scope.GetPreguntas();

            ///////////////////Boton Aceptar y No Aceptar Requisiciones /////////////////////

                   $scope.CloseRequisitocuenta = function(){
                         $('#requisitos').modal('hide');
                         $scope.mostrarmenulicitaciones = false;
                           }

                       $scope.AceptarRequisitocuenta = function(){
                       var Data={};
                        $loading.start('myloading');
                         Data.Formulario = 'Requisitos';
                         Data.Modalidad= 'Bodegajes';
                         Data.User = localStorage.UserConnected;
                         $http({
                         method: 'POST',
                         url: '/GetAceptarRequisitocuenta',
                         headers: { 'Content-Type': 'application/json' },
                         data: Data
                        }).then(function successCallback(response) {
                         $('#requisitos').modal('hide');
                          $scope.mostrarmenulicitaciones=true;
                         $loading.finish('myloading');
                         }, function errorCallback(response) {
                         alert(response.statusText);
                });
            }
                  $scope.botoncerrar = function(){
                    $scope.mostrarmenulicitaciones = false;
                  }

                  $scope.AceptarRequisitoboton = function(){
                         $('#requisitoss').modal('hide');
                   }

                  $scope.AceptarPreguntaboton = function(){
                         $('#preguntas').modal('hide');
                   }

              $scope.mostrarmenulicitaciones=true;

          //////////////////////////////////////////////////////////////////////
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
                  // Los files guardados en Drive
                  $scope.ProveedorFiles = response.ProveedorFiles;
                  swal("Licitaciones Proenfar", "Los datos del proveedor fueron actualizados.");
              }
              $scope.QuantityFiles--;
          }
        }])

        .controller('MyController', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', function ($scope, $http, $uibModal, $log, $document, $loading) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

            // Llama a HTML Modal que permite cambiar passwor de la app
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
            // Fin Llama a HTML Modal que permite cambiar passwor de la app

        }])

        .controller('CtrlSubirFile', ['$scope', '$http', '$loading', 'FileUploader', '$uibModal', function ($scope, $http, $loading, FileUploader, $uibModal) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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
              swal("Licitaciones Proenfar", "Tu archivo fue cargado con exito.");
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
              swal("Licitaciones Proenfar", "Debe seleccionar nómina y período.");
              return 0;
            }
              $scope.uploader2.uploadAll();
          };
          $scope.uploader2.onSuccessItem = function (item, response) {
              $loading.finish('myloading');
              $scope.uploader2.clearQueue();
              if (response.Result == 'norfc'){
                swal("Licitaciones Proenfar", "No existe empleado con el rfc del archivo para la nómina y el periodo seleccionado.");
                return 0;
              }
              swal("Licitaciones Proenfar", "Tu archivo fue cargado con exito.");
          };
          // Fin cargar file Txt
          $scope.ReadGoogleSheet = function(){
            if ($scope.txtUrl.trim() == '' || $scope.txtUrlValidacion.trim() == ''){
              swal("Licitaciones Proenfar", "Debe llenar las URL de plantillas.");
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
                swal("Licitaciones Proenfar", "El archivo que subió no tiene data.");
                return 0;
              }
              if (response.data.Result == 'notxt'){
                swal("Licitaciones Proenfar", "Falta subir archivo txt.");
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
                swal("Licitaciones Proenfar", "La data fue cargada exito.");
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
                swal("Licitaciones Proenfar", "El archivo que subió no tiene data.");
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

              swal("Licitaciones Proenfar", "Tu archivo fue cargado con exito.");
          };
        }])

        .controller('MyController2', ['$scope', '$http', '$loading', function ($scope, $http, $loading) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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
                    swal("Licitaciones Proenfar", "Debe llenar el campo de comentarios.");
                    return 0;
                }
                if (typeof $scope.selectedEmpleado == 'undefined') {
                    swal("Licitaciones Proenfar", "Debe seleccionar un(1) empleado.");
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
                    swal("Licitaciones Proenfar", "Tu solicitud fue generada.");
                    window.location.href = '/Solicitudes';
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
        }])

        .controller('MyController3', ['$scope', '$http', '$loading', '$location', function ($scope, $http, $loading, $location) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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
                        swal("Licitaciones Proenfar", "Datos de acceso incorrectos.");
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
                    swal("Licitaciones Proenfar", "Coloca un correo valido.");
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
                        swal("Licitaciones Proenfar", "Una nueva clave fue generada y enviada a tu correo electronico.");
                    }
                    else {
                        swal("Licitaciones Proenfar", "No se pudo generar nueva clave. Usuario no encontrado");
                    }
                }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }
        }])

        .controller('ctrlRecibosAsimilados', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', function ($scope, $http, $uibModal, $log, $document, $loading) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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
                swal("Licitaciones Proenfar", "El empleado seleccionado tiene un RFC invalido.");
                return 0;
              }
              var iFileName = PeriodoFile;
              window.open("/downloadanybyname?filename=" + iFileName,'_blank');
            }
        }])

        .controller('MyController4', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', function ($scope, $http, $uibModal, $log, $document, $loading) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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



        .controller('ctrlNuevoUsuario', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

           $scope.DeleteNomina = function(Name){
             $scope.NominasEmpleado = $scope.NominasEmpleado.filter(function(el){
               return el.Name != Name
             })
           }

             $scope.GetEmpleadosData = function () {
               $loading.start('myloading');
               var Data = {};
               Data.EditUser = localStorage.LoginUser;
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


        $scope.Perfiles = [{ id: 1, Name: 'Comercio Exterior' }, {id: 2, Name: 'Logistica' }];

        $scope.selectedPerfil = $scope.Perfiles[0];

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

               if (!$scope.bookmarkFormProv.$valid)
               {
                 return 0
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
                 Data.EditUser = localStorage.LoginUser;
                 Data.RazonSocial = $scope.razonsocial;
                 Data.UserName = $scope.username;
                 $http({
                     method: 'POST',
                     url: '/SaveUser',
                     headers: { 'Content-Type': 'application/json' },
                     data: Data
                 }).then(function successCallback(response) {
                     $loading.finish('myloading');

                     if (response.data.Result == 'noallow') {
                         swal("Licitaciones Proenfar", "No tiene permiso para crear usuario.");
                         return 0;
                     }

                     if (response.data.Result == 'ex') {
                         swal("Licitaciones Proenfar", "Ya existe un usuario con ese correo.");
                         return 0;
                     }
                     if (localStorage.User == '') {
                       window.location.href = '/usuarios.html';
                     }
                     else {
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

        .controller('ModalInstanceCtrlChangePassword', function ($uibModalInstance, ActiveUserModal, $http, $loading) {
            var $ctrl = this;
            $ctrl.NewPassword = '';
            $ctrl.RepeatPassword = '';

            $ctrl.ActiveUserModal = ActiveUserModal;
            $ctrl.ok = function () {
                $uibModalInstance.close();
            };
            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $ctrl.ChangePassword = function () {
              if ($ctrl.NewPassword.trim() == '') {
                  swal("Licitaciones Proenfar", "Debe colocar un password.");
                  return 0;
              }
              if ($ctrl.NewPassword.trim() != $ctrl.RepeatPassword.trim()) {
                  swal("Licitaciones Proenfar", "No coinciden los password.");
                  return 0;
              }
                $loading.start('myloading');
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
                        swal("Licitaciones Proenfar", "Su password fue cambiado.");
                        $ctrl.NewPassword = '';
                        $ctrl.RepeatPassword = '';
                        $uibModalInstance.dismiss('cancel');
                    }
                    else {
                        swal("Licitaciones Proenfar", "Su usuario fue actualizado.");
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
                swal("Licitaciones Proenfar", "Tu archivo fue cargado con exito.");
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

         

        .controller('ctrlProveedor', ['$scope', '$http', '$loading', '$uibModal','FileUploader',  function ($scope, $http, $loading, $uibModal,FileUploader) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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


        var editform= 0;

         $scope.Usuario={};   
         // Variables de selectores
         $scope.UsuarioSel = {};

            $scope.filterProveedores = function(){

           $scope.Usuarios = $scope.UsuariosSaved.filter(function (el) { return el.Name.toUpperCase().includes($scope.UsuarioSel.selected.Name.toUpperCase()); })
           console.log($scope.UsuarioSel.selected.Name);

           /*if (VistaName=='DatosProveedor')
           {
              $scope.GetProveedorModalidadName();
           }*/
         }

         // Modalidades para el filtro
         $scope.Modalidades = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFCL' }, { id: 4, Name: 'MritimasLCL' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

         $scope.GetUsuariosProveedor = function () {
           var Data = {};
           $loading.start('myloading');
           // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
           Data.Email = localStorage.User
           $http({
               method: 'POST',
               url: '/GetUsuarioProveedor',
               headers: { 'Content-Type': 'application/json' },
               data: Data
           }).then(function successCallback(response) {
              $loading.finish('myloading');
              $scope.Usuarios = response.data.data
              $scope.UsuariosSaved = response.data.data
           }, function errorCallback(response) {
               alert(response.statusText);
           });
         }

         $scope.GetUsuarioProveedor = function () {
           $loading.start('myloading');
           var Data = {};
           Data.EditUser = localStorage.LoginUser;
         $http({
               method: 'POST',
               url: '/GetEmpleadosdata',
               headers: { 'Content-Type': 'application/json' },
               data: Data
           }).then(function successCallback(response) {
             $loading.finish('myloading');

             $scope.username = response.data.Usuario.Name;
             $scope.email = response.data.Usuario.Email;
             $scope.user = response.data.Usuario.User;
             $scope.phone = response.data.Usuario.Phone;
             $scope.nit = response.data.Usuario.Nit;
             $scope.razonsocial = response.data.Usuario.RazonSocial;
            $scope.nrocelular = response.data.Usuario.NroCelular;
             $scope.ciudad = response.data.Usuario.Ciudad;
             $scope.direccion = response.data.Usuario.Direccion;
             $scope.pagweb = response.data.Usuario.PagWeb;
             $scope.replegal = response.data.Usuario.RepLegal;
             $scope.cedreplegal = response.data.Usuario.CedRepLegal;
             $scope.emailreplegal = response.data.Usuario.EmailRepLegal;
             $scope.tlfreplegal = response.data.Usuario.TlfRepLegal;
             $scope.celularreplegal = response.data.Usuario.CelularRepLegal;
             $scope.repcomercial = response.data.Usuario.RepComercial;
             $scope.emailrepcomercial = response.data.Usuario.EmailRepComercial;
             $scope.tlfrepcomercial = response.data.Usuario.TlfRepComercialnombre;
             $scope.celularrepcomercial = response.data.Usuario.CelularRepComercial;
             $scope.coordinadoroperacion = response.data.Usuario.CoordinadorOperacion;
             $scope.emailcoordinadoroperacion = response.data.Usuario.EmailCoordinadorOperacion;
             $scope.tlfcoordinadoroperacion = response.data.Usuario.TlfCoordinadorOperacion;
             $scope.celularcoordinadoroperacion = response.data.Usuario.CelularCoordinadorOperacion;

              $loading.finish('myloading');

           }, function errorCallback(response) {
               alert(response.statusText);
           });
         }

         $scope.GetUsuariosProveedor();

          $scope.NewUser = function () {
              $scope.razonsocial = '';
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

             if (!$scope.FormProveedores.$valid)
             {
               swal("Licitaciones Proenfar", "Hay valores inválidos. Por favor revisar el formulario.");
               return 0
             }

               $loading.start('myloading');
                var Data = {};
                Data.Email = $scope.email;
                Data.Password = $scope.password;
                Data.User=$scope.user;
                Data.Nit=$scope.nit;
                Data.Phone=$scope.phone;
                Data.EditUser = localStorage.LoginUser;
                Data.NombrePerfil ='Proveedor';
                Data.UserName = $scope.username;
                Data.RazonSocial = $scope.razonsocial;
                Data.Perfil = 3;
                $http({
                    method: 'POST',
                    url: '/SaveUser',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');

                    if (response.data.Result == 'noallow') {
                        swal("Licitaciones Proenfar", "No tiene permiso para crear usuarios.");
                        return 0;
                    }

                    if (response.data.Result == 'ex') {
                        swal("Licitaciones Proenfar", "Ya existe un proveedor con ese correo.");
                        return 0;
                    }
                    $('#nuevoProveedor').modal('hide');
                    $scope.GetUsuariosProveedor();

                }, function errorCallback(response) {
                    alert(response.statusText);
                });
             }

             $scope.DeleteUser = function (User) {
               if (localStorage.UserConnected == User) {
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
               Data.User = User;
               $http({
                   method: 'POST',
                   url: '/DeleteUser',
                   headers: { 'Content-Type': 'application/json' },
                   data: Data
               }).then(function successCallback(response) {
                  $loading.finish('myloading');
                  $scope.GetUsuariosProveedor();
               }, function errorCallback(response) {
                   alert(response.statusText);
               });

             });
           }

          $scope.GotoUser = function (User) {
            localStorage.LoginUser = User;
            $('#nuevoProveedor').modal('show');
            if (localStorage.LoginUser != ''){
              $scope.GetUsuarioProveedor();
            }
            else{
              $scope.username = '';
              $scope.email = '';
              $scope.user = '';
              $scope.phone = '';
              $scope.nit = '';
            }
          }


////////////////////////////////////////////////Detalle provedor ///////////////////////////////
          $scope.GotoUserdetalle = function (User) {
            localStorage.LoginUser = User;
            $('#detalleProveedor').modal('show');
            if (localStorage.LoginUser != ''){
              $scope.GetUsuarioProveedor();
              $scope.GetUsuario();
            }          
          }

           $scope.GetUsuario = function () {
            var Data = {};
            $loading.start('myloading');
            // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.User = localStorage.LoginUser;
            $http({
                method: 'POST',
                url: '/GetUsuario',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                $scope.Proveedor = response.data.data[0];
                $scope.ProveedorFilesdetalle = response.data.ProveedorFiles;
                
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
          $scope.GetUsuario();

          // Descarga el archivo
          $scope.DownloadFileById = function (Id) {
            window.location.href = '/downloadanybyid?fileid=' + Id;
          }
         
 
          $scope.uploader = new FileUploader();
          $scope.uploader.url = "/api/uploadFile";
          $scope.uploader.onBeforeUploadItem = function (item) {
              var Data = {};
              Data.Nit = $scope.Nit;
              Data.RazonSocial = $scope.RazonSocial;
              item.formData.push(Data);
          };
          $scope.uploader.onSuccessItem = function (item, response) {
              if ($scope.QuantityFiles == 1) {
                  $scope.uploader.clearQueue();
                  $loading.finish('myloading');
                  // Los files guardados en Drive
                  $scope.ProveedorFiles = response.ProveedorFiles;
                  swal("Licitaciones Proenfar", "Los datos del proveedor fueron actualizados.");
              }
              $scope.QuantityFiles--;
          }

         

        //////////////////////////////////Contacto Modalidad ///////////////////////////////////////
            $scope.Gotocontactomodalidad = function (email) {
            localStorage.ContactoPorModalidadEmail = email;
             $('#contactomodalidad').modal('show');
              if (localStorage.LoginUser != ''){
              $scope.GetContactosPorModalidades();
            }          
          }
          $scope.GetContactosPorModalidades = function () {
            var Data = {};
            Data.Proveedor = localStorage.LoginUser;
            $http({
                method: 'POST',
                url: '/GetContactosPorModalidades',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
              $scope.contactosmodalidades = response.data.contactosmodalidades;
              $scope.contactosmodalidades.forEach(function(element) {
                if (typeof element.modalidades != 'undefined'){
                  element.modalidadestext = '';
                  element.modalidades.forEach(function(modalidadinterna) {
                    element.modalidadestext += modalidadinterna.modalidad.name + ' '
                  });
                }
              });
              $scope.contactosmodalidadesfiltered = $scope.contactosmodalidades;
            }, function errorCallback(response) {
              alert(response.statusText);
            });
          }
          $scope.GetContactosPorModalidades();
          $scope.filtercontactos = function(){
            $scope.contactosmodalidadesfiltered = $scope.contactosmodalidades;
            $scope.contactosmodalidadesfiltered = $scope.contactosmodalidadesfiltered.filter(function (el) {
                return el.nombre.toUpperCase().indexOf($scope.strSerachContacto.toUpperCase()) > -1 || el.email.toUpperCase().indexOf($scope.strSerachContacto.toUpperCase()) > -1
            })
          }

       }])

////////////////////////////////////Desbloquear y Negociar ////////////////////////////////////////////////////

  .controller('ctrlDesbloquearnegociar', ['$scope', '$http', '$loading', '$uibModal',  function ($scope, $http, $loading, $uibModal) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

         var editform= 0;
         $scope.Usuario={};

         // Variables de selectores
         $scope.UsuarioSel = {};

            $scope.filterProveedores = function(){
           $scope.Usuarios = $scope.UsuariosSaved.filter(function (el) { return el.Name.toUpperCase().includes($scope.UsuarioSel.selected.Name.toUpperCase()); })
           console.log($scope.UsuarioSel.selected.Name);
              $scope.GetProveedorModalidadName();
         }

         // Modalidades para el filtro
         $scope.Modalidades = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFCL' }, { id: 4, Name: 'MritimasLCL' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

         $scope.GetUsuariosProveedor = function () {
           var Data = {};
           $loading.start('myloading');
           // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
           Data.Email = localStorage.User
           $http({
               method: 'POST',
               url: '/GetUsuarioProveedor',
               headers: { 'Content-Type': 'application/json' },
               data: Data
           }).then(function successCallback(response) {
              $loading.finish('myloading');
              $scope.Usuarios = response.data.data
              $scope.UsuariosSaved = response.data.data
           }, function errorCallback(response) {
               alert(response.statusText);
           });
         }

         $scope.GetUsuarioProveedor = function () {
           $loading.start('myloading');
           var Data = {};
           Data.EditUser = localStorage.LoginUser;
         $http({
               method: 'POST',
               url: '/GetEmpleadosdata',
               headers: { 'Content-Type': 'application/json' },
               data: Data
           }).then(function successCallback(response) {
             $loading.finish('myloading');

             $scope.username = response.data.Usuario.Name;
             $scope.email = response.data.Usuario.Email;
             $scope.user = response.data.Usuario.User;
             $scope.phone = response.data.Usuario.Phone;
             $scope.nit = response.data.Usuario.Nit;
             $scope.razonsocial = response.data.Usuario.RazonSocial;            

             $loading.finish('myloading');
           }, function errorCallback(response) {
               alert(response.statusText);
           });
         }

         $scope.GetUsuariosProveedor();

         

           $scope.GetProveedorModalidadName = function () {
                  var Data = {};
                  console.log('GetProveedorModalidadName');
                  console.log($scope.UsuarioSel.selected.RazonSocial);
                  Data.RazonSocial = $scope.UsuarioSel.selected.RazonSocial;
                  $loading.start('myloading');
                  $http({
                        method: 'POST',
                        url: '/GetProveedorModalidadName',
                        headers: { 'Content-Type': 'application/json' },
                        data: Data
                       }).then(function successCallback(response) {
                          $loading.finish('myloading');
                          $scope.LicitacionModalidadProveedor = response.data.data;
                          console.log($scope.LicitacionModalidadProveedor);
                       }, function errorCallback(response) {
                             console.log(response);
                        });
                     }
           

                  $scope.GetDesbloquearmodalidad = function (user,modalidad) {
                  var Data = {};
                  Data.Email= user;
                  Data.Modalidad=modalidad;
                  console.log(Data.Modalidad);
                  console.log(Data.Email);
                 swal({
                  title: "Seguro de Desbloquear Modalidad?",
                  text: "",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Aceptar",
                  closeOnConfirm: true
              },
              function () {
                  $loading.start('myloading');
                  $http({
                        method: 'POST',
                        url: '/GetDesbloquearmodalidad',
                        headers: { 'Content-Type': 'application/json' },
                        data: Data
                       }).then(function successCallback(response) {
                          $loading.finish('myloading');
                          swal("Licitaciones Proenfar", "Modalidad Desbloqueada.");
                          $scope.GetProveedorModalidadName();
                       }, function errorCallback(response) {
                             console.log(response);
                        });
                       });
                     }


                  $scope.GetNegociarmodalidad = function (user,modalidad) {
                  var Data = {};
                  Data.Email= user;
                  Data.Modalidad=modalidad;
                  console.log(Data.Modalidad);
                  console.log(Data.Email);
                   swal({
                  title: "Seguro de Negociar Modalidad?",
                  text: "",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Aceptar",
                  closeOnConfirm: true
              },
              function () {
                  $loading.start('myloading');
                  $http({
                        method: 'POST',
                        url: '/GetNegociarmodalidad',
                        headers: { 'Content-Type': 'application/json' },
                        data: Data
                       }).then(function successCallback(response) {
                          $loading.finish('myloading');
                          swal("Licitaciones Proenfar", "Modalidad Negociada.");
                          $scope.GetProveedorModalidadName();
                       }, function errorCallback(response) {
                             console.log(response);
                        });
                       });
                     }


       }])


/////////////////////////////////////////////Seleccionr Proveedor //////////////////////////////////////////

       .controller('ctrlSeleccionarProveedor', ['$scope', '$http', '$loading', 'FileUploader', '$uibModal', function ($scope, $http, $loading, FileUploader, $uibModal) {

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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;



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


        $scope.ModalidadesSelecProveedor = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFCL' }, { id: 4, Name: 'MaritimasLCL' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

         $scope.selectedModalidadSelecProveedor = $scope.ModalidadesSelecProveedor[0];

           $scope.GetSeleccionarProveedor = function (user,modalidad) {
                  var Data = {};
                  //Data.Email= user;
                  Data.Modalidad=$scope.selectedModalidadSelecProveedor.Name;
                  console.log(Data.Modalidad);
                  //console.log(Data.Email);
                  $loading.start('myloading');
                  $http({
                        method: 'POST',
                        url: '/GetSeleccionarProveedor',
                        headers: { 'Content-Type': 'application/json' },
                        data: Data
                       }).then(function successCallback(response) {
                          $loading.finish('myloading');
                          $scope.LicitacionModaProveedores = response.data.data;
                          $scope.LicitacionModaProveedores= _.orderBy($scope.LicitacionModaProveedores, [Licimodaprov => Licimodaprov.Email.toLowerCase()], ['asc']);
                          console.log($scope.LicitacionModaProveedores);

                       }, function errorCallback(response) {
                             console.log(response);
                        });
                     }

                      $scope.GetSeleccionarProveedor();

                $scope.ProveedorSeleccionado = function (Email){
                               var Data = {};
                               Data.Email = Email;
                               Data.Modalidad = $scope.selectedModalidadSelecProveedor.Name;
                               $loading.start('myloading');
                                $http({
                                 method: 'POST',
                                 url: '/GetProveedorSeleccionado',
                                 headers: { 'Content-Type': 'application/json' },
                                 data: Data
                             }).then(function successCallback(response) {
                                 $loading.finish('myloading');
                                }, function errorCallback(response) {
                                 console.log(response);
                             });

                        }



         }])

//////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////Consolidado datos menu licitacion ///////////////////////////////////////////////
  .controller('ctrlLicitacionConsolidadoDatos', ['$scope', '$http', '$loading', '$uibModal',  function ($scope, $http, $loading, $uibModal) {

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;

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

         $scope.Show30 = true;
         $scope.Show40 = false;
         $scope.Show50 = false;
         $scope.Show60 = false;
         $scope.Show70 = true;
         $scope.Show80 = true;
         $scope.Show90 = false;
                        $scope.Show1=true;
                        $scope.Show20=true;
                        $scope.Show111=true;
                        $scope.Show2=false;
                        $scope.Show3=false;
                        $scope.Show4=false;
                        $scope.Show5=false;

                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show11=false;
                        $scope.Show12=false;
                        $scope.Show13=false;

           //////////////////////////////se agrego consolidado datos /////////////////////////////////////
         var ProveedorSeleccionado=false;
        var ModalidadesSemaforo=false;

          $scope.ModalidadesSemaforo=false;

         $scope.ModalidadesConsolidado = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFcl' }, { id: 4, Name: 'MaritimasLcl' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

         $scope.selectedModalidadConsolidado = $scope.ModalidadesConsolidado[0];


                  $scope.GetConsolidadoDatos = function () {
                    var Data={};
                    var ModalidadTodas = [];
                    var ModalidadTodasOtm = [];
                    var ModalidadTodasT = [];
                    var ModalidadTodasTurbo = [];
                    var ModalidadTodasSencillo = [];
                    var ModalidadTodasPatineta = [];
                    var ModalidadTodasUrbano = [];
                    var ModalidadTodasSencilloII = [];
                    var ModalidadTodasTonelada = [];
                    var ModalidadTodasCarguero = [];
                    var ModalidadTodasPasajero = [];
                    var ModalidadTodasconOrden = [];
                    var ModalidadTodasconOrdenMinima = [];
                    var ModalidadTodasconOrdenGA = [];
                    var ModalidadTodasconOrdenGAII = [];
                    var ModalidadTodasconOrdenGAIII = [];
                    var ModalidadTodasconOrdenCA = [];
                    var ModalidadTodasconOrdenCAII = [];
                    var ModalidadTodasconOrdenCAIII = [];
                    var ModalidadTodasconOrdenCPC = [];
                    var ModalidadTodasconOrdenotros = [];
                    var ModalidadTodasconOrdenC4017 = [];
                    var ModalidadTodasconOrdenC401718 = [];
                    var ModalidadTodasconOrdenC4020 = [];
                    var ModalidadTodasconOrdenC4021 = [];
                    var ModalidadTodasconOrdenC4022 = [];
                    var ModalidadTodasconOrdenC4030 = [];
                    var ModalidadTodasconOrdenC20EST = [];
                    var ModalidadTodasconOrdenC40EST = [];
                    var ModalidadTodasconOrdenC20ESP = [];
                    var ModalidadTodasconOrdenC40ESP = [];
                    var ModalidadTodasconOrdenP = [];
                    var ModalidadTodasconOrdenMinimaP = [];
                    var ModalidadTodasconOrdenGAP = [];
                    var ModalidadTodasconOrdenGAIIP = [];
                    var ModalidadTodasconOrdenGAIIIP = [];
                    var ModalidadTodasconOrdenCAP = [];
                    var ModalidadTodasconOrdenCAIIP = [];
                    var ModalidadTodasconOrdenCAIIIP = [];
                    var ModalidadTodasconOrdenCPCP = [];
                    var ModalidadTodasconOrdenotrosP = [];
                    var ModalidadTodasconOrdenC4017P = [];
                    var ModalidadTodasconOrdenC401718P = [];
                    var ModalidadTodasconOrdenC4020P = [];
                    var ModalidadTodasconOrdenC4021P = [];
                    var ModalidadTodasconOrdenC4022P = [];
                    var ModalidadTodasconOrdenC4030P = [];
                    var ModalidadTodasconOrdenC20ESTP = [];
                    var ModalidadTodasconOrdenC40ESTP = [];
                    var ModalidadTodasconOrdenC20ESPP = [];
                    var ModalidadTodasconOrdenC40ESPP = [];
                    var ModalidadTodasconOrdencolor = [];
                    var ModalidadAduMinima = [];
                    var ModalidadAduTarifaValor = [];
                    var ModalidadAduGastosAdicionales = [];
                    var ModalidadTodasTerreNacionalSencillo = [];
                    var ModalidadTodasTerreNacionalPatineta = [];
                    var ModalidadTodasTerreNacionalTurbo = [];
                    var ModalidadTodasTerreUrbano = [];
                    var ModalidadTodasTerreUrbanoViaje = [];
                    var ModalidadTodasTerreUrbanoTonelada = [];
                    var ModalidadTodasAerea = [];
                    var ModalidadTodasAereaPasajero = [];
                    var UnObjeto= {};
                    var ModalidadDeUnProveedor = [];
                    var ModalidadAduanero= [];
                    var ModalidadConsolidado= $scope.selectedModalidadConsolidado.Name;
                    var ModalidadTodasRespaldoTN=[];
                    var ModalidadTodasRespaldoTNS=[];
                    var ModalidadTodasRespaldoTNP=[];
                    var ModalidadTodasRespaldoTU=[];
                    var ModalidadTodasRespaldoTUV=[];
                    var ModalidadTodasRespaldoTUT=[];
                    var ModalidadTodasRespaldoAA=[];
                    var ModalidadTodasRespaldoAP=[];
                    var ModalidadTodasRespaldoOTM=[];
                    var ModalidadTodasRespaldo=[];
                    var ModalidadTodasRespaldoAD=[];
                    var ModalidadTodasRespaldoExcel=[];
                    var ModalidadTodasRespaldoTNExcelExcel=[];
                    var ModalidadTodasRespaldoTNSExcel=[];
                    var ModalidadTodasRespaldoTNPExcel=[];
                    var ModalidadTodasRespaldoTUExcel=[];
                    var ModalidadTodasRespaldoTUVExcel=[];
                    var ModalidadTodasRespaldoTUTExcel=[];
                    var ModalidadTodasRespaldoAAExcel=[];
                    var ModalidadTodasRespaldoAPExcel=[];
                    var ModalidadTodasRespaldoOTMExcel=[];
                    var ModalidadTodasRespaldoExcel=[];
                    var ModalidadTodasRespaldoADExcel=[];
                    var ModalidadTodasRespaldoExcel=[];


                    var Unobjeto={};

                $loading.start('myloading');
                Data.ProveedorSeleccionado=ProveedorSeleccionado;
                Data.Modalidad=ModalidadConsolidado;
                console.log(Data.ProveedorSeleccionado);
                console.log(Data.Modalidad);
                $http({
                    method: 'POST',
                    url: '/GetConsolidadoDatos',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                     $loading.finish('myloading');
                     console.log(response);
                    $scope.ConsolidadoDatos = response.data.ConsolidadoDatos;
                    console.log($scope.ConsolidadoDatos);

                    if ($scope.ConsolidadosDatos !=[]) {

                    if (ModalidadConsolidado == 'Bodegajes') {
                      console.log('paso por aqui bodegajes');
                        $scope.Show1=true;
                        $scope.Show20=true;
                        $scope.Show111=true;
                        $scope.Show2=false;
                        $scope.Show3=false;
                        $scope.Show4=false;
                        $scope.Show5=false;

                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show11=false;
                        $scope.Show12=false;
                        $scope.Show13=false;

                      var ModalidadTodasBodegajeaduanero=[];
                      var ModalidadTodasconOrdenBodegajeaduanero=[];
                      var ModalidadTodasBodegajeaduaneromin=[];
                      var ModalidadTodasconOrdenBodegajeaduaneromin=[];

                      var ModalidadTodasBodegajeaduanerootro=[];
                      var ModalidadTodasconOrdenBodegajeaduanerootro=[];
                      console.log($scope.ConsolidadoDatos);

                       angular.forEach($scope.ConsolidadoDatos, function(consbodegaje) {

                          ModalidadDeUnProveedor = consbodegaje.Bodegajes.Aduanero;
                          Unobjeto.TarifaValor = ModalidadDeUnProveedor.TarifaValor;
                          Unobjeto.TarifaMinima = ModalidadDeUnProveedor.TarifaMinima;
                          Unobjeto.Otros = ModalidadDeUnProveedor.Otros;
                          Unobjeto.Email = consbodegaje.Email;

                          ModalidadTodasBodegajeaduanero.push({Email:Unobjeto.Email,TarifaValor:Unobjeto.TarifaValor, TarifaMinima:Unobjeto.TarifaMinima,Otros:Unobjeto.Otros});
                          console.log( ModalidadTodasBodegajeaduanero);


                          //ModalidadTodasconOrdenBodegajeaduanero=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduanero=ModalidadTodasBodegajeaduanero;
                          ModalidadTodasconOrdenBodegajeaduanerotv=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduanerotv=ModalidadTodasBodegajeaduanero;
                          ModalidadTodasconOrdenBodegajeaduaneromaq=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduaneromaq=ModalidadTodasBodegajeaduanero;
                          ModalidadTodasconOrdenBodegajeaduaneromin=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduaneromin=ModalidadTodasBodegajeaduanero;
                          ModalidadTodasconOrdenBodegajeaduanerootro=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduanerootro=ModalidadTodasBodegajeaduanero;

                         });

                       console.log( ModalidadTodasconOrdenBodegajeaduanerotv);
                       console.log( ModalidadTodasconOrdenBodegajeaduaneromin);
                       console.log( ModalidadTodasconOrdenBodegajeaduanerootro);

                      // function comparar ( a, b ){ return a - b; }

                 ///////////////////////// tarifa Valor////////////////////
                   //ModalidadTodasconOrdenBodegajeaduanerotv = _.orderBy(ModalidadTodasconOrdenBodegajeaduanerotv, [ModalidadBodegaje => ModalidadBodegaje.TarifaValor], ['asc']);

                    // ModalidadTodasconOrdenBodegajeaduanerotv = _.sortBy(ModalidadTodasconOrdenBodegajeaduanerotv,'TarifaValor');
                    ModalidadTodasconOrdenBodegajeaduanerotv = _.sortBy(ModalidadTodasconOrdenBodegajeaduanerotv, function (obj) {return parseFloat(obj.TarifaValor, 10); });

                    console.log( ModalidadTodasconOrdenBodegajeaduanerotv);
                     var cont=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduanerotv.length-1; i++){
                    if( ModalidadTodasconOrdenBodegajeaduanerotv[i].TarifaValor>0) {
                          if (i==0){
                            cont= cont + 1;
                            contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduanerotv[i].TarifaValor) == parseFloat( ModalidadTodasconOrdenBodegajeaduanerotv[i-1].TarifaValor))
                              {
                                cont= cont;
                                contnull=0;
                              }
                              else
                              {
                                cont=cont + 1;
                                contnull=0;                              }
                            }
                      }
                      else
                      {
                      contnull=1;
                      }


                        if (cont==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduanerotv[i].AdutarifaPintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduanerotv[i].AdutarifaPintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduanerotv[i].AdutarifaPintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduanerotv[i].AdutarifaPintada = [];
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduanerotv[i].AdutarifaPintada = [];
                        }
                        }

                         ///////////////////////// tarifa Minima////////////////////

                      //ModalidadTodasconOrdenBodegajeaduaneromin = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromin,'TarifaMinima');
                      ModalidadTodasconOrdenBodegajeaduaneromin= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromin, function (obj) {return parseFloat(obj.TarifaMinima, 10); });
                    console.log(ModalidadTodasconOrdenBodegajeaduaneromin);
                     var contmin=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromin.length-1; i++){
                     if( ModalidadTodasconOrdenBodegajeaduaneromin[i].TarifaMinima>0) {
                          if (i==0){
                            contmin= contmin + 1;
                            contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromin[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromin[i-1].TarifaMinima))
                              {
                                contmin= contmin;
                                contnull=0;
                              }
                              else
                              {
                                contmin=contmin + 1;
                                contnull=0;                              }
                            }
                              }
                      else
                      {
                      contnull=1;
                      }



                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromin[i].AdutarifaminPintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromin[i].AdutarifaminPintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromin[i].AdutarifaminPintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromin[i].AdutarifaminPintada = [];
                        }
                         if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromin[i].AdutarifaminPintada = [];
                        }
                        }

                                  ///////////////////////// otros////////////////////

                      //ModalidadTodasconOrdenBodegajeaduanerootro = _.sortBy(ModalidadTodasconOrdenBodegajeaduanerootro, 'Otros');
                      ModalidadTodasconOrdenBodegajeaduanerootro= _.sortBy(ModalidadTodasconOrdenBodegajeaduanerootro, function (obj) {return parseFloat(obj.Otros, 10); });
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduanerootro);
                     var contotro=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduanerootro.length-1; i++){
                    if( ModalidadTodasconOrdenBodegajeaduanerootro[i].Otros>0) {
                          if (i==0){
                            contotro= contotro + 1;
                            contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduanerootro[i].Otros) == parseFloat( ModalidadTodasconOrdenBodegajeaduanerootro[i-1].Otros))
                              {
                                contotro= contotro;
                                contnull=0;
                              }
                              else
                              {
                                contotro=contotro + 1;
                                contnull=0;                               }
                            }
                                     }
                      else
                      {
                      contnull=1;
                      }


                        if (contotro==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduanerootro[i].AdutarifaotroPintada = ["label label-success"];
                        }
                        if (contotro==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduanerootro[i].AdutarifaotroPintada = ["label label-warning"];
                        }
                        if (contotro==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduanerootro[i].AdutarifaotroPintada = ["label label-danger"];
                        }
                        if (contotro>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduanerootro[i].AdutarifaotroPintada = [];
                        }
                          if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduanerootro[i].AdutarifaotroPintada = [];
                        }
                        }
                        ModalidadTodasBodegajeaduanero = _.orderBy(ModalidadTodasconOrdenBodegajeaduanero, [ModalidadBodeaduanero => ModalidadBodeaduanero.Email.toLowerCase()], ['asc']);
                        console.log(ModalidadTodasBodegajeaduanero);
                       // ModalidadTodasBodegajeaduanero= _.orderBy(Email,[user => user.name.toLowerCase()], ['desc'])
                        //ModalidadTodasBodegajeaduanero= _.sortBy(_.sortBy(ModalidadTodasconOrdenBodegajeaduanero,'Email'), (a,b)=>b-a);
                        $scope.ModalidadTodasBodegajeaduanero=ModalidadTodasBodegajeaduanero;
                        console.log($scope.ModalidadTodasBodegajeaduanero);


                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasBodegajeaduanero;
                       $scope.ModalidadTodasBodegajeaduanero= ModalidadTodasBodegajeaduanero;
                       console.log(ModalidadTodasRespaldo);
                      console.log($scope.ModalidadesSemaforo);
                       $scope.ModalidadTodasBodegajeaduanero = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AdutarifaPintada.length > 0 ||
                                 el.AdutarifaminPintada.length > 0 ||
                                 el.AdutarifaotroPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });


                        ////////////////////////////////////////Maquinaria ///////////////////////
                         var ModalidadDeUnProveedormaqt=[];
                         var ModalidadTodasBodegajeaduaneromaqt=[];
                         var ModalidadTodasconOrdenBodegajeaduaneromaqt=[];
                          var ModalidadDeUnProveedormaqmint=[];
                         var ModalidadTodasBodegajeaduaneromaqmint=[];
                         var ModalidadTodasconOrdenBodegajeaduaneromaqmint=[];
                          var ModalidadDeUnProveedormaqfmmt=[];
                         var ModalidadTodasBodegajeaduaneromaqfmmt=[];
                         var ModalidadTodasconOrdenBodegajeaduaneromaqfmmt=[];
                         var Unobjetomaqt ={};
                      angular.forEach($scope.ConsolidadoDatos, function(consbodegajemaqt) {
                          ModalidadDeUnProveedormaqt = consbodegajemaqt.Bodegajes.Maquinaria;
                          Unobjetomaqt.Tarifa=ModalidadDeUnProveedormaqt.Tarifa;
                          Unobjetomaqt.TarifaMinima=ModalidadDeUnProveedormaqt.TarifaMinima;
                          Unobjetomaqt.Fmm=ModalidadDeUnProveedormaqt.Fmm;
                          Unobjetomaqt.Email=consbodegajemaqt.Email;
                        ModalidadTodasBodegajeaduaneromaqt.push({Email:Unobjetomaqt.Email,Tarifa:Unobjetomaqt.Tarifa, TarifaMinima:Unobjetomaqt.TarifaMinima, Fmm:Unobjetomaqt.Fmm});


                        ModalidadTodasconOrdenBodegajeaduaneromaqt=ModalidadTodasBodegajeaduaneromaqt;
                        ModalidadTodasconOrdenBodegajeaduaneromaqmint=ModalidadTodasBodegajeaduaneromaqt;
                        ModalidadTodasconOrdenBodegajeaduaneromaqfmmt=ModalidadTodasBodegajeaduaneromaqt;

                         });

                      /////////////////////////////////tarifa////////////////////////////////////

                      //ModalidadTodasconOrdenBodegajeaduaneromaqt = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqt,'Tarifa');
                      ModalidadTodasconOrdenBodegajeaduaneromaqt= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqt, function (obj) {return parseFloat(obj.Tarifa, 10); });
                     console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqt);
                     var contmaqt=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqt.length-1; i++){
                      if( ModalidadTodasconOrdenBodegajeaduaneromaqt[i].Tarifa>0) {
                          if (i==0){
                            contmaqt= contmaqt + 1;
                             contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqt[i].Tarifa) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqt[i-1].Tarifa))
                              {
                                contmaqt= contmaqt;
                                 contnull=0;
                              }
                              else
                              {
                                contmaqt=contmaqt + 1;
                                 contnull=0;                             }
                            }
                        }
                      else
                      {
                      contnull=1;
                      }


                        if (contmaqt==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqt[i].AdumaqtPintada = ["label label-success"];
                        }
                        if (contmaqt==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqt[i].AdumaqtPintada = ["label label-warning"];
                        }
                        if (contmaqt==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqt[i].AdumaqtPintada = ["label label-danger"];
                        }
                        if (contmaqt>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqt[i].AdumaqtPintada = [];
                        }
                         if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqt[i].AdumaqtPintada = [];
                        }
                        }

                            /////////////////////////////////tarifa minima////////////////////////////////////

                      //ModalidadTodasconOrdenBodegajeaduaneromaqmint = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqmint, 'Tarifa Minima');
                      ModalidadTodasconOrdenBodegajeaduaneromaqmint= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqmint, function (obj) {return parseFloat(obj.TarifaMinima, 10); });
                     console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqmin);
                     var contmaqmint=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqmint.length-1; i++){
                        if( ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].TarifaMinima>0) {
                          if (i==0){
                            contmaqmint= contmaqmint + 1;
                            contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqmint[i-1].TarifaMinima))
                              {
                                contmaqmint= contmaqmint;
                                contnull=0;
                              }
                              else
                              {
                                contmaqmint=contmaqmint + 1;
                                contnull=0;                               }
                            }
                             }
                      else
                      {
                      contnull=1;
                      }


                        if (contmaqmint==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].AdumaqtminPintada = ["label label-success"];
                        }
                        if (contmaqmint==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].AdumaqtminPintada = ["label label-warning"];
                        }
                        if (contmaqmint==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].AdumaqtminPintada = ["label label-danger"];
                        }
                        if (contmaqmint>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].AdumaqtminPintada = [];
                        }
                         if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].AdumaqtminPintada = [];
                        }
                        }

                     /////////////////////////////////FMM////////////////////////////////////

                      //ModalidadTodasconOrdenBodegajeaduaneromaqfmmt = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmt,'Fmm');
                      ModalidadTodasconOrdenBodegajeaduaneromaqfmmt= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmt, function (obj) {return parseFloat(obj.Fmm, 10); });
                     console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqfmm);
                     var contmaqfmmt=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqfmmt.length-1; i++){
                           if( ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].Fmm>0) {
                          if (i==0){
                            contmaqfmmt= contmaqfmmt + 1;
                            var contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].Fmm) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i-1].Fmm))
                              {
                                contmaqfmmt= contmaqfmmt;
                                var contnull=0;
                              }
                              else
                              {
                                contmaqfmmt=contmaqfmmt + 1;
                                var contnull=0;                              }
                            }
                            }
                      else
                      {
                      contnull=1;
                      }


                        if (contmaqfmmt==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].AdumaqtfmmPintada = ["label label-success"];
                        }
                        if (contmaqfmmt==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].AdumaqtfmmPintada = ["label label-warning"];
                        }
                        if (contmaqfmmt==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].AdumaqtfmmPintada = ["label label-danger"];
                        }
                        if (contmaqfmmt>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].AdumaqtfmmPintada = [];
                        }
                         if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].AdumaqtfmmPintada = [];
                        }
                        }

                          //ModalidadTodasBodegajeaduaneromaqt= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqt,'Email');
                          ModalidadTodasBodegajeaduaneromaqt = _.orderBy(ModalidadTodasconOrdenBodegajeaduaneromaqt, [ModalidadBodemaqt => ModalidadBodemaqt.Email.toLowerCase()], ['asc']);
                          $scope.ModalidadTodasBodegajeaduaneromaqt=ModalidadTodasBodegajeaduaneromaqt;
                          console.log($scope.ModalidadTodasBodegajeaduaneromaqt);

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasBodegajeaduaneromaqt;
                       $scope.ModalidadTodasBodegajeaduaneromaqt= ModalidadTodasBodegajeaduaneromaqt;
                       console.log(ModalidadTodasRespaldo);
                       $scope.ModalidadTodasBodegajeaduaneromaqt = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AdumaqtPintada.length > 0 ||
                                 el.AdumaqtminPintada.length > 0 ||
                                 el.AdumaqtfmmPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });


                              ////////////////////////////////////////Materia Prima ///////////////////////
                         var ModalidadDeUnProveedormaqp=[];
                         var ModalidadTodasBodegajeaduaneromaqp=[];
                         var ModalidadTodasconOrdenBodegajeaduaneromaqp=[];
                          var ModalidadDeUnProveedormaqminp=[];
                         var ModalidadTodasBodegajeaduaneromaqminp=[];
                         var ModalidadTodasconOrdenBodegajeaduaneromaqminp=[];
                          var ModalidadDeUnProveedormaqfmmp=[];
                         var ModalidadTodasBodegajeaduaneromaqfmmp=[];
                         var ModalidadTodasconOrdenBodegajeaduaneromaqfmmp=[];
                         var Unobjetomaqp ={};
                      angular.forEach($scope.ConsolidadoDatos, function(consbodegajemaqp) {
                          ModalidadDeUnProveedormaqp = consbodegajemaqp.Bodegajes.Maquinaria;
                          Unobjetomaqp.Tarifa=ModalidadDeUnProveedormaqp.Tarifa;
                          Unobjetomaqp.TarifaMinima=ModalidadDeUnProveedormaqp.TarifaMinima;
                          Unobjetomaqp.Fmm=ModalidadDeUnProveedormaqp.Fmm;
                          Unobjetomaqp.Email=consbodegajemaqp.Email;
                        ModalidadTodasBodegajeaduaneromaqp.push({Email:Unobjetomaqp.Email,Tarifa:Unobjetomaqp.Tarifa, TarifaMinima:Unobjetomaqp.TarifaMinima, Fmm:Unobjetomaqp.Fmm});


                        ModalidadTodasconOrdenBodegajeaduaneromaqp=ModalidadTodasBodegajeaduaneromaqp;
                        ModalidadTodasconOrdenBodegajeaduaneromaqminp=ModalidadTodasBodegajeaduaneromaqp;
                        ModalidadTodasconOrdenBodegajeaduaneromaqfmmp=ModalidadTodasBodegajeaduaneromaqp;

                         });

                      /////////////////////////////////tarifa////////////////////////////////////

                      //ModalidadTodasconOrdenBodegajeaduaneromaqp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqp,'Tarifa');
                      ModalidadTodasconOrdenBodegajeaduaneromaqp= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqp, function (obj) {return parseFloat(obj.Tarifa, 10); });
                     console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqp);
                     var contmaqp=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqp.length-1; i++){
                          if( ModalidadTodasconOrdenBodegajeaduaneromaqp[i].Tarifa>0) {
                          if (i==0){
                            contmaqp= contmaqp + 1;
                            var contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqp[i].Tarifa) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqp[i-1].Tarifa))
                              {
                                contmaqp= contmaqp;
                                var contnull=0;
                              }
                              else
                              {
                                contmaqp=contmaqp + 1;
                                var contnull=0;                               }
                            }
                             }
                      else
                      {
                      contnull=1;
                      }


                        if (contmaqp==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqp[i].AdumaqpPintada = ["label label-success"];
                        }
                        if (contmaqp==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqp[i].AdumaqpPintada = ["label label-warning"];
                        }
                        if (contmaqp==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqp[i].AdumaqpPintada = ["label label-danger"];
                        }
                        if (contmaqp>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqp[i].AdumaqpPintada = [];
                        }
                         if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqp[i].AdumaqpPintada = [];
                        }
                        }

                            /////////////////////////////////tarifa minima////////////////////////////////////

                      //ModalidadTodasconOrdenBodegajeaduaneromaqminp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqminp, 'Tarifa Minima');
                      ModalidadTodasconOrdenBodegajeaduaneromaqminp= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqminp, function (obj) {return parseFloat(obj.TarifaMinima, 10); });
                     console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqminp);
                     var contmaqminp=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqminp.length-1; i++){
                         if( ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].TarifaMinima>0) {
                          if (i==0){
                            contmaqminp= contmaqminp + 1;
                            contnull=0;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqminp[i-1].TarifaMinima))
                              {
                                contmaqminp= contmaqminp;
                                contnull=0;
                              }
                              else
                              {
                                contmaqminp=contmaqminp + 1;
                                contnull=0;                              }
                            }
                             }
                      else
                      {
                      contnull=1;
                      }


                        if (contmaqminp==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].AdumaqpminPintada = ["label label-success"];
                        }
                        if (contmaqminp==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].AdumaqpminPintada = ["label label-warning"];
                        }
                        if (contmaqminp==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].AdumaqpminPintada = ["label label-danger"];
                        }
                        if (contmaqminp>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].AdumaqpminPintada = [];
                        }
                         if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].AdumaqpminPintada = [];
                        }
                        }

                     /////////////////////////////////FMM////////////////////////////////////

                      //ModalidadTodasconOrdenBodegajeaduaneromaqfmmp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmp,'Fmm');
                      ModalidadTodasconOrdenBodegajeaduaneromaqfmmp= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmp, function (obj) {return parseFloat(obj.Fmm, 10); });
                     console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqfmmp);
                     var contmaqfmmp=0;
                     var contnull=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqfmmp.length-1; i++){
                        if( ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].Fmm>0) {
                          if (i==0){
                            contmaqfmmp= contmaqfmmp + 1;
                            contnull=0;

                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].Fmm) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i-1].Fmm))
                              {
                                contmaqfmmp= contmaqfmmp;
                                contnull=0;
                              }
                              else
                              {
                                contmaqfmmp=contmaqfmmp + 1;
                                contnull=0;                              }
                            }
                              }
                      else
                      {
                      contnull=1;
                      }


                        if (contmaqfmmp==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].AdumaqpfmmPintada = ["label label-success"];
                        }
                        if (contmaqfmmp==2)
                        {
                          console.log('paso por aqui amarillo');
                               ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].AdumaqpfmmPintada = ["label label-warning"];
                        }
                        if (contmaqfmmp==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].AdumaqpfmmPintada = ["label label-danger"];
                        }
                        if (contmaqfmmp>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].AdumaqpfmmPintada = [];
                        }
                         if (contnull==1)
                        {
                          ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].AdumaqpfmmPintada = [];
                        }
                        }

                           //ModalidadTodasBodegajeaduaneromaqp= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqp,'Email');
                           ModalidadTodasBodegajeaduaneromaqp = _.orderBy(ModalidadTodasconOrdenBodegajeaduaneromaqp, [ModalidadBodemaqp => ModalidadBodemaqp.Email.toLowerCase()], ['asc']);
                          $scope.ModalidadTodasBodegajeaduaneromaqp=ModalidadTodasBodegajeaduaneromaqp;
                          console.log($scope.ModalidadTodasBodegajeaduaneromaqp);
                          console.log($scope.ModalidadesSemaforo);

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasBodegajeaduaneromaqp;
                       $scope.ModalidadTodasBodegajeaduaneromaqp= ModalidadTodasBodegajeaduaneromaqp;
                       console.log(ModalidadTodasRespaldo);
                       $scope.ModalidadTodasBodegajeaduaneromaqp = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AdumaqpPintada.length > 0 ||
                                 el.AdumaqpminPintada.length > 0 ||
                                 el.AdumaqpfmmPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });

         ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadBodegaje = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodasBodegajeaduanero;
              Data.ModalidadesProveedor2=$scope.ModalidadTodasBodegajeaduaneromaqt;
              Data.ModalidadesProveedor3=$scope.ModalidadTodasBodegajeaduaneromaqp;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "Bodegaje.xlsx");
              //saveAs(urlbase64, "Report.xls");
               //$loading.finish('myloading');
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
                     }


                     //////////////////////////////  Aduanas ////////////////////////

                    if (ModalidadConsolidado == 'Aduanas') {

                      console.log('paso por aqui aduanas');

                        $scope.Show1=false;
                        $scope.Show20=false;
                        $scope.Show11=false;
                        $scope.Show111=false;
                        $scope.Show2=true;
                        $scope.Show3=false;
                        $scope.Show4=false;
                        $scope.Show5=false;
                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show1111=false;
                         $scope.Show12=false;
                        $scope.Show13=false;

                        var ModalidadTodasconOrden= [];
                        var ModalidadGrupoMaritimo= [];
                        var ModalidadGrupoTerrestre= [];

                        console.log($scope.ConsolidadoDatos);

                       angular.forEach($scope.ConsolidadoDatos, function(consaduana) {
                         ModalidadDeUnProveedorAD = consaduana.Aduana.Aduanas
                            angular.forEach(ModalidadDeUnProveedorAD, function(consaduanasprov) {
                              consaduanasprov.Email = consaduana.Email
                              ModalidadTodas.push(consaduanasprov);
                              ModalidadTodasconOrden = ModalidadTodas;
                              ModalidadTodasconOrdenMinima = ModalidadTodas;
                              ModalidadTodasconOrdenGA = ModalidadTodas;
                              ModalidadTodasconOrdenGAII = ModalidadTodas;
                              ModalidadTodasconOrdenGAIII = ModalidadTodas;
                              ModalidadTodasconOrdenCA = ModalidadTodas;
                              ModalidadTodasconOrdenCAII = ModalidadTodas;
                              ModalidadTodasconOrdenCAIII = ModalidadTodas;
                              ModalidadTodasconOrdenCPC = ModalidadTodas;
                              ModalidadTodasconOrdenotros = ModalidadTodas;
                            });

                        });

                       ModalidadTodas = _.sortBy(ModalidadTodas, 'Via');


                       console.log(ModalidadTodas);
                       //$scope.groups = _.groupBy(ModalidadTodas, "Via");

                    //////// Aerea campo ["Tarifa % Advalorem/ FOB"] //////////////////////////

                      //ModalidadTodasconOrden = _.sortBy( ModalidadTodasconOrden, 'Via','["Tarifa % Advalorem/ FOB"]');
                      //ModalidadTodasconOrden = _.orderBy(ModalidadTodasconOrden, [Modalidadadutar => Modalidadadutar.Via.toLowerCase(),Modalidadadutar => Modalidadadutar["Tarifa % Advalorem/ FOB"].parseFloat], ['asc','asc']);
                      ModalidadTodasconOrden = _.orderBy(ModalidadTodasconOrden, [Modalidadadutar => Modalidadadutar.Via.toLowerCase(),Modalidadadutar => parseFloat(Modalidadadutar["Tarifa % Advalorem/ FOB"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrden);

                     var cont=0;
                     var contnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrden[i]["Tarifa % Advalorem/ FOB"]>0){
                                 cont= cont + 1;
                                 console.log('i es o');
                                 console.log(cont);
                                 contnull=0;
                                }
                                  else
                                 {contnull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrden[i].Via == ModalidadTodasconOrden[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrden[i]["Tarifa % Advalorem/ FOB"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrden[i]["Tarifa % Advalorem/ FOB"]) == parseFloat(ModalidadTodasconOrden[i-1]["Tarifa % Advalorem/ FOB"]))
                                {
                                  cont= cont;
                                  console.log('campo igual');
                                  console.log(cont);
                                  contnull=0;
                                }
                                else
                                {
                                  cont=cont + 1;
                                  console.log('campo diferente');
                             console.log(cont);
                             contnull=0;
                                }
                              }
                              else
                              {
                                contnull=1;
                                 console.log(cont);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrden[i]["Tarifa % Advalorem/ FOB"]>0 ) {
                                  cont=1;
                                   console.log('via diferente');
                                   contnull=0;
                                  console.log(cont);
                                }
                                else
                                {
                                cont=0;
                                contnull=1;
                                }
                              }

                          }

                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AdutarifaPintada = [];
                          console.log('balnco 1');
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrden[i].AdutarifaPintada = [];
                          console.log('balnco 2');
                        }


                      }


              ////////////////// Campo Minima ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.orderBy(ModalidadTodasconOrdenMinima, [Modalidadadumin => Modalidadadumin.Via.toLowerCase(),Modalidadadumin => parseFloat(Modalidadadumin.Minima,10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenMinima);

                     var contmin=0;
                     var contminnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinima[i].Minima>0){
                                 contmin= contmin + 1;
                                 console.log('i es o');
                                 console.log(contmin);
                                 contminnull=0;
                                }
                                  else
                                 {contminnull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenMinima[i].Via == ModalidadTodasconOrdenMinima[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinima[i].Minima>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i].Minima) == parseFloat(ModalidadTodasconOrdenMinima[i-1].Minima))
                                {
                                  contmin= contmin;
                                  console.log('campo igual');
                                  console.log(contmin);
                                  contminnull=0;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                  console.log('campo diferente');
                             console.log(contmin);
                             contminnull=0;
                                }
                              }
                              else
                              {
                                contminnull=1;
                                 console.log(contmin);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinima[i].Minima>0 ) {
                                  contmin=1;
                                   console.log('via diferente');
                                   contminnull=0;
                                  console.log(contmin);
                                }
                                else
                                {
                                contmin=0;
                                contminnull=1;
                                }
                              }

                          }

                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduMinimaPintada = [];
                          console.log('balnco 1');
                        }
                        if (contminnull==1)
                        {
                          ModalidadTodasconOrdenMinima[i].AduMinimaPintada = [];
                          console.log('balnco 2');
                        }

                      }


                  ////////// Campo ["Gastos Adicionales"] ///////////////////////////////

                    ModalidadTodasconOrdenGA = _.orderBy(ModalidadTodasconOrdenGA, [Modalidadaduga => Modalidadaduga.Via.toLowerCase(),Modalidadaduga => parseFloat(Modalidadaduga["Gastos Adicionales"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenGA);

                     var contGA=0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGA[i]["Gastos Adicionales"]>0){
                                 contGA= contGA + 1;
                                 console.log('i es o');
                                 console.log(contGA);
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenGA[i].Via == ModalidadTodasconOrdenGA[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGA[i]["Gastos Adicionales"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["Gastos Adicionales"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["Gastos Adicionales"]))
                                {
                                  contGA= contGA;
                                  console.log('campo igual');
                                  console.log(contGA);
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                  console.log('campo diferente');
                             console.log(contGA);
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGA[i]["Gastos Adicionales"]>0 ) {
                                  contGA=1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA);
                                }
                                else
                                {
                                contGA=0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduGAPintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                          ModalidadTodasconOrdenGA[i].AduGAPintada = [];
                          console.log('balnco 2');
                        }


                      }

                    ////////// Campo ["Conceptos Adicionales"] ////////////////////////////////

                     /*ModalidadTodasconOrdenCA = _.orderBy(ModalidadTodasconOrdenCA, [ModalidadaduCA => ModalidadaduCA.Via.toLowerCase(),ModalidadaduCA => parseFloat(ModalidadaduCA["Conceptos Adicionales"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenCA);

                     var contCA=0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCA[i]["Conceptos Adicionales"]>0){
                                 contCA= contCA + 1;
                                 console.log('i es o');
                                 console.log(contCA);
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenCA[i].Via == ModalidadTodasconOrdenCA[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCA[i]["Conceptos Adicionales"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Conceptos Adicionales"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Conceptos Adicionales"]))
                                {
                                  contCA= contCA;
                                  console.log('campo igual');
                                  console.log(contCA);
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                  console.log('campo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCA[i]["Conceptos Adicionales"]>0 ) {
                                  contCA=1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA=0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduCAPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenCA[i].AduCAPintada = [];
                          console.log('balnco 2');
                        }


                      }*/

                      ////////// Campo ["Gastos Adicionales dos"] //////////////////////////////////////
                    ModalidadTodasconOrdenGAII = _.orderBy(ModalidadTodasconOrdenGAII, [ModalidadaduGAII => ModalidadaduGAII.Via.toLowerCase(),ModalidadaduGAII => parseFloat(ModalidadaduGAII["Gastos Adicionales dos"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenGAII);

                     var contGAII=0;
                     var contGAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAII[i]["Gastos Adicionales dos"]>0){
                                 contGAII= contGAII + 1;
                                 console.log('i es o');
                                 console.log(contGAII);
                                 contGAIInull=0;
                                }
                                  else
                                 {contGAIInull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenGAII[i].Via == ModalidadTodasconOrdenGAII[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAII[i]["Gastos Adicionales dos"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["Gastos Adicionales dos"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["Gastos Adicionales dos"]))
                                {
                                  contGAII= contGAII;
                                  console.log('GAIImpo igual');
                                  console.log(contGAII);
                                  contGAIInull=0;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                  console.log('GAIImpo diferente');
                             console.log(contGAII);
                             contGAIInull=0;
                                }
                              }
                              else
                              {
                                contGAIInull=1;
                                 console.log(contGAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAII[i]["Gastos Adicionales dos"]>0 ) {
                                  contGAII=1;
                                   console.log('via diferente');
                                   contGAIInull=0;
                                  console.log(contGAII);
                                }
                                else
                                {
                                contGAII=0;
                                contGAIInull=1;
                                }
                              }

                          }

                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduGAIIPintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIInull==1)
                        {
                          ModalidadTodasconOrdenGAII[i].AduGAIIPintada = [];
                          console.log('balnco 2');
                        }


                      }
                     /*  ////////// Campo ["Conceptos Adicionales dos"]

                     ModalidadTodasconOrdenCAII = _.orderBy(ModalidadTodasconOrdenCAII, [ModalidadaduCAII => ModalidadaduCAII.Via.toLowerCase(),ModalidadaduCAII => parseFloat(ModalidadaduCAII["Conceptos Adicionales dos"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenCAII);

                     var contCAII=0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAII[i]["Conceptos Adicionales dos"]>0){
                                 contCAII= contCAII + 1;
                                 console.log('i es o');
                                 console.log(contCAII);
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenCAII[i].Via == ModalidadTodasconOrdenCAII[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAII[i]["Conceptos Adicionales dos"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["Conceptos Adicionales dos"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["Conceptos Adicionales dos"]))
                                {
                                  contCAII= contCAII;
                                  console.log('CAIImpo igual');
                                  console.log(contCAII);
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                  console.log('CAIImpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAII[i]["Conceptos Adicionales dos"]>0 ) {
                                  contCAII=1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCAII=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduCAIIPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAII[i].AduCAIIPintada = [];
                          console.log('balnco 2');
                        }


                      }*/
                      ////////// Campo ["Gastos Adicionales tres"]

                    ModalidadTodasconOrdenGAIII  = _.orderBy(ModalidadTodasconOrdenGAIII , [ModalidadaduGAIII => ModalidadaduGAIII.Via.toLowerCase(),ModalidadaduGAIII => parseFloat(ModalidadaduGAIII["Gastos Adicionales tres"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenGAIII );

                     var contGAIII =0;
                     var contGAIIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAIII[i]["Gastos Adicionales tres"]>0){
                                 contGAIII = contGAIII  + 1;
                                 console.log('i es o');
                                 console.log(contGAIII );
                                 contGAIIInull=0;
                                }
                                  else
                                 {contGAIIInull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenGAIII[i].Via == ModalidadTodasconOrdenGAIII[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAIII[i]["Gastos Adicionales tres"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i]["Gastos Adicionales tres"]) == parseFloat(ModalidadTodasconOrdenGAIII[i-1]["Gastos Adicionales tres"]))
                                {
                                  contGAIII = contGAIII ;
                                  console.log('GAIII mpo igual');
                                  console.log(contGAIII );
                                  contGAIIInull=0;
                                }
                                else
                                {
                                  contGAIII =contGAIII  + 1;
                                  console.log('GAIII mpo diferente');
                             console.log(contGAIII );
                             contGAIIInull=0;
                                }
                              }
                              else
                              {
                                contGAIIInull=1;
                                 console.log(contGAIII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAIII[i]["Gastos Adicionales tres"]>0 ) {
                                  contGAIII =1;
                                   console.log('via diferente');
                                   contGAIIInull=0;
                                  console.log(contGAIII );
                                }
                                else
                                {
                                contGAIII =0;
                                contGAIIInull=1;
                                }
                              }

                          }

                        if (contGAIII ==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIII ==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIII ==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIII >3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIIInull==1)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = [];
                          console.log('balnco 2');
                        }


                      }

                  /* ////////// Campo ["Conceptos Adicionales tres"]

                     ModalidadTodasconOrdenCAIII = _.orderBy(ModalidadTodasconOrdenCAIII, [ModalidadaduCAIII => ModalidadaduCAIII.Via.toLowerCase(),ModalidadaduCAIII  => parseFloat(ModalidadaduCAIII["Conceptos Adicionales tres"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenCAIII );

                     var contCAIII =0;
                     var contCAIIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAIII[i]["Conceptos Adicionales tres"]>0){
                                 contCAIII = contCAIII  + 1;
                                 console.log('i es o');
                                 console.log(contCAIII );
                                 contCAIIInull=0;
                                }
                                  else
                                 {contCAIIInull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenCAIII[i].Via == ModalidadTodasconOrdenCAIII[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAIII[i]["Conceptos Adicionales tres"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAIII[i]["Conceptos Adicionales tres"]) == parseFloat(ModalidadTodasconOrdenCAIII[i-1]["Conceptos Adicionales tres"]))
                                {
                                  contCAIII = contCAIII ;
                                  console.log('CAIII mpo igual');
                                  console.log(contCAIII );
                                  contCAIIInull=0;
                                }
                                else
                                {
                                  contCAIII =contCAIII  + 1;
                                  console.log('CAIII mpo diferente');
                             console.log(contCAIII );
                             contCAIIInull=0;
                                }
                              }
                              else
                              {
                                contCAIIInull=1;
                                 console.log(contCAIII );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAIII[i]["Conceptos Adicionales tres"]>0 ) {
                                  contCAIII =1;
                                   console.log('via diferente');
                                   contCAIIInull=0;
                                  console.log(contCAIII );
                                }
                                else
                                {
                                contCAIII =0;
                                contCAIIInull=1;
                                }
                              }

                          }

                        if (contCAIII ==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAIII ==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAIII ==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAIII >3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIIInull==1)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = [];
                          console.log('balnco 2');
                        }


                      }*/


                          ////////// Campo ["Costo Planificacion Caja"]

                     ModalidadTodasconOrdenCPC  = _.orderBy(ModalidadTodasconOrdenCPC , [ModalidadaduCPC => ModalidadaduCPC.Via.toLowerCase(),ModalidadaduCPC => parseFloat(ModalidadaduCPC["Conceptos Adicionales tres"],10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenCPC );

                     var contCPC =0;
                     var contCPCnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPC.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCPC[i]["Conceptos Adicionales tres"]>0){
                                 contCPC = contCPC  + 1;
                                 console.log('i es o');
                                 console.log(contCPC );
                                 contCPCnull=0;
                                }
                                  else
                                 {contCPCnull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenCPC[i].Via == ModalidadTodasconOrdenCPC[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCPC[i]["Conceptos Adicionales tres"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCPC[i]["Conceptos Adicionales tres"]) == parseFloat(ModalidadTodasconOrdenCPC[i-1]["Conceptos Adicionales tres"]))
                                {
                                  contCPC = contCPC ;
                                  console.log('CPC mpo igual');
                                  console.log(contCPC );
                                  contCPCnull=0;
                                }
                                else
                                {
                                  contCPC =contCPC  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCPC );
                             contCPCnull=0;
                                }
                              }
                              else
                              {
                                contCPCnull=1;
                                 console.log(contCPC );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCPC[i]["Conceptos Adicionales tres"]>0 ) {
                                  contCPC =1;
                                   console.log('via diferente');
                                   contCPCnull=0;
                                  console.log(contCPC );
                                }
                                else
                                {
                                contCPC =0;
                                contCPCnull=1;
                                }
                              }

                          }

                        if (contCPC ==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCPC ==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCPC ==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCPC >3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduCPCPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCPCnull==1)
                        {
                          ModalidadTodasconOrdenCPC[i].AduCPCPintada = [];
                          console.log('balnco 2');
                        }


                      }

                   ////////// Campo Otros////////////////////////////

                   ModalidadTodasconOrdenotros  = _.orderBy(ModalidadTodasconOrdenotros , [Modalidadaduotro => Modalidadaduotro.Via.toLowerCase(),Modalidadaduotro => parseFloat(Modalidadaduotro.Otros,10)], ['asc','asc']);
                      console.log(ModalidadTodasconOrdenotros );

                     var contOTRO =0;
                     var contOTROnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotros.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenotros[i].Otros>0){
                                 contOTRO = contOTRO  + 1;
                                 console.log('i es o');
                                 console.log(contOTRO );
                                 contOTROnull=0;
                                }
                                  else
                                 {contOTROnull=1;}
                           }
                         else
                          {
                             if(ModalidadTodasconOrdenotros[i].Via == ModalidadTodasconOrdenotros[i-1].Via)
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenotros [i].Otros>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenotros[i].Otros) == parseFloat(ModalidadTodasconOrdenotros[i-1].Otros))
                                {
                                  contOTRO = contOTRO ;
                                  console.log('CPC mpo igual');
                                  console.log(contOTRO );
                                  contOTROnull=0;
                                }
                                else
                                {
                                  contOTRO =contOTRO  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contOTRO );
                             contOTROnull=0;
                                }
                              }
                              else
                              {
                                contOTROnull=1;
                                 console.log(contOTRO );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenotros[i].Otros>0 ) {
                                  contOTRO =1;
                                   console.log('via diferente');
                                   contOTROnull=0;
                                  console.log(contOTRO );
                                }
                                else
                                {
                                contOTRO =0;
                                contOTROnull=1;
                                }
                              }

                          }

                        if (contOTRO ==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contOTRO ==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contOTRO ==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contOTRO >3)
                        {
                          ModalidadTodasconOrdenotros[i].AduotroPintada = [];
                          console.log('balnco 1');
                        }
                        if (contOTROnull==1)
                        {
                          ModalidadTodasconOrdenotros[i].AduotroPintada = [];
                          console.log('balnco 2');
                        }


                      }


                    // ModalidadTodas= _.sortBy(ModalidadTodas,'Via','Email');
                   // ModalidadTodas = _.orderBy(ModalidadTodas, [Modalidadtoda => (Modalidadtoda.Via.toLowerCase())],[Modalidadtoda => (Modalidadtoda.Email.toLowerCase())],['asc'],['asc']);

                   //ModalidadTodas= _.orderBy(ModalidadTodas, ["Email"], ["asc"]);
                   ModalidadTodas=_.orderBy(ModalidadTodas, [ModalidadTodasadu => ModalidadTodasadu.Via.toLowerCase(),ModalidadTodasadu =>ModalidadTodasadu.Email.toLowerCase()], ['asc','asc']);

                     console.log(ModalidadTodas);
                       ModalidadTodasRespaldoAD = ModalidadTodas;
                       $scope.ModalidadTodas= ModalidadTodas;
                       $scope.ModalidadTodas = ModalidadTodasRespaldoAD.filter(function (el) {
                     return (el.AdutarifaPintada.length > 0 ||
                          el.AduMinimaPintada.length > 0 ||
                          el.AduGAPintada.length > 0 ||
                          //el.AduCAPintada.length > 0 ||
                          el.AduGAIIPintada.length > 0 ||
                          //el.AduCAIIPintada.length > 0 ||
                          el.AduGAIIIPintada.length > 0 ||
                          //el.AduCAIIIPintada.length > 0 ||
                          el.AduCPCPintada.length > 0 ||
                          el.AduotroPintada.length > 0 ||
                          $scope.ModalidadesSemaforo == false);
                });
                console.log($scope.ModalidadTodas);


          ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadAduana = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodas;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "Aduana.xlsx");
               //$loading.finish('myloading');
              //saveAs(urlbase64, "Report.xls");

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }

                   }


          ///////////////////////////////////////////////////OTM///////////////////////////////////////////////////
                      if (ModalidadConsolidado == 'OTM') {
                        $scope.Show20=false;
                        $scope.Show1=false;
                        $scope.Show11=false;
                        $scope.Show111=false;
                        $scope.Show2=false;
                        $scope.Show3=true;
                        $scope.Show4=false;
                        $scope.Show5=false;
                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show1111=false;
                         $scope.Show12=false;
                        $scope.Show13=false;

                       angular.forEach($scope.ConsolidadoDatos, function(consotm) {
                        console.log($scope.ConsolidadoDatos);
                        console.log(consotm);
                         ModalidadDeUnProveedorOTM = consotm.Otm.Otms
                            angular.forEach(ModalidadDeUnProveedorOTM, function(consotmprov) {
                              consotmprov.Email = consotm.Email
                              ModalidadTodasOtm.push(consotmprov);
                              console.log(ModalidadTodasOtm);
                              ModalidadTodasconOrden = ModalidadTodasOtm;
                              ModalidadTodasconOrdenMinima = ModalidadTodasOtm;
                              ModalidadTodasconOrdenGA = ModalidadTodasOtm;
                              ModalidadTodasconOrdenGAII = ModalidadTodasOtm;
                              ModalidadTodasconOrdenGAIII = ModalidadTodasOtm;
                              ModalidadTodasconOrdenCA = ModalidadTodasOtm;
                              ModalidadTodasconOrdenCAII = ModalidadTodasOtm;
                              ModalidadTodasconOrdenCAIII = ModalidadTodasOtm;
                              ModalidadTodasconOrdenCPC = ModalidadTodasOtm;
                              ModalidadTodasconOrdenotros = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC4017 = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC401718 = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC4020 = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC4021 = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC4022 = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC4030 = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC20EST = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC40EST = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodasOtm;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodasOtm;

                            });
                        });

                        ModalidadTodasOtm = _.sortBy(ModalidadTodasOtm, 'Destino','Origen');
                         console.log(ModalidadTodasOtm);

                         ////////  Campo ["C 20 hasta 4-5 Ton"] //////////////////////////

                console.log(ModalidadTodasconOrden );
                  ModalidadTodasconOrden  = _.orderBy(ModalidadTodasconOrden , [Modalidadotm2045 => Modalidadotm2045.Destino.toLowerCase(),Modalidadotm2045 => Modalidadotm2045.Origen.toLowerCase(),Modalidadotm2045 => parseFloat(Modalidadotm2045["C 20 hasta 4-5 Ton"],30)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrden );

                     var cont =0;
                     var contnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrden[i]["C 20 hasta 4-5 Ton"]>0){
                                 cont = cont  + 1;
                                 console.log('i es o');
                                 console.log(cont );
                                 contnull=0;
                                }
                                  else
                                 {contnull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrden[i]["C 20 hasta 4-5 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrden[i]["C 20 hasta 4-5 Ton"]) == parseFloat(ModalidadTodasconOrden[i-1]["C 20 hasta 4-5 Ton"]))
                                {
                                  cont = cont ;
                                  console.log('CPC mpo igual');
                                  console.log(cont );
                                  contnull=0;
                                }
                                else
                                {
                                  cont =cont  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(cont );
                             contnull=0;
                                }
                              }
                              else
                              {
                                contnull=1;
                                 console.log(cont );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrden[i]["C 20 hasta 4-5 Ton"]>0 ) {
                                  cont =1;
                                   console.log('via diferente');
                                   contnull=0;
                                  console.log(cont );
                                }
                                else
                                {
                                cont =0;
                                contnull=1;
                                }
                              }

                          }

                        if (cont ==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (cont ==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (cont ==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (cont >3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 2');
                        }


                      }

              ////////////////// ["C 20 hasta 8 Ton"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinima  = _.orderBy(ModalidadTodasconOrdenMinima , [Modalidadotm208 => Modalidadotm208.Destino.toLowerCase(), Modalidadotm208 => Modalidadotm208.Origen.toLowerCase(), Modalidadotm208 => parseFloat(Modalidadotm208["C 20 hasta 8 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenMinima );

                     var contmin =0;
                     var contminnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinima[i]["C 20 hasta 8 Ton"]>0){
                                 contmin = contmin  + 1;
                                 console.log('i es o');
                                 console.log(contmin );
                                 contminnull=0;
                                }
                                  else
                                 {contminnull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinima[i]["C 20 hasta 8 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["C 20 hasta 8 Ton"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["C 20 hasta 8 Ton"]))
                                {
                                  contmin = contmin ;
                                  console.log('CPC mpo igual');
                                  console.log(contmin );
                                  contminnull=0;
                                }
                                else
                                {
                                  contmin =contmin  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contmin );
                             contminnull=0;
                                }
                              }
                              else
                              {
                                contminnull=1;
                                 console.log(contmin );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinima[i]["C 20 hasta 8 Ton"]>0 ) {
                                  contmin =1;
                                   console.log('via diferente');
                                   contminnull=0;
                                  console.log(contmin );
                                }
                                else
                                {
                                contmin =0;
                                contminnull=1;
                                }
                              }

                          }

                        if (contmin ==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contmin ==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contmin ==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contmin >3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contminnull==1)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                  ////////// Campo ["C 20 hasta 10 Ton"] ///////////////////////////////
                      ModalidadTodasconOrdenGA  = _.orderBy(ModalidadTodasconOrdenGA , [Modalidadaduotm2010 => Modalidadaduotm2010.Destino.toLowerCase(),Modalidadotm2010 => Modalidadotm2010.Origen.toLowerCase(),Modalidadotm2010 => parseFloat(Modalidadotm2010["C 20 hasta 10 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenGA );

                     var contGA =0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGA[i]["C 20 hasta 10 Ton"]>0){
                                 contGA = contGA  + 1;
                                 console.log('i es o');
                                 console.log(contGA );
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                            if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGA[i]["C 20 hasta 10 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["C 20 hasta 10 Ton"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["C 20 hasta 10 Ton"]))
                                {
                                  contGA = contGA ;
                                  console.log('CPC mpo igual');
                                  console.log(contGA );
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA =contGA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGA );
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGA[i]["C 20 hasta 10 Ton"]>0 ) {
                                  contGA =1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA );
                                }
                                else
                                {
                                contGA =0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA ==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA ==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA ==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA >3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                    ////////// Campo ["C 20 hasta 17 Ton"]

                    ModalidadTodasconOrdenCA  = _.orderBy(ModalidadTodasconOrdenCA , [Modalidadaduotm2017 => Modalidadaduotm2017.Destino.toLowerCase(),Modalidadotm2017 => Modalidadotm2017.Origen.toLowerCase(),Modalidadotm2017 => parseFloat(Modalidadotm2017["C 20 hasta 17 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenCA );

                     var contCA =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCA[i]["C 20 hasta 17 Ton"]>0){
                                 contCA = contCA  + 1;
                                 console.log('i es o');
                                 console.log(contCA );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                           if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCA[i]["C 20 hasta 17 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["C 20 hasta 17 Ton"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["C 20 hasta 17 Ton"]))
                                {
                                  contCA = contCA ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA );
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCA[i]["C 20 hasta 17 Ton"]>0 ) {
                                  contCA =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA );
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                      ////////// Campo ["C 20 hasta 19 Ton"]

                 ModalidadTodasconOrdenGAII  = _.orderBy(ModalidadTodasconOrdenGAII , [Modalidadaduotm2019 => Modalidadaduotm2019.Destino.toLowerCase(),Modalidadotm2019 => Modalidadotm2019.Origen.toLowerCase(),Modalidadotm2019 => parseFloat(Modalidadotm2019["C 20 hasta 19 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenGAII );

                     var contGAII =0;
                     var contGAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAII[i]["C 20 hasta 19 Ton"]>0){
                                 contGAII = contGAII  + 1;
                                 console.log('i es o');
                                 console.log(contGAII );
                                 contGAIInull=0;
                                }
                                  else
                                 {contGAIInull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAII[i]["C 20 hasta 19 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["C 20 hasta 19 Ton"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["C 20 hasta 19 Ton"]))
                                {
                                  contGAII = contGAII ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAII );
                                  contGAIInull=0;
                                }
                                else
                                {
                                  contGAII =contGAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAII );
                             contGAIInull=0;
                                }
                              }
                              else
                              {
                                contGAIInull=1;
                                 console.log(contGAII );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAII[i]["C 20 hasta 19 Ton"]>0 ) {
                                  contGAII =1;
                                   console.log('via diferente');
                                   contGAIInull=0;
                                  console.log(contGAII );
                                }
                                else
                                {
                                contGAII =0;
                                contGAIInull=1;
                                }
                              }

                          }

                        if (contGAII ==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAII ==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAII ==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAII >3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIInull==1)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                       ////////// Campo ["C 20 hasta 20 Ton"]
                        ModalidadTodasconOrdenCAII  = _.orderBy(ModalidadTodasconOrdenCAII , [Modalidadaduotm2020 => Modalidadaduotm2020.Destino.toLowerCase(),Modalidadotm2020 => Modalidadotm2020.Origen.toLowerCase(),Modalidadotm2020 => parseFloat(Modalidadotm2020["C 20 hasta 20 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenCAII );

                     var contCAII =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAII[i]["C 20 hasta 20 Ton"]>0){
                                 contCAII = contCAII  + 1;
                                 console.log('i es o');
                                 console.log(contCAII );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAII[i]["C 20 hasta 20 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["C 20 hasta 20 Ton"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["C 20 hasta 20 Ton"]))
                                {
                                  contCAII = contCAII ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAII );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAII =contCAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII );
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAII[i]["C 20 hasta 20 Ton"]>0 ) {
                                  contCAII =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII );
                                }
                                else
                                {
                                contCAII =0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAII ==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAII ==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAII ==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAII >3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                      ////////// Campo ["C 20 hasta 21 Ton"]

                    ModalidadTodasconOrdenGAIII  = _.orderBy(ModalidadTodasconOrdenGAIII , [Modalidadaduotm2021 => Modalidadaduotm2021.Destino.toLowerCase(),Modalidadotm2021 => Modalidadotm2021.Origen.toLowerCase(),Modalidadotm2021 => parseFloat(Modalidadotm2021["C 20 hasta 21 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenGAIII );

                     var contGAIII =0;
                     var contGAIIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAIII[i]["C 20 hasta 21 Ton"]>0){
                                 contGAIII = contGAIII  + 1;
                                 console.log('i es o');
                                 console.log(contGAIII );
                                 contGAIIInull=0;
                                }
                                  else
                                 {contGAIIInull=1;}
                           }
                         else
                          {
                            if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAIII[i]["C 20 hasta 21 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i]["C 20 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenGAIII[i-1]["C 20 hasta 21 Ton"]))
                                {
                                  contGAIII = contGAIII ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAIII );
                                  contGAIIInull=0;
                                }
                                else
                                {
                                  contGAIII =contGAIII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAIII );
                             contGAIIInull=0;
                                }
                              }
                              else
                              {
                                contGAIIInull=1;
                                 console.log(contGAIII );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAIII[i]["C 20 hasta 21 Ton"]>0 ) {
                                  contGAIII =1;
                                   console.log('via diferente');
                                   contGAIIInull=0;
                                  console.log(contGAIII );
                                }
                                else
                                {
                                contGAIII =0;
                                contGAIIInull=1;
                                }
                              }

                          }

                        if (contGAIII ==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIII ==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIII ==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIII >3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIIInull==1)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                          console.log('balnco 2');
                        }


                      }
                   ////////// Campo ["C 20 hasta 25 Ton"]

                    ModalidadTodasconOrdenCAIII   = _.orderBy(ModalidadTodasconOrdenCAIII  , [Modalidadaduotm2025 => Modalidadaduotm2025.Destino.toLowerCase(),Modalidadotm2025 => Modalidadotm2025.Origen.toLowerCase(),Modalidadotm2025 => parseFloat(Modalidadotm2025["C 20 hasta 25 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenCAIII  );

                     var contCAIII  =0;
                     var contCAIIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAIII[i]["C 20 hasta 25 Ton"]>0){
                                 contCAIII  = contCAIII  + 1;
                                 console.log('i es o');
                                 console.log(contCAIII  );
                                 contCAIIInull=0;
                                }
                                  else
                                 {contCAIIInull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAIII[i]["C 20 hasta 25 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAIII[i]["C 20 hasta 25 Ton"]) == parseFloat(ModalidadTodasconOrdenCAIII[i-1]["C 20 hasta 25 Ton"]))
                                {
                                  contCAIII  = contCAIII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAIII  );
                                  contCAIIInull=0;
                                }
                                else
                                {
                                  contCAIII  =contCAIII   + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAIII  );
                             contCAIIInull=0;
                                }
                              }
                              else
                              {
                                contCAIIInull=1;
                                 console.log(contCAIII  );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAIII[i]["C 20 hasta 25 Ton"]>0 ) {
                                  contCAIII  =1;
                                   console.log('via diferente');
                                   contCAIIInull=0;
                                  console.log(contCAIII  );
                                }
                                else
                                {
                                contCAIII =0;
                                contCAIIInull=1;
                                }
                              }

                          }

                        if (contCAIII  ==1)
                        {
                               ModalidadTodasconOrdenCAIII [i].AduC2025Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAIII  ==2)
                        {
                               ModalidadTodasconOrdenCAIII [i].AduC2025Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAIII  ==3)
                        {
                               ModalidadTodasconOrdenCAIII [i].AduC2025Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAIII  >3)
                        {
                          ModalidadTodasconOrdenCAIII [i].AduC2025Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIIInull==1)
                        {
                          ModalidadTodasconOrdenCAIII [i].AduC2025Pintada = [];
                          console.log('balnco 2');
                        }


                      }

              /////////////////// ////////// Campo ["C 40 hasta 15 Ton"]  ////////////////////////////////////////////

                     ModalidadTodasconOrdenCPC   = _.orderBy(ModalidadTodasconOrdenCPC  , [Modalidadaduotm4015 => Modalidadaduotm4015.Destino.toLowerCase(),Modalidadotm4015 => Modalidadotm4015.Origen.toLowerCase(),Modalidadotm4015 => parseFloat(Modalidadotm4015["C 40 hasta 15 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenCPC  );

                     var contCPC  =0;
                     var contCPCnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPC.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCPC[i]["C 40 hasta 15 Ton"]>0){
                                 contCPC  = contCPC   + 1;
                                 console.log('i es o');
                                 console.log(contCPC  );
                                 contCPCnull=0;
                                }
                                  else
                                 {contCPCnull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCPC[i]["C 40 hasta 15 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCPC[i]["C 40 hasta 15 Ton"]) == parseFloat(ModalidadTodasconOrdenCPC[i-1]["C 40 hasta 15 Ton"]))
                                {
                                  contCPC = contCPC  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCPC  );
                                  contCPCnull=0;
                                }
                                else
                                {
                                  contCPC =contCPC  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCPC  );
                             contCPCnull=0;
                                }
                              }
                              else
                              {
                                contCPCnull=1;
                                 console.log(contCPC  );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCPC[i]["C 40 hasta 15 Ton"]>0 ) {
                                  contCPC  =1;
                                   console.log('via diferente');
                                   contCPCnull=0;
                                  console.log(contCPC  );
                                }
                                else
                                {
                                contCPC =0;
                                contCPCnull=1;
                                }
                              }

                          }

                        if (contCPC ==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCPC ==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCPC ==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCPC >3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCPCnull==1)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                   ////////// Campo ["C 40 hasta 16 Ton"]////////////////////////////

                    ModalidadTodasconOrdenotros   = _.orderBy(ModalidadTodasconOrdenotros  , [Modalidadaduotm4016 => Modalidadaduotm4016.Destino.toLowerCase(),Modalidadotm4016 => Modalidadotm4016.Origen.toLowerCase(),Modalidadotm4016 => parseFloat(Modalidadotm4016["C 40 hasta 16 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenotros  );

                     var contOTRO  =0;
                     var contOTROnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotros.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenotros[i]["C 40 hasta 16 Ton"]>0){
                                 contOTRO  = contOTRO   + 1;
                                 console.log('i es o');
                                 console.log(contOTRO  );
                                 contOTROnull=0;
                                }
                                  else
                                 {contOTROnull=1;}
                           }
                         else
                          {
                            if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenotros[i]["C 40 hasta 16 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenotros[i]["C 40 hasta 16 Ton"]) == parseFloat(ModalidadTodasconOrdenotros[i-1]["C 40 hasta 16 Ton"]))
                                {
                                  contOTRO = contOTRO  ;
                                  console.log('CPC mpo igual');
                                  console.log(contOTRO  );
                                  contOTROnull=0;
                                }
                                else
                                {
                                  contOTRO =contOTRO  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contOTRO  );
                             contOTROnull=0;
                                }
                              }
                              else
                              {
                                contOTROnull=1;
                                 console.log(contOTRO  );
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenotros[i]["C 40 hasta 16 Ton"]>0 ) {
                                  contOTRO  =1;
                                   console.log('via diferente');
                                   contOTROnull=0;
                                  console.log(contOTRO  );
                                }
                                else
                                {
                                contOTRO =0;
                                contOTROnull=1;
                                }
                              }

                          }

                        if (contOTRO ==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contOTRO ==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contOTRO ==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contOTRO >3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contOTROnull==1)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                  ////////// Campo ["C 40 hasta 17 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4017   = _.orderBy(ModalidadTodasconOrdenC4017  , [Modalidadaduotm4017 => Modalidadaduotm4017.Destino.toLowerCase(),Modalidadotm4017 => Modalidadotm4017.Origen.toLowerCase(),Modalidadotm4017 => parseFloat(Modalidadotm4017["C 40 hasta 17 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC4017  );

                     var contC4017  =0;
                     var contC4017null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4017.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4017[i]["C 40 hasta 17 Ton"]>0){
                                 contC4017  = contC4017   + 1;
                                 console.log('i es o');
                                 console.log(contC4017  );
                                 contC4017null=0;
                                }
                                  else
                                 {contC4017null=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4017[i]["C 40 hasta 17 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4017[i]["C 40 hasta 17 Ton"]) == parseFloat(ModalidadTodasconOrdenC4017[i-1]["C 40 hasta 17 Ton"]))
                                {
                                  contC4017 = contC4017  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4017  );
                                  contC4017null=0;
                                }
                                else
                                {
                                  contC4017 =contC4017  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4017);
                             contC4017null=0;
                                }
                              }
                              else
                              {
                                contC4017null=1;
                                 console.log(contC4017);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4017[i]["C 40 hasta 17 Ton"]>0 ) {
                                  contC4017  =1;
                                   console.log('via diferente');
                                   contC4017null=0;
                                  console.log(contC4017);
                                }
                                else
                                {
                                contC4017 =0;
                                contC4017null=1;
                                }
                              }

                          }

                        if (contC4017 ==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4017 ==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4017 ==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4017 >3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4017null==1)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                   ////////// Campo ["C 40 hasta 17-18 Ton"]////////////////////////////

                   ModalidadTodasconOrdenC401718   = _.orderBy(ModalidadTodasconOrdenC401718  , [Modalidadaduotm401718 => Modalidadaduotm401718.Destino.toLowerCase(),Modalidadotm401718 => Modalidadotm401718.Origen.toLowerCase(),Modalidadotm401718 => parseFloat(Modalidadotm401718["C 40 hasta 17-18 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC401718  );

                     var contC401718  =0;
                     var contC401718null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC401718.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC401718[i]["C 40 hasta 17-18 Ton"]>0){
                                 contC401718  = contC401718   + 1;
                                 console.log('i es o');
                                 console.log(contC401718  );
                                 contC401718null=0;
                                }
                                  else
                                 {contC401718null=1;}
                           }
                         else
                          {
                            if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC401718[i]["C 40 hasta 17-18 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC401718[i]["C 40 hasta 17-18 Ton"]) == parseFloat(ModalidadTodasconOrdenC401718[i-1]["C 40 hasta 17-18 Ton"]))
                                {
                                  contC401718 = contC401718  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC401718  );
                                  contC401718null=0;
                                }
                                else
                                {
                                  contC401718 =contC401718  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC401718);
                             contC401718null=0;
                                }
                              }
                              else
                              {
                                contC401718null=1;
                                 console.log(contC401718);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC401718[i]["C 40 hasta 17-18 Ton"]>0 ) {
                                  contC401718  =1;
                                   console.log('via diferente');
                                   contC401718null=0;
                                  console.log(contC401718);
                                }
                                else
                                {
                                contC401718 =0;
                                contC401718null=1;
                                }
                              }

                          }

                        if (contC401718 ==1)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC401718 ==2)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC401718 ==3)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC401718 >3)
                        {
                          ModalidadTodasconOrdenC401718[i].AduC401718Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC401718null==1)
                        {
                          ModalidadTodasconOrdenC401718[i].AduC401718Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                   ////////// Campo ["C 40 hasta 20 Ton"]////////////////////////////

                             ModalidadTodasconOrdenC4020   = _.orderBy(ModalidadTodasconOrdenC4020  , [Modalidadaduotm4020 => Modalidadaduotm4020.Destino.toLowerCase(),Modalidadotm4020 => Modalidadotm4020.Origen.toLowerCase(),Modalidadotm4020 => parseFloat(Modalidadotm4020["C 40 hasta 20 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC4020  );

                     var contC4020  =0;
                     var contC4020null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4020.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4020[i]["C 40 hasta 20 Ton"]>0){
                                 contC4020  = contC4020   + 1;
                                 console.log('i es o');
                                 console.log(contC4020  );
                                 contC4020null=0;
                                }
                                  else
                                 {contC4020null=1;}
                           }
                         else
                          {
                            if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4020[i]["C 40 hasta 20 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4020[i]["C 40 hasta 20 Ton"]) == parseFloat(ModalidadTodasconOrdenC4020[i-1]["C 40 hasta 20 Ton"]))
                                {
                                  contC4020 = contC4020  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4020  );
                                  contC4020null=0;
                                }
                                else
                                {
                                  contC4020 =contC4020  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4020);
                             contC4020null=0;
                                }
                              }
                              else
                              {
                                contC4020null=1;
                                 console.log(contC4020);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4020[i]["C 40 hasta 20 Ton"]>0 ) {
                                  contC4020  =1;
                                   console.log('via diferente');
                                   contC4020null=0;
                                  console.log(contC4020);
                                }
                                else
                                {
                                contC4020 =0;
                                contC4020null=1;
                                }
                              }

                          }

                        if (contC4020 ==1)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4020 ==2)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4020 ==3)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4020 >3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4020null==1)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                         ////////// Campo ["C 40 hasta 21 Ton"]////////////////////////////

                   ModalidadTodasconOrdenC4021   = _.orderBy(ModalidadTodasconOrdenC4021  , [Modalidadaduotm4021 => Modalidadaduotm4021.Destino.toLowerCase(),Modalidadotm4021 => Modalidadotm4021.Origen.toLowerCase(),Modalidadotm4021 => parseFloat(Modalidadotm4021["C 40 hasta 21 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC4021  );

                     var contC4021  =0;
                     var contC4021null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4021.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4021[i]["C 40 hasta 21 Ton"]>0){
                                 contC4021  = contC4021   + 1;
                                 console.log('i es o');
                                 console.log(contC4021  );
                                 contC4021null=0;
                                }
                                  else
                                 {contC4021null=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4021[i]["C 40 hasta 21 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4021[i]["C 40 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenC4021[i-1]["C 40 hasta 21 Ton"]))
                                {
                                  contC4021 = contC4021  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4021  );
                                  contC4021null=0;
                                }
                                else
                                {
                                  contC4021 =contC4021  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4021);
                             contC4021null=0;
                                }
                              }
                              else
                              {
                                contC4021null=1;
                                 console.log(contC4021);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4021[i]["C 40 hasta 21 Ton"]>0 ) {
                                  contC4021  =1;
                                   console.log('via diferente');
                                   contC4021null=0;
                                  console.log(contC4021);
                                }
                                else
                                {
                                contC4021 =0;
                                contC4021null=1;
                                }
                              }

                          }

                        if (contC4021 ==1)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4021 ==2)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4021 ==3)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4021 >3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4021null==1)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                     ////////// Campo ["C 40 hasta 22 Ton"]////////////////////////////
 ModalidadTodasconOrdenC4022   = _.orderBy(ModalidadTodasconOrdenC4022  , [Modalidadaduotm4022 => Modalidadaduotm4022.Destino.toLowerCase(),Modalidadotm4022 => Modalidadotm4022.Origen.toLowerCase(),Modalidadotm4022 => parseFloat(Modalidadotm4022["C 40 hasta 22 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC4022  );

                     var contC4022  =0;
                     var contC4022null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4022.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4022[i]["C 40 hasta 22 Ton"]>0){
                                 contC4022  = contC4022   + 1;
                                 console.log('i es o');
                                 console.log(contC4022  );
                                 contC4022null=0;
                                }
                                  else
                                 {contC4022null=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4022[i]["C 40 hasta 22 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4022[i]["C 40 hasta 22 Ton"]) == parseFloat(ModalidadTodasconOrdenC4022[i-1]["C 40 hasta 22 Ton"]))
                                {
                                  contC4022 = contC4022  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4022  );
                                  contC4022null=0;
                                }
                                else
                                {
                                  contC4022 =contC4022  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4022);
                             contC4022null=0;
                                }
                              }
                              else
                              {
                                contC4022null=1;
                                 console.log(contC4022);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4022[i]["C 40 hasta 22 Ton"]>0 ) {
                                  contC4022  =1;
                                   console.log('via diferente');
                                   contC4022null=0;
                                  console.log(contC4022);
                                }
                                else
                                {
                                contC4022 =0;
                                contC4022null=1;
                                }
                              }

                          }

                        if (contC4022 ==1)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4022 ==2)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4022 ==3)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4022 >3)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4022null==1)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                          console.log('balnco 2');
                        }


                      }
                       ////////// Campo ["C 40 hasta 30 Ton"]////////////////////////////

                   ModalidadTodasconOrdenC4030   = _.orderBy(ModalidadTodasconOrdenC4030  , [Modalidadaduotm4030 => Modalidadaduotm4030.Destino.toLowerCase(),Modalidadotm4030 => Modalidadotm4030.Origen.toLowerCase(),Modalidadotm4030 => parseFloat(Modalidadotm4030["C 40 hasta 30 Ton"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC4030  );

                     var contC4030  =0;
                     var contC4030null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4030.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4030[i]["C 40 hasta 30 Ton"]>0){
                                 contC4030  = contC4030   + 1;
                                 console.log('i es o');
                                 console.log(contC4030  );
                                 contC4030null=0;
                                }
                                  else
                                 {contC4030null=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4030[i]["C 40 hasta 30 Ton"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4030[i]["C 40 hasta 30 Ton"]) == parseFloat(ModalidadTodasconOrdenC4030[i-1]["C 40 hasta 30 Ton"]))
                                {
                                  contC4030 = contC4030  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4030  );
                                  contC4030null=0;
                                }
                                else
                                {
                                  contC4030 =contC4030  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4030);
                             contC4030null=0;
                                }
                              }
                              else
                              {
                                contC4030null=1;
                                 console.log(contC4030);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4030[i]["C 40 hasta 30 Ton"]>0 ) {
                                  contC4030  =1;
                                   console.log('via diferente');
                                   contC4030null=0;
                                  console.log(contC4030);
                                }
                                else
                                {
                                contC4030 =0;
                                contC4030null=1;
                                }
                              }

                          }

                        if (contC4030 ==1)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4030 ==2)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4030 ==3)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4030 >3)
                        {
                          ModalidadTodasconOrdenC4030[i].AduC4030Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4030null==1)
                        {
                          ModalidadTodasconOrdenC4030[i].AduC4030Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                     ////////// Campo ["Devolucion 20$ estandar"]////////////////////////////

                    ModalidadTodasconOrdenC20EST   = _.orderBy(ModalidadTodasconOrdenC20EST  , [Modalidadaduotm20EST => Modalidadaduotm20EST.Destino.toLowerCase(),Modalidadotm20EST => Modalidadotm20EST.Origen.toLowerCase(),Modalidadotm20EST => parseFloat(Modalidadotm20EST["Devolucion 20$ estandar"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC20EST  );

                     var contC20EST  =0;
                     var contC20ESTnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC20EST.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC20EST[i]["Devolucion 20$ estandar"]>0){
                                 contC20EST  = contC20EST   + 1;
                                 console.log('i es o');
                                 console.log(contC20EST  );
                                 contC20ESTnull=0;
                                }
                                  else
                                 {contC20ESTnull=1;}
                           }
                         else
                          {
                            if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC20EST[i]["Devolucion 20$ estandar"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC20EST[i]["Devolucion 20$ estandar"]) == parseFloat(ModalidadTodasconOrdenC20EST[i-1]["Devolucion 20$ estandar"]))
                                {
                                  contC20EST = contC20EST  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC20EST  );
                                  contC20ESTnull=0;
                                }
                                else
                                {
                                  contC20EST =contC20EST  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC20EST);
                             contC20ESTnull=0;
                                }
                              }
                              else
                              {
                                contC20ESTnull=1;
                                 console.log(contC20EST);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC20EST[i]["Devolucion 20$ estandar"]>0 ) {
                                  contC20EST  =1;
                                   console.log('via diferente');
                                   contC20ESTnull=0;
                                  console.log(contC20EST);
                                }
                                else
                                {
                                contC20EST =0;
                                contC20ESTnull=1;
                                }
                              }

                          }

                        if (contC20EST ==1)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC20EST ==2)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC20EST ==3)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC20EST >3)
                        {
                          ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = [];
                          console.log('balnco 1');
                        }
                        if (contC20ESTnull==1)
                        {
                          ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = [];
                          console.log('balnco 2');
                        }


                      }


                       ////////// Campo ["Devolucion 40$ estandar"]////////////////////////////

                  ModalidadTodasconOrdenC40EST   = _.orderBy(ModalidadTodasconOrdenC40EST  , [Modalidadaduotm40EST => Modalidadaduotm40EST.Destino.toLowerCase(),Modalidadotm40EST => Modalidadotm40EST.Origen.toLowerCase(),Modalidadotm40EST => parseFloat(Modalidadotm40EST["Devolucion 40$ estandar"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC40EST  );

                     var contC40EST  =0;
                     var contC40ESTnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC40EST.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC40EST[i]["Devolucion 40$ estandar"]>0){
                                 contC40EST  = contC40EST   + 1;
                                 console.log('i es o');
                                 console.log(contC40EST  );
                                 contC40ESTnull=0;
                                }
                                  else
                                 {contC40ESTnull=1;}
                           }
                         else
                          {
                            if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC40EST[i]["Devolucion 40$ estandar"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC40EST[i]["Devolucion 40$ estandar"]) == parseFloat(ModalidadTodasconOrdenC40EST[i-1]["Devolucion 40$ estandar"]))
                                {
                                  contC40EST = contC40EST  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC40EST  );
                                  contC40ESTnull=0;
                                }
                                else
                                {
                                  contC40EST =contC40EST  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC40EST);
                             contC40ESTnull=0;
                                }
                              }
                              else
                              {
                                contC40ESTnull=1;
                                 console.log(contC40EST);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC40EST[i]["Devolucion 40$ estandar"]>0 ) {
                                  contC40EST  =1;
                                   console.log('via diferente');
                                   contC40ESTnull=0;
                                  console.log(contC40EST);
                                }
                                else
                                {
                                contC40EST =0;
                                contC40ESTnull=1;
                                }
                              }

                          }

                        if (contC40EST ==1)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC40EST ==2)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC40EST ==3)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC40EST >3)
                        {
                          ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = [];
                          console.log('balnco 1');
                        }
                        if (contC40ESTnull==1)
                        {
                          ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = [];
                          console.log('balnco 2');
                        }


                      }


                        ///// Campo ["Devolucion 20$ expreso"]////////////////////////////

                  ModalidadTodasconOrdenC20ESP   = _.orderBy(ModalidadTodasconOrdenC20ESP  , [Modalidadaduotm20ESP => Modalidadaduotm20ESP.Destino.toLowerCase(),Modalidadotm20ESP => Modalidadotm20ESP.Origen.toLowerCase(),Modalidadotm20ESP => parseFloat(Modalidadotm20ESP["Devolucion 20$ expreso"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC20ESP  );

                     var contC20ESP  =0;
                     var contC20ESPnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC20ESP.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC20ESP[i]["Devolucion 20$ expreso"]>0){
                                 contC20ESP  = contC20ESP   + 1;
                                 console.log('i es o');
                                 console.log(contC20ESP  );
                                 contC20ESPnull=0;
                                }
                                  else
                                 {contC20ESPnull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC20ESP[i]["Devolucion 20$ expreso"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC20ESP[i]["Devolucion 20$ expreso"]) == parseFloat(ModalidadTodasconOrdenC20ESP[i-1]["Devolucion 20$ expreso"]))
                                {
                                  contC20ESP = contC20ESP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC20ESP  );
                                  contC20ESPnull=0;
                                }
                                else
                                {
                                  contC20ESP =contC20ESP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC20ESP);
                             contC20ESPnull=0;
                                }
                              }
                              else
                              {
                                contC20ESPnull=1;
                                 console.log(contC20ESP);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC20ESP[i]["Devolucion 20$ expreso"]>0 ) {
                                  contC20ESP  =1;
                                   console.log('via diferente');
                                   contC20ESPnull=0;
                                  console.log(contC20ESP);
                                }
                                else
                                {
                                contC20ESP =0;
                                contC20ESPnull=1;
                                }
                              }

                          }

                        if (contC20ESP ==1)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC20ESP ==2)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC20ESP ==3)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC20ESP >3)
                        {
                          ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = [];
                          console.log('balnco 1');
                        }
                        if (contC20ESPnull==1)
                        {
                          ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = [];
                          console.log('balnco 2');
                        }


                      }


                          ///// Campo ["Devolucion 40$ expreso"]////////////////////////////

                      ModalidadTodasconOrdenC40ESP   = _.orderBy(ModalidadTodasconOrdenC40ESP  , [Modalidadaduotm40ESP => Modalidadaduotm40ESP.Destino.toLowerCase(),Modalidadotm40ESP => Modalidadotm40ESP.Origen.toLowerCase(),Modalidadotm40ESP => parseFloat(Modalidadotm40ESP["Devolucion 40$ expreso"],10)], ['asc','asc','asc']);
                      console.log(ModalidadTodasconOrdenC40ESP  );

                     var contC40ESP  =0;
                     var contC40ESPnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC40ESP.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC40ESP[i]["Devolucion 40$ expreso"]>0){
                                 contC40ESP  = contC40ESP   + 1;
                                 console.log('i es o');
                                 console.log(contC40ESP  );
                                 contC40ESPnull=0;
                                }
                                  else
                                 {contC40ESPnull=1;}
                           }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC40ESP[i]["Devolucion 40$ expreso"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC40ESP[i]["Devolucion 40$ expreso"]) == parseFloat(ModalidadTodasconOrdenC40ESP[i-1]["Devolucion 40$ expreso"]))
                                {
                                  contC40ESP = contC40ESP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC40ESP  );
                                  contC40ESPnull=0;
                                }
                                else
                                {
                                  contC40ESP =contC40ESP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC40ESP);
                             contC40ESPnull=0;
                                }
                              }
                              else
                              {
                                contC40ESPnull=1;
                                 console.log(contC40ESP);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC40ESP[i]["Devolucion 40$ expreso"]>0 ) {
                                  contC40ESP  =1;
                                   console.log('via diferente');
                                   contC40ESPnull=0;
                                  console.log(contC40ESP);
                                }
                                else
                                {
                                contC40ESP =0;
                                contC40ESPnull=1;
                                }
                              }

                          }

                        if (contC40ESP ==1)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC40ESP ==2)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC40ESP ==3)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC40ESP >3)
                        {
                          ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = [];
                          console.log('balnco 1');
                        }
                        if (contC40ESPnull==1)
                        {
                          ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = [];
                          console.log('balnco 2');
                        }


                      }
                           ModalidadTodasOtm=_.orderBy(ModalidadTodasOtm, [ModalidadTodasotm => ModalidadTodasotm.Destino.toLowerCase(),ModalidadTodasotm =>ModalidadTodasotm.Origen.toLowerCase(),ModalidadTodasotm =>ModalidadTodasotm.Email.toLowerCase()], ['asc','asc','asc']);

              /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldoExcel = ModalidadTodasOtm;
                       ModalidadTodasRespaldo = ModalidadTodasOtm;
                       $scope.ModalidadTodasOtm= ModalidadTodasOtm;

                       $scope.ModalidadTodasOtm = ModalidadTodasRespaldo.filter(function (el) {
                         return (
                                el.AduC2045Pintada.length > 0 ||
                                el.AduC8Pintada.length > 0 ||
                                el.AduC2010Pintada.length > 0 ||
                                el.AduC2017Pintada.length > 0 ||
                                el.AduC2019Pintada.length > 0 ||
                                el.AduC2020Pintada.length > 0 ||
                                el.AduC2021Pintada.length > 0 ||
                                el.AduC2025Pintada.length > 0 ||

                                el.AduC4015Pintada.length > 0 ||

                                el.AduC4016Pintada.length > 0 ||
                                el.AduC4017Pintada.length > 0 ||
                                el.AduC401718Pintada.length > 0 ||
                                el.AduC4020Pintada.length > 0 ||
                                el.AduC4021Pintada.length > 0 ||
                                el.AduC4022Pintada.length > 0 ||
                                el.AduC4030Pintada.length > 0 ||
                                el.AduC20ESTPintada.length > 0 ||
                                el.AduC40ESTPintada.length > 0 ||
                                el.AduC20ESPPintada.length > 0 ||
                                el.AduC40ESPPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodasOtm);
                 //$loading.finish('myloading');

                 ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadOTM = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodasOtm;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "OTM.xlsx");
               //$loading.finish('myloading');
              //saveAs(urlbase64, "Report.xls");

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
               }

            ////////////////////////////////////////////////////////////////////////////////////////////////
                    if (ModalidadConsolidado == 'MaritimasFcl') {
                         $scope.Show1=false;
                         $scope.Show20=false;
                        $scope.Show11=false;
                        $scope.Show111=false;
                        $scope.Show2=false;
                        $scope.Show3=false;
                        $scope.Show4=true;
                        $scope.Show5=false;
                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show1111=false;
                         $scope.Show12=false;
                        $scope.Show13=false;


                       angular.forEach($scope.ConsolidadoDatos, function(consmaritfcl) {
                         ModalidadDeUnProveedor = consmaritfcl.MaritimaFcl.MaritimasFcl
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consmaritfclprov) {
                              consmaritfclprov.Email = consmaritfcl.Email
                              ModalidadTodas.push(consmaritfclprov);
                             ModalidadTodasconOrden = ModalidadTodas;
                              ModalidadTodasconOrdenMinima = ModalidadTodas;
                              ModalidadTodasconOrdenGA = ModalidadTodas;
                              ModalidadTodasconOrdenGAII = ModalidadTodas;
                              ModalidadTodasconOrdenGAIII = ModalidadTodas;
                              ModalidadTodasconOrdenCA = ModalidadTodas;
                              ModalidadTodasconOrdenCAII = ModalidadTodas;
                              ModalidadTodasconOrdenCAIII = ModalidadTodas;
                              ModalidadTodasconOrdenCPC = ModalidadTodas;
                              ModalidadTodasconOrdenotros = ModalidadTodas;
                              ModalidadTodasconOrdenC4017 = ModalidadTodas;
                              ModalidadTodasconOrdenC401718 = ModalidadTodas;
                              ModalidadTodasconOrdenC4020 = ModalidadTodas;
                              ModalidadTodasconOrdenC4021 = ModalidadTodas;
                              ModalidadTodasconOrdenC4022 = ModalidadTodas;
                              ModalidadTodasconOrdenC4030 = ModalidadTodas;
                              ModalidadTodasconOrdenC20EST = ModalidadTodas;
                              ModalidadTodasconOrdenC40EST = ModalidadTodas;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodas;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodas;

                            });
                        });

                         ModalidadTodas = _.sortBy(ModalidadTodas, 'PuertoDestino','PuertoOrigen','PaisDestino');
                         console.log(ModalidadTodas);


                         ////////  Campo ["C 20"] //////////////////////////

                     ModalidadTodasconOrden   = _.orderBy(ModalidadTodasconOrden  , [Modalidadadmfcl => Modalidadadmfcl.PuertoDestino.toLowerCase(),Modalidadadmfcl => Modalidadadmfcl.PuertoOrigen.toLowerCase(), Modalidadadmfcl => Modalidadadmfcl.PaisDestino.toLowerCase(), Modalidadadmfcl => parseFloat(Modalidadadmfcl["C 20"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrden  );

                     var cont  =0;
                     var contnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrden[i]["C 20"]>0){
                                 cont  = cont   + 1;
                                 console.log('i es o');
                                 console.log(cont  );
                                 contnull=0;
                                }
                                  else
                                 {contnull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrden[i]["C 20"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrden[i]["C 20"]) == parseFloat(ModalidadTodasconOrden[i-1]["C 20"]))
                                {
                                  cont = cont  ;
                                  console.log('CPC mpo igual');
                                  console.log(cont  );
                                  contnull=0;
                                }
                                else
                                {
                                  cont =cont  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(cont);
                             contnull=0;
                                }
                              }
                              else
                              {
                                contnull=1;
                                 console.log(cont);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrden[i]["C 20"]>0 ) {
                                  cont  =1;
                                   console.log('via diferente');
                                   contnull=0;
                                  console.log(cont);
                                }
                                else
                                {
                                cont =0;
                                contnull=1;
                                }
                              }

                          }

                        if (cont ==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (cont ==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (cont ==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (cont >3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 2');
                        }


                      }
              ////////////////// ["Baf 20"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinima   = _.orderBy(ModalidadTodasconOrdenMinima  , [Modalidadadmfclbaf20 => Modalidadadmfclbaf20.PuertoDestino.toLowerCase(),Modalidadadmfclbaf20 => Modalidadadmfclbaf20.PuertoOrigen.toLowerCase(), Modalidadadmfclbaf20 => Modalidadadmfclbaf20.PaisDestino.toLowerCase(), Modalidadadmfclbaf20 => parseFloat(Modalidadadmfclbaf20["Baf 20"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenMinima  );

                     var contmin  =0;
                     var contminnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinima[i]["Baf 20"]>0){
                                 contmin  = contmin   + 1;
                                 console.log('i es o');
                                 console.log(contmin  );
                                 contminnull=0;
                                }
                                  else
                                 {contminnull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinima[i]["Baf 20"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["Baf 20"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["Baf 20"]))
                                {
                                  contmin = contmin  ;
                                  console.log('CPC mpo igual');
                                  console.log(contmin  );
                                  contminnull=0;
                                }
                                else
                                {
                                  contmin =contmin  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contmin);
                             contminnull=0;
                                }
                              }
                              else
                              {
                                contminnull=1;
                                 console.log(contmin);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinima[i]["Baf 20"]>0 ) {
                                  contmin  =1;
                                   console.log('via diferente');
                                   contminnull=0;
                                  console.log(contmin);
                                }
                                else
                                {
                                contmin =0;
                                contminnull=1;
                                }
                              }

                          }

                        if (contmin ==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contmin ==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contmin ==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contmin >3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contminnull==1)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                  ////////// Campo ["C 40"]///////////////////////////////

                  ModalidadTodasconOrdenGA   = _.orderBy(ModalidadTodasconOrdenGA  , [Modalidadadmfcl40 => Modalidadadmfcl40.PuertoDestino.toLowerCase(),Modalidadadmfcl40 => Modalidadadmfcl40.PuertoOrigen.toLowerCase(), Modalidadadmfcl40 => Modalidadadmfcl40.PaisDestino.toLowerCase(), Modalidadadmfcl40 => parseFloat(Modalidadadmfcl40["C 40"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGA  );

                     var contGA  =0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGA[i]["C 40"]>0){
                                 contGA  = contGA   + 1;
                                 console.log('i es o');
                                 console.log(contGA  );
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGA[i]["C 40"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["C 40"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["C 40"]))
                                {
                                  contGA = contGA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGA  );
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA =contGA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGA);
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGA[i]["C 40"]>0 ) {
                                  contGA  =1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA);
                                }
                                else
                                {
                                contGA =0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA ==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA ==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA ==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA >3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                    ////////// Campo ["Baf 40"]

                    ModalidadTodasconOrdenCA   = _.orderBy(ModalidadTodasconOrdenCA  , [Modalidadadmfclbaf40 => Modalidadadmfclbaf40.PuertoDestino.toLowerCase(),Modalidadadmfclbaf40 => Modalidadadmfclbaf40.PuertoOrigen.toLowerCase(), Modalidadadmfclbaf40 => Modalidadadmfclbaf40.PaisDestino.toLowerCase(), Modalidadadmfclbaf40 => parseFloat(Modalidadadmfclbaf40["Baf 40"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCA  );

                     var contCA  =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCA[i]["Baf 40"]>0){
                                 contCA  = contCA   + 1;
                                 console.log('i es o');
                                 console.log(contCA  );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCA[i]["Baf 40"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Baf 40"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Baf 40"]))
                                {
                                  contCA = contCA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA  );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCA[i]["Baf 40"]>0 ) {
                                  contCA  =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                      ////////// Campo ["C 40HC"]

                  ModalidadTodasconOrdenGAII   = _.orderBy(ModalidadTodasconOrdenGAII  , [Modalidadadmfclbaf40 => Modalidadadmfclbaf40.PuertoDestino.toLowerCase(),Modalidadadmfclbaf40 => Modalidadadmfclbaf40.PuertoOrigen.toLowerCase(), Modalidadadmfclbaf40 => Modalidadadmfclbaf40.PaisDestino.toLowerCase(), Modalidadadmfclbaf40 => parseFloat(Modalidadadmfclbaf40["C 40HC"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAII  );

                     var contGAII  =0;
                     var contGAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAII[i]["C 40HC"]>0){
                                 contGAII  = contGAII   + 1;
                                 console.log('i es o');
                                 console.log(contGAII  );
                                 contGAIInull=0;
                                }
                                  else
                                 {contGAIInull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAII[i]["C 40HC"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["C 40HC"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["C 40HC"]))
                                {
                                  contGAII = contGAII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAII  );
                                  contGAIInull=0;
                                }
                                else
                                {
                                  contGAII =contGAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAII);
                             contGAIInull=0;
                                }
                              }
                              else
                              {
                                contGAIInull=1;
                                 console.log(contGAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAII[i]["C 40HC"]>0 ) {
                                  contGAII  =1;
                                   console.log('via diferente');
                                   contGAIInull=0;
                                  console.log(contGAII);
                                }
                                else
                                {
                                contGAII =0;
                                contGAIInull=1;
                                }
                              }

                          }

                        if (contGAII ==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAII ==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAII ==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAII >3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIInull==1)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                       ////////// Campo ["Baf 40HC"]

                   ModalidadTodasconOrdenCAII   = _.orderBy(ModalidadTodasconOrdenCAII  , [Modalidadadmfclbaf40h => Modalidadadmfclbaf40h.PuertoDestino.toLowerCase(),Modalidadadmfclbaf40h => Modalidadadmfclbaf40h.PuertoOrigen.toLowerCase(), Modalidadadmfclbaf40h => Modalidadadmfclbaf40h.PaisDestino.toLowerCase(), Modalidadadmfclbaf40h => parseFloat(Modalidadadmfclbaf40h["Baf 40HC"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCAII  );

                     var contCAII  =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAII[i]["Baf 40HC"]>0){
                                 contCAII  = contCAII   + 1;
                                 console.log('i es o');
                                 console.log(contCAII  );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAII[i]["Baf 40HC"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["Baf 40HC"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["Baf 40HC"]))
                                {
                                  contCAII = contCAII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAII  );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAII =contCAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAII[i]["Baf 40HC"]>0 ) {
                                  contCAII  =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCAII =0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAII ==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAII ==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAII ==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAII >3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                      ////////// Campo Naviera

                    /* ModalidadTodasconOrdenGAIII   = _.orderBy(ModalidadTodasconOrdenGAIII  , [Modalidadadmfclnav => Modalidadadmfclnav.PuertoDestino.toLowerCase(),Modalidadadmfclnav => Modalidadadmfclnav.PuertoOrigen.toLowerCase(), Modalidadadmfclnav => Modalidadadmfclnav.PaisDestino.toLowerCase(), Modalidadadmfclnav => parseFloat(Modalidadadmfclnav.Naviera,10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAIII  );

                     var contGAIII  =0;
                     var contGAIIInull=0;
                     var iultimo=0;


                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAIII[i].Naviera>0){
                                 contGAIII  = contGAIII   + 1;
                                 console.log('i es o');
                                 console.log(contGAIII  );
                                 contGAIIInull=0;
                                }
                                  else
                                 {contGAIIInull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAIII[i].Naviera>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i].Naviera) == parseFloat(ModalidadTodasconOrdenGAIII[i-1].Naviera))
                                {
                                  contGAIII = contGAIII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAIII  );
                                  contGAIIInull=0;
                                }
                                else
                                {
                                  contGAIII =contGAIII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAIII);
                             contGAIIInull=0;
                                }
                              }
                              else
                              {
                                contGAIIInull=1;
                                 console.log(contGAIII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAIII[i].Naviera>0 ) {
                                  contGAIII  =1;
                                   console.log('via diferente');
                                   contGAIIInull=0;
                                  console.log(contGAIII);
                                }
                                else
                                {
                                contGAIII =0;
                                contGAIIInull=1;
                                }
                              }

                          }

                        if (contGAIII ==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIII ==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIII ==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIII >3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIIInull==1)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                          console.log('balnco 2');
                        }


                      }*/



                   ////////// Campo ["Gastos Embarque"]

                   ModalidadTodasconOrdenCAIII   = _.orderBy(ModalidadTodasconOrdenCAIII  , [Modalidadadmfclge => Modalidadadmfclge.PuertoDestino.toLowerCase(),Modalidadadmfclge => Modalidadadmfclge.PuertoOrigen.toLowerCase(), Modalidadadmfclge => Modalidadadmfclge.PaisDestino.toLowerCase(), Modalidadadmfclge => parseFloat(Modalidadadmfclge["Gastos Embarque"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCAIII  );

                     var contCAIII  =0;
                     var contCAIIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAIII[i]["Gastos Embarque"]>0){
                                 contCAIII  = contCAIII   + 1;
                                 console.log('i es o');
                                 console.log(contCAIII  );
                                 contCAIIInull=0;
                                }
                                  else
                                 {contCAIIInull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAIII[i]["Gastos Embarque"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAIII[i]["Gastos Embarque"]) == parseFloat(ModalidadTodasconOrdenCAIII[i-1]["Gastos Embarque"]))
                                {
                                  contCAIII = contCAIII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAIII  );
                                  contCAIIInull=0;
                                }
                                else
                                {
                                  contCAIII =contCAIII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAIII);
                             contCAIIInull=0;
                                }
                              }
                              else
                              {
                                contCAIIInull=1;
                                 console.log(contCAIII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAIII[i]["Gastos Embarque"]>0 ) {
                                  contCAIII  =1;
                                   console.log('via diferente');
                                   contCAIIInull=0;
                                  console.log(contCAIII);
                                }
                                else
                                {
                                contCAIII =0;
                                contCAIIInull=1;
                                }
                              }

                          }

                        if (contCAIII ==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAIII ==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAIII ==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAIII >3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIIInull==1)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                          console.log('balnco 2');
                        }


                      }



                          ////////// Campo ["C 20 + Baf 20 + Gastos Embarque"]

                   ModalidadTodasconOrdenCPC   = _.orderBy(ModalidadTodasconOrdenCPC  , [Modalidadadmfclsuma1 => Modalidadadmfclsuma1.PuertoDestino.toLowerCase(),Modalidadadmfclsuma1 => Modalidadadmfclsuma1.PuertoOrigen.toLowerCase(), Modalidadadmfclsuma1 => Modalidadadmfclsuma1.PaisDestino.toLowerCase(), Modalidadadmfclsuma1 => parseFloat(Modalidadadmfclsuma1["C 20 + Baf 20 + Gastos Embarque"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCPC  );

                     var contCPC  =0;
                     var contCPCnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPC.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCPC[i]["C 20 + Baf 20 + Gastos Embarque"]>0){
                                 contCPC  = contCPC   + 1;
                                 console.log('i es o');
                                 console.log(contCPC  );
                                 contCPCnull=0;
                                }
                                  else
                                 {contCPCnull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCPC[i]["C 20 + Baf 20 + Gastos Embarque"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCPC[i]["C 20 + Baf 20 + Gastos Embarque"]) == parseFloat(ModalidadTodasconOrdenCPC[i-1]["C 20 + Baf 20 + Gastos Embarque"]))
                                {
                                  contCPC = contCPC  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCPC  );
                                  contCPCnull=0;
                                }
                                else
                                {
                                  contCPC =contCPC  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCPC);
                             contCPCnull=0;
                                }
                              }
                              else
                              {
                                contCPCnull=1;
                                 console.log(contCPC);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCPC[i]["C 20 + Baf 20 + Gastos Embarque"]>0 ) {
                                  contCPC  =1;
                                   console.log('via diferente');
                                   contCPCnull=0;
                                  console.log(contCPC);
                                }
                                else
                                {
                                contCPC =0;
                                contCPCnull=1;
                                }
                              }

                          }

                        if (contCPC ==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCPC ==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCPC ==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCPC >3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCPCnull==1)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                   ////////// Campo ["C 40 + Baf 40 + Gastos Embarque"]////////////////////////////

                     ModalidadTodasconOrdenotros   = _.orderBy(ModalidadTodasconOrdenotros  , [Modalidadadmfclsuma2 => Modalidadadmfclsuma2.PuertoDestino.toLowerCase(),Modalidadadmfclsuma2 => Modalidadadmfclsuma2.PuertoOrigen.toLowerCase(), Modalidadadmfclsuma2 => Modalidadadmfclsuma2.PaisDestino.toLowerCase(), Modalidadadmfclsuma2 => parseFloat(Modalidadadmfclsuma2["C 40 + Baf 40 + Gastos Embarque"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenotros  );

                     var contOTRO  =0;
                     var contOTROnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotros.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenotros[i]["C 40 + Baf 40 + Gastos Embarque"]>0){
                                 contOTRO  = contOTRO   + 1;
                                 console.log('i es o');
                                 console.log(contOTRO  );
                                 contOTROnull=0;
                                }
                                  else
                                 {contOTROnull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenotros[i]["C 40 + Baf 40 + Gastos Embarque"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenotros[i]["C 40 + Baf 40 + Gastos Embarque"]) == parseFloat(ModalidadTodasconOrdenotros[i-1]["C 40 + Baf 40 + Gastos Embarque"]))
                                {
                                  contOTRO = contOTRO  ;
                                  console.log('CPC mpo igual');
                                  console.log(contOTRO  );
                                  contOTROnull=0;
                                }
                                else
                                {
                                  contOTRO =contOTRO  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contOTRO);
                             contOTROnull=0;
                                }
                              }
                              else
                              {
                                contOTROnull=1;
                                 console.log(contOTRO);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenotros[i]["C 40 + Baf 40 + Gastos Embarque"]>0 ) {
                                  contOTRO  =1;
                                   console.log('via diferente');
                                   contOTROnull=0;
                                  console.log(contOTRO);
                                }
                                else
                                {
                                contOTRO =0;
                                contOTROnull=1;
                                }
                              }

                          }

                        if (contOTRO ==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contOTRO ==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contOTRO ==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contOTRO >3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contOTROnull==1)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                  ////////// ["C 40HC + Baf 40HC + Gastos Embarque"]////////////////////////////

                     ModalidadTodasconOrdenC4017   = _.orderBy(ModalidadTodasconOrdenC4017  , [Modalidadadmfclsuma3 => Modalidadadmfclsuma3.PuertoDestino.toLowerCase(),Modalidadadmfclsuma3 => Modalidadadmfclsuma3.PuertoOrigen.toLowerCase(), Modalidadadmfclsuma3 => Modalidadadmfclsuma3.PaisDestino.toLowerCase(), Modalidadadmfclsuma3 => parseFloat(Modalidadadmfclsuma3["C 40HC + Baf 40HC + Gastos Embarque"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenC4017  );

                     var contC4017  =0;
                     var contC4017null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4017.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4017[i]["C 40HC + Baf 40HC + Gastos Embarque"]>0){
                                 contC4017  = contC4017   + 1;
                                 console.log('i es o');
                                 console.log(contC4017  );
                                 contC4017null=0;
                                }
                                  else
                                 {contC4017null=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4017[i]["C 40HC + Baf 40HC + Gastos Embarque"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4017[i]["C 40HC + Baf 40HC + Gastos Embarque"]) == parseFloat(ModalidadTodasconOrdenC4017[i-1]["C 40HC + Baf 40HC + Gastos Embarque"]))
                                {
                                  contC4017 = contC4017  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4017  );
                                  contC4017null=0;
                                }
                                else
                                {
                                  contC4017 =contC4017  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4017);
                             contC4017null=0;
                                }
                              }
                              else
                              {
                                contC4017null=1;
                                 console.log(contC4017);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4017[i]["C 40HC + Baf 40HC + Gastos Embarque"]>0 ) {
                                  contC4017  =1;
                                   console.log('via diferente');
                                   contC4017null=0;
                                  console.log(contC4017);
                                }
                                else
                                {
                                contC4017 =0;
                                contC4017null=1;
                                }
                              }

                          }

                        if (contC4017 ==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4017 ==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4017 ==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4017 >3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4017null==1)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                  /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodas=_.orderBy(ModalidadTodas, [ModalidadTodasmfcl => ModalidadTodasmfcl.PuertoDestino.toLowerCase(),ModalidadTodasmfcl =>ModalidadTodasmfcl.PuertoOrigen.toLowerCase(),ModalidadTodasmfcl =>ModalidadTodasmfcl.PaisDestino.toLowerCase(),ModalidadTodasmfcl =>ModalidadTodasmfcl.Email.toLowerCase()], ['asc','asc','asc','asc']);
                       //ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PuertoOrigen','PaisDestino','Email');
                       console.log(ModalidadTodas);
                       ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodas= ModalidadTodas;
                       $scope.ModalidadTodas = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                el.AduC8Pintada.length > 0 ||
                                el.AduC2010Pintada.length > 0 ||
                                el.AduC2017Pintada.length > 0 ||
                                el.AduC2019Pintada.length > 0 ||
                                el.AduC2020Pintada.length > 0 ||
                                el.AduC2025Pintada.length > 0 ||
                                //el.AduC2021Pintada.length > 0 ||
                                el.AduC4015Pintada.length > 0 ||
                                el.AduC4016Pintada.length > 0 ||
                                el.AduC4017Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);
                 //$loading.finish('myloading');

                           ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadMaritFCL = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodas;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "MaritimasFCL.xlsx");
              // $loading.finish('myloading');
              //saveAs(urlbase64, "Report.xls");

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }

                   }


                        ////////////////////////////////
                    if (ModalidadConsolidado == 'MaritimasLcl') {

                        $scope.Show1=false;
                        $scope.Show20=false;
                        $scope.Show11=false;
                        $scope.Show111=false;
                        $scope.Show2=false;
                        $scope.Show3=false;
                        $scope.Show4=false;
                        $scope.Show5=true;
                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show1111=false;
                         $scope.Show12=false;
                        $scope.Show13=false;

                       angular.forEach($scope.ConsolidadoDatos, function(consmaritlcl) {
                         ModalidadDeUnProveedor = consmaritlcl.MaritimaLcl.MaritimasLcl
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consmaritlclprov) {
                              consmaritlclprov.Email = consmaritlcl.Email
                              ModalidadTodas.push(consmaritlclprov);
                             ModalidadTodasconOrden = ModalidadTodas;
                              ModalidadTodasconOrdenMinima = ModalidadTodas;
                              ModalidadTodasconOrdenGA = ModalidadTodas;
                              ModalidadTodasconOrdenGAII = ModalidadTodas;
                              ModalidadTodasconOrdenGAIII = ModalidadTodas;
                              ModalidadTodasconOrdenCA = ModalidadTodas;
                              ModalidadTodasconOrdenCAII = ModalidadTodas;
                              ModalidadTodasconOrdenCAIII = ModalidadTodas;
                              ModalidadTodasconOrdenCPC = ModalidadTodas;
                              ModalidadTodasconOrdenotros = ModalidadTodas;
                              ModalidadTodasconOrdenC4017 = ModalidadTodas;
                              ModalidadTodasconOrdenC401718 = ModalidadTodas;
                              ModalidadTodasconOrdenC4020 = ModalidadTodas;
                              ModalidadTodasconOrdenC4021 = ModalidadTodas;
                              ModalidadTodasconOrdenC4022 = ModalidadTodas;
                              ModalidadTodasconOrdenC4030 = ModalidadTodas;
                              ModalidadTodasconOrdenC20EST = ModalidadTodas;
                              ModalidadTodasconOrdenC40EST = ModalidadTodas;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodas;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodas;

                            });
                        });

                        ModalidadTodas = _.sortBy(ModalidadTodas, 'PuertoDestino','PuertoOrigen','PaisDestino');
                         console.log(ModalidadTodas);

                         ////////  Campo Minima //////////////////////////

                     ModalidadTodasconOrden   = _.orderBy(ModalidadTodasconOrden  , [Modalidadadmlcl => Modalidadadmlcl.PuertoDestino.toLowerCase(),Modalidadadmlcl => Modalidadadmlcl.PuertoOrigen.toLowerCase(), Modalidadadmlcl => Modalidadadmlcl.PaisDestino.toLowerCase(), Modalidadadmlcl => parseFloat(Modalidadadmlcl.Minima,10)], ['asc','asc','asc','asc']);
                     console.log(ModalidadTodasconOrden  );

                     var cont  =0;
                     var contnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrden[i].Minima>0){
                                 cont  = cont   + 1;
                                 console.log('i es o');
                                 console.log(cont  );
                                 contnull=0;
                                }
                                  else
                                 {contnull=1;}
                           }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrden[i].Minima>0 ) {
                                if(parseFloat(ModalidadTodasconOrden[i].Minima) == parseFloat(ModalidadTodasconOrden[i-1].Minima))
                                {
                                  cont = cont  ;
                                  console.log('CPC mpo igual');
                                  console.log(cont  );
                                  contnull=0;
                                }
                                else
                                {
                                  cont =cont  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(cont);
                             contnull=0;
                                }
                              }
                              else
                              {
                                contnull=1;
                                 console.log(cont);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrden[i].Minima>0 ) {
                                  cont  =1;
                                   console.log('via diferente');
                                   contnull=0;
                                  console.log(cont);
                                }
                                else
                                {
                                cont =0;
                                contnull=1;
                                }
                              }

                          }

                        if (cont ==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (cont ==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (cont ==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (cont >3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 2');
                        }


                      }


              ////////////////// ["1-5 ton/M3"] ////////////////////////////////////

                     ModalidadTodasconOrdenMinima   = _.orderBy(ModalidadTodasconOrdenMinima  , [Modalidadadmlcl => Modalidadadmlcl.PuertoDestino.toLowerCase(),Modalidadadmlcl => Modalidadadmlcl.PuertoOrigen.toLowerCase(), Modalidadadmlcl => Modalidadadmlcl.PaisDestino.toLowerCase(), Modalidadadmlcl => parseFloat(Modalidadadmlcl["1-5 ton/M3"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenMinima  );

                     var contmin  =0;
                     var contminnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinima[i]["1-5 ton/M3"]>0){
                                 contmin  = contmin   + 1;
                                 console.log('i es o');
                                 console.log(contmin  );
                                 contminnull=0;
                                }
                                  else
                                 {contminnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinima[i]["1-5 ton/M3"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["1-5 ton/M3"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["1-5 ton/M3"]))
                                {
                                  contmin = contmin  ;
                                  console.log('CPC mpo igual');
                                  console.log(contmin  );
                                  contminnull=0;
                                }
                                else
                                {
                                  contmin =contmin  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contmin);
                             contminnull=0;
                                }
                              }
                              else
                              {
                                contminnull=1;
                                 console.log(contmin);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinima[i]["1-5 ton/M3"]>0 ) {
                                  contmin  =1;
                                   console.log('via diferente');
                                   contminnull=0;
                                  console.log(contmin);
                                }
                                else
                                {
                                contmin =0;
                                contminnull=1;
                                }
                              }

                          }

                        if (contmin ==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contmin ==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contmin ==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contmin >3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contminnull==1)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 2');
                        }


                      }
                  ////////// Campo ["5-8 ton/M3"]///////////////////////////////

                             ModalidadTodasconOrdenGA   = _.orderBy(ModalidadTodasconOrdenGA  , [Modalidadadmlcl58 => Modalidadadmlcl58.PuertoDestino.toLowerCase(),Modalidadadmlcl58 => Modalidadadmlcl58.PuertoOrigen.toLowerCase(), Modalidadadmlcl58 => Modalidadadmlcl58.PaisDestino.toLowerCase(), Modalidadadmlcl58 => parseFloat(Modalidadadmlcl58["5-8 ton/M3"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGA  );

                     var contGA  =0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGA[i]["5-8 ton/M3"]>0){
                                 contGA  = contGA   + 1;
                                 console.log('i es o');
                                 console.log(contGA  );
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGA[i]["5-8 ton/M3"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["5-8 ton/M3"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["5-8 ton/M3"]))
                                {
                                  contGA = contGA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGA  );
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA =contGA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGA);
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGA[i]["5-8 ton/M3"]>0 ) {
                                  contGA  =1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA);
                                }
                                else
                                {
                                contGA =0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA ==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA ==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA ==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA >3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                    ////////// Campo ["8-12 ton/M3"]

                    ModalidadTodasconOrdenCA   = _.orderBy(ModalidadTodasconOrdenCA  , [Modalidadadmlcl812 => Modalidadadmlcl812.PuertoDestino.toLowerCase(),Modalidadadmlcl812 => Modalidadadmlcl812.PuertoOrigen.toLowerCase(), Modalidadadmlcl812 => Modalidadadmlcl812.PaisDestino.toLowerCase(), Modalidadadmlcl812 => parseFloat(Modalidadadmlcl812["8-12 ton/M3"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCA  );

                     var contCA  =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCA[i]["8-12 ton/M3"]>0){
                                 contCA  = contCA   + 1;
                                 console.log('i es o');
                                 console.log(contCA  );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCA[i]["8-12 ton/M3"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["8-12 ton/M3"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["8-12 ton/M3"]))
                                {
                                  contCA = contCA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA  );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCA[i]["8-12 ton/M3"]>0 ) {
                                  contCA  =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                      ////////// Campo ["12-18 ton/M3"]

                   ModalidadTodasconOrdenGAII   = _.orderBy(ModalidadTodasconOrdenGAII  , [Modalidadadmlcl812 => Modalidadadmlcl812.PuertoDestino.toLowerCase(),Modalidadadmlcl812 => Modalidadadmlcl812.PuertoOrigen.toLowerCase(), Modalidadadmlcl812 => Modalidadadmlcl812.PaisDestino.toLowerCase(), Modalidadadmlcl812 => parseFloat(Modalidadadmlcl812["12-18 ton/M3"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAII  );

                     var contGAII  =0;
                     var contGAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAII[i]["12-18 ton/M3"]>0){
                                 contGAII  = contGAII   + 1;
                                 console.log('i es o');
                                 console.log(contGAII  );
                                 contGAIInull=0;
                                }
                                  else
                                 {contGAIInull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAII[i]["12-18 ton/M3"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["12-18 ton/M3"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["12-18 ton/M3"]))
                                {
                                  contGAII = contGAII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAII  );
                                  contGAIInull=0;
                                }
                                else
                                {
                                  contGAII =contGAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAII);
                             contGAIInull=0;
                                }
                              }
                              else
                              {
                                contGAIInull=1;
                                 console.log(contGAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAII[i]["12-18 ton/M3"]>0 ) {
                                  contGAII  =1;
                                   console.log('via diferente');
                                   contGAIInull=0;
                                  console.log(contGAII);
                                }
                                else
                                {
                                contGAII =0;
                                contGAIInull=1;
                                }
                              }

                          }

                        if (contGAII ==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAII ==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAII ==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAII >3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIInull==1)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                       ////////// Campo ["Gastos Embarque"]

                     ModalidadTodasconOrdenCAII   = _.orderBy(ModalidadTodasconOrdenCAII  , [Modalidadadmlclge => Modalidadadmlclge.PuertoDestino.toLowerCase(),Modalidadadmlclge => Modalidadadmlclge.PuertoOrigen.toLowerCase(), Modalidadadmlclge => Modalidadadmlclge.PaisDestino.toLowerCase(), Modalidadadmlclge => parseFloat(Modalidadadmlclge["Gastos Embarque"],10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCAII  );

                     var contCAII  =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAII[i]["Gastos Embarque"]>0){
                                 contCAII  = contCAII   + 1;
                                 console.log('i es o');
                                 console.log(contCAII  );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAII[i]["Gastos Embarque"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["Gastos Embarque"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["Gastos Embarque"]))
                                {
                                  contCAII = contCAII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAII  );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAII =contCAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAII[i]["Gastos Embarque"]>0 ) {
                                  contCAII  =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCAII =0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAII ==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAII ==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAII ==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAII >3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                      ////////// Campo Naviera

                  /*ModalidadTodasconOrdenGAIII   = _.orderBy(ModalidadTodasconOrdenGAIII  , [Modalidadadmlclnv => Modalidadadmlclnv.PuertoDestino.toLowerCase(),Modalidadadmlclnv => Modalidadadmlclnv.PuertoOrigen.toLowerCase(), Modalidadadmlclnv => Modalidadadmlclnv.PaisDestino.toLowerCase(), Modalidadadmlclnv => parseFloat(Modalidadadmlclnv.Naviera,10)], ['asc','asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAIII  );

                     var contGAIII  =0;
                     var contGAIIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAIII[i].Naviera>0){
                                 contGAIII  = contGAIII   + 1;
                                 console.log('i es o');
                                 console.log(contGAIII  );
                                 contGAIIInull=0;
                                }
                                  else
                                 {contGAIIInull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAIII[i].Naviera>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i].Naviera) == parseFloat(ModalidadTodasconOrdenGAIII[i-1].Naviera))
                                {
                                  contGAIII = contGAIII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAIII  );
                                  contGAIIInull=0;
                                }
                                else
                                {
                                  contGAIII =contGAIII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAIII);
                             contGAIIInull=0;
                                }
                              }
                              else
                              {
                                contGAIIInull=1;
                                 console.log(contGAIII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAIII[i].Naviera>0 ) {
                                  contGAIII  =1;
                                   console.log('via diferente');
                                   contGAIIInull=0;
                                  console.log(contGAIII);
                                }
                                else
                                {
                                contGAIII =0;
                                contGAIIInull=1;
                                }
                              }

                          }

                        if (contGAIII ==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIII ==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIII ==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIII >3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIIInull==1)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                          console.log('balnco 2');
                        }


                      }*/


                        /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodas=_.orderBy(ModalidadTodas, [ModalidadTodasmlcl => ModalidadTodasmlcl.PuertoDestino.toLowerCase(),ModalidadTodasmlcl =>ModalidadTodasmlcl.PuertoOrigen.toLowerCase(),ModalidadTodasmlcl =>ModalidadTodasmlcl.PaisDestino.toLowerCase(),ModalidadTodasmlcl =>ModalidadTodasmlcl.Email.toLowerCase()], ['asc','asc','asc','asc']);
                      // ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PuertoOrigen','PaisDestino','Email');
                       ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodas= ModalidadTodas;
                       $scope.ModalidadTodas = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                el.AduC2010Pintada.length > 0 ||
                                el.AduC2017Pintada.length > 0 ||
                                el.AduC2019Pintada.length > 0 ||
                                el.AduC2020Pintada.length > 0 ||
                                //el.AduC2021Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);
                 //$loading.finish('myloading');

                                        ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadMaritLCL = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodas;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "MaritimasLCL.xlsx");
               //$loading.finish('myloading');
              //saveAs(urlbase64, "Report.xls");

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }

                   }

                   ///////////////////////////////////////////////////////////////////////
                      if (ModalidadConsolidado == 'Terrestre Nacional') {
                         $scope.Show1=false;
                        $scope.Show11=false;
                        $scope.Show20=false;
                        $scope.Show111=false;
                        $scope.Show2=false;
                        $scope.Show3=false;
                        $scope.Show4=false;
                        $scope.Show5=false;
                        $scope.Show6=true;
                        $scope.Show7=true;
                        $scope.Show8=true;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show1111=false;
                         $scope.Show12=false;
                        $scope.Show13=false;


                          var ModalidadTodasT=[];
                       angular.forEach($scope.ConsolidadoDatos, function(consterrenacional) {
                         ModalidadDeUnProveedorTN = consterrenacional.TerreNacional.TerresNacional
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedorTN, function(consterrenacionalprov) {
                              consterrenacionalprov.Email = consterrenacional.Email
                              ModalidadTodasT.push(consterrenacionalprov);
                              ModalidadTodasconOrdenT = ModalidadTodasT;
                              ModalidadTodasconOrdenMinimaT = ModalidadTodasT;
                              ModalidadTodasconOrdenGAT = ModalidadTodasT;
                              ModalidadTodasconOrdenGAIIT = ModalidadTodasT;
                              ModalidadTodasconOrdenGAIIIT = ModalidadTodasT;
                              ModalidadTodasconOrdenCAT = ModalidadTodasT;
                              ModalidadTodasconOrdenCAIIT = ModalidadTodasT;
                              ModalidadTodasconOrdenCAIIIT = ModalidadTodasT;
                              ModalidadTodasconOrdenCPCT = ModalidadTodasT;
                              ModalidadTodasconOrdenotrosT = ModalidadTodasT;
                              ModalidadTodasconOrdenC4017T = ModalidadTodasT;
                              ModalidadTodasconOrdenC401718T = ModalidadTodasT;
                              ModalidadTodasconOrdenC4020T = ModalidadTodasT;
                              ModalidadTodasconOrdenC4021T = ModalidadTodasT;
                              ModalidadTodasconOrdenC4022T = ModalidadTodasT;
                              ModalidadTodasconOrdenC4030T = ModalidadTodasT;
                              ModalidadTodasconOrdenC20ESTT = ModalidadTodasT;
                              ModalidadTodasconOrdenC40ESTT = ModalidadTodasT;
                              ModalidadTodasconOrdenC20ESPT = ModalidadTodasT;
                              ModalidadTodasconOrdenC40ESPT = ModalidadTodasT;

                            });
                        });

                         ModalidadTodasT = _.sortBy(ModalidadTodasT, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodasT);


                         ////////  Campo ["Turbo Standar (150Cajas)"] //////////////////////////


                     ModalidadTodasconOrdenT = _.orderBy(ModalidadTodasconOrdenT,[Modalidadadtnn => Modalidadadtnn.PuertoDestino.toLowerCase(),Modalidadadtnn => Modalidadadtnn.PaisOrigen.toLowerCase(), Modalidadadtnn => parseFloat(Modalidadadtnn["Turbo Standar (150Cajas)"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenT);

                     var cont  =0;
                     var contnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenT.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenT[i]["Turbo Standar (150Cajas)"]>0){
                                 cont  = cont   + 1;
                                 console.log('i es o');
                                 console.log(cont  );
                                 contnull=0;
                                }
                                  else
                                 {contnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenT[i].PuertoDestino ==  ModalidadTodasconOrdenT[i-1].PuertoDestino) && ( ModalidadTodasconOrdenT[i].PaisOrigen ==  ModalidadTodasconOrdenT[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenT[i]["Turbo Standar (150Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenT[i]["Turbo Standar (150Cajas)"]) == parseFloat(ModalidadTodasconOrdenT[i-1]["Turbo Standar (150Cajas)"]))
                                {
                                  cont = cont  ;
                                  console.log('CPC mpo igual');
                                  console.log(cont  );
                                  contnull=0;
                                }
                                else
                                {
                                  cont =cont  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(cont);
                             contnull=0;
                                }
                              }
                              else
                              {
                                contnull=1;
                                 console.log(cont);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenT[i]["Turbo Standar (150Cajas)"]>0 ) {
                                  cont  =1;
                                   console.log('via diferente');
                                   contnull=0;
                                  console.log(cont);
                                }
                                else
                                {
                                cont =0;
                                contnull=1;
                                }
                              }

                          }

                        if (cont ==1)
                        {
                               ModalidadTodasconOrdenT[i].AduC2045Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (cont ==2)
                        {
                               ModalidadTodasconOrdenT[i].AduC2045Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (cont ==3)
                        {
                               ModalidadTodasconOrdenT[i].AduC2045Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (cont >3)
                        {
                          ModalidadTodasconOrdenT[i].AduC2045Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrdenT[i].AduC2045Pintada = [];
                          console.log('balnco 2');
                        }


                      }


              ////////////////// ["Turbo Especial"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinimaT= _.orderBy(ModalidadTodasconOrdenMinimaT,[Modalidadadtns => Modalidadadtns.PuertoDestino.toLowerCase(),Modalidadadtns => Modalidadadtns.PaisOrigen.toLowerCase(), Modalidadadtns => parseFloat(Modalidadadtns["Turbo Especial"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenMinimaT);

                     var contmin  =0;
                     var contminnull=0;
                     //var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinimaT.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinimaT[i]["Turbo Especial"]>0){
                                 contmin  = contmin   + 1;
                                 console.log('i es o');
                                 console.log(contmin  );
                                 contminnull=0;
                                }
                                  else
                                 {contminnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenMinimaT[i].PuertoDestino ==  ModalidadTodasconOrdenMinimaT[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinimaT[i].PaisOrigen ==  ModalidadTodasconOrdenMinimaT[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinimaT[i]["Turbo Especial"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinimaT[i]["Turbo Especial"]) == parseFloat(ModalidadTodasconOrdenMinimaT[i-1]["Turbo Especial"]))
                                {
                                  contmin = contmin  ;
                                  console.log('CPC mpo igual');
                                  console.log(contmin  );
                                  contminnull=0;
                                }
                                else
                                {
                                  contmin =contmin  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contmin);
                             contminnull=0;
                                }
                              }
                              else
                              {
                                contminnull=1;
                                 console.log(contmin);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinimaT[i]["Turbo Especial"]>0 ) {
                                  contmin  =1;
                                   console.log('via diferente');
                                   contminnull=0;
                                  console.log(contmin);
                                }
                                else
                                {
                                contmin =0;
                                contminnull=1;
                                }
                              }

                          }

                        if (contmin ==1)
                        {
                               ModalidadTodasconOrdenMinimaT[i].AduC8Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contmin ==2)
                        {
                               ModalidadTodasconOrdenMinimaT[i].AduC8Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contmin ==3)
                        {
                               ModalidadTodasconOrdenMinimaT[i].AduC8Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contmin >3)
                        {
                          ModalidadTodasconOrdenMinimaT[i].AduC8Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contminnull==1)
                        {
                          ModalidadTodasconOrdenMinimaT[i].AduC8Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                         ModalidadTodasT=_.orderBy(ModalidadTodasT, [ModalidadTodastn => ModalidadTodastn.PuertoDestino.toLowerCase(),ModalidadTodastn =>ModalidadTodastn.PaisOrigen.toLowerCase(),ModalidadTodastn =>ModalidadTodastn.Email.toLowerCase()], ['asc','asc','asc']);
                         //ModalidadTodasT= _.sortBy(ModalidadTodasT,'PuertoDestino','PaisOrigen','Email');
                         $scope.ModalidadTodasTerreNacionalTurbo=ModalidadTodasT;


                          /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldoT = ModalidadTodasT;
                       $scope.ModalidadTodasTerreNacionalTurbo= ModalidadTodasT;
                       $scope.ModalidadTodasTerreNacionalTurbo = ModalidadTodasRespaldoT.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodasT);

                       //Terrestre Nacional Sencillo

                        angular.forEach($scope.ConsolidadoDatos, function(consterrenacionalsenc) {
                         ModalidadDeUnProveedorTNS = consterrenacionalsenc.TerreNacionalSencillo.TerresNacionalSencillo
                         console.log( ModalidadDeUnProveedorTNS);
                            angular.forEach(ModalidadDeUnProveedorTNS, function(consterrenacionalsencprov) {
                              consterrenacionalsencprov.Email = consterrenacionalsenc.Email
                              ModalidadTodasTerreNacionalSencillo.push(consterrenacionalsencprov);
                              ModalidadTodasconOrdenS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenMinimaS =ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenGAS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenGAIIS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenGAIIIS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenCAS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenCAIIS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenCAIIIS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenCPCS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenotrosS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC4017S = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC401718S = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC4020SS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC4021S = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC4022S = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC4030S = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC20ESTS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC40ESTS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC20ESPS = ModalidadTodasTerreNacionalSencillo;
                              ModalidadTodasconOrdenC40ESPS = ModalidadTodasTerreNacionalSencillo;

                            });
                        });

                         ModalidadTodasTerreNacionalSencillo = _.sortBy(ModalidadTodasTerreNacionalSencillo, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodasTerreNacionalSencillo);


                              ////////// Campo ["Sencillo Standar (150Cajas)"]///////////////////////////////


                     ModalidadTodasconOrdenGAS   = _.orderBy(ModalidadTodasconOrdenGAS  , [Modalidadadtnss => Modalidadadtnss.PuertoDestino.toLowerCase(),Modalidadadtnss => Modalidadadtnss.PaisOrigen.toLowerCase(), Modalidadadtnss => parseFloat(Modalidadadtnss["Sencillo Standar (150Cajas)"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAS  );

                     var contGA  =0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAS.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAS[i]["Sencillo Standar (150Cajas)"]>0){
                                 contGA  = contGA   + 1;
                                 console.log('i es o');
                                 console.log(contGA  );
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenGAS[i].PuertoDestino ==  ModalidadTodasconOrdenGAS[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAS[i].PaisOrigen ==  ModalidadTodasconOrdenGAS[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAS[i]["Sencillo Standar (150Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAS[i]["Sencillo Standar (150Cajas)"]) == parseFloat(ModalidadTodasconOrdenGAS[i-1]["Sencillo Standar (150Cajas)"]))
                                {
                                  contGA = contGA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGA  );
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA =contGA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGA);
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAS[i]["Sencillo Standar (150Cajas)"]>0 ) {
                                  contGA  =1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA);
                                }
                                else
                                {
                                contGA =0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA ==1)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA ==2)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA ==3)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA >3)
                        {
                          ModalidadTodasconOrdenGAS[i].AduC2010Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                          ModalidadTodasconOrdenGAS[i].AduC2010Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                    ////////// Campo Sencillo Especial

                    ModalidadTodasconOrdenCAS   = _.orderBy(ModalidadTodasconOrdenCAS  , [ModalidadadtnsP => ModalidadadtnsP.PuertoDestino.toLowerCase(),ModalidadadtnsP => ModalidadadtnsP.PaisOrigen.toLowerCase(), ModalidadadtnsP => parseFloat(ModalidadadtnsP["Sencillo Especial"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCAS);

                     var contCA  =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAS.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAS[i]["Sencillo Especial"]>0){
                                 contCA  = contCA   + 1;
                                 console.log('i es o');
                                 console.log(contCA  );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenCAS[i].PuertoDestino ==  ModalidadTodasconOrdenCAS[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAS[i].PaisOrigen ==  ModalidadTodasconOrdenCAS[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAS[i]["Sencillo Especial"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAS[i]["Sencillo Especial"]) == parseFloat(ModalidadTodasconOrdenCAS[i-1]["Sencillo Especial"]))
                                {
                                  contCA = contCA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA  );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAS[i]["Sencillo Especial"]>0 ) {
                                  contCA  =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                          ModalidadTodasconOrdenCAS[i].AduC2017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenCAS[i].AduC2017Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                        //ModalidadTodasTerreNacionalSencillo= _.sortBy(ModalidadTodasTerreNacionalSencillo,'PuertoDestino','PaisOrigen','Email');
                        ModalidadTodasTerreNacionalSencillo=_.orderBy(ModalidadTodasTerreNacionalSencillo, [ModalidadTodastns => ModalidadTodastns.PuertoDestino.toLowerCase(),ModalidadTodastns =>ModalidadTodastns.PaisOrigen.toLowerCase(),ModalidadTodastns =>ModalidadTodastns.Email.toLowerCase()], ['asc','asc','asc']);
                        $scope.ModalidadTodasTerreNacionalSencillo=ModalidadTodasTerreNacionalSencillo;

                    /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasTerreNacionalSencillo;
                       $scope.ModalidadTodasTerreNacionalSencillo= ModalidadTodasTerreNacionalSencillo;
                       $scope.ModalidadTodasTerreNacionalSencillo = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2010Pintada.length > 0 ||
                                 el.AduC2017Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });



                        //Terrestre Nacional Patineta
                        angular.forEach($scope.ConsolidadoDatos, function(consterrenacionalpat) {
                         ModalidadDeUnProveedorTNP = consterrenacionalpat.TerreNacionalPatineta.TerresNacionalPatineta
                         console.log( ModalidadDeUnProveedorTNP);
                            angular.forEach(ModalidadDeUnProveedorTNP, function(consterrenacionalpatprov) {
                              consterrenacionalpatprov.Email = consterrenacionalpat.Email
                              ModalidadTodasPatineta.push(consterrenacionalpatprov);
                              ModalidadTodasconOrden = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenMinima = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenGA = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenGAII = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenGAIII = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenCA = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenCAII = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenCAIII = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenCPC =ModalidadTodasPatineta;
                              ModalidadTodasconOrdenotros = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC4017 = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC401718 = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC4020 = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC4021 = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC4022 = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC4030 = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC20EST = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC40EST = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodasPatineta;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodasPatineta;

                            });
                        });

                         ModalidadTodasPatineta = _.sortBy(ModalidadTodasPatineta, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodasPatineta);


                           ////////// Campo Minimula///////////////////////////////

                ModalidadTodasconOrdenGA   = _.orderBy(ModalidadTodasconOrdenGA  , [ModalidadadtnsPp => ModalidadadtnsPp.PuertoDestino.toLowerCase(),ModalidadadtnsPp => ModalidadadtnsPp.PaisOrigen.toLowerCase(), ModalidadadtnsPp => parseFloat(ModalidadadtnsPp.Minimula,10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGA);

                     var contGA  =0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGA[i].Minimula>0){
                                 contGA  = contGA   + 1;
                                 console.log('i es o');
                                 console.log(contGA  );
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGA[i].PaisOrigen ==  ModalidadTodasconOrdenGA[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGA[i].Minimula>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGA[i].Minimula) == parseFloat(ModalidadTodasconOrdenGA[i-1].Minimula))
                                {
                                  contGA = contGA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGA  );
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA =contGA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGA);
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGA[i].Minimula>0 ) {
                                  contGA  =1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA);
                                }
                                else
                                {
                                contGA =0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA ==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA ==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA ==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA >3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2019Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2019Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                    ////////// Campo ["Gran Danes"]

                    ModalidadTodasconOrdenCA   = _.orderBy(ModalidadTodasconOrdenCA  , [ModalidadadtnsPpg => ModalidadadtnsPpg.PuertoDestino.toLowerCase(),ModalidadadtnsPpg => ModalidadadtnsPpg.PaisOrigen.toLowerCase(), ModalidadadtnsPpg => parseFloat(ModalidadadtnsPpg["Gran Danes"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCA);

                     var contCA  =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCA[i]["Gran Danes"]>0){
                                 contCA  = contCA   + 1;
                                 console.log('i es o');
                                 console.log(contCA  );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PaisOrigen ==  ModalidadTodasconOrdenCA[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCA[i]["Gran Danes"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Gran Danes"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Gran Danes"]))
                                {
                                  contCA = contCA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA  );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCA[i]["Gran Danes"]>0 ) {
                                  contCA  =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2020Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                       // ModalidadTodasPatineta= _.sortBy(ModalidadTodasPatineta,'PuertoDestino','PaisOrigen','Email');
                        ModalidadTodasPatineta=_.orderBy(ModalidadTodasPatineta, [ModalidadTodastnp => ModalidadTodastnp.PuertoDestino.toLowerCase(),ModalidadTodastnp =>ModalidadTodastnp.PaisOrigen.toLowerCase(),ModalidadTodastnp =>ModalidadTodastnp.Email.toLowerCase()], ['asc','asc','asc']);

                        $scope.ModalidadTodasTerreNacionalPatineta=ModalidadTodasPatineta;

                        ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasPatineta;
                        $scope.ModalidadTodasTerreNacionalPatineta= ModalidadTodasPatineta;
                        $scope.ModalidadTodasTerreNacionalPatineta = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2019Pintada.length > 0 ||
                                 el.AduC2020Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                         //$loading.finish('myloading');

           ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadTerrestreNacional = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodasTerreNacionalTurbo;
              Data.ModalidadesProveedor2=$scope.ModalidadTodasTerreNacionalSencillo;
              Data.ModalidadesProveedor3=$scope.ModalidadTodasTerreNacionalPatineta;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "TerrestreNacional.xlsx");
               //$loading.finish('myloading');
              //saveAs(urlbase64, "Report.xls");

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }


                    }
                ///////////////////////////////////////////////////////////////////////////////

                    if (ModalidadConsolidado == 'Terrestre Urbano') {

                         $scope.Show1=false;
                        $scope.Show11=false;
                        $scope.Show20=false;
                        $scope.Show111=false;
                        $scope.Show2=false;
                        $scope.Show3=false;
                        $scope.Show4=false;
                        $scope.Show5=false;
                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=true;
                        $scope.Show10=true;
                        $scope.Show1111=true;
                        $scope.Show12=false;
                        $scope.Show13=false;
                        //Terrestre Urbano
                       angular.forEach($scope.ConsolidadoDatos, function(consterreurbano) {
                         ModalidadDeUnProveedorTU = consterreurbano.TerreUrbano.TerresUrbano
                         console.log( ModalidadDeUnProveedorTU);
                            angular.forEach(ModalidadDeUnProveedorTU, function(consterreurbanoprov) {
                              consterreurbanoprov.Email = consterreurbano.Email
                              ModalidadTodasUrbano.push(consterreurbanoprov);
                               ModalidadTodasconOrden = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenMinima = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenGA = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenGAII = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenGAIII = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenCA = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenCAII = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenCAIII = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenCPC = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenotros = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC4017 = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC401718 =ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC4020 = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC4021 = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC4022 = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC4030 = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC20EST = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC40EST = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodasUrbano;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodasUrbano;

                            });
                        });

                          ModalidadTodasUrbano = _.sortBy(ModalidadTodasUrbano, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodasUrbano);

                        ////////  ["Turbo (150Cajas)"] //////////////////////////

                     ModalidadTodasconOrden   = _.orderBy(ModalidadTodasconOrden  , [Modalidadadtu => Modalidadadtu.PuertoDestino.toLowerCase(),Modalidadadtu => Modalidadadtu.PaisOrigen.toLowerCase(), Modalidadadtu => parseFloat(Modalidadadtu["Turbo (150Cajas)"],10)], ['asc','asc','asc']);
                    console.log(ModalidadTodasconOrden);

                     var cont  =0;
                     var contnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrden[i]["Turbo (150Cajas)"]>0){
                                 cont  = cont   + 1;
                                 console.log('i es o');
                                 console.log(cont  );
                                 contnull=0;
                                }
                                  else
                                 {contnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PaisOrigen ==  ModalidadTodasconOrden[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrden[i]["Turbo (150Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrden[i]["Turbo (150Cajas)"]) == parseFloat(ModalidadTodasconOrden[i-1]["Turbo (150Cajas)"]))
                                {
                                  cont = cont  ;
                                  console.log('CPC mpo igual');
                                  console.log(cont  );
                                  contnull=0;
                                }
                                else
                                {
                                  cont =cont  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(cont);
                             contnull=0;
                                }
                              }
                              else
                              {
                                contnull=1;
                                 console.log(cont);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrden[i]["Turbo (150Cajas)"]>0 ) {
                                  cont  =1;
                                   console.log('via diferente');
                                   contnull=0;
                                  console.log(cont);
                                }
                                else
                                {
                                cont =0;
                                contnull=1;
                                }
                              }

                          }

                        if (cont ==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (cont ==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (cont ==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (cont >3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                          console.log('balnco 2');
                        }


                      }



              ////////////////// ["Turbo Especial (200Cajas)"]////////////////////////////////////
                  ModalidadTodasconOrdenMinima   = _.orderBy(ModalidadTodasconOrdenMinima  , [Modalidadadtut => Modalidadadtut.PuertoDestino.toLowerCase(),Modalidadadtut => Modalidadadtut.PaisOrigen.toLowerCase(), Modalidadadtut => parseFloat(Modalidadadtut["Turbo Especial (200Cajas)"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenMinima);

                     var contmin  =0;
                     var contminnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinima[i]["Turbo Especial (200Cajas)"]>0){
                                 contmin  = contmin   + 1;
                                 console.log('i es o');
                                 console.log(contmin  );
                                 contminnull=0;
                                }
                                  else
                                 {contminnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenMinima[i].PuertoDestino ==  ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinima[i]["Turbo Especial (200Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["Turbo Especial (200Cajas)"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["Turbo Especial (200Cajas)"]))
                                {
                                  contmin = contmin  ;
                                  console.log('CPC mpo igual');
                                  console.log(contmin  );
                                  contminnull=0;
                                }
                                else
                                {
                                  contmin =contmin  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contmin);
                             contminnull=0;
                                }
                              }
                              else
                              {
                                contminnull=1;
                                 console.log(contmin);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinima[i]["Turbo Especial (200Cajas)"]>0 ) {
                                  contmin  =1;
                                   console.log('via diferente');
                                   contminnull=0;
                                  console.log(contmin);
                                }
                                else
                                {
                                contmin =0;
                                contminnull=1;
                                }
                              }

                          }

                        if (contmin ==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contmin ==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contmin ==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contmin >3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contminnull==1)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                  ////////// Campo ["Sencillo (240Cajas)"]///////////////////////////////

                    ModalidadTodasconOrdenGA   = _.orderBy(ModalidadTodasconOrdenGA  , [Modalidadadtuts => Modalidadadtuts.PuertoDestino.toLowerCase(),Modalidadadtuts => Modalidadadtuts.PaisOrigen.toLowerCase(), Modalidadadtuts => parseFloat(Modalidadadtuts["Sencillo (240Cajas)"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGA);

                     var contGA  =0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGA[i]["Sencillo (240Cajas)"]>0){
                                 contGA  = contGA   + 1;
                                 console.log('i es o');
                                 console.log(contGA  );
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGA[i].PaisOrigen ==  ModalidadTodasconOrdenGA[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGA[i]["Sencillo (240Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["Sencillo (240Cajas)"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["Sencillo (240Cajas)"]))
                                {
                                  contGA = contGA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGA  );
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA =contGA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGA);
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGA[i]["Sencillo (240Cajas)"]>0 ) {
                                  contGA  =1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA);
                                }
                                else
                                {
                                contGA =0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA ==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA ==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA ==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA >3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                          console.log('balnco 2');
                        }


                      }



                    ////////// Campo ["Sencillo Especial (300Cajas)"]
                   ModalidadTodasconOrdenCA   = _.orderBy(ModalidadTodasconOrdenCA  , [Modalidadadtutse => Modalidadadtutse.PuertoDestino.toLowerCase(),Modalidadadtutse => Modalidadadtutse.PaisOrigen.toLowerCase(), Modalidadadtutse => parseFloat(Modalidadadtutse["Sencillo Especial (300Cajas)"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCA);

                     var contCA  =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCA[i]["Sencillo Especial (300Cajas)"]>0){
                                 contCA  = contCA   + 1;
                                 console.log('i es o');
                                 console.log(contCA  );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PaisOrigen ==  ModalidadTodasconOrdenCA[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCA[i]["Sencillo Especial (300Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Sencillo Especial (300Cajas)"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Sencillo Especial (300Cajas)"]))
                                {
                                  contCA = contCA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA  );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCA[i]["Sencillo Especial (300Cajas)"]>0 ) {
                                  contCA  =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                          console.log('balnco 2');
                        }


                      }
                      ////////// Campo ["C 40HC"] Minimula

                   ModalidadTodasconOrdenGAII   = _.orderBy(ModalidadTodasconOrdenGAII  , [Modalidadadtutsem => Modalidadadtutsem.PuertoDestino.toLowerCase(),Modalidadadtutsem => Modalidadadtutsem.PaisOrigen.toLowerCase(), Modalidadadtutsem => parseFloat(Modalidadadtutsem.Minimula,10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAII);

                     var contCA  =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAII[i].Minimula>0){
                                 contCA  = contCA   + 1;
                                 console.log('i es o');
                                 console.log(contCA  );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenGAII[i].PuertoDestino ==  ModalidadTodasconOrdenGAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAII[i].PaisOrigen ==  ModalidadTodasconOrdenGAII[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAII[i].Minimula>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i].Minimula) == parseFloat(ModalidadTodasconOrdenGAII[i-1].Minimula))
                                {
                                  contCA = contCA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA  );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAII[i].Minimula>0 ) {
                                  contCA  =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                       ////////// Campo ["Gran Danes"]

                      ModalidadTodasconOrdenGAII   = _.orderBy(ModalidadTodasconOrdenGAII  , [Modalidadadtutgd => Modalidadadtutgd.PuertoDestino.toLowerCase(),Modalidadadtutgd => Modalidadadtutgd.PaisOrigen.toLowerCase(), Modalidadadtutgd => parseFloat(Modalidadadtutgd["Gran Danes"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAII);

                     var contCAII  =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAII[i]["Gran Danes"]>0){
                                 contCAII  = contCAII   + 1;
                                 console.log('i es o');
                                 console.log(contCAII  );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenGAII[i].PuertoDestino ==  ModalidadTodasconOrdenGAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAII[i].PaisOrigen ==  ModalidadTodasconOrdenGAII[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAII[i]["Gran Danes"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["Gran Danes"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["Gran Danes"]))
                                {
                                  contCAII = contCAII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAII  );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAII =contCAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAII[i]["Gran Danes"]>0 ) {
                                  contCAII  =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCAII =0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAII ==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAII ==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAII ==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAII >3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2020Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                        //ModalidadTodasUrbano= _.sortBy(ModalidadTodasUrbano,'PuertoDestino','PaisOrigen','Email');
                        ModalidadTodasUrbano=_.orderBy(ModalidadTodasUrbano, [ModalidadTodastu => ModalidadTodastu.PuertoDestino.toLowerCase(),ModalidadTodastu =>ModalidadTodastu.PaisOrigen.toLowerCase(),ModalidadTodastu =>ModalidadTodastu.Email.toLowerCase()], ['asc','asc','asc']);
                          // ModalidadTodasPatineta=_.orderBy(ModalidadTodasPatineta, [ModalidadTodastnp => ModalidadTodastnp.PuertoDestino.toLowerCase(),ModalidadTodastnp =>ModalidadTodastnp.PaisOrigen.toLowerCase(),ModalidadTodastnp =>ModalidadTodastnp.Email.toLowerCase()], ['asc','asc','asc']);
                        $scope.ModalidadTodasTerreUrbano=ModalidadTodasUrbano;

                           ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasUrbano;
                        $scope.ModalidadTodasTerreUrbano= ModalidadTodasUrbano;
                        $scope.ModalidadTodasTerreUrbano = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                 el.AduC2010Pintada.length > 0 ||
                                 el.AduC2017Pintada.length > 0 ||
                                 el.AduC2019Pintada.length > 0 ||
                                 el.AduC2020Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });


                  ////////////////////////Terrestre Urbano Viaje
                       angular.forEach($scope.ConsolidadoDatos, function(consterreurbanoviaj) {
                         ModalidadDeUnProveedorTUV = consterreurbanoviaj.TerreUrbanoViaje.TerresUrbanoViaje
                         console.log( ModalidadDeUnProveedorTUV);
                            angular.forEach(ModalidadDeUnProveedorTUV, function(consterreurbanoviajprov) {
                              consterreurbanoviajprov.Email = consterreurbanoviaj.Email
                              ModalidadTodasTerreUrbanoViaje.push(consterreurbanoviajprov);
                              ModalidadTodasconOrdenv = ModalidadTodasTerreUrbanoViaje;

                              ModalidadTodasconOrdenMinimav = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenGAv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenGAIIv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenGAIIIv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenCAv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenCAIIv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenCAIIIv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenCPCv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenotrosv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC4017v = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC401718v = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC4020v = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC4021v = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC4022v = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC4030v = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC20ESTv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC40ESTv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC20ESPv = ModalidadTodasTerreUrbanoViaje;
                              ModalidadTodasconOrdenC40ESPv = ModalidadTodasTerreUrbanoViaje;

                             });

                        });

                         ModalidadTodasTerreUrbanoViaje = _.sortBy(ModalidadTodasTerreUrbanoViaje, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodasUrbano);

                      ////////// Campo ["Turbo (150Cajas)"]  /////////////////////////////////////////////

                      ModalidadTodasconOrdenGAIIIv = _.orderBy(ModalidadTodasconOrdenGAIIIv,[Modalidadadtutgdv => Modalidadadtutgdv.PuertoDestino.toLowerCase(),Modalidadadtutgdv => Modalidadadtutgdv.PaisOrigen.toLowerCase(), Modalidadadtutgdv => parseFloat(Modalidadadtutgdv["Turbo (150Cajas)"],10)], ['asc','asc','asc']);
                        console.log(ModalidadTodasconOrdenGAIIIv);

                     var contGAIIIv  =0;
                     var contGAIIIvnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIIIv.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAIIIv[i]["Turbo (150Cajas)"]>0){
                                 contGAIIIv  = contGAIIIv   + 1;
                                 console.log('i es o');
                                 console.log(contGAIIIv  );
                                 contGAIIIvnull=0;
                                }
                                  else
                                 {contGAIIIvnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenGAIIIv[i].PuertoDestino ==  ModalidadTodasconOrdenGAIIIv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAIIIv[i].PaisOrigen ==  ModalidadTodasconOrdenGAIIIv[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAIIIv[i]["Turbo (150Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAIIIv[i]["Turbo (150Cajas)"]) == parseFloat(ModalidadTodasconOrdenGAIIIv[i-1]["Turbo (150Cajas)"]))
                                {
                                  contGAIIIv = contGAIIIv  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAIIIv  );
                                  contGAIIIvnull=0;
                                }
                                else
                                {
                                  contGAIIIv =contGAIIIv  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAIIIv);
                             contGAIIIvnull=0;
                                }
                              }
                              else
                              {
                                contGAIIIvnull=1;
                                 console.log(contGAIIIv);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAIIIv[i]["Turbo (150Cajas)"]>0 ) {
                                  contGAIIIv  =1;
                                   console.log('via diferente');
                                   contGAIIIvnull=0;
                                  console.log(contGAIIIv);
                                }
                                else
                                {
                                contGAIIIv =0;
                                contGAIIIvnull=1;
                                }
                              }

                          }

                        if (contGAIIIv ==1)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIIIv ==2)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIIIv ==3)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIIIv >3)
                        {
                          ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIIIvnull==1)
                        {
                          ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = [];
                          console.log('balnco 2');
                        }


                      }


                   ////////// Campo ["Turbo Especial (200Cajas)"]

                     ModalidadTodasconOrdenCAIIIv   = _.orderBy(ModalidadTodasconOrdenCAIIIv , [Modalidadadtutgdve => Modalidadadtutgdve.PuertoDestino.toLowerCase(),Modalidadadtutgdve => Modalidadadtutgdve.PaisOrigen.toLowerCase(), Modalidadadtutgdve => parseFloat(Modalidadadtutgdve["Turbo Especial (200Cajas)"],10)], ['asc','asc','asc']);
                   console.log(ModalidadTodasconOrdenCAIIIv);

                     var contCAIII  =0;
                     var contCAIIInull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIIIv.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAIIIv[i]["Turbo Especial (200Cajas)"]>0){
                                 contCAIII  = contCAIII   + 1;
                                 console.log('i es o');
                                 console.log(contCAIII  );
                                 contCAIIInull=0;
                                }
                                  else
                                 {contCAIIInull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenCAIIIv[i].PuertoDestino ==  ModalidadTodasconOrdenCAIIIv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAIIIv[i].PaisOrigen ==  ModalidadTodasconOrdenCAIIIv[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAIIIv[i]["Turbo Especial (200Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAIIIv[i]["Turbo Especial (200Cajas)"]) == parseFloat(ModalidadTodasconOrdenCAIIIv[i-1]["Turbo Especial (200Cajas)"]))
                                {
                                  contCAIII = contCAIII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAIII  );
                                  contCAIIInull=0;
                                }
                                else
                                {
                                  contCAIII =contCAIII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAIII);
                             contCAIIInull=0;
                                }
                              }
                              else
                              {
                                contCAIIInull=1;
                                 console.log(contCAIII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAIIIv[i]["Turbo Especial (200Cajas)"]>0 ) {
                                  contCAIII  =1;
                                   console.log('via diferente');
                                   contCAIIInull=0;
                                  console.log(contCAIII);
                                }
                                else
                                {
                                contCAIII =0;
                                contCAIIInull=1;
                                }
                              }

                          }

                        if (contCAIII ==1)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAIII ==2)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAIII ==3)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAIII >3)
                        {
                          ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIIInull==1)
                        {
                          ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = [];
                          console.log('balnco 2');
                        }


                      }

                          ////////// Campo ["Sencillo (240Cajas)"]


             ModalidadTodasconOrdenCPCv   = _.orderBy(ModalidadTodasconOrdenCPCv  , [Modalidadadtutgdvec => Modalidadadtutgdvec.PuertoDestino.toLowerCase(),Modalidadadtutgdvec => Modalidadadtutgdvec.PaisOrigen.toLowerCase(), Modalidadadtutgdvec => parseFloat(Modalidadadtutgdvec["Sencillo (240Cajas)"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCPCv);

                     var contCPC  =0;
                     var contCPCnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPCv.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCPCv[i]["Sencillo (240Cajas)"]>0){
                                 contCPC  = contCPC   + 1;
                                 console.log('i es o');
                                 console.log(contCPC  );
                                 contCPCnull=0;
                                }
                                  else
                                 {contCPCnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenCPCv[i].PuertoDestino ==  ModalidadTodasconOrdenCPCv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCPCv[i].PaisOrigen ==  ModalidadTodasconOrdenCPCv[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCPCv[i]["Sencillo (240Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCPCv[i]["Sencillo (240Cajas)"]) == parseFloat(ModalidadTodasconOrdenCPCv[i-1]["Sencillo (240Cajas)"]))
                                {
                                  contCPC = contCPC  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCPC  );
                                  contCPCnull=0;
                                }
                                else
                                {
                                  contCPC =contCPC  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCPC);
                             contCPCnull=0;
                                }
                              }
                              else
                              {
                                contCPCnull=1;
                                 console.log(contCPC);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCPCv[i]["Sencillo (240Cajas)"]>0 ) {
                                  contCPC  =1;
                                   console.log('via diferente');
                                   contCPCnull=0;
                                  console.log(contCPC);
                                }
                                else
                                {
                                contCPC =0;
                                contCPCnull=1;
                                }
                              }

                          }

                        if (contCPC ==1)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCPC ==2)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCPC ==3)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCPC >3)
                        {
                          ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCPCnull==1)
                        {
                          ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = [];
                          console.log('balnco 2');
                        }


                      }

                   ////////// Campo ["Sencillo Especial (300Cajas)"]////////////////////////////

                   ModalidadTodasconOrdenotrosv   = _.orderBy(ModalidadTodasconOrdenotrosv  , [Modalidadadtutse => Modalidadadtutse.PuertoDestino.toLowerCase(),Modalidadadtutse => Modalidadadtutse.PaisOrigen.toLowerCase(), Modalidadadtutse => parseFloat(Modalidadadtutse["Sencillo Especial (300Cajas)"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenotrosv);

                     var contOTRO  =0;
                     var contOTROnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotrosv.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenotrosv[i]["Sencillo Especial (300Cajas)"]>0){
                                 contOTRO  = contOTRO   + 1;
                                 console.log('i es o');
                                 console.log(contOTRO  );
                                 contOTROnull=0;
                                }
                                  else
                                 {contOTROnull=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenotrosv[i].PuertoDestino ==  ModalidadTodasconOrdenotrosv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenotrosv[i].PaisOrigen ==  ModalidadTodasconOrdenotrosv[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenotrosv[i]["Sencillo Especial (300Cajas)"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenotrosv[i]["Sencillo Especial (300Cajas)"]) == parseFloat(ModalidadTodasconOrdenotrosv[i-1]["Sencillo Especial (300Cajas)"]))
                                {
                                  contOTRO = contOTRO  ;
                                  console.log('CPC mpo igual');
                                  console.log(contOTRO  );
                                  contOTROnull=0;
                                }
                                else
                                {
                                  contOTRO =contOTRO  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contOTRO);
                             contOTROnull=0;
                                }
                              }
                              else
                              {
                                contOTROnull=1;
                                 console.log(contOTRO);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenotrosv[i]["Sencillo Especial (300Cajas)"]>0 ) {
                                  contOTRO  =1;
                                   console.log('via diferente');
                                   contOTROnull=0;
                                  console.log(contOTRO);
                                }
                                else
                                {
                                contOTRO =0;
                                contOTROnull=1;
                                }
                              }

                          }

                        if (contOTRO ==1)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contOTRO ==2)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contOTRO ==3)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contOTRO >3)
                        {
                          ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = [];
                          console.log('balnco 1');
                        }
                        if (contOTROnull==1)
                        {
                          ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = [];
                          console.log('balnco 2');
                        }


                      }

                  ////////// Minimula////////////////////////////
                        ModalidadTodasconOrdenC4017v   = _.orderBy(ModalidadTodasconOrdenC4017v  , [Modalidadadtutsew => Modalidadadtutsew.PuertoDestino.toLowerCase(),Modalidadadtutsew => Modalidadadtutsew.PaisOrigen.toLowerCase(), Modalidadadtutsew => parseFloat(Modalidadadtutsew.Minimula,10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenC4017v);

                     var contC4017  =0;
                     var contC4017null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4017v.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4017v[i].Minimula>0){
                                 contC4017  = contC4017   + 1;
                                 console.log('i es o');
                                 console.log(contC4017  );
                                 contC4017null=0;
                                }
                                  else
                                 {contC4017null=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenC4017v[i].PuertoDestino ==  ModalidadTodasconOrdenC4017v[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4017v[i].PaisOrigen ==  ModalidadTodasconOrdenC4017v[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4017v[i].Minimula>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4017v[i].Minimula) == parseFloat(ModalidadTodasconOrdenC4017v[i-1].Minimula))
                                {
                                  contC4017 = contC4017  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4017  );
                                  contC4017null=0;
                                }
                                else
                                {
                                  contC4017 =contC4017  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4017);
                             contC4017null=0;
                                }
                              }
                              else
                              {
                                contC4017null=1;
                                 console.log(contC4017);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4017v[i].Minimula>0 ) {
                                  contC4017  =1;
                                   console.log('via diferente');
                                   contC4017null=0;
                                  console.log(contC4017);
                                }
                                else
                                {
                                contC4017 =0;
                                contC4017null=1;
                                }
                              }

                          }

                        if (contC4017 ==1)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4017 ==2)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4017 ==3)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4017 >3)
                        {
                          ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4017null==1)
                        {
                          ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = [];
                          console.log('balnco 2');
                        }


                      }

                          ////////// ["Gran Danes"]////////////////////////////

                      ModalidadTodasconOrdenC401718v   = _.orderBy(ModalidadTodasconOrdenC401718v  , [Modalidadadtutseww => Modalidadadtutseww.PuertoDestino.toLowerCase(),Modalidadadtutseww => Modalidadadtutseww.PaisOrigen.toLowerCase(), Modalidadadtutseww => parseFloat(Modalidadadtutseww["Gran Danes"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenC401718v);

                     var contC4017  =0;
                     var contC4017null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC401718v.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC401718v[i]["Gran Danes"]>0){
                                 contC4017  = contC4017   + 1;
                                 console.log('i es o');
                                 console.log(contC4017  );
                                 contC4017null=0;
                                }
                                  else
                                 {contC4017null=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenC401718v[i].PuertoDestino ==  ModalidadTodasconOrdenC401718v[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC401718v[i].PaisOrigen ==  ModalidadTodasconOrdenC401718v[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC401718v[i]["Gran Danes"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC401718v[i]["Gran Danes"]) == parseFloat(ModalidadTodasconOrdenC401718v[i-1]["Gran Danes"]))
                                {
                                  contC4017 = contC4017  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4017  );
                                  contC4017null=0;
                                }
                                else
                                {
                                  contC4017 =contC4017  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4017);
                             contC4017null=0;
                                }
                              }
                              else
                              {
                                contC4017null=1;
                                 console.log(contC4017);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC401718v[i]["Gran Danes"]>0 ) {
                                  contC4017  =1;
                                   console.log('via diferente');
                                   contC4017null=0;
                                  console.log(contC4017);
                                }
                                else
                                {
                                contC4017 =0;
                                contC4017null=1;
                                }
                              }

                          }

                        if (contC4017 ==1)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4017 ==2)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4017 ==3)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4017 >3)
                        {
                          ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4017null==1)
                        {
                          ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = [];
                          console.log('balnco 2');
                        }


                      }


                         //ModalidadTodasTerreUrbanoViaje= _.sortBy(ModalidadTodasTerreUrbanoViaje,'PuertoDestino','PaisOrigen','Email');
                        ModalidadTodasTerreUrbanoViaje=_.orderBy(ModalidadTodasTerreUrbanoViaje, [ModalidadTodastuv => ModalidadTodastuv.PuertoDestino.toLowerCase(),ModalidadTodastuv =>ModalidadTodastuv.PaisOrigen.toLowerCase(),ModalidadTodastuv =>ModalidadTodastuv.Email.toLowerCase()], ['asc','asc','asc']);
                        $scope.ModalidadTodasTerreUrbanoViaje=ModalidadTodasTerreUrbanoViaje;

                    ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldoTUV = ModalidadTodasTerreUrbanoViaje;
                        $scope.ModalidadTodasTerreUrbanoViaje= ModalidadTodasTerreUrbanoViaje;
                        $scope.ModalidadTodasTerreUrbanoViaje = ModalidadTodasRespaldoTUV.filter(function (el) {
                         return (el.AduC2021vPintada.length > 0 ||
                                 el.AduC2025vPintada.length > 0 ||
                                 el.AduC4015vPintada.length > 0 ||
                                 el.AduC4016vPintada.length > 0 ||
                                 el.AduC4017vPintada.length > 0 ||
                                 el.AduC401718vPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });

                /////////////////////////////Terrestre Urbano Tonelada //////////////////////////////
                       angular.forEach($scope.ConsolidadoDatos, function(consterreurbanoton) {
                         ModalidadDeUnProveedorTUT = consterreurbanoton.TerreUrbanoTonelada.TerresUrbanoTonelada
                         console.log( ModalidadDeUnProveedorTUT);
                            angular.forEach(ModalidadDeUnProveedorTUT, function(consterreurbanotonprov) {
                              consterreurbanotonprov.Email = consterreurbanoton.Email
                              ModalidadTodasTerreUrbanoTonelada.push(consterreurbanotonprov);
                             ModalidadTodasconOrden = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenMinima = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenGA = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenGAII = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenGAIII = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenCA = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenCAII = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenCAIII = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenCPC = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenotros = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC4017 = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC401718 = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC4020 = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC4021 = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC4022 = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC4030 = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC20EST = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC40EST = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodasTerreUrbanoTonelada;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodasTerreUrbanoTonelada;

                                });

                        });

                         ModalidadTodasTerreUrbanoTonelada = _.sortBy(ModalidadTodasTerreUrbanoTonelada, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodasTerreUrbanoTonelada);

                               ////////// Campo Turbo////////////////////////////

                   ModalidadTodasconOrdenC4020   = _.orderBy(ModalidadTodasconOrdenC4020  , [Modalidadadtut => Modalidadadtut.PuertoDestino.toLowerCase(),Modalidadadtut => Modalidadadtut.PaisOrigen.toLowerCase(), Modalidadadtut => parseFloat(Modalidadadtut.Turbo,10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenC4020);

                     var contC4020  =0;
                     var contC4020null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4020.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4020[i].Turbo>0){
                                 contC4020  = contC4020   + 1;
                                 console.log('i es o');
                                 console.log(contC4020  );
                                 contC4020null=0;
                                }
                                  else
                                 {contC4020null=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenC4020[i].PuertoDestino ==  ModalidadTodasconOrdenC4020[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4020[i].PaisOrigen ==  ModalidadTodasconOrdenC4020[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4020[i].Turbo>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4020[i].Turbo) == parseFloat(ModalidadTodasconOrdenC4020[i-1].Turbo))
                                {
                                  contC4020 = contC4020  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4020  );
                                  contC4020null=0;
                                }
                                else
                                {
                                  contC4020 =contC4020  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4020);
                             contC4020null=0;
                                }
                              }
                              else
                              {
                                contC4020null=1;
                                 console.log(contC4020);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4020[i].Turbo>0 ) {
                                  contC4020  =1;
                                   console.log('via diferente');
                                   contC4020null=0;
                                  console.log(contC4020);
                                }
                                else
                                {
                                contC4020 =0;
                                contC4020null=1;
                                }
                              }

                          }

                        if (contC4020 ==1)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4020 ==2)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4020 ==3)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4020 >3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4020null==1)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                         ////////// Campo Sencillo////////////////////////////

                          ModalidadTodasconOrdenC4021   = _.orderBy(ModalidadTodasconOrdenC4021  , [Modalidadadtut => Modalidadadtut.PuertoDestino.toLowerCase(),Modalidadadtut => Modalidadadtut.PaisOrigen.toLowerCase(), Modalidadadtut => parseFloat(Modalidadadtut.Sencillo,10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenC4021);

                     var contC4021  =0;
                     var contC4021null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4021.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4021[i].Sencillo>0){
                                 contC4021  = contC4021   + 1;
                                 console.log('i es o');
                                 console.log(contC4021  );
                                 contC4021null=0;
                                }
                                  else
                                 {contC4021null=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenC4021[i].PuertoDestino ==  ModalidadTodasconOrdenC4021[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4021[i].PaisOrigen ==  ModalidadTodasconOrdenC4021[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4021[i].Sencillo>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4021[i].Sencillo) == parseFloat(ModalidadTodasconOrdenC4021[i-1].Sencillo))
                                {
                                  contC4021 = contC4021  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4021  );
                                  contC4021null=0;
                                }
                                else
                                {
                                  contC4021 =contC4021  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4021);
                             contC4021null=0;
                                }
                              }
                              else
                              {
                                contC4021null=1;
                                 console.log(contC4021);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4021[i].Sencillo>0 ) {
                                  contC4021  =1;
                                   console.log('via diferente');
                                   contC4021null=0;
                                  console.log(contC4021);
                                }
                                else
                                {
                                contC4021 =0;
                                contC4021null=1;
                                }
                              }

                          }

                        if (contC4021 ==1)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4021 ==2)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4021 ==3)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4021 >3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4021null==1)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                     ////////// Campo Tractomula////////////////////////////

                      ModalidadTodasconOrdenC4022   = _.orderBy(ModalidadTodasconOrdenC4022  , [Modalidadadtutt => Modalidadadtutt.PuertoDestino.toLowerCase(),Modalidadadtutt => Modalidadadtutt.PaisOrigen.toLowerCase(), Modalidadadtutt => parseFloat(Modalidadadtutt.Tractomula,10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenC4022);

                     var contC4022  =0;
                     var contC4022null=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4022.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenC4022[i].Tractomula>0){
                                 contC4022  = contC4022   + 1;
                                 console.log('i es o');
                                 console.log(contC4022  );
                                 contC4022null=0;
                                }
                                  else
                                 {contC4022null=1;}
                           }
                         else
                          {
                             if(( ModalidadTodasconOrdenC4022[i].PuertoDestino ==  ModalidadTodasconOrdenC4022[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4022[i].PaisOrigen ==  ModalidadTodasconOrdenC4022[i-1].PaisOrigen))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenC4022[i].Tractomula>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4022[i].Tractomula) == parseFloat(ModalidadTodasconOrdenC4022[i-1].Tractomula))
                                {
                                  contC4022 = contC4022  ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4022  );
                                  contC4022null=0;
                                }
                                else
                                {
                                  contC4022 =contC4022  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contC4022);
                             contC4022null=0;
                                }
                              }
                              else
                              {
                                contC4022null=1;
                                 console.log(contC4022);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4022[i].Tractomula>0 ) {
                                  contC4022  =1;
                                   console.log('via diferente');
                                   contC4022null=0;
                                  console.log(contC4022);
                                }
                                else
                                {
                                contC4022 =0;
                                contC4022null=1;
                                }
                              }

                          }

                        if (contC4022 ==1)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4022 ==2)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4022 ==3)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4022 >3)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contC4022null==1)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                     // ModalidadTodasTerreUrbanoTonelada = _.sortBy(ModalidadTodasTerreUrbanoTonelada, 'PuertoDestino','PaisOrigen','Email');
                        ModalidadTodasTerreUrbanoTonelada=_.orderBy(ModalidadTodasTerreUrbanoTonelada, [ModalidadTodastut => ModalidadTodastut.PuertoDestino.toLowerCase(),ModalidadTodastut =>ModalidadTodastut.PaisOrigen.toLowerCase(),ModalidadTodastut =>ModalidadTodastut.Email.toLowerCase()], ['asc','asc','asc']);
                      $scope.ModalidadTodasTerreUrbanoTonelada= ModalidadTodasTerreUrbanoTonelada;

                     ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldoTUT = ModalidadTodasTerreUrbanoTonelada;
                        $scope.ModalidadTodasTerreUrbanoTonelada= ModalidadTodasTerreUrbanoTonelada;
                        $scope.ModalidadTodasTerreUrbanoTonelada = ModalidadTodasRespaldoTUT.filter(function (el) {
                         return (el.AduC4020Pintada.length > 0 ||
                                 el.AduC4021Pintada.length > 0 ||
                                 el.AduC4022Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                         //$loading.finish('myloading');

                             ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadTerrestreUrbano = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodasTerreUrbano;
              Data.ModalidadesProveedor2=$scope.ModalidadTodasTerreUrbanoViaje;
              Data.ModalidadesProveedor3=$scope.ModalidadTodasTerreUrbanoTonelada;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "TerrestreUrbano.xlsx");
               //$loading.finish('myloading');
              //saveAs(urlbase64, "Report.xls");

            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }

                    }

                    //////////////////////////////////////////////////////////////////////////////////

                      if (ModalidadConsolidado == 'Aereas') {
                          $scope.Show1=false;
                        $scope.Show11=false;
                        $scope.Show20=false;
                        $scope.Show111=false;
                        $scope.Show2=false;
                        $scope.Show3=false;
                        $scope.Show4=false;
                        $scope.Show5=false;
                        $scope.Show6=false;
                        $scope.Show7=false;
                        $scope.Show8=false;
                        $scope.Show9=false;
                        $scope.Show10=false;
                        $scope.Show1111=false;
                        $scope.Show12=true;
                        $scope.Show13=true;
                       angular.forEach($scope.ConsolidadoDatos, function(consotm) {
                         ModalidadDeUnProveedorAA = consotm.Aerea.Aereas
                            angular.forEach(ModalidadDeUnProveedorAA, function(consotmprov) {
                              consotmprov.Email = consotm.Email
                              ModalidadTodasAerea.push(consotmprov);
                              ModalidadTodasconOrdenAA =ModalidadTodasAerea;
                              ModalidadTodasconOrdenMinimaAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGAAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGAIIAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGAIIIAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCAAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCAIIAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCAIIIAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCPCAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenotrosAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4017AA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC401718AA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4020AA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4021AA =ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4022AA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4030AA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC20ESTAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC40ESTAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC20ESPAA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC40ESPAA = ModalidadTodasAerea;

                            });
                        });

                        ModalidadTodasAerea = _.sortBy(ModalidadTodasAerea,'Aeropuerto','Pais');
                         console.log(ModalidadTodasAerea);


                         ////////  Campo Minima //////////////////////////

                  ModalidadTodasconOrdenAA   = _.orderBy(ModalidadTodasconOrdenAA  , [Modalidadada => Modalidadada.Aeropuerto.toLowerCase(),Modalidadada => Modalidadada.Pais.toLowerCase(), Modalidadada => parseFloat(Modalidadada.Minima,10)], ['asc','asc','asc']);
          // console.log(ModalidadTodasconOrdenAAS  );

                     var cont  =0;
                     var contnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenAA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenAA[i].Minima>0){
                                 cont  = cont   + 1;
                                 console.log('i es o');
                                 console.log(cont  );
                                 contnull=0;
                                }
                                  else
                                 {contnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenAA[i].Aeropuerto ==  ModalidadTodasconOrdenAA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenAA[i].Pais ==  ModalidadTodasconOrdenAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenAA[i].Minima>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenAA[i].Minima) == parseFloat(ModalidadTodasconOrdenAA[i-1].Minima))
                                {
                                  cont = cont  ;
                                  console.log('CPC mpo igual');
                                  console.log(cont  );
                                  contnull=0;
                                }
                                else
                                {
                                  cont =cont  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(cont);
                             contnull=0;
                                }
                              }
                              else
                              {
                                contnull=1;
                                 console.log(cont);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenAA[i].Minima>0 ) {
                                  cont  =1;
                                   console.log('via diferente');
                                   contnull=0;
                                  console.log(cont);
                                }
                                else
                                {
                                cont =0;
                                contnull=1;
                                }
                              }

                          }

                        if (cont ==1)
                        {
                              ModalidadTodasconOrdenAA[i].AduC2045Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (cont ==2)
                        {
                              ModalidadTodasconOrdenAA[i].AduC2045Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (cont ==3)
                        {
                              ModalidadTodasconOrdenAA[i].AduC2045Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (cont >3)
                        {
                         ModalidadTodasconOrdenAA[i].AduC2045Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contnull==1)
                        {
                         ModalidadTodasconOrdenAA[i].AduC2045Pintada = [];
                          console.log('balnco 2');
                        }


                      }


              ////////////////// ["45"] ////////////////////////////////////

                    ModalidadTodasconOrdenMinimaAA   = _.orderBy(ModalidadTodasconOrdenMinimaAA  , [Modalidadada45 => Modalidadada45.Aeropuerto.toLowerCase(),Modalidadada45 => Modalidadada45.Pais.toLowerCase(), Modalidadada45 => parseFloat(Modalidadada45["45"],10)], ['asc','asc','asc']);
          // console.log(ModalidadTodasconOrdenMinimaAAS  );

                     var contmin  =0;
                     var contminnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinimaAA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinimaAA[i]["45"]>0){
                                 contmin  = contmin   + 1;
                                 console.log('i es o');
                                 console.log(contmin  );
                                 contminnull=0;
                                }
                                  else
                                 {contminnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenMinimaAA[i].Aeropuerto ==  ModalidadTodasconOrdenMinimaAA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenMinimaAA[i].Pais ==  ModalidadTodasconOrdenMinimaAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinimaAA[i]["45"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinimaAA[i]["45"]) == parseFloat(ModalidadTodasconOrdenMinimaAA[i-1]["45"]))
                                {
                                  contmin = contmin  ;
                                  console.log('CPC mpo igual');
                                  console.log(contmin  );
                                  contminnull=0;
                                }
                                else
                                {
                                  contmin =contmin  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contmin);
                             contminnull=0;
                                }
                              }
                              else
                              {
                                contminnull=1;
                                 console.log(contmin);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinimaAA[i]["45"]>0 ) {
                                  contmin  =1;
                                   console.log('via diferente');
                                   contminnull=0;
                                  console.log(contmin);
                                }
                                else
                                {
                                contmin =0;
                                contminnull=1;
                                }
                              }

                          }

                        if (contmin ==1)
                        {
                              ModalidadTodasconOrdenMinimaAA[i].AduC8Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contmin ==2)
                        {
                              ModalidadTodasconOrdenMinimaAA[i].AduC8Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contmin ==3)
                        {
                              ModalidadTodasconOrdenMinimaAA[i].AduC8Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contmin >3)
                        {
                         ModalidadTodasconOrdenMinimaAA[i].AduC8Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contminnull==1)
                        {
                         ModalidadTodasconOrdenMinimaAA[i].AduC8Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                  ////////// Campo ['+100'] ///////////////////////////////
                 ModalidadTodasconOrdenGAAA   = _.orderBy(ModalidadTodasconOrdenGAAA  , [Modalidadada100 => Modalidadada100.Aeropuerto.toLowerCase(),Modalidadada100 => Modalidadada100.Pais.toLowerCase(), Modalidadada100 => parseFloat(Modalidadada100['+100'],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAAA  );

                     var contGA  =0;
                     var contGAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAAA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAAA[i]['+100']>0){
                                 contGA  = contGA   + 1;
                                 console.log('i es o');
                                 console.log(contGA  );
                                 contGAnull=0;
                                }
                                  else
                                 {contGAnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenGAAA[i].Aeropuerto ==  ModalidadTodasconOrdenGAAA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAAA[i].Pais ==  ModalidadTodasconOrdenGAAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAAA[i]['+100']>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAAA[i]['+100']) == parseFloat(ModalidadTodasconOrdenGAAA[i-1]['+100']))
                                {
                                  contGA = contGA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGA  );
                                  contGAnull=0;
                                }
                                else
                                {
                                  contGA =contGA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGA);
                             contGAnull=0;
                                }
                              }
                              else
                              {
                                contGAnull=1;
                                 console.log(contGA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAAA[i]['+100']>0 ) {
                                  contGA  =1;
                                   console.log('via diferente');
                                   contGAnull=0;
                                  console.log(contGA);
                                }
                                else
                                {
                                contGA =0;
                                contGAnull=1;
                                }
                              }

                          }

                        if (contGA ==1)
                        {
                              ModalidadTodasconOrdenGAAA[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA ==2)
                        {
                              ModalidadTodasconOrdenGAAA[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGA ==3)
                        {
                              ModalidadTodasconOrdenGAAA[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA >3)
                        {
                         ModalidadTodasconOrdenGAAA[i].AduC2010Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAnull==1)
                        {
                         ModalidadTodasconOrdenGAAA[i].AduC2010Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                    ////////// Campo ['+300']

                    ModalidadTodasconOrdenCAAA   = _.orderBy(ModalidadTodasconOrdenCAAA  , [Modalidadada300 => Modalidadada300.Aeropuerto.toLowerCase(),Modalidadada300 => Modalidadada300.Pais.toLowerCase(), Modalidadada300 => parseFloat(Modalidadada300['+300'],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCAAA  );

                     var contCA  =0;
                     var contCAnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAAA.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAAA[i]['+300']>0){
                                 contCA  = contCA   + 1;
                                 console.log('i es o');
                                 console.log(contCA  );
                                 contCAnull=0;
                                }
                                  else
                                 {contCAnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenCAAA[i].Aeropuerto ==  ModalidadTodasconOrdenCAAA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAAA[i].Pais ==  ModalidadTodasconOrdenCAAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAAA[i]['+300']>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAAA[i]['+300']) == parseFloat(ModalidadTodasconOrdenCAAA[i-1]['+300']))
                                {
                                  contCA = contCA  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCA  );
                                  contCAnull=0;
                                }
                                else
                                {
                                  contCA =contCA  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCA);
                             contCAnull=0;
                                }
                              }
                              else
                              {
                                contCAnull=1;
                                 console.log(contCA);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAAA[i]['+300']>0 ) {
                                  contCA  =1;
                                   console.log('via diferente');
                                   contCAnull=0;
                                  console.log(contCA);
                                }
                                else
                                {
                                contCA =0;
                                contCAnull=1;
                                }
                              }

                          }

                        if (contCA ==1)
                        {
                              ModalidadTodasconOrdenCAAA[i].AduC2017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCA ==2)
                        {
                              ModalidadTodasconOrdenCAAA[i].AduC2017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCA ==3)
                        {
                              ModalidadTodasconOrdenCAAA[i].AduC2017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCA >3)
                        {
                         ModalidadTodasconOrdenCAAA[i].AduC2017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAnull==1)
                        {
                         ModalidadTodasconOrdenCAAA[i].AduC2017Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                      ////////// Campo ['+500']
                    ModalidadTodasconOrdenGAIIAA   = _.orderBy( ModalidadTodasconOrdenGAIIAA  , [Modalidadada500 => Modalidadada500.Aeropuerto.toLowerCase(),Modalidadada500 => Modalidadada500.Pais.toLowerCase(), Modalidadada500 => parseFloat(Modalidadada500['+500'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenGAIIAA  );

                     var contGAII  =0;
                     var contGAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIAA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenGAIIAA[i]['+500']>0){
                                 contGAII  = contGAII   + 1;
                                 console.log('i es o');
                                 console.log(contGAII  );
                                 contGAIInull=0;
                                }
                                  else
                                 {contGAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenGAIIAA[i].Aeropuerto ==   ModalidadTodasconOrdenGAIIAA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenGAIIAA[i].Pais ==   ModalidadTodasconOrdenGAIIAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenGAIIAA[i]['+500']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenGAIIAA[i]['+500']) == parseFloat( ModalidadTodasconOrdenGAIIAA[i-1]['+500']))
                                {
                                  contGAII = contGAII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAII  );
                                  contGAIInull=0;
                                }
                                else
                                {
                                  contGAII =contGAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAII);
                             contGAIInull=0;
                                }
                              }
                              else
                              {
                                contGAIInull=1;
                                 console.log(contGAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenGAIIAA[i]['+500']>0 ) {
                                  contGAII  =1;
                                   console.log('via diferente');
                                   contGAIInull=0;
                                  console.log(contGAII);
                                }
                                else
                                {
                                contGAII =0;
                                contGAIInull=1;
                                }
                              }

                          }

                        if (contGAII ==1)
                        {
                               ModalidadTodasconOrdenGAIIAA[i].AduC2019Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAII ==2)
                        {
                               ModalidadTodasconOrdenGAIIAA[i].AduC2019Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAII ==3)
                        {
                               ModalidadTodasconOrdenGAIIAA[i].AduC2019Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAII >3)
                        {
                          ModalidadTodasconOrdenGAIIAA[i].AduC2019Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIInull==1)
                        {
                          ModalidadTodasconOrdenGAIIAA[i].AduC2019Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                       ////////// Campo ['+1000']

                    ModalidadTodasconOrdenCAIIAA   = _.orderBy( ModalidadTodasconOrdenCAIIAA  , [Modalidadada1000 => Modalidadada1000.Aeropuerto.toLowerCase(),Modalidadada1000 => Modalidadada1000.Pais.toLowerCase(), Modalidadada1000 => parseFloat(Modalidadada1000['+1000'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenCAIIAA  );

                     var contCAII  =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIAA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenCAIIAA[i]['+1000']>0){
                                 contCAII  = contCAII   + 1;
                                 console.log('i es o');
                                 console.log(contCAII  );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenCAIIAA[i].Aeropuerto ==   ModalidadTodasconOrdenCAIIAA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenCAIIAA[i].Pais ==   ModalidadTodasconOrdenCAIIAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenCAIIAA[i]['+1000']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenCAIIAA[i]['+1000']) == parseFloat( ModalidadTodasconOrdenCAIIAA[i-1]['+1000']))
                                {
                                  contCAII = contCAII  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAII  );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAII =contCAII  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenCAIIAA[i]['+1000']>0 ) {
                                  contCAII  =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCAII =0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAII ==1)
                        {
                               ModalidadTodasconOrdenCAIIAA[i].AduC2020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAII ==2)
                        {
                               ModalidadTodasconOrdenCAIIAA[i].AduC2020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAII ==3)
                        {
                               ModalidadTodasconOrdenCAIIAA[i].AduC2020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAII >3)
                        {
                          ModalidadTodasconOrdenCAIIAA[i].AduC2020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAIIAA[i].AduC2020Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                      ////////// Campo ["FS min"]

                       ModalidadTodasconOrdenGAIIIAA   = _.orderBy( ModalidadTodasconOrdenGAIIIAA  , [Modalidadadafs => Modalidadadafs.Aeropuerto.toLowerCase(),Modalidadadafs => Modalidadadafs.Pais.toLowerCase(), Modalidadadafs => parseFloat(Modalidadadafs["FS min"],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenGAIIIAA );

                     var contGAIII =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIIAA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenGAIIIAA[i]["FS min"]>0){
                                 contGAIII = contGAIII  + 1;
                                 console.log('i es o');
                                 console.log(contGAIII );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenGAIIIAA[i].Aeropuerto ==   ModalidadTodasconOrdenGAIIIAA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenGAIIIAA[i].Pais ==   ModalidadTodasconOrdenGAIIIAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenGAIIIAA[i]["FS min"]>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenGAIIIAA[i]["FS min"]) == parseFloat( ModalidadTodasconOrdenGAIIIAA[i-1]["FS min"]))
                                {
                                  contGAIII= contGAIII ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAIII );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenGAIIIAA[i]["FS min"]>0 ) {
                                  contGAIII =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contGAIII=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIIIAA[i].AduC2021Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIIIAA[i].AduC2021Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIIIAA[i].AduC2021Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIIIAA[i].AduC2021Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenGAIIIAA[i].AduC2021Pintada = [];
                          console.log('balnco 2');
                        }


                      }



                   ////////// Campo ["Fs/kg"]
                             ModalidadTodasconOrdenCAIIIAA   = _.orderBy( ModalidadTodasconOrdenCAIIIAA  , [Modalidadadafs => Modalidadadafs.Aeropuerto.toLowerCase(),Modalidadadafs => Modalidadadafs.Pais.toLowerCase(), Modalidadadafs => parseFloat(Modalidadadafs["Fs/kg"],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenCAIIIAA);

                     var contCAIII =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIIAA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenCAIIIAA[i]["Fs/kg"]>0){
                                 contCAIII = contCAIII  + 1;
                                 console.log('i es o');
                                 console.log(contCAIII );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenCAIIIAA[i].Aeropuerto ==   ModalidadTodasconOrdenCAIIIAA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenCAIIIAA[i].Pais ==   ModalidadTodasconOrdenCAIIIAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenCAIIIAA[i]["Fs/kg"]>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenCAIIIAA[i]["Fs/kg"]) == parseFloat( ModalidadTodasconOrdenCAIIIAA[i-1]["Fs/kg"]))
                                {
                                  contCAIII= contCAIII ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAIII );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenCAIIIAA[i]["Fs/kg"]>0 ) {
                                  contCAIII =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCAIII=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIIIAA[i].AduC2025Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIIIAA[i].AduC2025Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIIIAA[i].AduC2025Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIIIAA[i].AduC2025Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAIIIAA[i].AduC2025Pintada = [];
                          console.log('balnco 2');
                        }


                      }




                          ////////// Campo["Gastos Embarque"]

                       ModalidadTodasconOrdenCAIIIAA   = _.orderBy( ModalidadTodasconOrdenCAIIIAA  , [Modalidadadage => Modalidadadage.Aeropuerto.toLowerCase(),Modalidadadage => Modalidadadage.Pais.toLowerCase(), Modalidadadage => parseFloat(Modalidadadage["Gastos Embarque"],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenCAIIIAA  );

                     var contCPC =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIIAA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenCAIIIAA[i]["Gastos Embarque"]>0){
                                 contCPC = contCPC  + 1;
                                 console.log('i es o');
                                 console.log(contCPC );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenCAIIIAA[i].Aeropuerto ==   ModalidadTodasconOrdenCAIIIAA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenCAIIIAA[i].Pais ==   ModalidadTodasconOrdenCAIIIAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenCAIIIAA[i]["Gastos Embarque"]>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenCAIIIAA[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCAIIIAA[i-1]["Gastos Embarque"]))
                                {
                                  contCPC= contCPC ;
                                  console.log('CPC mpo igual');
                                  console.log(contCPC );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenCAIIIAA[i]["Gastos Embarque"]>0 ) {
                                  contCPC =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCPC=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCAIIIAA[i].AduC4015Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCAIIIAA[i].AduC4015Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCAIIIAA[i].AduC4015Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCAIIIAA[i].AduC4015Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAIIIAA[i].AduC4015Pintada = [];
                          console.log('balnco 2');
                        }


                      }


                   ////////// Campo Naviera////////////////////////////

                 /* ModalidadTodasconOrdenotrosAA   = _.orderBy( ModalidadTodasconOrdenotrosAA  , [Modalidadadavia => Modalidadadavia.Aeropuerto.toLowerCase(),Modalidadadavia => Modalidadadavia.Pais.toLowerCase(), Modalidadadavia => parseFloat(Modalidadadavia.Naviera,10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenotrosAA  );

                     var contOTRO =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotrosAA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenotrosAA[i].Via>0){
                                 contOTRO = contOTRO  + 1;
                                 console.log('i es o');
                                 console.log(contOTRO );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenotrosAA[i].Aeropuerto ==   ModalidadTodasconOrdenotrosAA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenotrosAA[i].Pais ==   ModalidadTodasconOrdenotrosAA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenotrosAA[i].Via>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenotrosAA[i].Via) == parseFloat( ModalidadTodasconOrdenotrosAA[i-1].Via))
                                {
                                  contOTRO= contOTRO ;
                                  console.log('CPC mpo igual');
                                  console.log(contOTRO );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenotrosAA[i].Via>0 ) {
                                  contOTRO =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contOTRO=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotrosAA[i].AduC4016Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotrosAA[i].AduC4016Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotrosAA[i].AduC4016Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotrosAA[i].AduC4016Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenotrosAA[i].AduC4016Pintada = [];
                          console.log('balnco 2');
                        }


                      }*/

                    ////////// Campo ['+100 + Fs/kg + Gastos Embarque']////////////////////////////

                     ModalidadTodasconOrdenC4017AA   = _.orderBy( ModalidadTodasconOrdenC4017AA  , [Modalidadadasuma1 => Modalidadadasuma1.Aeropuerto.toLowerCase(),Modalidadadasuma1 => Modalidadadasuma1.Pais.toLowerCase(), Modalidadadasuma1 => parseFloat(Modalidadadasuma1['+100 + Fs/kg + Gastos Embarque'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC4017AA  );

                     var contC4017 =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017AA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC4017AA[i]['+100 + Fs/kg + Gastos Embarque']>0){
                                 contC4017 = contC4017  + 1;
                                 console.log('i es o');
                                 console.log(contC4017 );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenC4017AA[i].Aeropuerto ==   ModalidadTodasconOrdenC4017AA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenC4017AA[i].Pais ==   ModalidadTodasconOrdenC4017AA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC4017AA[i]['+100 + Fs/kg + Gastos Embarque']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenC4017AA[i]['+100 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC4017AA[i-1]['+100 + Fs/kg + Gastos Embarque']))
                                {
                                  contC4017= contC4017 ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4017 );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenC4017AA[i]['+100 + Fs/kg + Gastos Embarque']>0 ) {
                                  contC4017 =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC4017=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017AA[i].AduC4017Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017AA[i].AduC4017Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017AA[i].AduC4017Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017AA[i].AduC4017Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC4017AA[i].AduC4017Pintada = [];
                          console.log('balnco 2');
                        }


                      }


               ////////// Campo ['+300 + Fs/kg + Gastos Embarque']////////////////////////////

                    ModalidadTodasconOrdenC401718AA   = _.orderBy( ModalidadTodasconOrdenC401718AA  , [Modalidadadasuma2 => Modalidadadasuma2.Aeropuerto.toLowerCase(),Modalidadadasuma2 => Modalidadadasuma2.Pais.toLowerCase(), Modalidadadasuma2 => parseFloat(Modalidadadasuma2['+300 + Fs/kg + Gastos Embarque'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC401718AA );

                     var contC401718 =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718AA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC401718AA[i]['+300 + Fs/kg + Gastos Embarque']>0){
                                 contC401718 = contC401718  + 1;
                                 console.log('i es o');
                                 console.log(contC401718 );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenC401718AA[i].Aeropuerto ==   ModalidadTodasconOrdenC401718AA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenC401718AA[i].Pais ==   ModalidadTodasconOrdenC401718AA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC401718AA[i]['+300 + Fs/kg + Gastos Embarque']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenC401718AA[i]['+300 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC401718AA[i-1]['+300 + Fs/kg + Gastos Embarque']))
                                {
                                  contC401718= contC401718 ;
                                  console.log('CPC mpo igual');
                                  console.log(contC401718 );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC401718=contC401718 + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenC401718AA[i]['+300 + Fs/kg + Gastos Embarque']>0 ) {
                                  contC401718 =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC401718=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC401718==1)
                        {
                               ModalidadTodasconOrdenC401718AA[i].AduC401718Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC401718==2)
                        {
                               ModalidadTodasconOrdenC401718AA[i].AduC401718Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC401718==3)
                        {
                               ModalidadTodasconOrdenC401718AA[i].AduC401718Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC401718>3)
                        {
                          ModalidadTodasconOrdenC401718AA[i].AduC401718Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC401718AA[i].AduC401718Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                   ////////// Campo ['+500 + Fs/kg + Gastos Embarque']////////////////////////////

                      ModalidadTodasconOrdenC4020AA   = _.orderBy( ModalidadTodasconOrdenC4020AA  , [Modalidadadasuma3 => Modalidadadasuma3.Aeropuerto.toLowerCase(),Modalidadadasuma3 => Modalidadadasuma3.Pais.toLowerCase(), Modalidadadasuma3 => parseFloat(Modalidadadasuma3['+500 + Fs/kg + Gastos Embarque'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC4020AA );

                     var contC4020 =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4020AA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC4020AA[i]['+500 + Fs/kg + Gastos Embarque']>0){
                                 contC4020 = contC4020  + 1;
                                 console.log('i es o');
                                 console.log(contC4020 );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenC4020AA[i].Aeropuerto ==   ModalidadTodasconOrdenC4020AA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenC4020AA[i].Pais ==   ModalidadTodasconOrdenC4020AA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC4020AA[i]['+500 + Fs/kg + Gastos Embarque']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenC4020AA[i]['+500 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC4020AA[i-1]['+500 + Fs/kg + Gastos Embarque']))
                                {
                                  contC4020= contC4020 ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4020 );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC4020=contC4020 + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenC4020AA[i]['+500 + Fs/kg + Gastos Embarque']>0 ) {
                                  contC4020 =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC4020=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC4020==1)
                        {
                               ModalidadTodasconOrdenC4020AA[i].AduC4020Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4020==2)
                        {
                               ModalidadTodasconOrdenC4020AA[i].AduC4020Pintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4020==3)
                        {
                               ModalidadTodasconOrdenC4020AA[i].AduC4020Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4020>3)
                        {
                          ModalidadTodasconOrdenC4020AA[i].AduC4020Pintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC4020AA[i].AduC4020Pintada = [];
                          console.log('balnco 2');
                        }


                      }

                         ////////// Campo ['+1000 + Fs/kg + Gastos Embarque']////////////////////////////

                      ModalidadTodasconOrdenC4021AA   = _.orderBy( ModalidadTodasconOrdenC4021AA  , [Modalidadadasuma4 => Modalidadadasuma4.Aeropuerto.toLowerCase(),Modalidadadasuma4 => Modalidadadasuma4.Pais.toLowerCase(), Modalidadadasuma4 => parseFloat(Modalidadadasuma4['+1000 + Fs/kg + Gastos Embarque'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC4021AA  );

                     var contC4021 =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4021AA.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC4021AA[i]['+1000 + Fs/kg + Gastos Embarque']>0){
                                 contC4021 = contC4021  + 1;
                                 console.log('i es o');
                                 console.log(contC4021 );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenC4021AA[i].Aeropuerto ==   ModalidadTodasconOrdenC4021AA[i-1].Aeropuerto) && (  ModalidadTodasconOrdenC4021AA[i].Pais ==   ModalidadTodasconOrdenC4021AA[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC4021AA[i]['+1000 + Fs/kg + Gastos Embarque']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenC4021AA[i]['+1000 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC4021AA[i-1]['+1000 + Fs/kg + Gastos Embarque']))
                                {
                                  contC4021= contC4021 ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4021 );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC4021=contC4021 + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenC4021AA[i]['+1000 + Fs/kg + Gastos Embarque']>0 ) {
                                  contC4021 =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC4021=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC4021==1)
                        {
                               ModalidadTodasconOrdenC4021AA[i].AduC4021Pintada  = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4021==2)
                        {
                               ModalidadTodasconOrdenC4021AA[i].AduC4021Pintada  = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4021==3)
                        {
                               ModalidadTodasconOrdenC4021AA[i].AduC4021Pintada  = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4021>3)
                        {
                          ModalidadTodasconOrdenC4021AA[i].AduC4021Pintada  = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC4021AA[i].AduC4021Pintada  = [];
                          console.log('balnco 2');
                        }


                      }


                     //ModalidadTodasAerea = _.sortBy(ModalidadTodasAerea, 'Aeropuerto','Pais','Email');
                     ModalidadTodasAerea=_.orderBy(ModalidadTodasAerea, [ModalidadTodasac => ModalidadTodasac.Aeropuerto.toLowerCase(),ModalidadTodasac =>ModalidadTodasac.Pais.toLowerCase(),ModalidadTodasac =>ModalidadTodasac.Email.toLowerCase()], ['asc','asc','asc']);
                     $scope.ModalidadTodasAerea=ModalidadTodasAerea;

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldoAA = ModalidadTodasAerea;
                       $scope.ModalidadTodasAerea= ModalidadTodasAerea;
                       console.log(ModalidadTodasRespaldoAA);
                       $scope.ModalidadTodasAerea = ModalidadTodasRespaldoAA.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                el.AduC2010Pintada.length > 0 ||
                                el.AduC2017Pintada.length > 0 ||
                                el.AduC2019Pintada.length > 0 ||
                                el.AduC2020Pintada.length > 0 ||
                                el.AduC2021Pintada.length > 0 ||
                                el.AduC2025Pintada.length > 0 ||
                                el.AduC4015Pintada.length > 0 ||
                                //el.AduC4016Pintada.length > 0 ||
                                el.AduC4017Pintada.length > 0 ||
                                el.AduC401718Pintada.length > 0 ||
                                el.AduC4020Pintada.length > 0 ||
                                el.AduC4021Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });


                ////////////////////////////Aerea Pasajero /////////////////////////////////////////
                ModalidadTodasAereaPasajero=[];
                console.log($scope.ConsolidadoDatos);
                       angular.forEach($scope.ConsolidadoDatos, function(consotm) {
                         ModalidadDeUnProveedorAP = consotm.AereaPasajero.AereasPasajeros
                            angular.forEach(ModalidadDeUnProveedorAP, function(consotmprov) {
                              consotmprov.Email = consotm.Email
                              ModalidadTodasAereaPasajero.push(consotmprov);
                              ModalidadTodasconOrdenP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenMinimaP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenGAP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenGAIIP =ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenGAIIIP =ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenCAP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenCAIIP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenCAIIIP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenCPCP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenotrosP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC4017P = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC401718P = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC4020P = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC4021P = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC4022P = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC4030P = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC20ESTP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC40ESTP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC20ESPP = ModalidadTodasAereaPasajero;
                              ModalidadTodasconOrdenC40ESPP = ModalidadTodasAereaPasajero;

                            });
                        });

                         ModalidadTodasAereaPasajero = _.sortBy(ModalidadTodasAereaPasajero,'Aeropuerto','Pais');
                         console.log(ModalidadTodasAereaPasajero);

                         ////////  Campo Minima //////////////////////////

                        ModalidadTodasconOrdenP   = _.orderBy(ModalidadTodasconOrdenP  , [Modalidadadap => Modalidadadap.Aeropuerto.toLowerCase(),Modalidadadap => Modalidadadap.Pais.toLowerCase(), Modalidadadap => parseFloat(Modalidadadap.Minima,10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenP  );

                     var contP  =0;
                     var contPnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenP.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenP[i].Minima>0){
                                 contP  = contP   + 1;
                                 console.log('i es o');
                                 console.log(contP  );
                                 contPnull=0;
                                }
                                  else
                                 {contPnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenP[i].Aeropuerto ==  ModalidadTodasconOrdenP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenP[i].Pais ==  ModalidadTodasconOrdenP[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenP[i].Minima>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenP[i].Minima) == parseFloat(ModalidadTodasconOrdenP[i-1].Minima))
                                {
                                  contP = contP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contP  );
                                  contPnull=0;
                                }
                                else
                                {
                                  contP =contP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contP);
                             contPnull=0;
                                }
                              }
                              else
                              {
                                contPnull=1;
                                 console.log(contP);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenP[i].Minima>0 ) {
                                  contP  =1;
                                   console.log('via diferente');
                                   contPnull=0;
                                  console.log(contP);
                                }
                                else
                                {
                                contP =0;
                                contPnull=1;
                                }
                              }

                          }

                        if (contP ==1)
                        {
                              ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contP ==2)
                        {
                              ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contP ==3)
                        {
                              ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contP >3)
                        {
                         ModalidadTodasconOrdenP[i].AduC2045PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contPnull==1)
                        {
                         ModalidadTodasconOrdenP[i].AduC2045PPintada = [];
                          console.log('balnco 2');
                        }


                      }


              ////////////////// ["45"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinimaP   = _.orderBy(ModalidadTodasconOrdenMinimaP  , [Modalidadada45P => Modalidadada45P.Aeropuerto.toLowerCase(),Modalidadada45P => Modalidadada45P.Pais.toLowerCase(), Modalidadada45P => parseFloat(Modalidadada45P["45"],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenMinimaP);

                     var contminP  =0;
                     var contminPnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinimaP.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenMinimaP[i]["45"]>0){
                                 contminP  = contminP   + 1;
                                 console.log('i es o');
                                 console.log(contminP  );
                                 contminPnull=0;
                                }
                                  else
                                 {contminPnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenMinimaP[i].Aeropuerto ==  ModalidadTodasconOrdenMinimaP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenMinimaP[i].Pais ==  ModalidadTodasconOrdenMinimaP[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenMinimaP[i]["45"]>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenMinimaP[i]["45"]) == parseFloat(ModalidadTodasconOrdenMinimaP[i-1]["45"]))
                                {
                                  contminP = contminP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contminP  );
                                  contminPnull=0;
                                }
                                else
                                {
                                  contminP =contminP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contminP);
                             contminPnull=0;
                                }
                              }
                              else
                              {
                                contminPnull=1;
                                 console.log(contminP);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenMinimaP[i]["45"]>0 ) {
                                  contminP  =1;
                                   console.log('via diferente');
                                   contminPnull=0;
                                  console.log(contminP);
                                }
                                else
                                {
                                contminP =0;
                                contminPnull=1;
                                }
                              }

                          }

                        if (contminP ==1)
                        {
                              ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contminP ==2)
                        {
                              ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contminP ==3)
                        {
                              ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contminP >3)
                        {
                         ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contminPnull==1)
                        {
                         ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = [];
                          console.log('balnco 2');
                        }


                      }
                   ////////// Campo ['+100'] ///////////////////////////////
                ModalidadTodasconOrdenGAP   = _.orderBy(ModalidadTodasconOrdenGAP  , [Modalidadada100P => Modalidadada100P.Aeropuerto.toLowerCase(),Modalidadada100P => Modalidadada100P.Pais.toLowerCase(), Modalidadada100P => parseFloat(Modalidadada100P['+100'],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenGAP);

                     var contGAP  =0;
                     var contGAPnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAP.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenGAP[i]['+100']>0){
                                 contGAP  = contGAP   + 1;
                                 console.log('i es o');
                                 console.log(contGAP  );
                                 contGAPnull=0;
                                }
                                  else
                                 {contGAPnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenGAP[i].Aeropuerto ==  ModalidadTodasconOrdenGAP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAP[i].Pais ==  ModalidadTodasconOrdenGAP[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenGAP[i]['+100']>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenGAP[i]['+100']) == parseFloat(ModalidadTodasconOrdenGAP[i-1]['+100']))
                                {
                                  contGAP = contGAP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAP  );
                                  contGAPnull=0;
                                }
                                else
                                {
                                  contGAP =contGAP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAP);
                             contGAPnull=0;
                                }
                              }
                              else
                              {
                                contGAPnull=1;
                                 console.log(contGAP);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenGAP[i]['+100']>0 ) {
                                  contGAP  =1;
                                   console.log('via diferente');
                                   contGAPnull=0;
                                  console.log(contGAP);
                                }
                                else
                                {
                                contGAP =0;
                                contGAPnull=1;
                                }
                              }

                          }

                        if (contGAP ==1)
                        {
                              ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAP ==2)
                        {
                              ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAP ==3)
                        {
                              ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAP >3)
                        {
                         ModalidadTodasconOrdenGAP[i].AduC2010PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAPnull==1)
                        {
                         ModalidadTodasconOrdenGAP[i].AduC2010PPintada = [];
                          console.log('balnco 2');
                        }


                      }


                    ////////// Campo ['+300']

                   ModalidadTodasconOrdenCAP   = _.orderBy(ModalidadTodasconOrdenCAP  , [Modalidadada300P => Modalidadada300P.Aeropuerto.toLowerCase(),Modalidadada300P => Modalidadada300P.Pais.toLowerCase(), Modalidadada300P => parseFloat(Modalidadada300P['+300'],10)], ['asc','asc','asc']);
           console.log(ModalidadTodasconOrdenCAP);

                     var contCAP  =0;
                     var contCAPnull=0;
                     var iultimo=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAP.length-1; i++){
                           if (i==0 )
                          {
                               if(ModalidadTodasconOrdenCAP[i]['+300']>0){
                                 contCAP  = contCAP   + 1;
                                 console.log('i es o');
                                 console.log(contCAP  );
                                 contCAPnull=0;
                                }
                                  else
                                 {contCAPnull=1;}
                           }
                         else
                          {
                               if(( ModalidadTodasconOrdenCAP[i].Aeropuerto ==  ModalidadTodasconOrdenCAP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAP[i].Pais ==  ModalidadTodasconOrdenCAP[i-1].Pais))
                              {
                                console.log('via igual');
                           if (ModalidadTodasconOrdenCAP[i]['+300']>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenCAP[i]['+300']) == parseFloat(ModalidadTodasconOrdenCAP[i-1]['+300']))
                                {
                                  contCAP = contCAP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAP  );
                                  contCAPnull=0;
                                }
                                else
                                {
                                  contCAP =contCAP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAP);
                             contCAPnull=0;
                                }
                              }
                              else
                              {
                                contCAPnull=1;
                                 console.log(contCAP);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenCAP[i]['+300']>0 ) {
                                  contCAP  =1;
                                   console.log('via diferente');
                                   contCAPnull=0;
                                  console.log(contCAP);
                                }
                                else
                                {
                                contCAP =0;
                                contCAPnull=1;
                                }
                              }

                          }

                        if (contCAP ==1)
                        {
                              ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAP ==2)
                        {
                              ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAP ==3)
                        {
                              ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAP >3)
                        {
                         ModalidadTodasconOrdenCAP[i].AduC2017PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAPnull==1)
                        {
                         ModalidadTodasconOrdenCAP[i].AduC2017PPintada = [];
                          console.log('balnco 2');
                        }


                      }
                      ////////// Campo ['+500']

                  ModalidadTodasconOrdenGAIIP   = _.orderBy( ModalidadTodasconOrdenGAIIP  , [Modalidadada500P => Modalidadada500P.Aeropuerto.toLowerCase(),Modalidadada500P => Modalidadada500P.Pais.toLowerCase(), Modalidadada500P => parseFloat(Modalidadada500P['+500'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenGAIIP);

                     var contGAIIP  =0;
                     var contGAIIPnull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIP.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenGAIIP[i]['+500']>0){
                                 contGAIIP  = contGAIIP   + 1;
                                 console.log('i es o');
                                 console.log(contGAIIP  );
                                 contGAIIPnull=0;
                                }
                                  else
                                 {contGAIIPnull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenGAIIP[i].Aeropuerto ==   ModalidadTodasconOrdenGAIIP[i-1].Aeropuerto) && (  ModalidadTodasconOrdenGAIIP[i].Pais ==   ModalidadTodasconOrdenGAIIP[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenGAIIP[i]['+500']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenGAIIP[i]['+500']) == parseFloat( ModalidadTodasconOrdenGAIIP[i-1]['+500']))
                                {
                                  contGAIIP = contGAIIP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAIIP  );
                                  contGAIIPnull=0;
                                }
                                else
                                {
                                  contGAIIP =contGAIIP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contGAIIP);
                             contGAIIPnull=0;
                                }
                              }
                              else
                              {
                                contGAIIPnull=1;
                                 console.log(contGAIIP);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenGAIIP[i]['+500']>0 ) {
                                  contGAIIP  =1;
                                   console.log('via diferente');
                                   contGAIIPnull=0;
                                  console.log(contGAIIP);
                                }
                                else
                                {
                                contGAIIP =0;
                                contGAIIPnull=1;
                                }
                              }

                          }

                        if (contGAIIP ==1)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIIP ==2)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIIP ==3)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIIP >3)
                        {
                          ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contGAIIPnull==1)
                        {
                          ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = [];
                          console.log('balnco 2');
                        }


                      }
                       ////////// Campo ['+1000']

                     ModalidadTodasconOrdenCAIIP   = _.orderBy( ModalidadTodasconOrdenCAIIP  , [Modalidadada1000P => Modalidadada1000P.Aeropuerto.toLowerCase(),Modalidadada1000P => Modalidadada1000P.Pais.toLowerCase(), Modalidadada1000P => parseFloat(Modalidadada1000P['+1000'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenCAIIP);

                     var contCAIIP  =0;
                     var contCAIIPnull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIP.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenCAIIP[i]['+1000']>0){
                                 contCAIIP  = contCAIIP   + 1;
                                 console.log('i es o');
                                 console.log(contCAIIP  );
                                 contCAIIPnull=0;
                                }
                                  else
                                 {contCAIIPnull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenCAIIP[i].Aeropuerto ==   ModalidadTodasconOrdenCAIIP[i-1].Aeropuerto) && (  ModalidadTodasconOrdenCAIIP[i].Pais ==   ModalidadTodasconOrdenCAIIP[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenCAIIP[i]['+1000']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenCAIIP[i]['+1000']) == parseFloat( ModalidadTodasconOrdenCAIIP[i-1]['+1000']))
                                {
                                  contCAIIP = contCAIIP  ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAIIP  );
                                  contCAIIPnull=0;
                                }
                                else
                                {
                                  contCAIIP =contCAIIP  + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAIIP);
                             contCAIIPnull=0;
                                }
                              }
                              else
                              {
                                contCAIIPnull=1;
                                 console.log(contCAIIP);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenCAIIP[i]['+1000']>0 ) {
                                  contCAIIP  =1;
                                   console.log('via diferente');
                                   contCAIIPnull=0;
                                  console.log(contCAIIP);
                                }
                                else
                                {
                                contCAIIP =0;
                                contCAIIPnull=1;
                                }
                              }

                          }

                        if (contCAIIP ==1)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAIIP ==2)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAIIP ==3)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAIIP >3)
                        {
                          ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIIPnull==1)
                        {
                          ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = [];
                          console.log('balnco 2');
                        }


                      }
                      ////////// Campo ["FS min"]

                   ModalidadTodasconOrdenGAIIIP   = _.orderBy( ModalidadTodasconOrdenGAIIIP  , [ModalidadadafsP => ModalidadadafsP.Aeropuerto.toLowerCase(),ModalidadadafsP => ModalidadadafsP.Pais.toLowerCase(), ModalidadadafsP => parseFloat(ModalidadadafsP["FS min"],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenGAIIIP);

                     var contGAIIIP =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIIP.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenGAIIIP[i]["FS min"]>0){
                                 contGAIIIP = contGAIIIP  + 1;
                                 console.log('i es o');
                                 console.log(contGAIIIP );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenGAIIIP[i].Aeropuerto ==   ModalidadTodasconOrdenGAIIIP[i-1].Aeropuerto) && (  ModalidadTodasconOrdenGAIIIP[i].Pais ==   ModalidadTodasconOrdenGAIIIP[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenGAIIIP[i]["FS min"]>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenGAIIIP[i]["FS min"]) == parseFloat( ModalidadTodasconOrdenGAIIIP[i-1]["FS min"]))
                                {
                                  contGAIIIP= contGAIIIP ;
                                  console.log('CPC mpo igual');
                                  console.log(contGAIIIP );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contGAIIIP=contGAIIIP + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenGAIIIP[i]["FS min"]>0 ) {
                                  contGAIIIP =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contGAIIIP=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contGAIIIP==1)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGAIIIP==2)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contGAIIIP==3)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGAIIIP>3)
                        {
                          ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = [];
                          console.log('balnco 2');
                        }


                      }



                   ////////// Campo ["Fs/kg"]

                    ModalidadTodasconOrdenCAIIIP   = _.orderBy( ModalidadTodasconOrdenCAIIIP  , [ModalidadadafsP => ModalidadadafsP.Aeropuerto.toLowerCase(),ModalidadadafsP => ModalidadadafsP.Pais.toLowerCase(), ModalidadadafsP => parseFloat(ModalidadadafsP["Fs/kg"],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenCAIIIP);

                     var contCAIIIP =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIIP.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenCAIIIP[i]["Fs/kg"]>0){
                                 contCAIIIP = contCAIIIP  + 1;
                                 console.log('i es o');
                                 console.log(contCAIIIP );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenCAIIIP[i].Aeropuerto ==   ModalidadTodasconOrdenCAIIIP[i-1].Aeropuerto) && (  ModalidadTodasconOrdenCAIIIP[i].Pais ==   ModalidadTodasconOrdenCAIIIP[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenCAIIIP[i]["Fs/kg"]>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenCAIIIP[i]["Fs/kg"]) == parseFloat( ModalidadTodasconOrdenCAIIIP[i-1]["Fs/kg"]))
                                {
                                  contCAIIIP= contCAIIIP ;
                                  console.log('CPC mpo igual');
                                  console.log(contCAIIIP );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCAIIIP=contCAIIIP + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenCAIIIP[i]["Fs/kg"]>0 ) {
                                  contCAIIIP =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCAIIIP=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCAIIIP==1)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCAIIIP==2)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCAIIIP==3)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCAIIIP>3)
                        {
                          ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = [];
                          console.log('balnco 2');
                        }


                      }



                          ////////// Campo["Gastos Embarque"]
                ModalidadTodasconOrdenCPCP = _.orderBy( ModalidadTodasconOrdenCPCP  , [ModalidadadageP => ModalidadadageP.Aeropuerto.toLowerCase(),ModalidadadageP => ModalidadadageP.Pais.toLowerCase(), ModalidadadageP => parseFloat(ModalidadadageP["Gastos Embarque"],10)], ['asc','asc','asc']);
                      console.log( ModalidadTodasconOrdenCPCP);

                     var contCPC =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPCP.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenCPCP[i]["Gastos Embarque"]>0){
                                 contCPC = contCPC  + 1;
                                 console.log('i es o');
                                 console.log(contCPC );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenCPCP[i].Aeropuerto ==   ModalidadTodasconOrdenCPCP[i-1].Aeropuerto) && (  ModalidadTodasconOrdenCPCP[i].Pais ==   ModalidadTodasconOrdenCPCP[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenCPCP[i]["Gastos Embarque"]>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenCPCP[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCPCP[i-1]["Gastos Embarque"]))
                                {
                                  contCPC= contCPC ;
                                  console.log('CPC mpo igual');
                                  console.log(contCPC );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenCPCP[i]["Gastos Embarque"]>0 ) {
                                  contCPC =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contCPC=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = [];
                          console.log('balnco 2');
                        }


                      }
                   ////////// Campo Via////////////////////////////

                 /* ModalidadTodasconOrdenotrosP = _.orderBy( ModalidadTodasconOrdenotrosP  , [ModalidadadaviaP => ModalidadadaviaP.Aeropuerto.toLowerCase(),ModalidadadaviaP => ModalidadadaviaP.Pais.toLowerCase(), ModalidadadaviaP => parseFloat(ModalidadadaviaP.Via,10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenotrosP);

                     var contOTROP =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotrosP.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenotrosP[i].Via>0){
                                 contOTROP = contOTROP  + 1;
                                 console.log('i es o');
                                 console.log(contOTROP );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenotrosP[i].Aeropuerto ==   ModalidadTodasconOrdenotrosP[i-1].Aeropuerto) && (  ModalidadTodasconOrdenotrosP[i].Pais ==   ModalidadTodasconOrdenotrosP[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenotrosP[i].Via>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenotrosP[i].Via) == parseFloat( ModalidadTodasconOrdenotrosP[i-1].Via))
                                {
                                  contOTROP= contOTROP ;
                                  console.log('CPC mpo igual');
                                  console.log(contOTROP );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contOTROP=contOTROP + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenotrosP[i].Via>0 ) {
                                  contOTROP =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contOTROP=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contOTROP==1)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contOTROP==2)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contOTROP==3)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contOTROP>3)
                        {
                          ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = [];
                          console.log('balnco 2');
                        }


                      }*/
                        ////////// Campo ['+100 + Fs/kg + Gastos Embarque']////////////////////////////

                   ModalidadTodasconOrdenC4017P   = _.orderBy( ModalidadTodasconOrdenC4017P  , [Modalidadadasuma1P => Modalidadadasuma1P.Aeropuerto.toLowerCase(),Modalidadadasuma1P => Modalidadadasuma1P.Pais.toLowerCase(), Modalidadadasuma1P => parseFloat(Modalidadadasuma1P['+100 + Fs/kg'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC4017P);

                     var contC4017P =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017P.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC4017P[i]['+100 + Fs/kg']>0){
                                 contC4017P = contC4017P  + 1;
                                 console.log('i es o');
                                 console.log(contC4017P );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenC4017P[i].Aeropuerto ==   ModalidadTodasconOrdenC4017P[i-1].Aeropuerto) && (  ModalidadTodasconOrdenC4017P[i].Pais ==   ModalidadTodasconOrdenC4017P[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC4017P[i]['+100 + Fs/kg']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenC4017P[i]['+100 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4017P[i-1]['+100 + Fs/kg']))
                                {
                                  contC4017P= contC4017P ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4017P );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC4017P=contC4017P + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenC4017P[i]['+100 + Fs/kg']>0 ) {
                                  contC4017P =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC4017P=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC4017P==1)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4017P==2)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4017P==3)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4017P>3)
                        {
                          ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = [];
                          console.log('balnco 2');
                        }


                      }

               ////////// Campo ['+300 + Fs/kg + Gastos Embarque']////////////////////////////

                  ModalidadTodasconOrdenC401718P   = _.orderBy( ModalidadTodasconOrdenC401718P  , [Modalidadadasuma2P => Modalidadadasuma2P.Aeropuerto.toLowerCase(),Modalidadadasuma2P => Modalidadadasuma2P.Pais.toLowerCase(), Modalidadadasuma2P => parseFloat(Modalidadadasuma2P['+300 + Fs/kg'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC401718P);

                     var contC401718P =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718P.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC401718P[i]['+300 + Fs/kg']>0){
                                 contC401718P = contC401718P  + 1;
                                 console.log('i es o');
                                 console.log(contC401718P );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenC401718P[i].Aeropuerto ==   ModalidadTodasconOrdenC401718P[i-1].Aeropuerto) && (  ModalidadTodasconOrdenC401718P[i].Pais ==   ModalidadTodasconOrdenC401718P[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC401718P[i]['+300 + Fs/kg']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenC401718P[i]['+300 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC401718P[i-1]['+300 + Fs/kg']))
                                {
                                  contC401718P= contC401718P ;
                                  console.log('CPC mpo igual');
                                  console.log(contC401718P );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC401718P=contC401718P + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenC401718P[i]['+300 + Fs/kg']>0 ) {
                                  contC401718P =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC401718P=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC401718P==1)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC401718P==2)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC401718P==3)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC401718P>3)
                        {
                          ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = [];
                          console.log('balnco 2');
                        }


                      }
                   ////////// Campo ['+500 + Fs/kg + Gastos Embarque']////////////////////////////

                     ModalidadTodasconOrdenC4020P   = _.orderBy( ModalidadTodasconOrdenC4020P  , [Modalidadadasuma3P => Modalidadadasuma3P.Aeropuerto.toLowerCase(),Modalidadadasuma3P => Modalidadadasuma3P.Pais.toLowerCase(), Modalidadadasuma3P => parseFloat(Modalidadadasuma3P['+500 + Fs/kg'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC4020P);

                     var contC4020P =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4020P.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC4020P[i]['+500 + Fs/kg']>0){
                                 contC4020P = contC4020P  + 1;
                                 console.log('i es o');
                                 console.log(contC4020P );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((  ModalidadTodasconOrdenC4020P[i].Aeropuerto ==   ModalidadTodasconOrdenC4020P[i-1].Aeropuerto) && (  ModalidadTodasconOrdenC4020P[i].Pais ==   ModalidadTodasconOrdenC4020P[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC4020P[i]['+500 + Fs/kg']>0 ) {
                                if(parseFloat( ModalidadTodasconOrdenC4020P[i]['+500 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4020P[i-1]['+500 + Fs/kg']))
                                {
                                  contC4020P= contC4020P ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4020P );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC4020P=contC4020P + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if ( ModalidadTodasconOrdenC4020P[i]['+500 + Fs/kg']>0 ) {
                                  contC4020P =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC4020P=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC4020P==1)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4020P==2)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4020P==3)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4020P>3)
                        {
                          ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = [];
                          console.log('balnco 2');
                        }


                      }
                     ////////// Campo ['+10000 + Fs/kg + Gastos Embarque']////////////////////////////
  ModalidadTodasconOrdenC4021P   = _.orderBy(ModalidadTodasconOrdenC4021P, [Modalidadadasuma4P => Modalidadadasuma4P.Aeropuerto.toLowerCase(),Modalidadadasuma4P => Modalidadadasuma4P.Pais.toLowerCase(), Modalidadadasuma4P => parseFloat(Modalidadadasuma4P['+1000 + Fs/kg'],10)], ['asc','asc','asc']);
           console.log( ModalidadTodasconOrdenC4021P  );

                     var contC4021P =0;
                     var contCAIInull=0;
                     var iultimo=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4021P.length-1; i++){
                           if (i==0 )
                          {
                               if( ModalidadTodasconOrdenC4021P[i]['+1000 + Fs/kg']>0){
                                 contC4021P = contC4021P  + 1;
                                 console.log('i es o');
                                 console.log(contC4021P );
                                 contCAIInull=0;
                                }
                                  else
                                 {contCAIInull=1;}
                           }
                         else
                          {
                               if((ModalidadTodasconOrdenC4021P[i].Aeropuerto == ModalidadTodasconOrdenC4021P[i-1].Aeropuerto) && (ModalidadTodasconOrdenC4021P[i].Pais ==  ModalidadTodasconOrdenC4021P[i-1].Pais))
                              {
                                console.log('via igual');
                           if ( ModalidadTodasconOrdenC4021P[i]['+1000 + Fs/kg']>0 ) {
                                if(parseFloat(ModalidadTodasconOrdenC4021P[i]['+1000 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4021P[i-1]['+1000 + Fs/kg']))
                                {
                                  contC4021P= contC4021P ;
                                  console.log('CPC mpo igual');
                                  console.log(contC4021P );
                                  contCAIInull=0;
                                }
                                else
                                {
                                  contC4021P=contC4021P + 1;
                                  console.log('CPC mpo diferente');
                             console.log(contCAII);
                             contCAIInull=0;
                                }
                              }
                              else
                              {
                                contCAIInull=1;
                                 console.log(contCAII);
                              }

                              }
                             else
                              {
                                if (ModalidadTodasconOrdenC4021P[i]['+1000 + Fs/kg']>0 ) {
                                  contC4021P =1;
                                   console.log('via diferente');
                                   contCAIInull=0;
                                  console.log(contCAII);
                                }
                                else
                                {
                                contC402P1=0;
                                contCAIInull=1;
                                }
                              }

                          }

                        if (contC4021P==1)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada  = ["label label-success"];
                               console.log('verde');
                        }
                        if (contC4021P==2)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada  = ["label label-warning"];
                               console.log('amrillo');
                        }
                        if (contC4021P==3)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada  = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contC4021P>3)
                        {
                          ModalidadTodasconOrdenC4021P[i].AduC4021PPintada  = [];
                          console.log('balnco 1');
                        }
                        if (contCAIInull==1)
                        {
                          ModalidadTodasconOrdenC4021P[i].AduC4021PPintada  = [];
                          console.log('balnco 2');
                        }


                      }
                   // ModalidadTodasAereaPasajero = _.sortBy(ModalidadTodasAereaPasajero, 'Aeropuerto','Pais','Email');
                    ModalidadTodasAereaPasajero=_.orderBy(ModalidadTodasAereaPasajero, [ModalidadTodasap => ModalidadTodasap.Aeropuerto.toLowerCase(),ModalidadTodasap =>ModalidadTodasap.Pais.toLowerCase(),ModalidadTodasap =>ModalidadTodasap.Email.toLowerCase()], ['asc','asc','asc']);
                    //$scope.ModalidadTodasAereaPasajero=ModalidadTodasAereaPasajero;

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldoAP = ModalidadTodasAereaPasajero;
                       $scope.ModalidadTodasAereaPasajero= ModalidadTodasAereaPasajero;
                       $scope.ModalidadTodasAereaPasajero = ModalidadTodasRespaldoAP.filter(function (el) {
                         return (el.AduC2045PPintada.length > 0 ||
                                 el.AduC8PPintada.length > 0 ||
                                el.AduC2010PPintada.length > 0 ||
                                el.AduC2017PPintada.length > 0 ||
                                el.AduC2019PPintada.length > 0 ||
                                el.AduC2020PPintada.length > 0 ||
                                el.AduC2021PPintada.length > 0 ||
                                el.AduC2025PPintada.length > 0 ||
                                el.AduC4015PPintada.length > 0 ||
                                //el.AduC4016PPintada.length > 0 ||
                                el.AduC4017PPintada.length > 0 ||
                                el.AduC401718PPintada.length > 0 ||
                                el.AduC4020PPintada.length > 0 ||
                                el.AduC4021PPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                        //$loading.finish('myloading');

                            ///////////////////////////Crea plantilla para exportar a excel ////////////////
          //////////////////////////////////////Exportar a Excel////////////////////////////////////////

            function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

          $scope.ExportarExcelModalidadAerea = function () {

              Data = {};
              Data.ModalidadesProveedor=$scope.ModalidadTodasAerea;
              Data.ModalidadesProveedor2=$scope.ModalidadTodasAereaPasajero;
              Data.Modalidad=ModalidadConsolidado;

            //$loading.start('myloading');
            $http({
                method: 'POST',
                url: '/ExportarExcelModalidad',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
               console.log(response.data.ExcelBase64);
               var urlbase64 = "data:application/vnd.ms-excel;base64,"+ response.data.ExcelBase64;
              downloadURI(urlbase64, "Aerea.xlsx");
              // $loading.finish('myloading');
              //saveAs(urlbase64, "Report.xls");
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }

           }
         }
             $loading.finish('myloading');

       }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }


             $scope.GetConsolidadoDatos();

             var editform= 0;

         $scope.Usuario={};
         var VistaName='';
         var label="Consolidado Datos";

         $scope.Showf1 = function () {
          VistaName = '';
           $scope.Show30 = true;
           $scope.Show40 = false;
           $scope.Show50 = false;
           $scope.Show60=false;
           $scope.Show70 = true;
           $scope.Show80 = true;
           $scope.Show90 = false;
            //$scope.Show100 = false;
           $scope.Show1=true;
            $scope.Show20=true;
            $scope.Show111=true;
            $scope.Show2=false;
            $scope.Show3=false;
            $scope.Show4=false;
            $scope.Show5=false;

            $scope.Show6=false;
            $scope.Show7=false;
            $scope.Show8=false;
            $scope.Show9=false;
            $scope.Show10=false;
            $scope.Show11=false;
            $scope.Show12=false;
            $scope.Show13=false;
            $scope.GetConsolidadoDatos();

         };

            $scope.FiltroProveedorSeleccionado= function  (){
            if (ProveedorSeleccionado==false){
              ProveedorSeleccionado=true;
            }
            else
            {
              ProveedorSeleccionado=false;
            }
              $scope.GetConsolidadoDatos()
            }


             $scope.FiltroSemaforo= function  (){
              if (ModalidadesSemaforo==false){
              ModalidadesSemaforo=true;
            }
            else
            {
              ModalidadesSemaforo=false;
            }
              $scope.GetConsolidadoDatos()
            }


        }])

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        .controller('ctrlWarrantyLogin', ['$scope', '$http', '$loading', 'FileUploader', '$uibModal', function ($scope, $http, $loading, FileUploader, $uibModal) {
         // Llama a HTML Modal que permite cambiar passwor de la app

         $scope.Menulicitacion = function () {
                console.log('paso por aqui formulariovisto');
                             var Data = {};
                             $loading.start('myloading');
                             Data.Formulario = 'Requisitos';
                             Data.User = localStorage.UserConnected;
                            $http({
                            method: 'POST',
                            url: '/GetFormularioVisto',
                            headers: { 'Content-Type': 'application/json' },
                            data: Data
                            }).then(function successCallback(response) {
                            $loading.finish('myloading');
                            $scope.Formulario = response.data.Formularios;
                           console.log($scope.Formulario.length);
                              if ($scope.Formulario.length == 0){
                                  $scope.menulicitacion = false;
                               }
                               else
                               {
                                 $scope.menulicitacion = true;
                               }
                           }, function errorCallback(response) {
                           alert(response.statusText);
                            });
                          }

                            $scope.Menulicitacion();

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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

          $scope.UserNameConnected = localStorage.UserNameConnected;



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

            //Sólo para fechas boostrap Datepicker
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
            $scope.fechainicio = new Date();
            $scope.fechafin = new Date();
            // Sólo para fechas boostrap Datepicker

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
          $scope.Mensaje = '';
          // Uploader de files para el email
          $scope.uploader = new FileUploader();
          $scope.uploader.url = "/api/uploadFileNotificationEmail";
          $scope.uploader.onSuccessItem = function (item, response) {
              if ($scope.QuantityFiles == 1) {
                  $scope.uploader.clearQueue();
                  $scope.EnviarEmailProveedoresFinish();
              }
              $scope.QuantityFiles--;
          }
          $scope.EnviarEmailProveedoresFinish = function () {
            var Data = {}
            Data.Proveedores = $scope.Proveedores;
            Data.Mensaje = $scope.Mensaje;
            Data.FechaInicio = $scope.fechainicio;
            Data.FechaFin = $scope.fechafin;
            $http({
                method: 'POST',
                url: '/EnviarEmailProveedores',
                headers: { 'Content-Type': 'application/json' },
                data: Data
            }).then(function successCallback(response) {
                $loading.finish('myloading');
                if (response.data.Result == 'Ok'){
                  swal("Licitaciones Proenfar", "Mensaje enviado.");
                }
            }, function errorCallback(response) {
                alert(response.statusText);
            });
          }
          // Fin Uploader de files para el email
          $scope.EnviarEmailProveedores = function () {
            if ($scope.Proveedores.length == 0){
              swal("Licitaciones Proenfar", "Debe escoger a menos un proveedor.");
              return 0;
            }
            if ($scope.uploader.queue.length == 0){
              swal("Licitaciones Proenfar", "Debe escoger a menos un archivo anexo de la licitación para el proveedor.");
              return 0;
            }
            if ($scope.Mensaje.trim() == ''){
              swal("Licitaciones Proenfar", "Debe colocar un mensaje para los proveedores de la licitación.");
              return 0;
            }
            $loading.start('myloading');
            $scope.QuantityFiles = $scope.uploader.queue.length;
            if ($scope.QuantityFiles > 0) {
                $scope.uploader.uploadAll();
            }
            else {
                $scope.EnviarEmailProveedoresFinish();
            }
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
              if (typeof $scope.Usuario.selected == 'undefined'){
                swal("Licitaciones Proenfar", "Debe buscar un proveedor con algunas letras del nombre.");
                return 0;
              }
              var tmpProveedores = $scope.Proveedores.filter(function(el){
                return el.Name == $scope.Usuario.selected.Name
              })
              if (tmpProveedores.length > 0){
                swal("Licitaciones Proenfar", "Ya el proveedor fue agregado.");
                return 0;
              }
              $scope.Proveedores.push($scope.Usuario.selected);
              $scope.Usuario.selected=undefined;
            }

            $scope.dtproveedor= function(dato) {
              $scope.Proveedores = $scope.Proveedores.filter(function(el){
                return el.User != dato.User
              })
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
              var params = { usuario: usuario };
              $loading.start('myloading');
              return $http.post('/GetBuscarUsuarioByRazon', { params: params })
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
                    swal("Licitaciones Proenfar", "Debe ingresar un email valido.");
                    return 0;
                }

                  if ($scope.username.trim() == '') {
                    swal("Licitaciones Proenfar", "Debe colocar un nombre de contacto.");
                    return 0;
                }

                if ($scope.phone.length == 0) {
                    swal("Licitaciones Proenfar", "Debe ingresar un numero contacto.");
                    return 0;
                }


                if ($scope.user.trim() == '') {
                    swal("Licitaciones Proenfar", "Debe ingresar usuario.");
                    return 0;
                }

                if ($scope.password.trim() == '') {
                    swal("Licitaciones Proenfar", "Debe ingresar un password.");
                    return 0;
                }
            }




        }])

        .controller('ctrlUsuarioAdmin', ['$scope', '$http', '$loading', '$uibModal', function ($scope, $http, $loading, $uibModal) {
        // Llama a HTML Modal que permite cambiar passwor de la app
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
          // Fin Llama a HTML Modal que permite cambiar passwor de la app

           ///////////////////////////////menu licitacion///////////////////


          $scope.UserNameConnected = localStorage.UserNameConnected;

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

          $scope.read = function (workbook) {
            console.log(workbook);
            console.log(workbook.Sheets.Hoja1);
            var a = XLSX.utils.sheet_to_json(workbook.Sheets.Hoja1, {raw: true});
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
            $scope.DeleteUser = function (User) {
              if (localStorage.UserConnected == User) {
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
                Data.User = User;
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
            $scope.GotoUser = function (User) {
                localStorage.LoginUser = User;
                window.location.href = '/nuevo_usuario.html';
            }



            $scope.GetUsuarios();
        }]);
