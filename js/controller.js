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
              $scope.contactosmodalidadesfiltered = $scope.contactosmodalidades
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


        .controller('ctrlLicitacion', ['$scope', '$http', '$uibModal', '$log', '$document', '$loading', 'FileUploader', function ($scope, $http, $uibModal, $log, $document, $loading, FileUploader) {

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
                        Areas: true,
                        BodegajesP: true,
                        AduanasP: true,
                        OTMP: true,
                        MaritimasFclP: true,
                        MaritimasLclP: true,
                        TerrestreNacionalP: true,
                        TerrestreUrbanoP: true,
                        AreasP: true,
                        BodegajesR: true,
                        AduanasR: true,
                        OTMR: true,
                        MaritimasFclR: true,
                        MaritimasLclR: true,
                        TerrestreNacionalR: true,
                        TerrestreUrbanoR: true,
                        AreasR: true
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
                        if ($scope.ModalidadesMostrarActual == 'Areas'){
                          $scope.ModalidadesMostrar.Areas = false;
                        }
                        if (ModalidadesMostrar == 'Bodegajes'){
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
                        }



                          $scope.ModalidadesMostrarActual = ModalidadesMostrar;
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
                 ////////////////////////////Bodegajes_Aduanero ////////////////////////////////////////////
                      if($scope.ModalidadesMostrarActual=='Bodegajes'){
                          angular.forEach(data.Aduanero, function(aduanero) {
                        ////////////////////////////valida si es numerico o null ///////////////
                               if(pattern.test(aduanero.TarifaValor)){
                                  $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaValor = aduanero.TarifaValor;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='Aduanero_TarifaValor';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }

                               if(pattern.test(aduanero.TarifaMinima)){
                                  $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaMinima = aduanero.TarifaMinima;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='Aduanero_TarifaMinima';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }

                               if(pattern.test(aduanero.Otros)){
                                $scope.ModalidadesProveedor.Bodegajes.Aduanero.Otros = aduanero.Otros;
                                 // $scope.$apply();
                                }
                                else
                                {
                                  var valor='Aduanero_Otros';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }
                              $scope.$apply();
                           });


                     ////////////////////////////Bodegajes_Maquinaria ////////////////////////////////////////////
                         angular.forEach(data.Maquinaria , function(maquinaria) {
                           if(pattern.test(maquinaria.Tarifa)){
                                  $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Tarifa = maquinaria.Tarifa;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='Maquinaria_Tarifa';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }

                               if(pattern.test(maquinaria.TarifaMinima)){
                                  $scope.ModalidadesProveedor.Bodegajes.Maquinaria.TarifaMinima = maquinaria.TarifaMinima;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='Maquinaria_TarifaMinima';
                                  $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }

                               if(pattern.test(maquinaria.FMM)){
                                 $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Fmm = maquinaria.FMM;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='Maquinaria_FMM';
                                 $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }
                                $scope.$apply();
                             });

                     ////////////////////////////Bodegajes_Materia_Prima ////////////////////////////////////////////
                         angular.forEach(data.Materia_Prima , function(materiaprima) {
                          //////////////////////valida si es numerico o null ///////////////
                               if(pattern.test(materiaprima.Tarifa)){
                                 $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Tarifa = materiaprima.Tarifa;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='MateriaPrima_Tarifa';
                                   $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }

                               if(pattern.test(materiaprima.TarifaMinima)){
                                 $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.TarifaMinima = materiaprima.TarifaMinima;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='MateriaPrima_TarifaMinima';
                                 $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }

                               if(pattern.test(materiaprima.FMM)){
                                  $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Fmm = materiaprima.FMM;
                                  //$scope.$apply();
                                }
                                else
                                {
                                  var valor='MateriaPrima_FMM';
                                 $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }
                                $scope.$apply();
                             });

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
                                if(pattern.test(aduana.Tarifa)){
                                   filaTarifa=filaTarifa +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                  // $scope.$apply();
                                }
                                else
                                {

                                filaTarifa=filaTarifa +1;
                                  var valor='Tarifa';
                                  $scope.erroresimportacion.push({fila: filaTarifa, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);

                                 }
                            //////////////////Minima//////////////////////////
                                if(pattern.test(aduana.Minima)){
                                  filaMinima=filaMinima +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaMinima=filaMinima +1;
                                  var valor='Minima';
                                  $scope.erroresimportacion.push({fila: filaMinima, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////GastosAdicionales//////////////////////////
                                if(pattern.test(aduana.Gastos_Adicionales)){
                                  filaGastosAdicionales=filaGastosAdicionales +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosAdicionales=filaGastosAdicionales +1;
                                  var valor='Gastos_Adicionales';
                                  $scope.erroresimportacion.push({fila: filaGastosAdicionales, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////ConceptosAdicionales//////////////////////////
                                if(pattern.test(aduana.Conceptos_Adicionales)){
                                  filaConceptosAdicionales=filaConceptosAdicionales +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                  //$scope.$apply();
                                  }
                                else
                                {
                                filaConceptosAdicionales=filaConceptosAdicionales +1;
                                  var valor='Conceptos_Adicionales';
                                  $scope.erroresimportacion.push({fila: filaConceptosAdicionales, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                        //////////////////GastosAdicionalesdos//////////////////////////
                                if(pattern.test(aduana.Gastos_Adicionales_dos)){
                                  filaGastosAdicionalesdos=filaGastosAdicionalesdos +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosAdicionalesdos=filaGastosAdicionalesdos +1;
                                  var valor='Gastos_Adicionales_dos';
                                  $scope.erroresimportacion.push({fila: filaGastosAdicionalesdos, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////ConceptosAdicionales2//////////////////////////
                                if(pattern.test(aduana.Conceptos_Adicionales_dos)){
                                  filaConceptosAdicionalesdos=filaConceptosAdicionalesdos +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaConceptosAdicionalesdos=filaConceptosAdicionalesdos +1;
                                  var valor='Conceptos_Adicionales_dos';
                                  $scope.erroresimportacion.push({fila: filaConceptosAdicionalesdos, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          //////////////////GastosAdicionalestres//////////////////////////
                                if(pattern.test(aduana.Gastos_Adicionales_tres)){
                                  filaGastosAdicionalestres=filaGastosAdicionalestres +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosAdicionalestres=filaGastosAdicionalestres +1;
                                  var valor='Gastos_Adicionales_tres';
                                  $scope.erroresimportacion.push({fila: filaGastosAdicionalestres, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////ConceptosAdicionalestres//////////////////////////
                                if(pattern.test(aduana.Conceptos_Adicionales_tres)){
                                  filaConceptosAdicionalestres=filaConceptosAdicionalestres +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaConceptosAdicionalestres=filaConceptosAdicionalestres +1;
                                  var valor='Conceptos_Adicionales_tres';
                                  $scope.erroresimportacion.push({fila: filaConceptosAdicionalestres, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////CostoPlanificacionCaja//////////////////////////
                                if(pattern.test(aduana.Costo_Planificacion_Caja)){
                                  filaCostoPlanificacionCaja=filaCostoPlanificacionCaja +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaCostoPlanificacionCaja=filaCostoPlanificacionCaja +1;
                                  var valor='Costo_Planificacion_Caja';
                                  $scope.erroresimportacion.push({fila: filaCostoPlanificacionCaja, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////Otros/////////////////////////////////////////
                                if(pattern.test(aduana.Otros)){
                                  filaOtros=filaOtros +1;
                                   $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaOtros=filaOtros +1;
                                  var valor='Otros';
                                  $scope.erroresimportacion.push({fila: filaOtros, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                $scope.$apply();
                        });
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
                                if(pattern.test(otm.C_20_hasta_4_5_Ton)){
                                   filacveintecuatroconcinco=filacveintecuatroconcinco +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintecuatroconcinco=filacveintecuatroconcinco +1;
                                  var valor='C_20_hasta_4_5_Ton';
                                  $scope.erroresimportacion.push({fila: filacveintecuatroconcinco, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////C_20_hasta_8_Ton//////////////////////////
                                if(pattern.test(otm.C_20_hasta_8_Ton)){
                                  filaCcveinteoocho=filacveinteoocho +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteoocho=filacveinteoocho +1;
                                  var valor='C_20_hasta_8_Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteoocho, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////cveintendiez//////////////////////////
                                if(pattern.test(otm.C_20_hasta_10_Ton)){
                                  filacveintendiez=filacveintendiez +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintendiez=filacveintendiez +1;
                                  var valor='C_20_hasta_10_Ton';
                                  $scope.erroresimportacion.push({fila: filacveintendiez, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////cveintendiezsiete//////////////////////////
                                if(pattern.test(otm.C_20_hasta_17_Ton)){
                                  filacveintendiezsiete=filacveintendiezsiete +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintendiezsiete=filacveintendiezsiete +1;
                                  var valor='C_20_hasta_17_Ton';
                                  $scope.erroresimportacion.push({fila: filacveintendiezsiete, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                        //////////////////cveintendieznueve//////////////////////////
                                if(pattern.test(otm.C_20_hasta_19_Ton)){
                                  filacveintendieznueve=filacveintendieznueve +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveintendieznueve=filacveintendieznueve +1;
                                  var valor='C_20_hasta_19_Ton';
                                  $scope.erroresimportacion.push({fila: filacveintendieznueve, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////cveinteveinte//////////////////////////
                                if(pattern.test(otm.C_20_hasta_20_Ton)){
                                  filacveinteveinte=filacveinteveinte +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteveinte=filacveinteveinte +1;
                                  var valor='C_20_hasta_20_Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteveinte, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          //////////////////cveinteveinteyuno//////////////////////////
                                if(pattern.test(otm.C_20_hasta_21_Ton)){
                                  filacveinteveinteyuno=filacveinteveinteyuno +1;
                                   $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteveinteyuno=filacveinteveinteyuno +1;
                                  var valor='C_20_hasta_21_Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteveinteyuno, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////cveinteveinteycinco//////////////////////////
                                if(pattern.test(otm.C_20_hasta_25_Ton)){
                                  filacveinteveinteycinco=filacveinteveinteycinco +1;
                                   $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filacveinteveinteycinco=filacveinteveinteycinco +1;
                                  var valor='C_20_hasta_25_Ton';
                                  $scope.erroresimportacion.push({fila: filacveinteveinteycinco, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentaquince//////////////////////////
                                if(pattern.test(otm.C_40_hasta_15_Ton)){
                                  filaccuarentaquince=filaccuarentaquince +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaquince=filaccuarentaquince +1;
                                  var valor='C_40_hasta_15_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaquince, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentadiezyseis/////////////////////////////////////////
                                if(pattern.test(otm.C_40_hasta_16_Ton)){
                                  filaccuarentadiezyseis=filaccuarentadiezyseis +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentadiezyseis=filaccuarentadiezyseis +1;
                                  var valor='C_40_hasta_16_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentadiezyseis, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                      //////////////////ccuarentadiezysiete//////////////////////////
                                if(pattern.test(otm.C_40_hasta_17_Ton)){
                                  filaccuarentadiezysiete=filaccuarentadiezysiete +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentadiezysiete=filaccuarentadiezysiete +1;
                                  var valor='C_40_hasta_17_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentadiezysiete, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentaveinte/////////////////////////////////////////
                                if(pattern.test(otm.C_40_hasta_17_18_Ton)){
                                  filaccuarentaveinte=filaccuarentaveinte +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinte=filaccuarentaveinte +1;
                                  var valor='C_40_hasta_17_18_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinte, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             //////////////////ccuarentaveinteyuno//////////////////////////
                                if(pattern.test(otm.C_40_hasta_20_Ton)){
                                  filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;
                                  var valor='cC_40_hasta_20_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinteyuno, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentaveinteydos/////////////////////////////////////////
                                if(pattern.test(otm.C_40_hasta_21_Ton)){
                                  filaccuarentaveinteydos=filaccuarentaveinteydos +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinteydos=filaccuarentaveinteydos +1;
                                  var valor='C_40_hasta_21_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinteydos, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                           //////////////////ccuarentatreinta//////////////////////////
                                if(pattern.test(otm.C_40_hasta_22_Ton)){
                                  filaccuarentatreinta=filaccuarentatreinta +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentatreinta=filaccuarentatreinta +1;
                                  var valor='C_40_hasta_22_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentatreinta, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                   //////////////////ccuarentatreinta//////////////////////////
                                if(pattern.test(otm.C_40_hasta_30_Ton)){
                                  filaccuarentatreinta=filaccuarentatreinta +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentatreinta=filaccuarentatreinta +1;
                                  var valor='C_40_hasta_30_Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentatreinta, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////devolucionveinteestandar/////////////////////////////////////////
                                if(pattern.test(otm.Devolucion_20$_estandar)){
                                  filadevolucionveinteestandar=filadevolucionveinteestandar +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filadevolucionveinteestandar=filadevolucionveinteestandar +1;
                                  var valor='Devolucion_20$_estandar';
                                  $scope.erroresimportacion.push({fila: filadevolucionveinteestandar, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////devolucioncuarentaestandar//////////////////////////
                                if(pattern.test(otm.Devolucion_40$_estandar)){
                                  filadevolucioncuarentaestandar=filadevolucioncuarentaestandar +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filadevolucioncuarentaestandar=filadevolucioncuarentaestandar +1;
                                  var valor='Devolucion_40$_estandar';
                                  $scope.erroresimportacion.push({fila: filadevolucioncuarentaestandar, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////devolucionveinteexpreso/////////////////////////////////////////
                                if(pattern.test(otm.Devolucion_20$_expreso)){
                                  filadevolucionveinteexpreso=filadevolucionveinteexpreso +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filadevolucionveinteexpreso=filadevolucionveinteexpreso +1;
                                  var valor='Devolucion_20$_expreso';
                                  $scope.erroresimportacion.push({fila: filadevolucionveinteexpreso, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            //////////////////devolucioncuarentaexpreso/////////////////////////////////////////
                                if(pattern.test(otm.Devolucion_40$_expreso)){
                                  filadevolucioncuarentaexpreso=filadevolucioncuarentaexpreso +1;
                                    $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filadevolucioncuarentaexpreso=filadevolucioncuarentaexpreso +1;
                                  var valor='Devolucion_40$_expreso';
                                  $scope.erroresimportacion.push({fila: filadevolucioncuarentaexpreso, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               $scope.$apply();
                        });
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
                                if(pattern.test(maritimasfcl.C20)){
                                   filaC20=filaC20 +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.C20= data.MaritimasFcl.C20;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaC20=filaC20 +1;
                                  var valor='C20';
                                  $scope.erroresimportacion.push({fila: filaC20, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////Baf20////////////////////////////////////
                                if(pattern.test(maritimasfcl.Baf20)){
                                   filaBaf20=filaBaf20 +1;
                                  //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Baf20= data.MaritimasFcl.Baf20;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaBaf20=filaBaf20 +1;
                                  var valor='Baf20';
                                  $scope.erroresimportacion.push({fila: filaBaf20, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////C40////////////////////////////////////
                                if(pattern.test(maritimasfcl.C40)){
                                   filaC40=filaC40 +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.C40= data.MaritimasFcl.C40;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaC40=filaC40 +1;
                                  var valor='C_40';
                                  $scope.erroresimportacion.push({fila: filaC40, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               /////////////Baf40////////////////////////////////////
                                if(pattern.test(maritimasfcl.Baf40)){
                                   filaBaf40=filaBaf40 +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Baf40= data.MaritimasFcl.Baf40;
       ;                           //$scope.$apply();
                                  }
                                else
                                {
                                filaBaf40=filaBaf40 +1;
                                  var valor='Baf40';
                                  $scope.erroresimportacion.push({fila: filaBaf40, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                              /////////////C40HC////////////////////////////////////
                                if(pattern.test(maritimasfcl.C40HC)){
                                   filaC40HC=filaC40HC +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.atoria_C40HC= data.MaritimasFcl.C40HC;

                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaC40HC=filaC40HC +1;
                                  var valor='C40HC';
                                  $scope.erroresimportacion.push({fila: filaC40HC, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               /////////////Baf40HC////////////////////////////////////
                                if(pattern.test(maritimasfcl.Baf40HC)){
                                   filaBaf40HC=filaBaf40HC +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.SBaf40HC= data.MaritimasFcl.Baf40HC;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaBaf40HC=filaBaf40HC +1;
                                  var valor='Baf40HC';
                                  //$scope.erroresimportacion.push({fila: filaBaf40HC, campo:valor, error:'Valor NO numérico'});
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Observaciones= data.MaritimasFcl.Observacione;
                                  $scope.AbrirModal(valor);
                                 }
                               /////////////Observaciones////////////////////////////////////
                                 if(maritimasfcl.Observaciones==null){
                                   filaObservacionesmf=filaObservacionesmf +1;
                                  var valor='Observaciones';
                                  $scope.erroresimportacion.push({fila: filaObservacionesmf, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                  }
                                else
                                {
                                 filaObservacionesmf=filaObservacionesmf +1;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.$apply();
                                 }
                            /////////////GastosEmbarque////////////////////////////////////
                                if(pattern.test(maritimasfcl.GastosEmbarque)){
                                   filaGastosEmbarquemf=filaGastosEmbarquemf +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.GastosEmbarque= data.MaritimasFcl.GastosEmbarque;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarquemf=filaGastosEmbarquemf +1;
                                  var valor='GastosEmbarque';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarquemf, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////Time////////////////////////////////////
                                if(pattern.test(maritimasfcl.Lead_TimeDias)){
                                   filaTimemf=filaTimemf +1;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Lead_TimeDias= data.MaritimasFcl.Lead_TimeDias;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimemf=filaTimemf +1;
                                  var valor='Lead_TimeDias';
                                  $scope.erroresimportacion.push({fila: filaTimemf, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////Naviera////////////////////////////////////
                                if(pattern.test(maritimasfcl.Naviera)){
                                   filaNavierafcl=filaNavierafcl +1;
                                   //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                   $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl.Naviera= data.MaritimasFcl.Naviera;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaNavierafcl=filaNavierafcl +1;
                                  var valor='Naviera';
                                  $scope.erroresimportacion.push({fila: filaNavierafcl, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////FrecuenciaSemanal////////////////////////////////////
                                if(maritimasfcl.FrecuenciaSemanal=='X') {
                                 maritimasfcl.FrecuenciaSemanal=true;
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                  }
                                else
                                {
                                 maritimasfcl.FrecuenciaSemanal=false;
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  $scope.$apply();
                                 }
                             /////////////FrecuenciaQuincenal////////////////////////////////////
                                if(maritimasfcl.FrecuenciaQuincenal=='X')  {
                                  maritimasfcl.FrecuenciaQuincenal=true;
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                  }
                                else
                                {
                                  maritimasfcl.FrecuenciaQuincenal=false;
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                }
                            /////////////FrecuenciaMensual////////////////////////////////////
                               if(maritimasfcl.FrecuenciaMensual=='X') {
                                 maritimasfcl.FrecuenciaMensual=true;
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                  }

                                else
                                {
                                  maritimasfcl.FrecuenciaMensual=false;
                                  $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                  //$scope.$apply();
                                 }
                           /////////////SUMATORIA C20 + Baf 20 + Ge////////////////////////////////////
                                var sumatoria=0;
                                sumatoria=maritimasfcl.C20 + maritimasfcl.Baf20 + maritimasfcl.GastosEmbarque;
                                maritimasfcl.Sumatoria_C20_Baf20_Ge = sumatoria;
                                $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                //$scope.$apply();
                           /////////////SUMATORIA C40 + Baf 40 + Ge////////////////////////////////////
                                var sumatoria1=0;
                                sumatoria1=maritimasfcl.C40 + maritimasfcl.Baf40 + maritimasfcl.GastosEmbarque;
                                maritimasfcl.Sumatoria_C40_Baf40_Ge = sumatoria1;
                                $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                //$scope.$apply();
                           /////////////SUMATORIA C40HC + Baf 40HC + Ge////////////////////////////////////
                                var sumatoria2=0;
                                sumatoria2=maritimasfcl.C40HC + maritimasfcl.Baf40HC + maritimasfcl.GastosEmbarque;
                                maritimasfcl.Sumatoria_C40HC_Baf40HC_Ge = sumatoria2;
                                $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                               // $scope.$apply();
                               $scope.$apply();
                              });

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
                                if(pattern.test(maritimaslcl.Minima)){
                                   filaMinima=filaMinima +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaMinima=filaMinima +1;
                                  var valor='Minima';
                                  $scope.erroresimportacion.push({fila: filaMinima, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////ton15////////////////////////////////////
                                if(pattern.test(maritimaslcl._1_5_ton_M3)){
                                   filaton15=filaton15 +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton15=filaton15 +1;
                                  var valor='_1_5_ton_M3';
                                  $scope.erroresimportacion.push({fila: filaton15, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////ton58////////////////////////////////////
                                if(pattern.test(maritimaslcl._5_8_ton_M3)){
                                   filaton58=filaton58 +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton58=filaton58 +1;
                                  var valor='_5_8_ton_M3';
                                  $scope.erroresimportacion.push({fila: filaton58, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               /////////////ton812////////////////////////////////////
                                if(pattern.test(maritimaslcl._8_12_ton_M3)){
                                   filaton812=filaton812 +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton812=filaton812 +1;
                                  var valor='_8_12_ton_M3';
                                  $scope.erroresimportacion.push({fila: filaton812, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               /////////////ton1218////////////////////////////////////
                                if(pattern.test(maritimaslcl._12_18_ton_M3)){
                                   filaton1218=filaton1218 +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaton1218=filaton1218 +1;
                                  var valor='_12_18_ton_M3';
                                  $scope.erroresimportacion.push({fila: filaton1218, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                              /////////////GastosEmbarque////////////////////////////////////
                                if(pattern.test(maritimaslcl.Gastos_Embarque)){
                                   filaGastosEmbarqueml=filaGastosEmbarqueml +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarqueml=filaGastosEmbarqueml +1;
                                  var valor='Gastos_Embarque';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarqueml, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                }
                               /////////////Observaciones////////////////////////////////////
                                if(maritimaslcl.Observaciones==null){
                                 filaObservacionesml=filaObservacionesml +1;
                                  var valor='Observaciones';
                                  $scope.erroresimportacion.push({fila: filaObservacionesml, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                  }
                                else
                                {
                                  filaObservacionesml=filaObservacionesml +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }
                             /////////////Time////////////////////////////////////
                                if(pattern.test(maritimaslcl.Time)){
                                   filaTimeml=filaTimeml +1;
                                  $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimeml=filaTimeml +1;
                                  var valor='Time';
                                  $scope.erroresimportacion.push({fila: filaTimeml, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                   /////////////Naviera////////////////////////////////////
                                if(pattern.test(maritimaslcl.Naviera)){
                                   filaNavieralcl=filaNavieralcl +1;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   $scope.$apply();
                                  }
                                else
                                {
                                filaNavieralcl=filaNavieralcl +1;
                                  var valor='Naviera';
                                  $scope.erroresimportacion.push({fila: filaNavieralcl, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          /////////////FrecuenciaLunes////////////////////////////////////
                                if(maritimaslcl.FrecuenciaDiasLunes=='X') {
                                    maritimaslcl.FrecuenciaDiasLunes=true;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl.FrecuenciaDiasLunes=false;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                          /////////////FrecuenciaMartes////////////////////////////////////
                                if(maritimaslcl.FrecuenciaDiasMartes=='X') {
                                   maritimaslcl.FrecuenciaDiasMartes=true;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl.FrecuenciaDiasMartes=false;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                           /////////////FrecuenciaMiercoles////////////////////////////////////
                                  if(maritimaslcl.FrecuenciaDiasMiercoles=='X') {
                                   maritimaslcl.FrecuenciaDiasMiercoles=true;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl.FrecuenciaDiasMiercoles=false;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                            //////////FrecuenciaJueves////////////////////////////////////

                                  if(maritimaslcl.FrecuenciaDiasJueves=='X') {
                                   maritimaslcl.FrecuenciaDiasJueves=true;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl.FrecuenciaDiasJueves=false;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaViernes////////////////////////////////////
                                if(maritimaslcl.FrecuenciaDiasViernes=='X') {
                                   maritimaslcl.FrecuenciaDiasViernes=true;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                  //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl.FrecuenciaDiasViernes=false;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaSabado////////////////////////////////////
                                if(maritimaslcl.FrecuenciaDiasSabado=='X') {
                                   maritimaslcl.FrecuenciaDiasSabado=true;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl.FrecuenciaDiasSabado=false;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }

                             /////////////FrecuenciaDominfo////////////////////////////////////
                                   if(maritimaslcl.FrecuenciaDiasDomingo=='X') {
                                   maritimaslcl.FrecuenciaDiasDomingo=true;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  maritimaslcl.FrecuenciaDiasDomingo=false;
                                   $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                 }
                            $scope.$apply();
                          });
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
                                if(pattern.test(terrestrenacional.Turbo_Standar_150Cajas)){
                                   filaEstandarna=filaEstandarna +1;
                                   $scope.ModalidadesProveedor.TerreNacional.TerresNacional= data.Terrestre_Nacional;
                                   console.log('Terrenacional por aqui');
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandarna=filaEstandarna +1;
                                  var valor='Turbo_Standar_150Cajas';
                                  $scope.erroresimportacion.push({fila: filaEstandarna, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////Especial////////////////////////////////////
                                if(pattern.test(terrestrenacional.Turbo_Especial)){
                                   filaEspecialna=filaEspecialna +1;
                                   console.log('Terrenacional por aqui 2');
                                   $scope.ModalidadesProveedor.TerreNacional.TerresNacional= data.Terrestre_Nacional;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialna=filaEspecialna +1;
                                  var valor='Turbo_Especial';
                                  $scope.erroresimportacion.push({fila: filaEspecialna, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             $scope.$apply();
                        });

                   ///////////////////Terrestre Nacional Sencillo////////////////////////////////////////////
                         var filaEstandarnasen=1;
                         var filaEspecialnasen=1;

                           angular.forEach(data.Terrestre_Nacional_Sencillo, function(terrestrenacionalsencillo) {
                             /////////////Sencillo_240Cajass////////////////////////////////////
                                if(pattern.test(terrestrenacionalsencillo.Sencillo_240Cajas)){
                                   filaEstandarnasen=filaEstandarnasen +1;
                                   $scope.ModalidadesProveedor.TerreNacionalSencillo.TerresNacionalSencillo= data.Terrestre_Nacional_Sencillo;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandarnasen=filaEstandarnasen +1;
                                  var valor='Sencillo_240Cajas';
                                  $scope.erroresimportacion.push({fila: filaEstandarnasen, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////Sencillo_Especial////////////////////////////////////
                                if(pattern.test(terrestrenacionalsencillo.Sencillo_Especial)){
                                   filaEspecialnasen=filaEspecialnasen +1;
                                   $scope.ModalidadesProveedor.TerreNacionalSencillo.TerresNacionalSencillo= data.Terrestre_Nacional_Sencillo;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialnasen=filaEspecialnasen +1;
                                  var valor='Sencillo_Especial';
                                  $scope.erroresimportacion.push({fila: filaEspecialnasen, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                 $scope.$apply();
                        });

                     ///////////////////Terrestre Nacional Patineta////////////////////////////////////////////
                         var filaEstandarnapat=1;
                         var filaEspecialnapat=1;

                           angular.forEach(data.Terrestre_Nacional_Patineta, function(terrestrenacionalpatineta) {
                             /////////////Minimula////////////////////////////////////
                                if(pattern.test(terrestrenacionalpatineta.Minimula)){
                                   filaEstandarnapat=filaEstandarnapat +1;
                                   $scope.ModalidadesProveedor.TerreNacionalPatineta.TerresNacionalPatineta= data.Terrestre_Nacional_Patineta;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandarnapat=filaEstandarnapat +1;
                                  var valor='Minimula';
                                  $scope.erroresimportacion.push({fila: filaEstandarnapat, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////GranDanes////////////////////////////////////
                                if(pattern.test(terrestrenacionalpatineta.GranDanes)){
                                   filaEspecialnapat=filaEspecialnapat +1;
                                   $scope.ModalidadesProveedor.TerreNacionalPatineta.TerresNacionalPatineta= data.Terrestre_Nacional_Patineta;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaEspecialnapat=filaEspecialnapat +1;
                                  var valor='GranDanes';
                                  $scope.erroresimportacion.push({fila: filaEspecialnapat, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               $scope.$apply();
                        });

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
                                if(pattern.test(terrestreurbano.Turbo_150Cajas)){
                                   filaEstandartu=filaEstandartu +1;
                                   $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandartu=filaEstandartu +1;
                                  var valor='Turbo_150Cajas';
                                  $scope.erroresimportacion.push({fila: filaEstandartu, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////ETurbo_Especial_200Cajas////////////////////////////////////
                                if(pattern.test(terrestreurbano.Turbo_Especial_200Cajas)){
                                   filaEspecialtu=filaEspecialtu +1;
                                   $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtu=filaEspecialtu +1;
                                  var valor='Turbo_Especial_200Cajas';
                                  $scope.erroresimportacion.push({fila: filaEspecialtu, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_240Cajas////////////////////////////////////
                                if(pattern.test(terrestreurbano.Sencillo_240Cajas)){
                                   filaEspecialtusen240=filaEspecialtusen240 +1;
                                   $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.TerrestreUrbano;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen240=filaEspecialtusen240 +1;
                                  var valor='Sencillo_240Cajas';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen240, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_Especial_300Cajas////////////////////////////////////
                                if(pattern.test(terrestreurbano.Sencillo_Especial_300Cajas)){
                                   filaEspecialtusen300=filaEspecialtusen300 +1;
                                   $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen300=filaEspecialtusen300 +1;
                                  var valor='Sencillo_Especial_300Cajas';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen300, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////Minimula////////////////////////////////////
                                if(pattern.test(terrestreurbano.Minimula)){
                                   filaEspecialtumini=filaEspecialtumini +1;
                                   $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.TerrestreUrbano;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtumini=filaEspecialtumini +1;
                                  var valor='Minimula';
                                  $scope.erroresimportacion.push({fila: filaEspecialtumini, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////GranDanes////////////////////////////////////
                                if(pattern.test(terrestreurbano.GranDanes)){
                                   filaEspecialtugran=filaEspecialtugran +1;
                                   $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.Terrestre_Urbano_Dia;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtugran=filaEspecialtugran +1;
                                  var valor='GranDanes';
                                  $scope.erroresimportacion.push({fila: filaEspecialtugran, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
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
                                if(pattern.test(terrestreurbanoviaje.Turbo_150Cajas)){
                                   filaEstandartuvia=filaEstandartuvia +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandartu=filaEstandartu +1;
                                  var valor='Turbo_150Cajas';
                                  $scope.erroresimportacion.push({fila: filaEstandartuvia, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////ETurbo_Especial_200Cajas////////////////////////////////////
                                if(pattern.test(terrestreurbanoviaje.Turbo_Especial_200Cajas)){
                                   filaEspecialtuvia=filaEspecialtuvia +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtuvia=filaEspecialtuvia +1;
                                  var valor='Turbo_Especial_200Cajas';
                                  $scope.erroresimportacion.push({fila: filaEspecialtuvia, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_240Cajas////////////////////////////////////
                                if(pattern.test(terrestreurbanoviaje.Sencillo_240Cajas)){
                                   filaEspecialtusen240via=filaEspecialtusen240via +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen240via=filaEspecialtusen240via +1;
                                  var valor='Sencillo_240Cajas';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen240via, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          /////////////Sencillo_Especial_300Cajas////////////////////////////////////
                                if(pattern.test(terrestreurbanoviaje.Sencillo_Especial_300Cajas)){
                                   filaEspecialtusen300via=filaEspecialtusen300via +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtusen300via=filaEspecialtusen300via +1;
                                  var valor='Sencillo_Especial_300Cajas';
                                  $scope.erroresimportacion.push({fila: filaEspecialtusen300via, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////Minimula////////////////////////////////////
                                if(pattern.test(terrestreurbanoviaje.Minimula)){
                                   filaEspecialtuminivia=filaEspecialtuminivia +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtuminivia=filaEspecialtuminivia +1;
                                  var valor='Minimula';
                                  $scope.erroresimportacion.push({fila: filaEspecialtuminivia, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////GranDanes////////////////////////////////////
                                if(pattern.test(terrestreurbanoviaje.GranDanes)){
                                   filaEspecialtugranvia=filaEspecialtugranvia +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoViaje.TerresUrbanoViaje= data.Terrestre_Urbano_Viaje;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtugranvia=filaEspecialtugranvia +1;
                                  var valor='GranDanes';
                                  $scope.erroresimportacion.push({fila: filaEspecialtugranvia, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                 $scope.$apply();
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
                                if(pattern.test(terrestreurbanotonelada.Turbo)){
                                   filaEstandartuviatone=filaEstandartuviatone +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada= data.Terrestre_Urbano_Tonelada;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEstandartuviatone=filaEstandartuviatone +1;
                                  var valor='Turbo_150Cajas';
                                  $scope.erroresimportacion.push({fila: filaEstandartuviatone, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////Sencillo////////////////////////////////////
                                if(pattern.test(terrestreurbanotonelada.Sencillo)){
                                   filaEspecialtuviasentone=filaEspecialtuviasentone +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada= data.Terrestre_Urbano_Tonelada;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtuviasentone=filaEspecialtuviasentone +1;
                                  var valor='Turbo_Especial_200Cajas';
                                  $scope.erroresimportacion.push({fila: filaEspecialtuviasentone, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          /////////////Tractomula////////////////////////////////////
                                if(pattern.test(terrestreurbanotonelada.Tractomula)){
                                   filaEspecialtutracto=filaEspecialtutracto +1;
                                   $scope.ModalidadesProveedor.TerreUrbanoTonelada.TerresUrbanoTonelada= data.Terrestre_Urbano_Tonelada;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaEspecialtutracto=filaEspecialtutracto +1;
                                  var valor='Tractomula';
                                  $scope.erroresimportacion.push({fila: filaEspecialtutracto, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                 $scope.$apply();
                             });

                              //console.log($scope.data.Aduanas);
                        if (typeof data.Terrestre_Urbano_Dia == 'undefined') {
                          swal("Licitaciones Proenfar", "La plantilla no corresponde a esta modalidad.");
                      }
                         }

                 ///////////////////Aereas Carguero////////////////////////////////////////////
                        if($scope.ModalidadesMostrarActual=='Areas'){
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
                                if(pattern.test(aereacarguero.Minima)){
                                   filaMinimaca=filaMinimaca +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaMinimaca=filaMinimaca +1;
                                  var valor='Minima_Carguero';
                                  $scope.erroresimportacion.push({fila: filaMinimaca, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////aerea45////////////////////////////////////
                                if(pattern.test(aereacarguero.T_45)){
                                   filaaerea45=filaaerea45 +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea45=filaaerea45 +1;
                                  var valor='T45_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea45, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////aerea100////////////////////////////////////
                                if(pattern.test(aereacarguero.T_100)){
                                   filaaerea100=filaaerea100 +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea100=filaaerea100 +1;
                                  var valor='T100_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea100, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               /////////////aerea300////////////////////////////////////
                                if(pattern.test(aereacarguero.T_300)){
                                   filaaerea300=filaaerea300 +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea300=filaaerea300 +1;
                                  var valor='T300_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea300, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                           /////////////aerea500////////////////////////////////////
                                if(pattern.test(aereacarguero.T_500)){
                                   filaaerea500=filaaerea500 +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaaerea500=filaaerea500 +1;
                                  var valor='T500_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea500, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////aerea1000////////////////////////////////////
                                if(pattern.test(aereacarguero.T_1000)){
                                   filaaerea1000=filaaerea1000 +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea1000=filaaerea1000 +1;
                                  var valor='T1000_Carguero';
                                  $scope.erroresimportacion.push({fila: filaaerea1000, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////FSmin////////////////////////////////////
                                if(pattern.test(aereacarguero.FSmin)){
                                   filaFSmin=filaFSmin +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaFSmin=filaFSmin +1;
                                  var valor='FSmin_Carguero';
                                  $scope.erroresimportacion.push({fila: filaFSmin, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                       /////////////Fskg////////////////////////////////////
                                if(pattern.test(aereacarguero.Fskg)){
                                   filaFskg=filaFskg +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaFskg=filaFskg +1;
                                  var valor='Fskg_Carguero';
                                  $scope.erroresimportacion.push({fila: filaFskg, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////GastosEmbarque////////////////////////////////////
                                if(pattern.test(aereacarguero.Gastos_Embarque)){
                                   filaGastosEmbarqueca=filaGastosEmbarqueca +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarqueca=filaGastosEmbarqueca +1;
                                  var valor='GastosEmbarque_Carguero';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarqueca, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                              /////////////Observaciones////////////////////////////////////
                                if(aereacarguero.Observaciones==null){
                                  filaObservacionesca=filaObservacionesca +1;
                                  var valor='Observaciones_Carguero';
                                  $scope.erroresimportacion.push({fila: filaObservacionesca, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                  }
                                else
                                {
                                 filaObservacionesca=filaObservacionesca +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }
                            /////////////Time////////////////////////////////////
                                if(pattern.test(aereacarguero.Lead_Time_Dias)){
                                   filaTimeca=filaTimeca +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimeca=filaTimeca +1;
                                  var valor='LeadTimeDias_Carguero';
                                  $scope.erroresimportacion.push({fila: filaTimeca, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////Via////////////////////////////////////
                                if(pattern.test(aereacarguero.Via)){
                                   filaTimeca=filaVia +1;
                                  $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaVia=filaVia +1;
                                  var valor='Via_Carguero';
                                  $scope.erroresimportacion.push({fila: filaVia, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                          /////////////FrecuenciaLunes////////////////////////////////////
                                  if(aereacarguero.FrecuenciaDiasLunes=='X') {
                                   aereacarguero.FrecuenciaDiasLunes=true;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero.FrecuenciaDiasLunes=false;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }
                          /////////////FrecuenciaMartes////////////////////////////////////
                                if(aereacarguero.FrecuenciaDiasMartes=='X') {
                                   aereacarguero.FrecuenciaDiasMartes=true;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero.FrecuenciaDiasMartes=false;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  // $scope.$apply();
                                 }
                           /////////////FrecuenciaMiercoles////////////////////////////////////
                                 if(aereacarguero.FrecuenciaDiasMiercoles=='X') {
                                   aereacarguero.FrecuenciaDiasMiercoles=true;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero.FrecuenciaDiasMiercoles=false;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                            //////////FrecuenciaJueves////////////////////////////////////
                               if(aereacarguero.FrecuenciaDiasJueves=='X') {
                                   aereacarguero.FrecuenciaDiasJueves=true;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero.FrecuenciaDiasJueves=false;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaViernes////////////////////////////////////
                                if(aereacarguero.FrecuenciaDiasViernes=='X') {
                                   aereacarguero.FrecuenciaDiasViernes=true;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero.FrecuenciaDiasViernes=false;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaSabado////////////////////////////////////
                                 if(aereacarguero.FrecuenciaDiasSabado=='X') {
                                   aereacarguero.FrecuenciaDiasSabado=true;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero.FrecuenciaDiasSabado=false;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                 }

                             /////////////FrecuenciaDominfo////////////////////////////////////
                                if(aereacarguero.FrecuenciaDiasDomingo=='X') {
                                   aereacarguero.FrecuenciaDiasDomingo=true;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereacarguero.FrecuenciaDiasDomingo=false;
                                   $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                  // $scope.$apply();
                                 }
                           /////////////Sumatoria_T100_FS_Ge////////////////////////////////////
                                var sumatoria=0;
                                sumatoria=aereacarguero.T_100 + aereacarguero.Fskg + aereacarguero.Gastos_Embarque;
                                aereacarguero.Sumatoria_T100_FS_Ge = sumatoria;
                                $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                           /////////////Sumatoria_T300_FS_Ge////////////////////////////////////
                                var sumatoria1=0;
                                sumatoria1=aereacarguero.T_300 + aereacarguero.Fskg + aereacarguero.Gastos_Embarque;
                                aereacarguero.Sumatoria_T100_FS_Ge = sumatoria1;
                                $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                           /////////////Sumatoria_T500_FS_Ge////////////////////////////////////
                                var sumatoria2=0;
                                sumatoria2=aereacarguero.T_500 + aereacarguero.Fskg + aereacarguero.Gastos_Embarque;
                                aereacarguero.Sumatoria_T500_FS_Ge = sumatoria2;
                                $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                            /////////////Sumatoria_T1000_FS_Ge////////////////////////////////////
                                var sumatoria3=0;
                                sumatoria3=aereacarguero.T_1000 + aereacarguero.Fskg + aereacarguero.Gastos_Embarque;
                                aereacarguero.Sumatoria_T1000_FS_Ge = sumatoria3;
                                $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                               // $scope.$apply();
                             $scope.$apply();
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
                                if(pattern.test(aereapasajero.Minima)){
                                   filaMinimapa=filaMinimapa +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaMinimapa=filaMinimapa +1;
                                  var valor='Minima_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaMinimapa, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////aerea45////////////////////////////////////
                                if(pattern.test(aereapasajero.T_45)){
                                   filaaerea45=filaaerea45 +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea45=filaaerea45 +1;
                                  var valor='T45_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea45, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////aerea100////////////////////////////////////
                                if(pattern.test(aereapasajero.T_100)){
                                   filaaerea100=filaaerea100 +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_100= data.Aerea_Pasajero.T_100;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea100=filaaerea100 +1;
                                  var valor='T100_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea100, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                               /////////////aerea300////////////////////////////////////
                                if(pattern.test(aereapasajero.T_300)){
                                   filaaerea300=filaaerea300 +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_300= data.Aerea_Pasajero.T_300;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea300=filaaerea300 +1;
                                  var valor='T300_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea300, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                           /////////////aerea500////////////////////////////////////
                                if(pattern.test(aereapasajero.T_500)){
                                   filaaerea500=filaaerea500 +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_500= data.Aerea_Pasajero.T_500;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea500=filaaerea500 +1;
                                  var valor='T500_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea500, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////aerea1000////////////////////////////////////
                                if(pattern.test(aereapasajero.T_1000)){
                                   filaaerea1000=filaaerea1000 +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros.T_1000= data.Aerea_Pasajero.T_1000;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaaerea1000=filaaerea1000 +1;
                                  var valor='T1000_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaaerea1000, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                             /////////////FSmin////////////////////////////////////
                                if(pattern.test(aereapasajero.FSmin)){
                                   filaFSmin=filaFSmin +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaFSmin=filaFSmin +1;
                                  var valor='FSmin_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaFSmin, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                                       /////////////Fskg////////////////////////////////////
                                if(pattern.test(aereapasajero.Fskg)){
                                   filaFskg=filaFskg +1;
                                 $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaFskg=filaFskg +1;
                                  var valor='Fskg_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaFskg, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////GastosEmbarque////////////////////////////////////
                                if(pattern.test(aereapasajero.Gastos_Embarque)){
                                   filaGastosEmbarquepa=filaGastosEmbarquepa +1;
                                 $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaGastosEmbarquepa=filaGastosEmbarquepa +1;
                                  var valor='GastosEmbarque_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaGastosEmbarquepa, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                              /////////////Observaciones////////////////////////////////////
                                if(aereapasajero.Observaciones==null){
                                  filaObservacionespa=filaObservacionespa +1;
                                  var valor='Observacione_Pasajeros';
                                  $scope.erroresimportacion.push({fila: filaObservacionespa, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                  }
                                else
                                {
                                  filaObservacionespa=filaObservacionespa +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }
                            /////////////Time////////////////////////////////////
                                if(pattern.test(aereapasajero.Lead_Time_Dias)){
                                   filaTimepa=filaTimepa +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimepa=filaTimepa +1;
                                  var valor='LeadTimeDias_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaTimepa, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                            /////////////Via////////////////////////////////////
                                if(pattern.test(aereapasajero.Via)){
                                   filaTimeca=filaVia +1;
                                  $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaVia=filaVia +1;
                                  var valor='Via_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaVia, campo:valor, error:'Valor NO numérico'});
                                  $scope.AbrirModal(valor);
                                 }
                           /////////////FrecuenciaLunes////////////////////////////////////
                                 if(aereapasajero.FrecuenciaDiasLunes=='X') {
                                   aereapasajero.FrecuenciaDiasLunes=true;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero.FrecuenciaDiasLunes=false;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                          /////////////FrecuenciaMartes////////////////////////////////////
                               if(aereapasajero.FrecuenciaDiasMartes=='X') {
                                   aereapasajero.FrecuenciaDiasMartes=true;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero.FrecuenciaDiasMartes=false;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                           /////////////FrecuenciaMiercoles////////////////////////////////////
                                 if(aereapasajero.FrecuenciaDiasMiercoles=='X') {
                                   aereapasajero.FrecuenciaDiasMiercoles=true;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero.FrecuenciaDiasMiercoles=false;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }
                            //////////FrecuenciaJueves////////////////////////////////////

                                 if(aereapasajero.FrecuenciaDiasJueves=='X') {
                                   aereapasajero.FrecuenciaDiasJueves=true;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero.FrecuenciaDiasJueves=false;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaViernes////////////////////////////////////
                                 if(aereapasajero.FrecuenciaDiasViernes=='X') {
                                   aereapasajero.FrecuenciaDiasViernes=true;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero.FrecuenciaDiasViernes=false;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                            /////////////FrecuenciaSabado////////////////////////////////////
                                  if(aereapasajero.FrecuenciaDiasSabado=='X') {
                                   aereapasajero.FrecuenciaDiasSabdo=true;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero.FrecuenciaDiasSabado=false;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }

                             /////////////FrecuenciaDomingo////////////////////////////////////
                                if(aereapasajero.FrecuenciaDiasDomingo=='X') {
                                   aereapasajero.FrecuenciaDiasDomingo=true;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                   }
                                else
                                {
                                  aereapasajero.FrecuenciaDiasDomingo=false;
                                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                 }
                           /////////////Sumatoria_T100_FS_Ge////////////////////////////////////
                                var sumatoriap=0;
                                sumatoriap=aereapasajero.T_100 + aereapasajero.Fskg;
                                aereapasajero.Sumatoria_T100_FS = sumatoriap;
                                $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                           /////////////Sumatoria_T300_FS_Ge////////////////////////////////////
                                var sumatoria1p=0;
                                sumatoria1p=aereapasajero.T_300 + aereapasajero.Fskg;
                                aereapasajero.Sumatoria_T300_FS = sumatoria1p;
                                $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                           /////////////Sumatoria_T500_FS_Ge////////////////////////////////////
                                var sumatoria2p=0;
                                sumatoria2p=aereapasajero.T_500 + aereapasajero.Fskg;
                                aereapasajero.Sumatoria_T500_FS = sumatoria2p;
                                $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                            /////////////Sumatoria_T1000_FS_Ge////////////////////////////////////
                                var sumatoria3p=0;
                               sumatoria3p=aereapasajero.T_1000 + aereapasajero.Fskg;
                                aereapasajero.Sumatoria_T1000_FS = sumatoria3p;
                                $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                               $scope.$apply();
                        });
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

                         $scope.AbrirModal = function(valor){
                          $loading.start('myloading');
                          $scope.GetModalidadesProveedor();
                            if ($scope.erroresimportacion.length > 0){
                            $('#error-importacion-excel').modal('show');
                            return 0;
                              }
                              $loading.finish('myloading');
                               }

                           $scope.sumamarit = function(MaritimaFcl){
                           MaritimaFcl.Sumatoria_C20_Baf20_Ge= parseFloat(MaritimaFcl.C20) + parseFloat(MaritimaFcl.Baf20) + parseFloat(MaritimaFcl.GastosEmbarque);
                           MaritimaFcl.Sumatoria_C40_Baf40_Ge= parseFloat(MaritimaFcl.C40) + parseFloat(MaritimaFcl.Baf40) + parseFloat(MaritimaFcl.GastosEmbarque);
                           MaritimaFcl.Sumatoria_C40HC_Baf40HC_Ge= parseFloat(MaritimaFcl.C40HC) + parseFloat(MaritimaFcl.Baf40HC) + parseFloat(MaritimaFcl.GastosEmbarque);
                           }

                           $scope.sumaaerea = function(Aerea){
                           Aerea.Sumatoria_T100_FS_Ge= parseFloat(Aerea.T_100) + parseFloat(Aerea.Fskg) + parseFloat(Aerea.Gastos_Embarque);
                           Aerea.Sumatoria_T300_FS_Ge= parseFloat(Aerea.T_300) + parseFloat(Aerea.Fskg) + parseFloat(Aerea.Gastos_Embarque);
                           Aerea.Sumatoria_T500_FS_Ge= parseFloat(Aerea.T_500) + parseFloat(Aerea.Fskg) + parseFloat(Aerea.Gastos_Embarque);
                           Aerea.Sumatoria_T1000_FS_Ge= parseFloat(Aerea.T_1000) + parseFloat(Aerea.Fskg) + parseFloat(Aerea.Gastos_Embarque);
                           }

                           $scope.sumaaereapasaj = function(AereaPasajero){
                           AereaPasajero.Sumatoria_T100_FS= parseFloat(AereaPasajero.T_100) + parseFloat(AereaPasajero.Fskg);
                           AereaPasajero.Sumatoria_T300_FS= parseFloat(AereaPasajero.T_300) + parseFloat(AereaPasajero.Fskg);
                           AereaPasajero.Sumatoria_T500_FS= parseFloat(AereaPasajero.T_500) + parseFloat(AereaPasajero.Fskg);
                           AereaPasajero.Sumatoria_T1000_FS= parseFloat(AereaPasajero.T_1000) + parseFloat(AereaPasajero.Fskg);
                           }






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
                              $('#requisitos').modal('show');
                              $scope.PreguntasLicitacion = $scope.PreguntasLicitacion.filter(function (el){
                                return el.Modalidad == 'Bodegajes'
                              })
                              $('#preguntas').modal('show');
                              // Carga modal de ayuda de forma de cargar
                              $('#modal-tips').modal('show');

                              $scope.PreguntasMostrando = 'Bodegajes';
                              $scope.RequisitosMostrando = 'Bodegajes';

                              //console.log($scope.ModalidadesProveedor);
                          }, function errorCallback(response) {
                            console.log(response);
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
                          if ($scope.RequisitosMostrando == 'Bodegajes'){
                            $scope.ModalidadesMostrar.BodegajesR = false;
                          }
                          if ($scope.RequisitosMostrando == 'Aduanas'){
                            $scope.ModalidadesMostrar.AduanasR = false;
                          }
                          if ($scope.RequisitosMostrando == 'Otms'){
                            $scope.ModalidadesMostrar.OTMR = false;
                          }
                          if ($scope.RequisitosMostrando == 'MaritimasFCL'){
                            $scope.ModalidadesMostrar.MaritimasFclR = false;
                          }
                          if ($scope.RequisitosMostrando == 'MaritimasLCL'){
                            $scope.ModalidadesMostrar.MaritimasLclR = false;
                          }
                          if ($scope.RequisitosMostrando == 'Terrestre Nacional'){
                            $scope.ModalidadesMostrar.TerrestreNacionalR = false;
                          }
                          if ($scope.RequisitosMostrando == 'Terrestre Urbano'){
                            $scope.ModalidadesMostrar.TerrestreUrbanoR = false;
                          }
                          if ($scope.RequisitosMostrando == 'Aereas'){
                            $scope.ModalidadesMostrar.AreasR = false;
                          }
                          $('#requisitos').modal('hide');
                        }
                        $scope.AceptarPregunta = function(){
                          if ($scope.PreguntasMostrando == 'Bodegajes'){
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
                          }
                          $('#preguntas').modal('hide');
                        }
                        // Fin Cerrar requisitos y preguntas aceptando
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
                 Data.Perfil = $scope.selectedPerfil.id;
                 Data.NombrePerfil = $scope.selectedPerfil.Name;
                 Data.EditUser = localStorage.LoginUser;
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
                         swal("Licitaciones Proenfar", "Ya existe un usuario con el nombre de usuario suministrado.");
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

        .controller('ctrlProveedor', ['$scope', '$http', '$loading', '$uibModal',  function ($scope, $http, $loading, $uibModal) {

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

             $loading.finish('myloading');
           }, function errorCallback(response) {
               alert(response.statusText);
           });
         }

         $scope.GetUsuariosProveedor();

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

       }])

        .controller('ctrlWarrantyLogin', ['$scope', '$http', '$loading', 'FileUploader', '$uibModal', function ($scope, $http, $loading, FileUploader, $uibModal) {

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
