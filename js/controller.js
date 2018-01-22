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
                             if( ( typeof aduana["Conceptos Adicionales"] == 'undefined' ) || pattern.test(aduana["Conceptos Adicionales"])){
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
                                 }
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
                                if( ( typeof aduana["Conceptos Adicionales dos"] == 'undefined' ) || pattern.test(aduana["Conceptos Adicionales dos"])){
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
                                 }
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
                                if( ( typeof aduana["Conceptos Adicionales tres"] == 'undefined' ) || pattern.test(aduana["Conceptos Adicionales tres"])){
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
                                 }
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
                                  filaccuarentaveinte=filaccuarentaveinte +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                  // $scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinte=filaccuarentaveinte +1;
                                  var valor='C 40 hasta 17-18 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinte, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                             //////////////////ccuarentaveinteyuno//////////////////////////
                               if( ( typeof otm["C 40 hasta 20 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 20 Ton"])){
                                  filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;
                                  var valor='C 40 hasta 20 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinteyuno, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                            //////////////////ccuarentaveinteydos/////////////////////////////////////////
                                if( ( typeof otm["C 40 hasta 21 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 21 Ton"])){
                                  filaccuarentaveinteydos=filaccuarentaveinteydos +1;
                                   // $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentaveinteydos=filaccuarentaveinteydos +1;
                                  var valor='C 40 hasta 21 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentaveinteydos, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
                           //////////////////ccuarentatreinta//////////////////////////
                               if( ( typeof otm["C 40 hasta 22 Ton"] == 'undefined' ) || pattern.test(otm["C 40 hasta 22 Ton"])){
                                  filaccuarentatreinta=filaccuarentatreinta +1;
                                    //$scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaccuarentatreinta=filaccuarentatreinta +1;
                                  var valor='C 40 hasta 22 Ton';
                                  $scope.erroresimportacion.push({fila: filaccuarentatreinta, campo:valor, error:'Valor NO numérico'});
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
                             if( ( typeof maritimasfcl["Lead Time(dias)"] == 'undefined' ) || pattern.test(maritimasfcl["Lead Time(dias)"]) &&  maritimasfcl["Lead Time(dias)"] < 51 &&  maritimasfcl["Lead Time(dias)"] > 0){
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
                             if( ( typeof maritimasfcl.Naviera == 'undefined' ) || pattern.test(maritimasfcl.Naviera)){
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
                                 }
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
                                sumatoria=maritimasfcl["C 20"] + maritimasfcl["Baf 20"] + maritimasfcl["Gastos Embarque"];
                                maritimasfcl["C 20 + Baf 20 + Gastos Embarque"] = sumatoria;
                                //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                //$scope.$apply();
                           /////////////SUMATORIA C40 + Baf 40 + Ge////////////////////////////////////
                                var sumatoria1=0;
                                sumatoria1=maritimasfcl["C 40"] + maritimasfcl["Baf 40"]+ maritimasfcl["Gastos Embarque"];
                                maritimasfcl["C 40 + Baf 40 + Gastos Embarque"] = sumatoria1;
                                //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                                //$scope.$apply();
                           /////////////SUMATORIA C40HC + Baf 40HC + Ge////////////////////////////////////
                                var sumatoria2=0;
                                sumatoria2=maritimasfcl["C 40HC"] + maritimasfcl["Baf 40HC"] + maritimasfcl["Gastos Embarque"];
                                maritimasfcl["C 40hc + Baf 40hc + Gastos Embarque"] = sumatoria2;
                                //$scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                               // $scope.$apply();
                               //$scope.$apply();
                              });

                      if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                          $scope.UpdateModalidades();
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
                                if( ( typeof maritimaslcl["Lead time(dias)"] == 'undefined' ) || pattern.test(maritimaslcl["Lead time(dias)"]) && maritimaslcl["Lead time(dias)"] < 51 && maritimaslcl["Lead time(dias)"] > 0){
                                   filaTimeml=filaTimeml +1;
                                 // $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaTimeml=filaTimeml +1;
                                  var valor='Lead Time(dias)';
                                  $scope.erroresimportacion.push({fila: filaTimeml, campo:valor, error:'Debe ser un número entre 1 y 50'});
                                  //$scope.AbrirModal(valor);
                                 }
                                   /////////////Naviera////////////////////////////////////
                                if( ( typeof maritimaslcl.Naviera == 'undefined' ) || pattern.test(maritimaslcl.Naviera)){
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
                                 }
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
                                filaEstandartu=filaEstandartu +1;
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
                              if( ( typeof aereacarguero["Lead Time (dias)"] == 'undefined' ) || pattern.test(aereacarguero["Lead Time (dias)"]) && aereacarguero["Lead Time (dias)"] < 51 && aereacarguero["Lead Time (dias)"] > 0 ){
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
                            /////////////Via////////////////////////////////////
                            if( ( typeof aereacarguero.Via == 'undefined' ) || pattern.test(aereacarguero.Via)){
                                  filaVia=filaVia +1;
                                  //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaVia=filaVia +1;
                                  var valor='Via_Carguero';
                                  $scope.erroresimportacion.push({fila: filaVia, campo:valor, error:'Valor NO numérico'});
                                  //$scope.AbrirModal(valor);
                                 }
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
                                sumatoria=aereacarguero["+100"] + aereacarguero["Fs/kg"] + aereacarguero["Gastos Embarque"];
                                aereacarguero["+100 + Fs/kg + Gastos Embarque"] = sumatoria;
                                //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                           /////////////Sumatoria_T300_FS_Ge////////////////////////////////////
                                var sumatoria1=0;
                                sumatoria1=aereacarguero["+300"] + aereacarguero["Fs/kg"] + aereacarguero["Gastos Embarque"];
                                aereacarguero["+300 + Fs/kg + Gastos Embarque"] = sumatoria1;
                                //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                           /////////////Sumatoria_T500_FS_Ge////////////////////////////////////
                                var sumatoria2=0;
                                sumatoria2=aereacarguero["+500"] + aereacarguero["Fs/kg"] + aereacarguero["Gastos Embarque"];
                                aereacarguero["+500 + Fs/kg + Gastos Embarque"] = sumatoria2;
                                //$scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                                //$scope.$apply();
                            /////////////Sumatoria_T1000_FS_Ge////////////////////////////////////
                                var sumatoria3=0;
                                sumatoria3=aereacarguero["+1000"] + aereacarguero["Fs/kg"];
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
                            if( ( typeof aereapasajero["Lead time (dias)"] == 'undefined' ) || pattern.test(aereapasajero["Lead time (dias)"]) && aereapasajero["Lead time (dias)"] < 51 && aereapasajero["Lead time (dias)"] > 0){
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
                            /////////////Via////////////////////////////////////
                            if( ( typeof aereapasajero.Via == 'undefined' ) || pattern.test(aereapasajero.Via)){
                                  filaTimeca=filaVia +1;
                                  //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                   //$scope.$apply();
                                  }
                                else
                                {
                                filaVia=filaVia +1;
                                  var valor='Via_Pasajero';
                                  $scope.erroresimportacion.push({fila: filaVia, campo:valor, error:'Valor NO numérico'});
                                 // $scope.AbrirModal(valor);
                                 }
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
                                sumatoriap=aereapasajero["+100"] + aereapasajero["Fs/kg"];
                                aereapasajero["+100 + Fs/kg"] = sumatoriap;
                                //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                           /////////////Sumatoria_T300_FS_Ge////////////////////////////////////
                                var sumatoria1p=0;
                                sumatoria1p=aereapasajero["+300"] + aereapasajero["Fs/kg"];
                                aereapasajero["+300 + Fs/kg"] = sumatoria1p;
                                //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                           /////////////Sumatoria_T500_FS_Ge////////////////////////////////////
                                var sumatoria2p=0;
                                sumatoria2p=aereapasajero["+500"] + aereapasajero["Fs/kg"];
                                aereapasajero["+500 + Fs/kg"] = sumatoria2p;
                               //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                            /////////////Sumatoria_T1000_FS_Ge////////////////////////////////////
                                var sumatoria3p=0;
                               sumatoria3p=aereapasajero["+1000"] + aereapasajero["Fs/kg"];
                                aereapasajero["+1000 + Fs/kg"] = sumatoria3p;
                                //$scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                                //$scope.$apply();
                        });

                      if ($scope.erroresimportacion.length == 0){
                          $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                          $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
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

                           $scope.sumamarit = function(MaritimaFcl){
                           MaritimaFcl["C 20 + Baf 20 + Gastos Embarque"]= parseFloat(MaritimaFcl["C 20"]) + parseFloat(MaritimaFcl["Baf 20"]) + parseFloat(MaritimaFcl["Gastos Embarque"]);
                           MaritimaFcl["C 40 + Baf 40 + Gastos Embarque"]= parseFloat(MaritimaFcl["C 40"]) + parseFloat(MaritimaFcl["Baf 40"]) + parseFloat(MaritimaFcl["Gastos Embarque"]);
                           MaritimaFcl["C 40HC + Baf 40HC + Gastos Embarque"]= parseFloat(MaritimaFcl["C 40HC"]) + parseFloat(MaritimaFcl["Baf 40HC"]) + parseFloat(MaritimaFcl["Gastos Embarque"]);
                           }

                           $scope.sumaaerea = function(Aerea){
                           Aerea["+100 + Fs/kg + Gastos Embarque"]= parseFloat(Aerea["+100"]) + parseFloat(Aerea["Fs/kg"]) + parseFloat(Aerea["Gastos Embarque"]);
                           Aerea["+300 + Fs/kg + Gastos Embarque"]= parseFloat(Aerea["+300"]) + parseFloat(Aerea["Fs/kg"]) + parseFloat(Aerea["Gastos Embarque"]);
                           Aerea["+500 + Fs/kg + Gastos Embarque"]= parseFloat(Aerea["+500"]) + parseFloat(Aerea["Fs/kg"]) + parseFloat(Aerea["Gastos Embarque"]);
                           Aerea["+1000 + Fs/kg + Gastos Embarque"]= parseFloat(Aerea["+1000"]) + parseFloat(Aerea["Fs/kg"]) + parseFloat(Aerea["Gastos Embarque"]);
                           }

                           $scope.sumaaereapasaj = function(AereaPasajero){
                           AereaPasajero["+100 + Fs/kg"]= parseFloat(AereaPasajero["+100"]) + parseFloat(AereaPasajero["Fs/kg"]);
                           AereaPasajero["+300 + Fs/kg"]= parseFloat(AereaPasajero["+300"]) + parseFloat(AereaPasajero["Fs/kg"]);
                           AereaPasajero["+500 + Fs/kg"]= parseFloat(AereaPasajero["+500"]) + parseFloat(AereaPasajero["Fs/kg"]);
                           AereaPasajero["+1000 + Fs/kg"]= parseFloat(AereaPasajero["+1000"]) + parseFloat(AereaPasajero["Fs/kg"]);
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

                            var Data = {};
                            Data.Email = localStorage.UserConnected;

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

         .controller('ctrlConsolidadoDatos', ['$scope', '$http', '$loading', '$uibModal', '$log', '$document', 'FileUploader', function ($scope, $http, $loading, $uibModal,$log, $document, FileUploader) {
          $scope.Show2=false;
          $scope.ModalidadesSemaforo=false;

         $scope.Modalidades = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFCL' }, { id: 4, Name: 'MaritimasLCL' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

         $scope.selectedModalidad = $scope.Modalidades[0];


                  $scope.GetConsolidadoDatos = function () {
                    var Data={};
                    var ModalidadTodas = [];
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
                    var ModalidadDeUnProveedor = []
                    var ModalidadAduanero= []
                    var Modalidad= $scope.selectedModalidad.Name;
                    var ModalidadesTodasRespaldo=[];

                    var Unobjeto={};

                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/GetConsolidadoDatos',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.ConsolidadoDatos = response.data.ConsolidadoDatos;

                     if (Modalidad == 'Bodegajes') {
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

                          ModalidadTodasBodegajeaduanero.push({TarifaValor:Unobjeto.TarifaValor, TarifaMinima:Unobjeto.TarifaMinima,Otros:Unobjeto.Otros,Email:Unobjeto.Email});
                          console.log( ModalidadTodasBodegajeaduanero);
                          
                          ModalidadTodasconOrdenBodegajeaduanero=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduaneromaq=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduanero=ModalidadTodasBodegajeaduanero;
                          ModalidadTodasconOrdenBodegajeaduaneromin=parseFloat(ModalidadTodasBodegajeaduanero); 
                          ModalidadTodasconOrdenBodegajeaduaneromin=ModalidadTodasBodegajeaduanero;                        
                          
                          ModalidadTodasconOrdenBodegajeaduanerootro=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduanerootro=ModalidadTodasBodegajeaduanero;

                         });

                       console.log( ModalidadTodasconOrdenBodegajeaduanero);
                       console.log( ModalidadTodasconOrdenBodegajeaduaneromin);
                       console.log( ModalidadTodasconOrdenBodegajeaduanerootro);



                 ///////////////////////// tarifa Valor////////////////////

                     ModalidadTodasconOrdenBodegajeaduanero = _.sortBy(ModalidadTodasconOrdenBodegajeaduanero,'TarifaValor');
                    console.log( ModalidadTodasconOrdenBodegajeaduanero);
                     var cont=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduanero.length-1; i++){
                          if (i==0){
                            cont= cont + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduanero[i].TarifaValor) == parseFloat( ModalidadTodasconOrdenBodegajeaduanero[i-1].TarifaValor))
                              {
                                cont= cont;
                              }
                              else
                              {
                                cont=cont + 1;                               }
                            }


                        if (cont==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = [];
                        }
                        }

                         ///////////////////////// tarifa Minima////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromin = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromin,'TarifaMinima');
                    console.log(ModalidadTodasconOrdenBodegajeaduaneromin);
                     var contmin=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromin.length-1; i++){
                          if (i==0){
                            contmin= contmin + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromin[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromin[i-1].TarifaMinima))
                              {
                                contmin= contmin;
                              }
                              else
                              {
                                contmin=contmin + 1;                               }
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
                        }

                                  ///////////////////////// otros////////////////////

                      ModalidadTodasconOrdenBodegajeaduanerootro = _.sortBy(ModalidadTodasconOrdenBodegajeaduanerootro, 'Otros');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduanerootro);
                     var contotro=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduanerootro.length-1; i++){
                          if (i==0){
                            contotro= contotro + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduanerootro[i].Otros) == parseFloat( ModalidadTodasconOrdenBodegajeaduanerootro[i-1].Otros))
                              {
                                contotro= contotro;
                              }
                              else
                              {
                                contotro=contotro + 1;                               }
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
                        }
                         

                        ModalidadTodasBodegajeaduanero= _.sortBy(ModalidadTodasconOrdenBodegajeaduanero,'Email');
                        $scope.ModalidadTodasBodegajeaduanero=ModalidadTodasBodegajeaduanero;


                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasBodegajeaduanero;
                       $scope.ModalidadTodasBodegajeaduanero= ModalidadTodasBodegajeaduanero;
                       console.log(ModalidadTodasRespaldo);
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
                        ModalidadTodasBodegajeaduaneromaqt.push({Tarifa:Unobjetomaqt.Tarifa, TarifaMinima:Unobjetomaqt.TarifaMinima, Fmm:Unobjetomaqt.Fmm, Email:Unobjetomaqt.Email});

                        
                        ModalidadTodasconOrdenBodegajeaduaneromaqt=ModalidadTodasBodegajeaduaneromaqt;
                        ModalidadTodasconOrdenBodegajeaduaneromaqmint=ModalidadTodasBodegajeaduaneromaqt;
                        ModalidadTodasconOrdenBodegajeaduaneromaqfmmt=ModalidadTodasBodegajeaduaneromaqt;

                         });

                      /////////////////////////////////tarifa////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqt = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqt,'Tarifa');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqt);
                     var contmaqt=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqt.length-1; i++){
                          if (i==0){
                            contmaqt= contmaqt + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqt[i].Tarifa) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqt[i-1].Tarifa))
                              {
                                contmaqt= contmaqt;
                              }
                              else
                              {
                                contmaqt=contmaqt + 1;                               }
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
                        }

                            /////////////////////////////////tarifa minima////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqmint = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqmint, 'Tarifa Minima');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqmin);
                     var contmaqmint=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqmint.length-1; i++){
                          if (i==0){
                            contmaqmint= contmaqmint + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqmint[i-1].TarifaMinima))
                              {
                                contmaqmint= contmaqmint;
                              }
                              else
                              {
                                contmaqmint=contmaqmint + 1;                               }
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
                        }

                     /////////////////////////////////FMM////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqfmmt = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmt,'Fmm');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqfmm);
                     var contmaqfmmt=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqfmmt.length-1; i++){
                          if (i==0){
                            contmaqfmmt= contmaqfmmt + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].Fmm) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i-1].Fmm))
                              {
                                contmaqfmmt= contmaqfmmt;
                              }
                              else
                              {
                                contmaqfmmt=contmaqfmmt + 1;                               }
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
                        }

                          ModalidadTodasBodegajeaduaneromaqt= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqt,'Email');
                          $scope.ModalidadTodasBodegajeaduaneromaqt=ModalidadTodasBodegajeaduaneromaqt;

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
                        ModalidadTodasBodegajeaduaneromaqp.push({Tarifa:Unobjetomaqp.Tarifa, TarifaMinima:Unobjetomaqp.TarifaMinima, Fmm:Unobjetomaqp.Fmm, Email:Unobjetomaqp.Email});

                        
                        ModalidadTodasconOrdenBodegajeaduaneromaqp=ModalidadTodasBodegajeaduaneromaqp;
                        ModalidadTodasconOrdenBodegajeaduaneromaqminp=ModalidadTodasBodegajeaduaneromaqp;
                        ModalidadTodasconOrdenBodegajeaduaneromaqfmmp=ModalidadTodasBodegajeaduaneromaqp;

                         });

                      /////////////////////////////////tarifa////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqp,'Tarifa');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqp);
                     var contmaqp=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqp.length-1; i++){
                          if (i==0){
                            contmaqp= contmaqp + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqp[i].Tarifa) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqp[i-1].Tarifa))
                              {
                                contmaqp= contmaqp;
                              }
                              else
                              {
                                contmaqp=contmaqp + 1;                               }
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
                        }

                            /////////////////////////////////tarifa minima////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqminp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqminp, 'Tarifa Minima');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqminp);
                     var contmaqminp=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqminp.length-1; i++){
                          if (i==0){
                            contmaqminp= contmaqminp + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqminp[i-1].TarifaMinima))
                              {
                                contmaqminp= contmaqminp;
                              }
                              else
                              {
                                contmaqminp=contmaqminp + 1;                               }
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
                        }

                     /////////////////////////////////FMM////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqfmmp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmp,'Fmm');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqfmmp);
                     var contmaqfmmp=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqfmmp.length-1; i++){
                          if (i==0){
                            contmaqfmmp= contmaqfmmp + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].Fmm) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i-1].Fmm))
                              {
                                contmaqfmmp= contmaqfmmp;
                              }
                              else
                              {
                                contmaqfmmp=contmaqfmmp + 1;                               }
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
                        }

                           ModalidadTodasBodegajeaduaneromaqp= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqp,'Email');
                          $scope.ModalidadTodasBodegajeaduaneromaqp=ModalidadTodasBodegajeaduaneromaqp;

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
                     }

                     //////////////////////////////  Aduanas ////////////////////////

                    if (Modalidad == 'Aduanas') {

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

                       angular.forEach($scope.ConsolidadoDatos, function(consaduana) {
                         ModalidadDeUnProveedor = consaduana.Aduana.Aduanas
                            angular.forEach(ModalidadDeUnProveedor, function(consaduanasprov) {
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

                       //console.log(ModalidadTodas);
                       //$scope.groups = _.groupBy(ModalidadTodas, "Via");

                    //////// Aerea campo ["Tarifa % Advalorem/ FOB"] //////////////////////////
                      ModalidadTodasconOrden = _.sortBy( ModalidadTodasconOrden, 'Via','["Tarifa % Advalorem/ FOB"]');
                      console.log(ModalidadTodasconOrden);

                     var cont=0;
                     var contnull=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){
                           if (i==0)
                          {
                             cont= cont + 1;
                             console.log('i es o');
                             console.log(cont);
                          }
                         else
                          {
                             if(ModalidadTodasconOrden[i].Via == ModalidadTodasconOrden[i-1].Via)

                              {
                                console.log('via igual');
                                if(parseFloat(ModalidadTodasconOrden[i]["Tarifa % Advalorem/ FOB"]) == parseFloat(ModalidadTodasconOrden[i-1]["Tarifa % Advalorem/ FOB"]))
                                {
                                  cont= cont;
                                  console.log('campo igual');
                                  console.log(cont);
                                }
                                else
                                {
                                  cont=cont + 1;
                                  console.log('campo diferente');
                             console.log(cont);
                                }

                              }
                             else
                              {
                               cont=1;
                               console.log('via diferente');
                             console.log(cont);
                              }

                          }

                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AdutarifaPintada = [];
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrden[i].AdutarifaPintada = [];
                        }

                        }


              ////////////////// Campo Minima ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'Via','Minima');
                    var contmin=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenMinima[i].Via == ModalidadTodasconOrdenMinima[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i].Minima) == parseFloat(ModalidadTodasconOrdenMinima[i-1].Minima))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }

                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduMinimaPintada = [];
                        }
                        }

                  ////////// Campo ["Gastos Adicionales"] ///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'Via', '["Gastos Adicionales"]');

                     var contGA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenGA[i].Via == ModalidadTodasconOrdenGA[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["Gastos Adicionales"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["Gastos Adicionales"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }

                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduGAPintada = [];
                        }
                        }

                    ////////// Campo ["Conceptos Adicionales"] ////////////////////////////////

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'Via','["Conceptos Adicionales"]');
                    var contCA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCA[i].Via == ModalidadTodasconOrdenCA[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Conceptos Adicionales"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Conceptos Adicionales"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduCAPintada = [];
                        }
                        }

                      ////////// Campo ["Gastos Adicionales dos"] //////////////////////////////////////

                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'Via', '["Gastos Adicionales dos"]');

                      var contGAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenGAII[i].Via == ModalidadTodasconOrdenGAII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["Gastos Adicionales dos"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["Gastos Adicionales dos"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduGAIIPintada = [];
                        }
                        }

                       ////////// Campo ["Conceptos Adicionales dos"]

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'Via', '["Conceptos Adicionales dos"]');

                    var contCAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){

                           if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCAII[i].Via == ModalidadTodasconOrdenCAII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["Conceptos Adicionales dos"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["Conceptos Adicionales dos"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduCAIIPintada = [];
                        }
                        }
                      ////////// Campo ["Gastos Adicionales tres"]

                    ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'Via','["Gastos Adicionales tres"]');

                      var contGAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenGAIII[i].Via == ModalidadTodasconOrdenGAIII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i]["Gastos Adicionales tres"]) == parseFloat(ModalidadTodasconOrdenGAIII[i-1]["Gastos Adicionales tres"]))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = [];
                        }
                        }


                   ////////// Campo ["Conceptos Adicionales tres"]

                    ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'Via','["Conceptos Adicionales tres"]');

                     var contCAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIII.length-1; i++){

                          if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCAIII[i].Via == ModalidadTodasconOrdenCAIII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAIII[i]["Conceptos Adicionales tres"]) == parseFloat(ModalidadTodasconOrdenCAIII[i-1]["Conceptos Adicionales tres"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }


                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = [];
                        }
                        }



                          ////////// Campo ["Costo Planificacion Caja"]

                    ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC, 'Via', '["Costo Planificacion Caja"]');

                     var contCPC=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPC.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCPC[i].Via == ModalidadTodasconOrdenCPC[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCPC[i]["Costo Planificacion Caja"]) == parseFloat(ModalidadTodasconOrdenCPC[i-1]["Costo Planificacion Caja"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }

                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduCPCPintada = [];
                        }
                        }

                   ////////// Campo Otros////////////////////////////

                    ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros, 'Via', 'Otros');

                       var contOTRO=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotros.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenotros[i].Via == ModalidadTodasconOrdenotros[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenotros[i].Otros) == parseFloat(ModalidadTodasconOrdenotros[i-1]["Costo Planificacion Otros"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduotroPintada = [];
                        }
                        }


                     ModalidadTodas= _.sortBy(ModalidadTodas,'Via','Email');
                     ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodas= ModalidadTodas;
                       $scope.ModalidadTodas = ModalidadTodasRespaldo.filter(function (el) {
                     return (el.AdutarifaPintada.length > 0 ||
                          el.AduMinimaPintada.length > 0 ||
                          el.AduGAPintada.length > 0 ||
                          el.AduCAPintada.length > 0 ||
                          el.AduGAIIPintada.length > 0 ||
                          el.AduCAIIPintada.length > 0 ||
                          el.AduGAIIIPintada.length > 0 ||
                          el.AduCAIIIPintada.length > 0 ||
                          el.AduCPCPintada.length > 0 ||
                          el.AduotroPintada.length > 0 ||
                          $scope.ModalidadesSemaforo == false);
                });
                console.log($scope.ModalidadTodas);


               }
          ///////////////////////////////////////////////////OTM///////////////////////////////////////////////////
                      if (Modalidad == 'OTM') {
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
                         ModalidadDeUnProveedor = consotm.Otm.Otms
                            angular.forEach(ModalidadDeUnProveedor, function(consotmprov) {
                              consotmprov.Email = consotm.Email
                              ModalidadTodas.push(consotmprov);
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

                        ModalidadTodas = _.sortBy(ModalidadTodas, 'Destino','Origen');
                         console.log(ModalidadTodas);

                         ////////  Campo ["C 20 hasta 4-5 Ton"] //////////////////////////

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden, 'Destino','Origen','["C 20 hasta 4-5 Ton"]');

                      var cont=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrden[i].Otros) == parseFloat(ModalidadTodasconOrden[i-1]["Costo Planificacion Otros"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["C 20 hasta 8 Ton"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'Destino','Origen','["C 20 hasta 8 Ton"]');
                       var contmin=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenMinima[i].Destino == ModalidadTodasconOrdenMinima[i-1].Destino) && (ModalidadTodasconOrdenMinima[i].Origen == ModalidadTodasconOrdenMinima[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["C 20 hasta 8 Ton"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["C 20 hasta 8 Ton"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }


                  ////////// Campo ["C 20 hasta 10 Ton"] ///////////////////////////////
                       ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'Destino','Origen', '["C 20 hasta 10 Ton"]');

                      var contGA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGA[i].Destino == ModalidadTodasconOrdenGA[i-1].Destino) && (ModalidadTodasconOrdenGA[i].Origen == ModalidadTodasconOrdenGA[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["C 20 hasta 10 Ton"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["C 20 hasta 10 Ton"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["C 20 hasta 17 Ton"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'Destino','Origen','["C 20 hasta 17 Ton"]');
                     var contCA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCA[i].Destino == ModalidadTodasconOrdenCA[i-1].Destino) && (ModalidadTodasconOrdenCA[i].Origen == ModalidadTodasconOrdenCA[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["C 20 hasta 17 Ton"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["C 20 hasta 17 Ton"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ["C 20 hasta 19 Ton"]

                   ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII,'Destino','Origen','["C 20 hasta 19 Ton"]');

                     var contGAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGAII[i].Destino == ModalidadTodasconOrdenGAII[i-1].Destino) && (ModalidadTodasconOrdenGAII[i].Origen == ModalidadTodasconOrdenGAII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["C 20 hasta 19 Ton"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["C 20 hasta 19 Ton"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }

                       ////////// Campo ["C 20 hasta 20 Ton"]
                       ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII,'Destino','Origen','["C 20 hasta 20 Ton"]');

                       var contCAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){

                          if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCAII[i].Destino == ModalidadTodasconOrdenCAII[i-1].Destino) && (ModalidadTodasconOrdenCAII[i].Origen == ModalidadTodasconOrdenCAII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["C 20 hasta 20 Ton"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["C 20 hasta 20 Ton"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }


                      ////////// Campo ["C 20 hasta 21 Ton"]

                    ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'Destino','Origen','["C 20 hasta 21 Ton"]');

                     var contGAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGAIII[i].Destino == ModalidadTodasconOrdenGAIII[i-1].Destino) && (ModalidadTodasconOrdenGAIII[i].Origen == ModalidadTodasconOrdenGAIII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i]["C 20 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenGAIII[i-1]["C 20 hasta 21 Ton"]))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }

                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }


                   ////////// Campo ["C 20 hasta 25 Ton"]

                     ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'Destino','Origen','["C 20 hasta 25 Ton"]');

                     var contCAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIII.length-1; i++){

                          if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCAIII[i].Destino == ModalidadTodasconOrdenCAIII[i-1].Destino) && (ModalidadTodasconOrdenCAIII[i].Origen == ModalidadTodasconOrdenCAIII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAIII[i]["C 20 hasta 25 Ton"]) == parseFloat(ModalidadTodasconOrdenCAIII[i-1]["C 20 hasta 25 Ton"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }

                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                        }
                        }

              /////////////////// ////////// Campo ["C 40 hasta 15 Ton"]  ////////////////////////////////////////////

                    ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC, 'Destino','Origen','["C 40 hasta 15 Ton"]');

                      var contCPC=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPC.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCPC[i].Destino == ModalidadTodasconOrdenCPC[i-1].Destino) && (ModalidadTodasconOrdenCPC[i].Origen == ModalidadTodasconOrdenCPC[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCPC[i]["C 40 hasta 15 Ton"]) == parseFloat(ModalidadTodasconOrdenCPC[i-1]["C 40 hasta 15 Ton"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                        }
                        }

                   ////////// Campo ["C 40 hasta 16 Ton"]////////////////////////////

                    ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros, 'Destino','Origen','["C 40 hasta 16 Ton"]');

                       var contOTRO=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotros.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenotros[i].Destino == ModalidadTodasconOrdenotros[i-1].Destino) && (ModalidadTodasconOrdenotros[i].Origen == ModalidadTodasconOrdenotros[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenotros[i]["C 40 hasta 16 Ton"]) == parseFloat(ModalidadTodasconOrdenotros[i-1]["C 40 hasta 16 Ton"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                        }
                        }

                  ////////// Campo ["C 40 hasta 17 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4017 = _.sortBy(ModalidadTodasconOrdenC4017,'Destino','Origen','["C 40 hasta 17 Ton"]');

                     var contC4017=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4017.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC4017[i].Destino == ModalidadTodasconOrdenC4017[i-1].Destino) && (ModalidadTodasconOrdenC4017[i].Origen == ModalidadTodasconOrdenC4017[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4017[i]["C 40 hasta 17 Ton"]) == parseFloat(ModalidadTodasconOrdenC4017[i-1]["C 40 hasta 17 Ton"]))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                        }
                        }

                   ////////// Campo ["C 40 hasta 17-18 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC401718 = _.sortBy(ModalidadTodasconOrdenC401718, 'Destino','Origen','["C 40 hasta 17-18 Ton"]');

                    var contC401718=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC401718.length-1; i++){

                          if (i==0)
                          {
                             contC401718= contC401718 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC401718[i].Destino == ModalidadTodasconOrdenC401718[i-1].Destino) && (ModalidadTodasconOrdenC401718[i].Origen == ModalidadTodasconOrdenC401718[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC401718[i]["C 40 hasta 17-18 Ton"]) == parseFloat(ModalidadTodasconOrdenC401718[i-1]["C 40 hasta 17-18 Ton"]))
                                {
                                  contC401718= contC401718;
                                }
                                else
                                {
                                  contC401718=contC401718 + 1;
                                }
                              }
                             else
                              {
                               contC401718=1;
                              }

                          }


                        if (contC401718==1)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-success"];
                        }
                        if (contC401718==2)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-warning"];
                        }
                        if (contC401718==3)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-danger"];
                        }
                        if (contC401718>3)
                        {
                          ModalidadTodasconOrdenC401718[i].AduC401718Pintada = [];
                        }
                        }


                   ////////// Campo ["C 40 hasta 20 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4020 = _.sortBy(ModalidadTodasconOrdenC4020, 'Destino','Origen','["C 40 hasta 20 Ton"]');

                     var contC4020=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4020.length-1; i++){

                          if (i==0)
                          {
                             contC4020= contC4020 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4020[i].Destino == ModalidadTodasconOrdenC4020[i-1].Destino) && (ModalidadTodasconOrdenC4020[i].Origen == ModalidadTodasconOrdenC4020[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4020[i]["C 40 hasta 20 Ton"]) == parseFloat(ModalidadTodasconOrdenC4020[i-1]["C 40 hasta 20 Ton"]))
                                {
                                  contC4020= contC4020;
                                }
                                else
                                {
                                  contC4020=contC4020 + 1;
                                }
                              }
                             else
                              {
                               contC4020=1;
                              }

                          }


                        if (contC4020==1)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                        }
                        if (contC4020==2)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                        }
                        if (contC4020==3)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                        }
                        if (contC4020>3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                        }
                        }

                         ////////// Campo ["C 40 hasta 21 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4021 = _.sortBy(ModalidadTodasconOrdenC4021, 'Destino','Origen','["C 40 hasta 21 Ton"]');

                    var contC4021=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4021.length-1; i++){

                          if (i==0)
                          {
                             contC4021= contC4021 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4021[i].Destino == ModalidadTodasconOrdenC4021[i-1].Destino) && (ModalidadTodasconOrdenC4021[i].Origen == ModalidadTodasconOrdenC4021[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4021[i]["C 40 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenC4021[i-1]["C 40 hasta 21 Ton"]))
                                {
                                  contC4021= contC4021;
                                }
                                else
                                {
                                  contC4021=contC4021 + 1;
                                }
                              }
                             else
                              {
                               contC4021=1;
                              }

                          }


                        if (contC4021==1)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                        }
                        if (contC4021==2)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                        }
                        if (contC4021==3)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                        }
                        if (contC4021>3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                        }
                        }

                     ////////// Campo ["C 40 hasta 22 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4022 = _.sortBy(ModalidadTodasconOrdenC4022, 'Destino','Origen','["C 40 hasta 22 Ton"]');

                      var contC4022=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4022.length-1; i++){

                          if (i==0)
                          {
                             contC4022= contC4022 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4022[i].Destino == ModalidadTodasconOrdenC4022[i-1].Destino) && (ModalidadTodasconOrdenC4022[i].Origen == ModalidadTodasconOrdenC4022[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4022[i]["C 40 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenC4022[i-1]["C 40 hasta 22 Ton"]))
                                {
                                  contC4022= contC4022;
                                }
                                else
                                {
                                  contC4022=contC4022 + 1;
                                }
                              }
                             else
                              {
                               contC4022=1;
                              }

                          }


                        if (contC4022==1)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-success"];
                        }
                        if (contC4022==2)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-warning"];
                        }
                        if (contC4022==3)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-danger"];
                        }
                        if (contC4022>3)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                        }
                        }

                       ////////// Campo ["C 40 hasta 30 Ton"]////////////////////////////

                   ModalidadTodasconOrdenC4030 = _.sortBy(ModalidadTodasconOrdenC4030, 'Destino','Origen','["C 40 hasta 30 Ton"]');

                    var contC4030=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4030.length-1; i++){

                          if (i==0)
                          {
                             contC4030= contC4030 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4030[i].Destino == ModalidadTodasconOrdenC4030[i-1].Destino) && (ModalidadTodasconOrdenC4030[i].Origen == ModalidadTodasconOrdenC4030[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4030[i]["C 40 hasta 30 Ton"]) == parseFloat(ModalidadTodasconOrdenC4030[i-1]["C 40 hasta 30 Ton"]))
                                {
                                  contC4030= contC4030;
                                }
                                else
                                {
                                  contC4030=contC4030 + 1;
                                }
                              }
                             else
                              {
                               contC4030=1;
                              }

                          }


                        if (contC4030==1)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-success"];
                        }
                        if (contC4030==2)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-warning"];
                        }
                        if (contC4030==3)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-danger"];
                        }
                        if (contC4030>3)
                        {
                          ModalidadTodasconOrdenC4030[i].AduC4030Pintada = [];
                        }
                        }

                     ////////// Campo ["Devolucion 20$ estandar"]////////////////////////////

                    ModalidadTodasconOrdenC20EST  = _.sortBy(ModalidadTodasconOrdenC20EST , 'Destino','Origen','["Devolucion 20$ estandar"]');

                     var contC20EST=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC20EST.length-1; i++){

                          if (i==0)
                          {
                             contC20EST= contC20EST + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC20EST[i].Destino == ModalidadTodasconOrdenC20EST[i-1].Destino) && (ModalidadTodasconOrdenC20EST[i].Origen == ModalidadTodasconOrdenC20EST[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC20EST[i]["Devolucion 20$ estandar"]) == parseFloat(ModalidadTodasconOrdenC20EST[i-1]["Devolucion 20$ estandar"]))
                                {
                                  contC20EST= contC20EST;
                                }
                                else
                                {
                                  contC20EST=contC20EST + 1;
                                }
                              }
                             else
                              {
                               contC20EST=1;
                              }

                          }


                        if (contC20EST==1)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-success"];
                        }
                        if (contC20EST==2)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-warning"];
                        }
                        if (contC20EST==3)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-danger"];
                        }
                        if (contC20EST>3)
                        {
                          ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = [];
                        }
                        }

                       ////////// Campo ["Devolucion 40$ estandar"]////////////////////////////

                    ModalidadTodasconOrdenC40EST = _.sortBy(ModalidadTodasconOrdenC40EST, 'Destino','Origen','["Devolucion 40$ estandar"]');

                      var contC40EST=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC40EST.length-1; i++){

                          if (i==0)
                          {
                             contC40EST= contC40EST + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC40EST[i].Destino == ModalidadTodasconOrdenC40EST[i-1].Destino) && (ModalidadTodasconOrdenC40EST[i].Origen == ModalidadTodasconOrdenC40EST[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC40EST[i]["Devolucion 40$ estandar"]) == parseFloat(ModalidadTodasconOrdenC40EST[i-1]["Devolucion 40$ estandar"]))
                                {
                                  contC40EST= contC40EST;
                                }
                                else
                                {
                                  contC40EST=contC40EST + 1;
                                }
                              }
                             else
                              {
                               contC40EST=1;
                              }

                          }


                        if (contC40EST==1)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-success"];
                        }
                        if (contC40EST==2)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-warning"];
                        }
                        if (contC40EST==3)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-danger"];
                        }
                        if (contC40EST>3)
                        {
                          ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = [];
                        }
                        }

                        ///// Campo ["Devolucion 20$ expreso"]////////////////////////////

                     ModalidadTodasconOrdenC20ESP  = _.sortBy(ModalidadTodasconOrdenC20ESP , 'Destino','Origen','["Devolucion 20$ expreso"]');

                     var contC20ESP=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC20ESP.length-1; i++){

                          if (i==0)
                          {
                             contC20ESP= contC20ESP + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC20ESP[i].Destino == ModalidadTodasconOrdenC20ESP[i-1].Destino) && (ModalidadTodasconOrdenC20ESP[i].Origen == ModalidadTodasconOrdenC20ESP[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC20ESP[i]["Devolucion 20$ expreso"]) == parseFloat(ModalidadTodasconOrdenC20ESP[i-1]["Devolucion 20$ expreso"]))
                                {
                                  contC20ESP= contC20ESP;
                                }
                                else
                                {
                                  contC20ESP=contC20ESP + 1;
                                }
                              }
                             else
                              {
                               contC20ESP=1;
                              }

                          }


                        if (contC20ESP==1)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-success"];
                        }
                        if (contC20ESP==2)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-warning"];
                        }
                        if (contC20ESP==3)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-danger"];
                        }
                        if (contC20ESP>3)
                        {
                          ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = [];
                        }
                        }

                          ///// Campo ["Devolucion 40$ expreso"]////////////////////////////

                      ModalidadTodasconOrdenC40ESP  = _.sortBy(ModalidadTodasconOrdenC40ESP , 'Destino','Origen','["Devolucion 40$ expreso"]');

                     var contC40ESP=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC40ESP.length-1; i++){

                          if (i==0)
                          {
                             contC40ESP= contC40ESP + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC40ESP[i].Destino == ModalidadTodasconOrdenC40ESP[i-1].Destino) && (ModalidadTodasconOrdenC40ESP[i].Origen == ModalidadTodasconOrdenC40ESP[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC40ESP[i]["Devolucion 40$ expreso"]) == parseFloat(ModalidadTodasconOrdenC40ESP[i-1]["Devolucion 40$ expreso"]))
                                {
                                  contC40ESP= contC40ESP;
                                }
                                else
                                {
                                  contC40ESP=contC40ESP + 1;
                                }
                              }
                             else
                              {
                               contC40ESP=1;
                              }

                          }


                        if (contC40ESP==1)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-success"];
                        }
                        if (contC40ESP==2)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-warning"];
                        }
                        if (contC40ESP==3)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-danger"];
                        }
                        if (contC40ESP>3)
                        {
                          ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = [];
                        }
                        }
                           var ModalidadTodasOTM=[];
                           ModalidadTodasOTM= _.sortBy(ModalidadTodas,'Destino','Origen','Email');

              /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasOTM;
                       $scope.ModalidadTodasOTM= ModalidadTodasOTM;

                       $scope.ModalidadTodasOTM = ModalidadTodasRespaldo.filter(function (el) {
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
                                el.AduC4020Pintada.length > 0 ||
                                el.AduC4030Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);



               }

            ////////////////////////////////////////////////////////////////////////////////////////////////
                    if (Modalidad == 'MaritimasFCL') {
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

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden,'PuertoDestino','PuertoOrigen','PaisDestino','["C 20"]');

                      var cont=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrden[i].PuertoDestino == ModalidadTodasconOrden[i-1].PuertoDestino) && (ModalidadTodasconOrden[i].PuertoOrigen == ModalidadTodasconOrden[i-1].PuertoOrigen) && (ModalidadTodasconOrden[i].PaisDestino == ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrden[i]["C 20"]) == parseFloat(ModalidadTodasconOrden[i-1]["C 20"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["Baf 20"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima, 'PuertoDestino','PuertoOrigen','PaisDestino', '["Baf 20"]');

                      var contmin=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenMinima[i].PuertoDestino == ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && (ModalidadTodasconOrdenMinima[i].PuertoOrigen == ModalidadTodasconOrdenMinima[i-1].PuertoOrigen) && (ModalidadTodasconOrdenMinima[i].PaisDestino == ModalidadTodasconOrdenMinima[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["Baf 20"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["Baf 20"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }

                  ////////// Campo ["C 40"]///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PuertoOrigen','PaisDestino','["C 40"]');

                       var contGA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){

                        if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGA[i].PuertoDestino == ModalidadTodasconOrdenGA[i-1].PuertoDestino) && (ModalidadTodasconOrdenGA[i].PuertoOrigen == ModalidadTodasconOrdenGA[i-1].PuertoOrigen) && (ModalidadTodasconOrdenGA[i].PaisDestino == ModalidadTodasconOrdenGA[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["C 40"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["C 40"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["Baf 40"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PuertoOrigen','PaisDestino','["Baf 40"]');
                       var contCA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){

                         if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCA[i].PuertoDestino == ModalidadTodasconOrdenCA[i-1].PuertoDestino) && (ModalidadTodasconOrdenCA[i].PuertoOrigen == ModalidadTodasconOrdenCA[i-1].PuertoOrigen) && (ModalidadTodasconOrdenCA[i].PaisDestino == ModalidadTodasconOrdenCA[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Baf 40"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Baf 40"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ["C 40HC"]

                  ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["C 40HC"]');

                       var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAII[i].PuertoDestino ==  ModalidadTodasconOrdenGAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAII[i].PuertoOrigen ==  ModalidadTodasconOrdenGAII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGAII[i].PaisDestino ==  ModalidadTodasconOrdenGAII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAII[i]["C 40HC"]) == parseFloat( ModalidadTodasconOrdenGAII[i-1]["C 40HC"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }

                       ////////// Campo ["Baf 40HC"]

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["Baf 40HC"]');

                        var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                         if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].PuertoDestino ==  ModalidadTodasconOrdenCAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAII[i].PuertoOrigen ==  ModalidadTodasconOrdenCAII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCAII[i].PaisDestino ==  ModalidadTodasconOrdenCAII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]["Baf 40HC"]) == parseFloat( ModalidadTodasconOrdenCAII[i-1]["Baf 40HC"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }



                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }

                      ////////// Campo Naviera

                    ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'PuertoDestino','PuertoOrigen','PaisDestino','Naviera');

                      var contGAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIII[i].PuertoDestino ==  ModalidadTodasconOrdenGAIII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAIII[i].PuertoOrigen ==  ModalidadTodasconOrdenGAIII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGAIII[i].PaisDestino ==  ModalidadTodasconOrdenGAIII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIII[i].Naviera) == parseFloat( ModalidadTodasconOrdenGAIII[i-1].Naviera))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }


                   ////////// Campo ["Gastos Embarque"]

                   ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'PuertoDestino','PuertoOrigen','PaisDestino','["Gastos Embarque"]');

                    var contCAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIII.length-1; i++){

                          if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIII[i].PuertoDestino ==  ModalidadTodasconOrdenCAIII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAIII[i].PuertoOrigen ==  ModalidadTodasconOrdenCAIII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCAIII[i].PaisDestino ==  ModalidadTodasconOrdenCAIII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIII[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCAIII[i-1]["Gastos Embarque"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }

                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                        }
                        }



                          ////////// Campo ["C 20 + Baf 20 + Gastos Embarque"]

                   ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC,'PuertoDestino','PuertoOrigen','PaisDestino','["C 20 + Baf 20 + Gastos Embarque"]');

                     var contCPC=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPC.length-1; i++){

                         if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPC[i].PuertoDestino ==  ModalidadTodasconOrdenCPC[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCPC[i].PuertoOrigen ==  ModalidadTodasconOrdenCPC[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCPC[i].PaisDestino ==  ModalidadTodasconOrdenCPC[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPC[i]["C 20 + Baf 20 + Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCPC[i-1]["C 20 + Baf 20 + Gastos Embarque"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                        }
                        }

                   ////////// Campo ["C 40 + Baf 40 + Gastos Embarque"]////////////////////////////

                    ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros, 'PuertoDestino','PuertoOrigen','PaisDestino','["C 40 + Baf 40 + Gastos Embarque"]');

                    var contOTRO=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotros.length-1; i++){

                       if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotros[i].PuertoDestino ==  ModalidadTodasconOrdenotros[i-1].PuertoDestino) && ( ModalidadTodasconOrdenotros[i].PuertoOrigen ==  ModalidadTodasconOrdenotros[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenotros[i].PaisDestino ==  ModalidadTodasconOrdenotros[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotros[i]["C 40 + Baf 40 + Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenotros[i-1]["C 40 + Baf 40 + Gastos Embarque"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                        }
                        }

                  ////////// ["C 40HC + Baf 40HC + Gastos Embarque"]////////////////////////////

                     ModalidadTodasconOrdenC4017 = _.sortBy(ModalidadTodasconOrdenC4017,'PuertoDestino','PuertoOrigen','PaisDestino','["C 40HC + Baf 40HC + Gastos Embarque"]');

                       var contC4017=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017[i].PuertoDestino ==  ModalidadTodasconOrdenC4017[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4017[i].PuertoOrigen ==  ModalidadTodasconOrdenC4017[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenC4017[i].PaisDestino ==  ModalidadTodasconOrdenC4017[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017[i]["C 40HC + Baf 40HC + Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenC4017[i-1]["C 40HC + Baf 40HC + Gastos Embarque"]))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                        }
                        }

                  /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PuertoOrigen','PaisDestino','Email');
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
                                el.AduC2021Pintada.length > 0 ||
                                el.AduC4015Pintada.length > 0 ||
                                el.AduC4016Pintada.length > 0 ||
                                el.AduC4017Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);

                   }


                        ////////////////////////////////
                    if (Modalidad == 'MaritimasLCL') {

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

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden, 'PuertoDestino','PuertoOrigen','PaisDestino','Minima');
                     console.log(ModalidadTodasconOrden);

                      var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                         if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i].Minima) == parseFloat( ModalidadTodasconOrden[i-1].Minima))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["1-5 ton/M3"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima, 'PuertoDestino','PuertoOrigen','PaisDestino','["1-5 ton/M3"]');
                   console.log(ModalidadTodasconOrdenMinima);

                     var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinima[i].PuertoDestino ==  ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PuertoOrigen ==  ModalidadTodasconOrdenMinima[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenMinima[i].PaisDestino ==  ModalidadTodasconOrdenMinima[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinima[i]["1-5 ton/M3"]) == parseFloat( ModalidadTodasconOrdenMinima[i-1]["1-5 ton/M3"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }
                  ////////// Campo ["5-8 ton/M3"]///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PuertoOrigen','PaisDestino','["5-8 ton/M3"]');

                   var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGA[i].PuertoOrigen ==  ModalidadTodasconOrdenGA[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGA[i].PaisDestino ==  ModalidadTodasconOrdenGA[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i]["5-8 ton/M3"]) == parseFloat( ModalidadTodasconOrdenGA[i-1]["5-8 ton/M3"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["8-12 ton/M3"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PuertoOrigen','PaisDestino','["8-12 ton/M3"]');
                     var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                         if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PuertoOrigen ==  ModalidadTodasconOrdenCA[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCA[i].PaisDestino ==  ModalidadTodasconOrdenCA[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["8-12 ton/M3"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["8-12 ton/M3"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ["12-18 ton/M3"]

                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["12-18 ton/M3"]');

                     var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PuertoOrigen ==  ModalidadTodasconOrdenCA[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCA[i].PaisDestino ==  ModalidadTodasconOrdenCA[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["12-18 ton/M3"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["12-18 ton/M3"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }

                       ////////// Campo ["Gastos Embarque"]

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["Gastos Embarque"]');

                     var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                          if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].PuertoDestino ==  ModalidadTodasconOrdenCAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAII[i].PuertoOrigen ==  ModalidadTodasconOrdenCAII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCAII[i].PaisDestino ==  ModalidadTodasconOrdenCAII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCAII[i-1]["Gastos Embarque"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }

                      ////////// Campo Naviera

                   ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'PuertoDestino','PuertoOrigen','PaisDestino','Naviera');

                    var contGAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIII[i].PuertoDestino ==  ModalidadTodasconOrdenGAIII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAIII[i].PuertoOrigen ==  ModalidadTodasconOrdenGAIII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGAIII[i].PaisDestino ==  ModalidadTodasconOrdenGAIII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIII[i].Naviera) == parseFloat( ModalidadTodasconOrdenGAIII[i-1].Naviera))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }

                        /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PuertoOrigen','PaisDestino','Email');
                       ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodas= ModalidadTodas;
                       $scope.ModalidadTodas = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                el.AduC2010Pintada.length > 0 ||
                                el.AduC2017Pintada.length > 0 ||
                                el.AduC2019Pintada.length > 0 ||
                                el.AduC2020Pintada.length > 0 ||
                                el.AduC2021Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);

                   }

                   ///////////////////////////////////////////////////////////////////////
                      if (Modalidad == 'Terrestre Nacional') {
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



                       angular.forEach($scope.ConsolidadoDatos, function(consterrenacional) {
                         ModalidadDeUnProveedor = consterrenacional.TerreNacional.TerresNacional
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterrenacionalprov) {
                              consterrenacionalprov.Email = consterrenacional.Email
                              ModalidadTodas.push(consterrenacionalprov);
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

                         ModalidadTodas = _.sortBy(ModalidadTodas, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodas);


                         ////////  Campo ["Turbo Standar (150Cajas)"] //////////////////////////

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden, 'PuertoDestino','PaisOrigen','["Turbo Standar (150Cajas)"]');

                     var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PaisOrigen ==  ModalidadTodasconOrden[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i]["Turbo Standar (150Cajas)"]) == parseFloat( ModalidadTodasconOrden[i-1]["Turbo Standar (150Cajas)"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["Turbo Especial"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima, 'PuertoDestino','PaisOrigen','["Turbo Especial"]');

                     var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinima.length-1; i++){

                         if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinima[i].PuertoDestino ==  ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinima[i]["Turbo Especial"]) == parseFloat( ModalidadTodasconOrdenMinima[i-1]["Turbo Especial"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }

                         ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PaisOrigen','Email');
                         $scope.ModalidadTodasTerreNacionalTurbo=ModalidadTodas;


                          /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodasTerreNacionalTurbo= ModalidadTodas;
                       $scope.ModalidadTodasTerreNacionalTurbo = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);


                       //Terrestre Nacional Sencillo

                        angular.forEach($scope.ConsolidadoDatos, function(consterrenacionalsenc) {
                         ModalidadDeUnProveedor = consterrenacionalsenc.TerreNacionalSencillo.TerresNacionalSencillo
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterrenacionalsencprov) {
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

                     ModalidadTodasconOrdenGAS = _.sortBy(ModalidadTodasconOrdenGAS,'PuertoDestino','PaisOrigen','["Sencillo Standar (150Cajas)"]');
                     console.log(ModalidadTodasconOrdenGA);
                     var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                             console.log('Es igual a cero');
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAS[i].PuertoDestino ==  ModalidadTodasconOrdenGAS[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAS[i].PaisOrigen ==  ModalidadTodasconOrdenGAS[i-1].PaisOrigen))
                              {
                               console.log('Puerto igual');
                                if(parseFloat( ModalidadTodasconOrdenGAS[i]["Sencillo Standar (150Cajas)"]) == parseFloat( ModalidadTodasconOrdenGAS[i-1]["Sencillo Standar (150Cajas)"]))
                                {
                                  contGA= contGA;
                                  console.log('numero igual');
                                  console.log(contGA);
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                  console.log('numero diferete');
                                  console.log(contGA);
                                }
                              }
                             else
                              {
                               contGA=1;
                               console.log('Puerto diferete');
                               console.log(contGA);
                              }

                          }



                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amarillo');
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGAS[i].AduC2010Pintada = [];
                          console.log('blanco');
                        }
                        }

                    ////////// Campo Sencillo Especial

                     ModalidadTodasconOrdenCAS = _.sortBy(ModalidadTodasconOrdenCAS, 'PuertoDestino','PaisOrigen','["Sencillo Especial"]');

                     var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                         if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAS[i].PuertoDestino ==  ModalidadTodasconOrdenCAS[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAS[i].PaisOrigen ==  ModalidadTodasconOrdenCAS[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAS[i]["Sencillo Especial"]) == parseFloat( ModalidadTodasconOrdenCAS[i-1]["Sencillo Especial"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCAS[i].AduC2017Pintada = [];
                        }
                        }

                        ModalidadTodasTerreNacionalSencillo= _.sortBy(ModalidadTodasTerreNacionalSencillo,'PuertoDestino','PaisOrigen','Email');
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
                         ModalidadDeUnProveedor = consterrenacionalpat.TerreNacionalPatineta.TerresNacionalPatineta
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterrenacionalpatprov) {
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

                  ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PaisOrigen','Minimula');

                     var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                           if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGA[i].PaisOrigen ==  ModalidadTodasconOrdenGA[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i].Minimula) == parseFloat( ModalidadTodasconOrdenGA[i-1].Minimula))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2019Pintada = [];
                        }
                        }

                    ////////// Campo ["Gran Danes"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PaisOrigen','["Gran Danes"]');

                       var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PaisOrigen ==  ModalidadTodasconOrdenCA[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["Gran Danes"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["Gran Danes"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2020Pintada = [];
                        }
                        }
                        
                        ModalidadTodasPatineta= _.sortBy(ModalidadTodasPatineta,'PuertoDestino','PaisOrigen','Email');
                        $scope.ModalidadTodasTerreNacionalPatineta=ModalidadTodasPatineta;

                        ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasPatineta;
                        $scope.ModalidadTodasTerreNacionalPatineta= ModalidadTodasPatineta;
                        $scope.ModalidadTodasTerreNacionalPatineta = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2019Pintada.length > 0 ||
                                 el.AduC2020Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });


                    }
                ///////////////////////////////////////////////////////////////////////////////

                    if (Modalidad == 'Terrestre Urbano') {

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
                         ModalidadDeUnProveedor = consterreurbano.TerreUrbano.TerresUrbano
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterreurbanoprov) {
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

                     ModalidadTodasconOrden= _.sortBy(ModalidadTodasconOrden, 'PuertoDestino','PaisOrigen','["Turbo (150Cajas)"]');
                     console.log(ModalidadTodasconOrden);

                     var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                         if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PaisOrigen ==  ModalidadTodasconOrden[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i]["Turbo (150Cajas)"]) == parseFloat( ModalidadTodasconOrden[i-1]["Turbo (150Cajas)"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }



              ////////////////// ["Turbo Especial (200Cajas)"]////////////////////////////////////
                  ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'PuertoDestino','PaisOrigen', '["Turbo Especial (200Cajas)"]');

                       var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinima[i].PuertoDestino ==  ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinima[i]["Turbo Especial (200Cajas)"]) == parseFloat( ModalidadTodasconOrdenMinima[i-1]["Turbo Especial (200Cajas)"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }


                  ////////// Campo ["Sencillo (240Cajas)"]///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PaisOrigen','["Sencillo (240Cajas)"]');

                     var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                           if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i]["Sencillo (240Cajas)"]) == parseFloat( ModalidadTodasconOrdenGA[i-1]["Sencillo (240Cajas)"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["Sencillo Especial (300Cajas)"]
                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PaisOrigen','["Sencillo Especial (300Cajas)"]');
                     var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["Sencillo Especial (300Cajas)"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["Sencillo Especial (300Cajas)"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }
                      ////////// Campo ["C 40HC"] Minimula

                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII,'PuertoDestino','PaisOrigen','Minimula');

                    var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAII[i].PuertoDestino ==  ModalidadTodasconOrdenGAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAII[i].Minimula) == parseFloat( ModalidadTodasconOrdenGAII[i-1].Minimula))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }
                       ////////// Campo ["Gran Danes"]

                     ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'PuertoDestino','PaisOrigen','["Gran Danes"]');

                      var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                         if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].PuertoDestino ==  ModalidadTodasconOrdenCAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]["Gran Danes"]) == parseFloat( ModalidadTodasconOrdenCAII[i-1]["Gran Danes"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }
                        
                        ModalidadTodasUrbano= _.sortBy(ModalidadTodasUrbano,'PuertoDestino','PaisOrigen','Email');
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
                         ModalidadDeUnProveedor = consterreurbanoviaj.TerreUrbanoViaje.TerresUrbanoViaje
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterreurbanoviajprov) {
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

                       ModalidadTodasconOrdenGAIIIv = _.sortBy(ModalidadTodasconOrdenGAIIIv,'PuertoDestino','PaisOrigen','["Turbo (150Cajas)"]');

                     var contGAIIIv=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIIv.length-1; i++){

                         if (i==0)
                          {
                             contGAIIIv= contGAIIIv + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIIIv[i].PuertoDestino ==  ModalidadTodasconOrdenGAIIIv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAIIIv[i].PaisOrigen ==  ModalidadTodasconOrdenGAIIIv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIIIv[i]["Turbo (150Cajas)"]) == parseFloat( ModalidadTodasconOrdenGAIIIv[i-1]["Turbo (150Cajas)"]))
                                {
                                  contGAIIIv= contGAIIIv;
                                }
                                else
                                {
                                  contGAIIIv=contGAIIIv + 1;
                                }
                              }
                             else
                              {
                               contGAIIIv=1;
                              }

                          }


                        if (contGAIIIv==1)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-success"];
                        }
                        if (contGAIIIv==2)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-warning"];
                        }
                        if (contGAIIIv==3)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-danger"];
                        }
                        if (contGAIIIv>3)
                        {
                          ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = [];
                        }
                        }


                   ////////// Campo ["Turbo Especial (200Cajas)"]

                     ModalidadTodasconOrdenCAIIIv = _.sortBy(ModalidadTodasconOrdenCAIIIv, 'PuertoDestino','PaisOrigen','["Turbo Especial (200Cajas)"]');

                      var contCAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIIv.length-1; i++){

                           if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIIIv[i].PuertoDestino ==  ModalidadTodasconOrdenCAIIIv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAIIIv[i].PaisOrigen ==  ModalidadTodasconOrdenCAIIIv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIIIv[i]["Turbo Especial (200Cajas)"]) == parseFloat( ModalidadTodasconOrdenCAIIIv[i-1]["Turbo Especial (200Cajas)"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }


                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = [];
                        }
                        }



                          ////////// Campo ["Sencillo (240Cajas)"]


              ModalidadTodasconOrdenCPCv = _.sortBy(ModalidadTodasconOrdenCPCv, 'PuertoDestino','PaisOrigen','["Sencillo (240Cajas)"]');

                       var contCPC=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPCv.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPCv[i].PuertoDestino ==  ModalidadTodasconOrdenCPCv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCPCv[i].PaisOrigen ==  ModalidadTodasconOrdenCPCv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPCv[i]["Sencillo (240Cajas)"]) == parseFloat( ModalidadTodasconOrdenCPCv[i-1]["Sencillo (240Cajas)"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = [];
                        }
                        }

                   ////////// Campo ["Sencillo Especial (300Cajas)"]////////////////////////////

                    ModalidadTodasconOrdenotrosv = _.sortBy(ModalidadTodasconOrdenotrosv, 'PuertoDestino','PaisOrigen','["Sencillo Especial (300Cajas)"]');

                     var contOTRO=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotrosv.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotrosv[i].PuertoDestino ==  ModalidadTodasconOrdenotrosv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenotrosv[i].PaisOrigen ==  ModalidadTodasconOrdenotrosv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotrosv[i]["Sencillo Especial (300Cajas)"]) == parseFloat( ModalidadTodasconOrdenotrosv[i-1]["Sencillo Especial (300Cajas)"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = [];
                        }
                        }

                  ////////// Minimula////////////////////////////
                        ModalidadTodasconOrdenC4017v = _.sortBy(ModalidadTodasconOrdenC4017v, 'PuertoDestino','PaisOrigen','Minimula');

                     var contC4017=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017v.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017v[i].PuertoDestino ==  ModalidadTodasconOrdenC4017v[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4017v[i].PaisOrigen ==  ModalidadTodasconOrdenC4017v[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017v[i].Minimula) == parseFloat( ModalidadTodasconOrdenC4017v[i-1].Minimula))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = [];
                        }
                        }


                          ////////// ["Gran Danes"]////////////////////////////

                     ModalidadTodasconOrdenC401718v = _.sortBy(ModalidadTodasconOrdenC401718v,'PuertoDestino','PaisOrigen','["Gran Danes"]');

                        var contC401718=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718v.length-1; i++){

                          if (i==0)
                          {
                             contC401718= contC401718 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC401718v[i].PuertoDestino ==  ModalidadTodasconOrdenC401718v[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC401718v[i].PaisOrigen ==  ModalidadTodasconOrdenC401718v[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC401718v[i]["Gran Danes"]) == parseFloat( ModalidadTodasconOrdenC401718v[i-1]["Gran Danes"]))
                                {
                                  contC401718= contC401718;
                                }
                                else
                                {
                                  contC401718=contC401718 + 1;
                                }
                              }
                             else
                              {
                               contC401718=1;
                              }

                          }

                        if (contC401718==1)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-success"];
                        }
                        if (contC401718==2)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-warning"];
                        }
                        if (contC401718==3)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-danger"];
                        }
                        if (contC401718>3)
                        {
                          ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = [];
                        }
                        }

                         ModalidadTodasTerreUrbanoViaje= _.sortBy(ModalidadTodasTerreUrbanoViaje,'PuertoDestino','PaisOrigen','Email');

                        $scope.ModalidadTodasTerreUrbanoViaje=ModalidadTodasTerreUrbanoViaje;

                    ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasTerreUrbanoViaje;
                        $scope.ModalidadTodasTerreUrbanoViaje= ModalidadTodasTerreUrbanoViaje;
                        $scope.ModalidadTodasTerreUrbanoViaje = ModalidadTodasRespaldo.filter(function (el) {
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
                         ModalidadDeUnProveedor = consterreurbanoton.TerreUrbanoTonelada.TerresUrbanoTonelada
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterreurbanotonprov) {
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

                    ModalidadTodasconOrdenC4020 = _.sortBy(ModalidadTodasconOrdenC4020, 'PuertoDestino','PaisOrigen','Turbo');
                      var contC4020=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4020.length-1; i++){

                          if (i==0)
                          {
                             contC4020= contC4020 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4020[i].PuertoDestino ==  ModalidadTodasconOrdenC4020[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4020[i].PaisOrigen ==  ModalidadTodasconOrdenC4020[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4020[i].Turbo) == parseFloat( ModalidadTodasconOrdenC4020[i-1].Turbo))
                                {
                                  contC4020= contC4020;
                                }
                                else
                                {
                                  contC4020=contC4020 + 1;
                                }
                              }
                             else
                              {
                               contC4020=1;
                              }

                          }


                        if (contC4020==1)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                        }
                        if (contC4020==2)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                        }
                        if (contC4020==3)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                        }
                        if (contC4020>3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                        }
                        }

                         ////////// Campo Sencillo////////////////////////////

                    ModalidadTodasconOrdenC4021 = _.sortBy(ModalidadTodasconOrdenC4021, 'PuertoDestino','PaisOrigen','Sencillo');

                     var contC4021=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4021.length-1; i++){

                           if (i==0)
                          {
                             contC4021= contC4021 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4021[i].PuertoDestino ==  ModalidadTodasconOrdenC4021[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4021[i].PaisOrigen ==  ModalidadTodasconOrdenC4021[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4021[i].Sencillo) == parseFloat( ModalidadTodasconOrdenC4021[i-1].Sencillo))
                                {
                                  contC4021= contC4021;
                                }
                                else
                                {
                                  contC4021=contC4021 + 1;
                                }
                              }
                             else
                              {
                               contC4021=1;
                              }

                          }



                        if (contC4021==1)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                        }
                        if (contC4021==2)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                        }
                        if (contC4021==3)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                        }
                        if (contC4021>3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                        }
                        }

                     ////////// Campo Tractomula////////////////////////////

                     ModalidadTodasconOrdenC4022 = _.sortBy(ModalidadTodasconOrdenC4022, 'PuertoDestino','PaisOrigen','Tractomula');
                     console.log(ModalidadTodasconOrdenC4022);

                     var contC4022=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4022.length-1; i++){

                          if (i==0)
                          {
                             contC4022= contC4022 + 1;
                             console.log(' es cero verde');
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4022[i].PuertoDestino ==  ModalidadTodasconOrdenC4022[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4022[i].PaisOrigen ==  ModalidadTodasconOrdenC4022[i-1].PaisOrigen))
                              {
                                console.log('Via igual');
                                if(parseFloat( ModalidadTodasconOrdenC4022[i].Tractomula) == parseFloat( ModalidadTodasconOrdenC4022[i-1].Tractomula))
                                {
                                  console.log('campo igual');
                                  contC4022= contC4022;
                                  console.log(contC4022);
                                }
                                else
                                {
                                  contC4022=contC4022 + 1;
                                  console.log('campo difere');
                                  console.log(contC4022);
                                }
                              }
                             else
                              {
                               contC4022=1;
                               console.log('via diferen difere');
                                  console.log(contC4022);
                              }

                          }


                        if (contC4022==1)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-success"];
                        }
                        if (contC4022==2)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-warning"];
                        }
                        if (contC4022==3)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-danger"];
                        }
                        if (contC4022>3)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                        }
                        }
                      
                      ModalidadTodasTerreUrbanoTonelada = _.sortBy(ModalidadTodasTerreUrbanoTonelada, 'PuertoDestino','PaisOrigen','Email');
                      $scope.ModalidadTodasTerreUrbanoTonelada= ModalidadTodasTerreUrbanoTonelada;

                     ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasTerreUrbanoTonelada;
                        $scope.ModalidadTodasTerreUrbanoTonelada= ModalidadTodasTerreUrbanoTonelada;
                        $scope.ModalidadTodasTerreUrbanoTonelada = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC4020Pintada.length > 0 ||
                                 el.AduC4021Pintada.length > 0 ||
                                 el.AduC4022Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });

                    }

                    //////////////////////////////////////////////////////////////////////////////////

                      if (Modalidad == 'Aereas') {
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
                         ModalidadDeUnProveedor = consotm.Aerea.Aereas
                            angular.forEach(ModalidadDeUnProveedor, function(consotmprov) {
                              consotmprov.Email = consotm.Email
                              ModalidadTodasAerea.push(consotmprov);
                              ModalidadTodasconOrden =ModalidadTodasAerea;
                              ModalidadTodasconOrdenMinima = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGAII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGAIII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCAII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCAIII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCPC = ModalidadTodasAerea;
                              ModalidadTodasconOrdenotros = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4017 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC401718 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4020 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4021 =ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4022 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4030 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC20EST = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC40EST = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodasAerea;

                            });
                        });

                        ModalidadTodasAerea = _.sortBy(ModalidadTodasAerea,'Aeropuerto','Pais');
                         console.log(ModalidadTodasAerea);


                         ////////  Campo Minima //////////////////////////

                    ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden,'Aeropuerto','Pais','Minima');

                    var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].Aeropuerto ==  ModalidadTodasconOrden[i-1].Aeropuerto) && ( ModalidadTodasconOrden[i].Pais ==  ModalidadTodasconOrden[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i].Minima) == parseFloat( ModalidadTodasconOrden[i-1].Minima))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }

                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["45"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'Aeropuerto','Pais', '["45"]');
                    var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].Aeropuerto ==  ModalidadTodasconOrden[i-1].Aeropuerto) && ( ModalidadTodasconOrden[i].Pais ==  ModalidadTodasconOrden[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i]["45"]) == parseFloat( ModalidadTodasconOrden[i-1]["45"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }

                  ////////// Campo ['+100'] ///////////////////////////////
                  ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'Aeropuerto','Pais',"['+100']");

                      var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].Aeropuerto ==  ModalidadTodasconOrdenGA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGA[i].Pais ==  ModalidadTodasconOrdenGA[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i]['+100']) == parseFloat( ModalidadTodasconOrdenGA[i-1]['+100']))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }

                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ['+300']

                   ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA,'Aeropuerto','Pais', "['+300']");
                       var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                           if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].Aeropuerto ==  ModalidadTodasconOrdenCA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCA[i].Pais ==  ModalidadTodasconOrdenCA[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]['+300']) == parseFloat( ModalidadTodasconOrdenCA[i-1]['+300']))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ['+500']
                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'Aeropuerto','Pais',"['+500']");

                         var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAII.length-1; i++){

                           if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAII[i].Aeropuerto ==  ModalidadTodasconOrdenGAII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAII[i].Pais ==  ModalidadTodasconOrdenGAII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAII[i]['+500']) == parseFloat( ModalidadTodasconOrdenGAII[i-1]['+500']))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }
                       ////////// Campo ['+1000']

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII,'Aeropuerto','Pais', "['+1000']");

                            var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                           if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].Aeropuerto ==  ModalidadTodasconOrdenCAII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAII[i].Pais ==  ModalidadTodasconOrdenCAII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]['+1000']) == parseFloat( ModalidadTodasconOrdenCAII[i-1]['+1000']))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }

                      ////////// Campo ["FS min"]

                   ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII,'Aeropuerto','Pais', '["FS min"]');

                      var contGAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIII[i].Aeropuerto ==  ModalidadTodasconOrdenGAIII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAIII[i].Pais ==  ModalidadTodasconOrdenGAIII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIII[i]["FS min"]) == parseFloat( ModalidadTodasconOrdenGAIII[i-1]["FS min"]))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }


                   ////////// Campo ["Fs/kg"]
                      ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'Aeropuerto','Pais','["Fs/kg"]');

                      var contCAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIII.length-1; i++){

                            if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIII[i].Aeropuerto ==  ModalidadTodasconOrdenCAIII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAIII[i].Pais ==  ModalidadTodasconOrdenCAIII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIII[i]["Fs/kg"]) == parseFloat( ModalidadTodasconOrdenCAIII[i-1]["Fs/kg"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }


                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                        }
                        }




                          ////////// Campo["Gastos Embarque"]

                   ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC,'Aeropuerto','Pais','["Gastos Embarque"]');

                       var contCPC=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPC.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPC[i].Aeropuerto ==  ModalidadTodasconOrdenCPC[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCPC[i].Pais ==  ModalidadTodasconOrdenCPC[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPC[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCPC[i-1]["Gastos Embarque"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                        }
                        }

                   ////////// Campo Via////////////////////////////

                  ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros ,'Aeropuerto','Pais','Via');

                       var contOTRO=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotros.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotros[i].Aeropuerto ==  ModalidadTodasconOrdenotros[i-1].Aeropuerto) && ( ModalidadTodasconOrdenotros[i].Pais ==  ModalidadTodasconOrdenotros[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotros[i].Via) == parseFloat( ModalidadTodasconOrdenotros[i-1].Via))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                        }
                        }
                    ////////// Campo ['+100 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC4017 = _.sortBy(ModalidadTodasconOrdenC4017 ,'Aeropuerto','Pais',"['+100 + Fs/kg + Gastos Embarque']");

                       var contC4017=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017[i].Aeropuerto ==  ModalidadTodasconOrdenC4017[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4017[i].Pais ==  ModalidadTodasconOrdenC4017[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017[i]['+100 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC4017[i-1]['+100 + Fs/kg + Gastos Embarque']))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                        }
                        }

               ////////// Campo ['+300 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC401718 = _.sortBy(ModalidadTodasconOrdenC401718 ,'Aeropuerto','Pais',"['+300 + Fs/kg + Gastos Embarque']");

                       var contC401718=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718.length-1; i++){

                          if (i==0)
                          {
                             contC401718= contC401718 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC401718[i].Aeropuerto ==  ModalidadTodasconOrdenC401718[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC401718[i].Pais ==  ModalidadTodasconOrdenC401718[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC401718[i]['+300 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC401718[i-1]['+300 + Fs/kg + Gastos Embarque']))
                                {
                                  contC401718= contC401718;
                                }
                                else
                                {
                                  contC401718=contC401718 + 1;
                                }
                              }
                             else
                              {
                               contC401718=1;
                              }

                          }


                        if (contC401718==1)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-success"];
                        }
                        if (contC401718==2)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-warning"];
                        }
                        if (contC401718==3)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-danger"];
                        }
                        if (contC401718>3)
                        {
                          ModalidadTodasconOrdenC401718[i].AduC401718Pintada = [];
                        }
                        }
                   ////////// Campo ['+500 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                    ModalidadTodasconOrdenC4020 = _.sortBy(ModalidadTodasconOrdenC4020, "['+500 + Fs/kg + Gastos Embarque']");
                     
                     var contC4020=0;
                        for (var i=0; i<=ModalidadTodasconOrdenC4020.length-1; i++){                                                    
                          if (i==0){                            
                            contC4020= contC4020 + 1;
                          }
                          else
                              {         
                              if(parseFloat(ModalidadTodasconOrdenC4020[i]['+500 + Fs/kg + Gastos Embarque']) == parseFloat(ModalidadTodasconOrdenC4020[i-1]['+500 + Fs/kg + Gastos Embarque'])) 
                              {                                 
                                contC4020= contC4020;
                              }
                              else
                              {
                                contC4020=contC4020 + 1;                               }
                            }                                                        
                          

                        if (contC4020==1) 
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                        }
                        if (contC4020==2) 
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                        }
                        if (contC4020==3) 
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                        }
                        if (contC4020>3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                        }
                        }       

                         ////////// Campo ['+1000 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                    ModalidadTodasconOrdenC4021 = _.sortBy(ModalidadTodasconOrdenC4021, "['+1000 + Fs/kg + Gastos Embarque']");
                     
                     var contC4021=0;
                        for (var i=0; i<=ModalidadTodasconOrdenC4021.length-1; i++){                                                    
                          if (i==0){                            
                            contC4021= contC4021 + 1;
                          }
                          else
                              {         
                              if(parseFloat(ModalidadTodasconOrdenC4021[i]['+1000 + Fs/kg + Gastos Embarque']) == parseFloat(ModalidadTodasconOrdenC4021[i-1]['+1000 + Fs/kg + Gastos Embarque'])) 
                              {                                 
                                contC4021= contC4021;
                              }
                              else
                              {
                                contC4021=contC4021 + 1;                               }
                            }                                                        
                          

                        if (contC4021==1) 
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                        }
                        if (contC4021==2) 
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                        }
                        if (contC4021==3) 
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                        }
                        if (contC4021>3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                        }
                        } 


                     ModalidadTodasAerea = _.sortBy(ModalidadTodasAerea, 'Aeropuerto','Pais','Email');
                     $scope.ModalidadTodasAerea=ModalidadTodasAerea;

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasAerea;
                       $scope.ModalidadTodasAerea= ModalidadTodasAerea;
                       console.log(ModalidadTodasRespaldo);
                       $scope.ModalidadTodasAerea = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
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
                                el.AduC40120Pintada.length > 0 ||
                                el.AduC4021Pintada.length > 0 ||                              
                                $scope.ModalidadesSemaforo == false);
                      });


                ////////////////////////////Aerea Pasajero /////////////////////////////////////////
                ModalidadTodasAereaPasajero=[];
                       angular.forEach($scope.ConsolidadoDatos, function(consotm) {
                         ModalidadDeUnProveedor = consotm.AereaPasajero.AereasPasajeros
                            angular.forEach(ModalidadDeUnProveedor, function(consotmprov) {
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

                      ModalidadTodasconOrdenP = _.sortBy(ModalidadTodasconOrdenP,'Aeropuerto','Pais', 'Minima');
                      var contP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenP.length-1; i++){

                          if (i==0)
                          {
                             contP= contP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenP[i].Aeropuerto ==  ModalidadTodasconOrdenP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenP[i].Pais ==  ModalidadTodasconOrdenP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenP[i].Minima) == parseFloat( ModalidadTodasconOrdenP[i-1].Minima))
                                {
                                  contP= contP;
                                }
                                else
                                {
                                  contP=contP + 1;
                                }
                              }
                             else
                              {
                               contP=1;
                              }

                          }


                        if (contP==1)
                        {
                               ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-success"];
                        }
                        if (contP==2)
                        {
                               ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-warning"];
                        }
                        if (contP==3)
                        {
                               ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-danger"];
                        }
                        if (contP>3)
                        {
                          ModalidadTodasconOrdenP[i].AduC2045PPintada = [];
                        }
                        }

              ////////////////// ["45"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinimaP = _.sortBy(ModalidadTodasconOrdenMinimaP, 'Aeropuerto','Pais','["45"]');

                      var contminP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinimaP.length-1; i++){

                         if (i==0)
                          {
                             contminP= contminP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinimaP[i].Aeropuerto ==  ModalidadTodasconOrdenMinimaP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenMinimaP[i].Pais ==  ModalidadTodasconOrdenMinimaP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinimaP[i]["45"]) == parseFloat( ModalidadTodasconOrdenMinimaP[i-1]["45"]))
                                {
                                  contminP= contminP;
                                }
                                else
                                {
                                  contminP=contminP + 1;
                                }
                              }
                             else
                              {
                               contminP=1;
                              }

                          }


                        if (contminP==1)
                        {
                               ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-success"];
                        }
                        if (contminP==2)
                        {
                               ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-warning"];
                        }
                        if (contminP==3)
                        {
                               ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-danger"];
                        }
                        if (contminP>3)
                        {
                          ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = [];
                        }
                        }

                   ////////// Campo ['+100'] ///////////////////////////////
                  ModalidadTodasconOrdenGAP = _.sortBy(ModalidadTodasconOrdenGAP, 'Aeropuerto','Pais',"['+100']");

                      var contGAP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAP.length-1; i++){

                          if (i==0)
                          {
                             contGAP= contGAP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAP[i].Aeropuerto ==  ModalidadTodasconOrdenGAP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAP[i].Pais ==  ModalidadTodasconOrdenGAP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAP[i]['+100']) == parseFloat( ModalidadTodasconOrdenGAP[i-1]['+100']))
                                {
                                  contGAP= contGAP;
                                }
                                else
                                {
                                  contGAP=contGAP + 1;
                                }
                              }
                             else
                              {
                               contGAP=1;
                              }

                          }

                        if (contGAP==1)
                        {
                               ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-success"];
                        }
                        if (contGAP==2)
                        {
                               ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-warning"];
                        }
                        if (contGAP==3)
                        {
                               ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-danger"];
                        }
                        if (contGAP>3)
                        {
                          ModalidadTodasconOrdenGAP[i].AduC2010PPintada = [];
                        }
                        }


                    ////////// Campo ['+300']

                    ModalidadTodasconOrdenCAP = _.sortBy(ModalidadTodasconOrdenCAP,'Aeropuerto','Pais', "['+300']");
                     var contCAP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAP.length-1; i++){

                           if (i==0)
                          {
                             contCAP= contCAP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAP[i].Aeropuerto ==  ModalidadTodasconOrdenCAP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAP[i].Pais ==  ModalidadTodasconOrdenCAP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAP[i]['+300']) == parseFloat( ModalidadTodasconOrdenCAP[i-1]['+300']))
                                {
                                  contCAP= contCAP;
                                }
                                else
                                {
                                  contCAP=contCAP + 1;
                                }
                              }
                             else
                              {
                               contCAP=1;
                              }

                          }


                        if (contCAP==1)
                        {
                               ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-success"];
                        }
                        if (contCAP==2)
                        {
                               ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-warning"];
                        }
                        if (contCAP==3)
                        {
                               ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-danger"];
                        }
                        if (contCAP>3)
                        {
                          ModalidadTodasconOrdenCAP[i].AduC2017PPintada = [];
                        }
                        }

                      ////////// Campo ['+500']

                   ModalidadTodasconOrdenGAIIP = _.sortBy(ModalidadTodasconOrdenGAIIP, 'Aeropuerto','Pais',"['+500']");

                      var contGAIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIP.length-1; i++){

                          if (i==0)
                          {
                             contGAIIP= contGAIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIIP[i].Aeropuerto ==  ModalidadTodasconOrdenGAIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAIIP[i].Pais ==  ModalidadTodasconOrdenGAIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIIP[i]['+500']) == parseFloat( ModalidadTodasconOrdenGAIIP[i-1]['+500']))
                                {
                                  contGAIIP= contGAIIP;
                                }
                                else
                                {
                                  contGAIIP=contGAIIP + 1;
                                }
                              }
                             else
                              {
                               contGAIIP=1;
                              }

                          }

                        if (contGAIIP==1)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-success"];
                        }
                        if (contGAIIP==2)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-warning"];
                        }
                        if (contGAIIP==3)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-danger"];
                        }
                        if (contGAIIP>3)
                        {
                          ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = [];
                        }
                        }

                       ////////// Campo ['+1000']

                      ModalidadTodasconOrdenCAIIP = _.sortBy(ModalidadTodasconOrdenCAIIP, 'Aeropuerto','Pais',"['+1000']");

                     var contCAIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIP.length-1; i++){

                           if (i==0)
                          {
                             contCAIIP= contCAIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIIP[i].Aeropuerto ==  ModalidadTodasconOrdenCAIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAIIP[i].Pais ==  ModalidadTodasconOrdenCAIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIIP[i]['+1000']) == parseFloat( ModalidadTodasconOrdenCAIIP[i-1]['+1000']))
                                {
                                  contCAIIP= contCAIIP;
                                }
                                else
                                {
                                  contCAIIP=contCAIIP + 1;
                                }
                              }
                             else
                              {
                               contCAIIP=1;
                              }

                          }


                        if (contCAIIP==1)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-success"];
                        }
                        if (contCAIIP==2)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-warning"];
                        }
                        if (contCAIIP==3)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-danger"];
                        }
                        if (contCAIIP>3)
                        {
                          ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = [];
                        }
                        }
                      ////////// Campo ["FS min"]

                   ModalidadTodasconOrdenGAIIIP = _.sortBy(ModalidadTodasconOrdenGAIIIP,'Aeropuerto','Pais','["FS min"]');

                      var contGAIIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIIP.length-1; i++){

                          if (i==0)
                          {
                             contGAIIIP= contGAIIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIIIP[i].Aeropuerto ==  ModalidadTodasconOrdenGAIIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAIIIP[i].Pais ==  ModalidadTodasconOrdenGAIIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIIIP[i]["FS min"]) == parseFloat( ModalidadTodasconOrdenGAIIIP[i-1]["FS min"]))
                                {
                                  contGAIIIP= contGAIIIP;
                                }
                                else
                                {
                                  contGAIIIP=contGAIIIP + 1;
                                }
                              }
                             else
                              {
                               contGAIIIP=1;
                              }

                          }


                        if (contGAIIIP==1)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-success"];
                        }
                        if (contGAIIIP==2)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-warning"];
                        }
                        if (contGAIIIP==3)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-danger"];
                        }
                        if (contGAIIIP>3)
                        {
                          ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = [];
                        }
                        }


                   ////////// Campo ["Fs/kg"]

                      ModalidadTodasconOrdenCAIIIP = _.sortBy(ModalidadTodasconOrdenCAIIIP,'Aeropuerto','Pais','["Fs/kg"]');

                      var contCAIIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIIP.length-1; i++){

                          if (i==0)
                          {
                             contCAIIIP= contCAIIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIIIP[i].Aeropuerto ==  ModalidadTodasconOrdenCAIIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAIIIP[i].Pais ==  ModalidadTodasconOrdenCAIIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIIIP[i]["Fs/kg"]) == parseFloat( ModalidadTodasconOrdenCAIIIP[i-1]["Fs/kg"]))
                                {
                                  contCAIIIP= contCAIIIP;
                                }
                                else
                                {
                                  contCAIIIP=contCAIIIP + 1;
                                }
                              }
                             else
                              {
                               contCAIIIP=1;
                              }

                          }


                        if (contCAIIIP==1)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-success"];
                        }
                        if (contCAIIIP==2)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-warning"];
                        }
                        if (contCAIIIP==3)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-danger"];
                        }
                        if (contCAIIIP>3)
                        {
                          ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = [];
                        }
                        }



                          ////////// Campo["Gastos Embarque"]

                    ModalidadTodasconOrdenCPCP = _.sortBy(ModalidadTodasconOrdenCPCP,'Aeropuerto','Pais','["Gastos Embarque"]');
                    var contCPCP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPCP.length-1; i++){

                          if (i==0)
                          {
                             contCPCP= contCPCP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPCP[i].Aeropuerto ==  ModalidadTodasconOrdenCPCP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCPCP[i].Pais ==  ModalidadTodasconOrdenCPCP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPCP[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCPCP[i-1]["Gastos Embarque"]))
                                {
                                  contCPCP= contCPCP;
                                }
                                else
                                {
                                  contCPCP=contCPCP + 1;
                                }
                              }
                             else
                              {
                               contCPCP=1;
                              }

                          }

                        if (contCPCP==1)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-success"];
                        }
                        if (contCPCP==2)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-warning"];
                        }
                        if (contCPCP==3)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-danger"];
                        }
                        if (contCPCP>3)
                        {
                          ModalidadTodasconOrdenCPCP[i].AduCPCPintada = [];
                        }
                        }

                   ////////// Campo Via////////////////////////////

                    ModalidadTodasconOrdenotrosP = _.sortBy(ModalidadTodasconOrdenotrosP,'Aeropuerto','Pais', 'Via');

                        var contOTROP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotrosP.length-1; i++){

                          if (i==0)
                          {
                             contOTROP= contOTROP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotrosP[i].Aeropuerto ==  ModalidadTodasconOrdenotrosP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenotrosP[i].Pais ==  ModalidadTodasconOrdenotrosP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotrosP[i].Via) == parseFloat( ModalidadTodasconOrdenotrosP[i-1].Via))
                                {
                                  contOTROP= contOTROP;
                                }
                                else
                                {
                                  contOTROP=contOTROP + 1;
                                }
                              }
                             else
                              {
                               contOTROP=1;
                              }

                          }

                        if (contOTROP==1)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-success"];
                        }
                        if (contOTROP==2)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-warning"];
                        }
                        if (contOTROP==3)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-danger"];
                        }
                        if (contOTROP>3)
                        {
                          ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = [];
                        }
                        }

                        ////////// Campo ['+100 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC4017P = _.sortBy(ModalidadTodasconOrdenC4017P ,'Aeropuerto','Pais',"['+100 + Fs/kg']");

                       var contC4017P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017P.length-1; i++){

                          if (i==0)
                          {
                             contC4017P= contC4017P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017P[i].Aeropuerto ==  ModalidadTodasconOrdenC4017P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4017P[i].Pais ==  ModalidadTodasconOrdenC4017P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017P[i]['+100 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4017P[i-1]['+100 + Fs/kg']))
                                {
                                  contC4017P= contC4017P;
                                }
                                else
                                {
                                  contC4017P=contC4017P + 1;
                                }
                              }
                             else
                              {
                               contC4017P=1;
                              }

                          }


                        if (contC4017P==1)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-success"];
                        }
                        if (contC4017P==2)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-warning"];
                        }
                        if (contC4017P==3)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-danger"];
                        }
                        if (contC4017P>3)
                        {
                          ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = [];
                        }
                        }

               ////////// Campo ['+300 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC401718P = _.sortBy(ModalidadTodasconOrdenC401718P ,'Aeropuerto','Pais',"['+300 + Fs/kg']");

                       var contC401718P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718P.length-1; i++){

                          if (i==0)
                          {
                             contC401718P= contC401718P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC401718P[i].Aeropuerto ==  ModalidadTodasconOrdenC401718P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC401718P[i].Pais ==  ModalidadTodasconOrdenC401718P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC401718P[i]['+300 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC401718P[i-1]['+300 + Fs/kg']))
                                {
                                  contC401718P= contC401718P;
                                }
                                else
                                {
                                  contC401718P=contC401718P + 1;
                                }
                              }
                             else
                              {
                               contC401718P=1;
                              }

                          }


                        if (contC401718P==1)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-success"];
                        }
                        if (contC401718P==2)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-warning"];
                        }
                        if (contC401718P==3)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-danger"];
                        }
                        if (contC401718P>3)
                        {
                          ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = [];
                        }
                        }
                   ////////// Campo ['+500 + Fs/kg + Gastos Embarque']////////////////////////////              
                       
                     ModalidadTodasconOrdenC4020P = _.sortBy(ModalidadTodasconOrdenC4020P ,'Aeropuerto','Pais',"['+500 + Fs/kg']");

                       var contC4020P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4020P.length-1; i++){

                          if (i==0)
                          {
                             contC4020P= contC4020P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4020P[i].Aeropuerto ==  ModalidadTodasconOrdenC4020P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4020P[i].Pais ==  ModalidadTodasconOrdenC4020P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4020P[i]['+500 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4020P[i-1]['+500 + Fs/kg']))
                                {
                                  contC4020P= contC4020P;
                                }
                                else
                                {
                                  contC4020P=contC4020P + 1;
                                }
                              }
                             else
                              {
                               contC4020P=1;
                              }

                          }


                        if (contC4020P==1)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-success"];
                        }
                        if (contC4020P==2)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-warning"];
                        }
                        if (contC4020P==3)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-danger"];
                        }
                        if (contC4020P>3)
                        {
                          ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = [];
                        }
                        }
                       
                     ////////// Campo ['+10000 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                      ModalidadTodasconOrdenC4021P = _.sortBy(ModalidadTodasconOrdenC4021P ,'Aeropuerto','Pais',"['+1000 + Fs/kg']");

                       var contC4021P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4021P.length-1; i++){

                          if (i==0)
                          {
                             contC4021P= contC4021P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4021P[i].Aeropuerto ==  ModalidadTodasconOrdenC4021P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4021P[i].Pais ==  ModalidadTodasconOrdenC4021P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4021P[i]['+1000 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4021P[i-1]['+1000 + Fs/kg']))
                                {
                                  contC4021P= contC4021P;
                                }
                                else
                                {
                                  contC4021P=contC4021P + 1;
                                }
                              }
                             else
                              {
                               contC4021P=1;
                              }

                          }


                        if (contC4021P==1)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = ["label label-success"];
                        }
                        if (contC4021P==2)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = ["label label-warning"];
                        }
                        if (contC4021P==3)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = ["label label-danger"];
                        }
                        if (contC4021P>3)
                        {
                          ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = [];
                        }
                        }

                    ModalidadTodasAereaPasajero = _.sortBy(ModalidadTodasAereaPasajero, 'Aeropuerto','Pais','Email');
                    //$scope.ModalidadTodasAereaPasajero=ModalidadTodasAereaPasajero;

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasAereaPasajero;
                       $scope.ModalidadTodasAereaPasajero= ModalidadTodasAereaPasajero;
                       $scope.ModalidadTodasAereaPasajero = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045PPintada.length > 0 ||
                                 el.AduC8PPintada.length > 0 ||
                                el.AduC2010PPintada.length > 0 ||
                                el.AduC2017PPintada.length > 0 ||
                                el.AduC2019PPintada.length > 0 ||
                                el.AduC2020PPintada.length > 0 ||
                                el.AduC2021PPintada.length > 0 ||
                                el.AduC2025PPintada.length > 0 ||
                                el.AduC4015PPintada.length > 0 ||
                                el.AduC4016PPintada.length > 0 ||
                                el.AduC4017PPintada.length > 0 ||
                                el.AduC401718PPintada.length > 0 ||
                                el.AduC4020PPintada.length > 0 ||
                                el.AduC4021PPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });

               }


                    ///////////////////////////////////////////////////////////////////////////

                  }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }

            $scope.FiltroS= function  (){
              $scope.ModalidadesSemaforo == true;
              $scope.GetConsolidadoDatos()

              }



             $scope.GetConsolidadoDatos();


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
         var VistaName='';

         $scope.Show30 = false;
         $scope.Show40 = false;
         $scope.Show50 = false;
         $scope.Show60 = false;
         $scope.Show70 = false;
         $scope.Show80 = false;
         $scope.Show90 = true;
                        $scope.Show1=false;
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
                        $scope.Show11=false;
                        $scope.Show12=false;
                        $scope.Show13=false;
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
         $scope.Showf2 = function () {
          VistaName='';
           $scope.Show30 = false;
           $scope.Show40 = true;
           $scope.Show50 = false;
           $scope.Show60=true;                   
           $scope.Show70 = false;
           $scope.Show80 = false;
           $scope.Show90 = true;
            //$scope.Show100 = false;
            $scope.Show1=false;
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
            $scope.Show11=false;
            $scope.Show12=false;
            $scope.Show13=false;
         };
         $scope.Showf3 = function () {
          VistaName = 'DatosProveedor';
           $scope.Show30 = false;
           $scope.Show40 = false;
           $scope.Show50 = true;
           $scope.Show60=false;
           $scope.Show70 = false;
           $scope.Show80 = false;
           $scope.Show90 = true;
           //$scope.Show100 = true;
            $scope.Show1=false;
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
            $scope.Show11=false;
            $scope.Show12=false;
            $scope.Show13=false;
            $scope.GetProveedoresModalidadesName();
         };

         // Variables de selectores
         $scope.UsuarioSel = {};

            $scope.filterProveedores = function(){

           $scope.Usuarios = $scope.UsuariosSaved.filter(function (el) { return el.Name.toUpperCase().includes($scope.UsuarioSel.selected.Name.toUpperCase()); })
           console.log($scope.UsuarioSel.selected.Name);
           
           if (VistaName=='DatosProveedor')
           {
              $scope.GetProveedorModalidadName();
           }
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

          //////////////////////////////////////////Data Proveedor ////////////////////////////////////////
          
          /*  $scope.filterProveedoresModalidad = function(){ 
                $scope.GetProveedorModalidadName();
           } */ 

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

             $scope.GetProveedoresModalidadesName = function () {
                  var Data = {};
                  $loading.start('myloading');
                  $http({
                        method: 'POST',
                        url: '/GetProveedoresModalidadesName',
                        headers: { 'Content-Type': 'application/json' },
                        data: Data
                       }).then(function successCallback(response) {
                          $loading.finish('myloading');
                          $scope.LicitacionModalidadesProveedores = response.data.data; 
                          console.log($scope.LicitacionModalidadesProveedores);                         
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
                     }


                  $scope.GetNegociarmodalidad = function (user,modalidad) {
                  var Data = {};
                  Data.Email= user;
                  Data.Modalidad=modalidad;
                  console.log(Data.Modalidad);
                  console.log(Data.Email);
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
                     }

          //////////////////////////////se agrego consolidado datos /////////////////////////////////////

            $scope.ModalidadesSemaforo=false;

         $scope.ModalidadesConsolidado = [{ id: 0, Name: 'Bodegajes' }, { id: 1, Name: 'Aduanas' }, {id: 2, Name: 'OTM' }, { id: 3, Name: 'MaritimasFCL' }, { id: 4, Name: 'MaritimasLCL' }, { id: 5, Name: 'Terrestre Nacional' }, { id: 6, Name: 'Terrestre Urbano' },{ id: 7, Name: 'Aereas' }];

         $scope.selectedModalidadConsolidado = $scope.ModalidadesConsolidado[0];


                  $scope.GetConsolidadoDatos = function () {
                    var Data={};
                    var ModalidadTodas = [];
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
                    var ModalidadDeUnProveedor = []
                    var ModalidadAduanero= []
                    var ModalidadConsolidado= $scope.selectedModalidadConsolidado.Name;
                    var ModalidadesTodasRespaldo=[];

                    var Unobjeto={};

                $loading.start('myloading');
                $http({
                    method: 'POST',
                    url: '/GetConsolidadoDatos',
                    headers: { 'Content-Type': 'application/json' },
                    data: Data
                }).then(function successCallback(response) {
                    $loading.finish('myloading');
                    $scope.ConsolidadoDatos = response.data.ConsolidadoDatos;

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

                          ModalidadTodasBodegajeaduanero.push({TarifaValor:Unobjeto.TarifaValor, TarifaMinima:Unobjeto.TarifaMinima,Otros:Unobjeto.Otros,Email:Unobjeto.Email});
                          console.log( ModalidadTodasBodegajeaduanero);
                          
                          ModalidadTodasconOrdenBodegajeaduanero=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduaneromaq=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduanero=ModalidadTodasBodegajeaduanero;
                          ModalidadTodasconOrdenBodegajeaduaneromin=parseFloat(ModalidadTodasBodegajeaduanero); 
                          ModalidadTodasconOrdenBodegajeaduaneromin=ModalidadTodasBodegajeaduanero;                        
                          
                          ModalidadTodasconOrdenBodegajeaduanerootro=parseFloat(ModalidadTodasBodegajeaduanero);
                          ModalidadTodasconOrdenBodegajeaduanerootro=ModalidadTodasBodegajeaduanero;

                         });

                       console.log( ModalidadTodasconOrdenBodegajeaduanero);
                       console.log( ModalidadTodasconOrdenBodegajeaduaneromin);
                       console.log( ModalidadTodasconOrdenBodegajeaduanerootro);



                 ///////////////////////// tarifa Valor////////////////////

                     ModalidadTodasconOrdenBodegajeaduanero = _.sortBy(ModalidadTodasconOrdenBodegajeaduanero,'TarifaValor');
                    console.log( ModalidadTodasconOrdenBodegajeaduanero);
                     var cont=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduanero.length-1; i++){
                          if (i==0){
                            cont= cont + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduanero[i].TarifaValor) == parseFloat( ModalidadTodasconOrdenBodegajeaduanero[i-1].TarifaValor))
                              {
                                cont= cont;
                              }
                              else
                              {
                                cont=cont + 1;                               }
                            }


                        if (cont==1)
                        {
                               ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrdenBodegajeaduanero[i].AdutarifaPintada = [];
                        }
                        }

                         ///////////////////////// tarifa Minima////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromin = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromin,'TarifaMinima');
                    console.log(ModalidadTodasconOrdenBodegajeaduaneromin);
                     var contmin=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromin.length-1; i++){
                          if (i==0){
                            contmin= contmin + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromin[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromin[i-1].TarifaMinima))
                              {
                                contmin= contmin;
                              }
                              else
                              {
                                contmin=contmin + 1;                               }
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
                        }

                                  ///////////////////////// otros////////////////////

                      ModalidadTodasconOrdenBodegajeaduanerootro = _.sortBy(ModalidadTodasconOrdenBodegajeaduanerootro, 'Otros');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduanerootro);
                     var contotro=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduanerootro.length-1; i++){
                          if (i==0){
                            contotro= contotro + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduanerootro[i].Otros) == parseFloat( ModalidadTodasconOrdenBodegajeaduanerootro[i-1].Otros))
                              {
                                contotro= contotro;
                              }
                              else
                              {
                                contotro=contotro + 1;                               }
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
                        }
                         

                        ModalidadTodasBodegajeaduanero= _.sortBy(ModalidadTodasconOrdenBodegajeaduanero,'Email');
                        $scope.ModalidadTodasBodegajeaduanero=ModalidadTodasBodegajeaduanero;


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
                        ModalidadTodasBodegajeaduaneromaqt.push({Tarifa:Unobjetomaqt.Tarifa, TarifaMinima:Unobjetomaqt.TarifaMinima, Fmm:Unobjetomaqt.Fmm, Email:Unobjetomaqt.Email});

                        
                        ModalidadTodasconOrdenBodegajeaduaneromaqt=ModalidadTodasBodegajeaduaneromaqt;
                        ModalidadTodasconOrdenBodegajeaduaneromaqmint=ModalidadTodasBodegajeaduaneromaqt;
                        ModalidadTodasconOrdenBodegajeaduaneromaqfmmt=ModalidadTodasBodegajeaduaneromaqt;

                         });

                      /////////////////////////////////tarifa////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqt = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqt,'Tarifa');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqt);
                     var contmaqt=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqt.length-1; i++){
                          if (i==0){
                            contmaqt= contmaqt + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqt[i].Tarifa) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqt[i-1].Tarifa))
                              {
                                contmaqt= contmaqt;
                              }
                              else
                              {
                                contmaqt=contmaqt + 1;                               }
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
                        }

                            /////////////////////////////////tarifa minima////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqmint = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqmint, 'Tarifa Minima');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqmin);
                     var contmaqmint=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqmint.length-1; i++){
                          if (i==0){
                            contmaqmint= contmaqmint + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqmint[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqmint[i-1].TarifaMinima))
                              {
                                contmaqmint= contmaqmint;
                              }
                              else
                              {
                                contmaqmint=contmaqmint + 1;                               }
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
                        }

                     /////////////////////////////////FMM////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqfmmt = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmt,'Fmm');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqfmm);
                     var contmaqfmmt=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqfmmt.length-1; i++){
                          if (i==0){
                            contmaqfmmt= contmaqfmmt + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i].Fmm) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmt[i-1].Fmm))
                              {
                                contmaqfmmt= contmaqfmmt;
                              }
                              else
                              {
                                contmaqfmmt=contmaqfmmt + 1;                               }
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
                        }

                          ModalidadTodasBodegajeaduaneromaqt= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqt,'Email');
                          $scope.ModalidadTodasBodegajeaduaneromaqt=ModalidadTodasBodegajeaduaneromaqt;

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
                        ModalidadTodasBodegajeaduaneromaqp.push({Tarifa:Unobjetomaqp.Tarifa, TarifaMinima:Unobjetomaqp.TarifaMinima, Fmm:Unobjetomaqp.Fmm, Email:Unobjetomaqp.Email});

                        
                        ModalidadTodasconOrdenBodegajeaduaneromaqp=ModalidadTodasBodegajeaduaneromaqp;
                        ModalidadTodasconOrdenBodegajeaduaneromaqminp=ModalidadTodasBodegajeaduaneromaqp;
                        ModalidadTodasconOrdenBodegajeaduaneromaqfmmp=ModalidadTodasBodegajeaduaneromaqp;

                         });

                      /////////////////////////////////tarifa////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqp,'Tarifa');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqp);
                     var contmaqp=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqp.length-1; i++){
                          if (i==0){
                            contmaqp= contmaqp + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqp[i].Tarifa) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqp[i-1].Tarifa))
                              {
                                contmaqp= contmaqp;
                              }
                              else
                              {
                                contmaqp=contmaqp + 1;                               }
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
                        }

                            /////////////////////////////////tarifa minima////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqminp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqminp, 'Tarifa Minima');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqminp);
                     var contmaqminp=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqminp.length-1; i++){
                          if (i==0){
                            contmaqminp= contmaqminp + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqminp[i].TarifaMinima) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqminp[i-1].TarifaMinima))
                              {
                                contmaqminp= contmaqminp;
                              }
                              else
                              {
                                contmaqminp=contmaqminp + 1;                               }
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
                        }

                     /////////////////////////////////FMM////////////////////////////////////

                      ModalidadTodasconOrdenBodegajeaduaneromaqfmmp = _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqfmmp,'Fmm');
                    console.log( $scope.ModalidadDeUnProveedorbodegajeaduaneromaqfmmp);
                     var contmaqfmmp=0;
                        for (var i=0; i<= ModalidadTodasconOrdenBodegajeaduaneromaqfmmp.length-1; i++){
                          if (i==0){
                            contmaqfmmp= contmaqfmmp + 1;
                          }
                          else
                              {
                              if(parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i].Fmm) == parseFloat( ModalidadTodasconOrdenBodegajeaduaneromaqfmmp[i-1].Fmm))
                              {
                                contmaqfmmp= contmaqfmmp;
                              }
                              else
                              {
                                contmaqfmmp=contmaqfmmp + 1;                               }
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
                        }

                           ModalidadTodasBodegajeaduaneromaqp= _.sortBy(ModalidadTodasconOrdenBodegajeaduaneromaqp,'Email');
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

                       angular.forEach($scope.ConsolidadoDatos, function(consaduana) {
                         ModalidadDeUnProveedor = consaduana.Aduana.Aduanas
                            angular.forEach(ModalidadDeUnProveedor, function(consaduanasprov) {
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

                       //console.log(ModalidadTodas);
                       //$scope.groups = _.groupBy(ModalidadTodas, "Via");

                    //////// Aerea campo ["Tarifa % Advalorem/ FOB"] //////////////////////////
                      ModalidadTodasconOrden = _.sortBy( ModalidadTodasconOrden, 'Via','["Tarifa % Advalorem/ FOB"]');
                      console.log(ModalidadTodasconOrden);

                     var cont=0;
                     var contnull=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){
                           if (i==0)
                          {
                             cont= cont + 1;
                             console.log('i es o');
                             console.log(cont);
                          }
                         else
                          {
                             if(ModalidadTodasconOrden[i].Via == ModalidadTodasconOrden[i-1].Via)

                              {
                                console.log('via igual');
                                if(parseFloat(ModalidadTodasconOrden[i]["Tarifa % Advalorem/ FOB"]) == parseFloat(ModalidadTodasconOrden[i-1]["Tarifa % Advalorem/ FOB"]))
                                {
                                  cont= cont;
                                  console.log('campo igual');
                                  console.log(cont);
                                }
                                else
                                {
                                  cont=cont + 1;
                                  console.log('campo diferente');
                             console.log(cont);
                                }

                              }
                             else
                              {
                               cont=1;
                               console.log('via diferente');
                             console.log(cont);
                              }

                          }

                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AdutarifaPintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AdutarifaPintada = [];
                        }
                        if (contnull==1)
                        {
                          ModalidadTodasconOrden[i].AdutarifaPintada = [];
                        }

                        }


              ////////////////// Campo Minima ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'Via','Minima');
                    var contmin=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenMinima[i].Via == ModalidadTodasconOrdenMinima[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i].Minima) == parseFloat(ModalidadTodasconOrdenMinima[i-1].Minima))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }

                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduMinimaPintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduMinimaPintada = [];
                        }
                        }

                  ////////// Campo ["Gastos Adicionales"] ///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'Via', '["Gastos Adicionales"]');

                     var contGA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){
                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenGA[i].Via == ModalidadTodasconOrdenGA[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["Gastos Adicionales"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["Gastos Adicionales"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }

                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduGAPintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduGAPintada = [];
                        }
                        }

                    ////////// Campo ["Conceptos Adicionales"] ////////////////////////////////

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'Via','["Conceptos Adicionales"]');
                    var contCA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCA[i].Via == ModalidadTodasconOrdenCA[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Conceptos Adicionales"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Conceptos Adicionales"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduCAPintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduCAPintada = [];
                        }
                        }

                      ////////// Campo ["Gastos Adicionales dos"] //////////////////////////////////////

                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'Via', '["Gastos Adicionales dos"]');

                      var contGAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenGAII[i].Via == ModalidadTodasconOrdenGAII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["Gastos Adicionales dos"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["Gastos Adicionales dos"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduGAIIPintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduGAIIPintada = [];
                        }
                        }

                       ////////// Campo ["Conceptos Adicionales dos"]

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'Via', '["Conceptos Adicionales dos"]');

                    var contCAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){

                           if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCAII[i].Via == ModalidadTodasconOrdenCAII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["Conceptos Adicionales dos"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["Conceptos Adicionales dos"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduCAIIPintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduCAIIPintada = [];
                        }
                        }
                      ////////// Campo ["Gastos Adicionales tres"]

                    ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'Via','["Gastos Adicionales tres"]');

                      var contGAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenGAIII[i].Via == ModalidadTodasconOrdenGAIII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i]["Gastos Adicionales tres"]) == parseFloat(ModalidadTodasconOrdenGAIII[i-1]["Gastos Adicionales tres"]))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduGAIIIPintada = [];
                        }
                        }


                   ////////// Campo ["Conceptos Adicionales tres"]

                    ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'Via','["Conceptos Adicionales tres"]');

                     var contCAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIII.length-1; i++){

                          if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCAIII[i].Via == ModalidadTodasconOrdenCAIII[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAIII[i]["Conceptos Adicionales tres"]) == parseFloat(ModalidadTodasconOrdenCAIII[i-1]["Conceptos Adicionales tres"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }


                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduCAIIIPintada = [];
                        }
                        }



                          ////////// Campo ["Costo Planificacion Caja"]

                    ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC, 'Via', '["Costo Planificacion Caja"]');

                     var contCPC=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPC.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenCPC[i].Via == ModalidadTodasconOrdenCPC[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenCPC[i]["Costo Planificacion Caja"]) == parseFloat(ModalidadTodasconOrdenCPC[i-1]["Costo Planificacion Caja"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }

                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduCPCPintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduCPCPintada = [];
                        }
                        }

                   ////////// Campo Otros////////////////////////////

                    ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros, 'Via', 'Otros');

                       var contOTRO=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotros.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                             if(ModalidadTodasconOrdenotros[i].Via == ModalidadTodasconOrdenotros[i-1].Via)
                              {
                                if(parseFloat(ModalidadTodasconOrdenotros[i].Otros) == parseFloat(ModalidadTodasconOrdenotros[i-1]["Costo Planificacion Otros"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduotroPintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduotroPintada = [];
                        }
                        }


                     ModalidadTodas= _.sortBy(ModalidadTodas,'Via','Email');
                     ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodas= ModalidadTodas;
                       $scope.ModalidadTodas = ModalidadTodasRespaldo.filter(function (el) {
                     return (el.AdutarifaPintada.length > 0 ||
                          el.AduMinimaPintada.length > 0 ||
                          el.AduGAPintada.length > 0 ||
                          el.AduCAPintada.length > 0 ||
                          el.AduGAIIPintada.length > 0 ||
                          el.AduCAIIPintada.length > 0 ||
                          el.AduGAIIIPintada.length > 0 ||
                          el.AduCAIIIPintada.length > 0 ||
                          el.AduCPCPintada.length > 0 ||
                          el.AduotroPintada.length > 0 ||
                          $scope.ModalidadesSemaforo == false);
                });
                console.log($scope.ModalidadTodas);


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
                         ModalidadDeUnProveedor = consotm.Otm.Otms
                            angular.forEach(ModalidadDeUnProveedor, function(consotmprov) {
                              consotmprov.Email = consotm.Email
                              ModalidadTodas.push(consotmprov);
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

                        ModalidadTodas = _.sortBy(ModalidadTodas, 'Destino','Origen');
                         console.log(ModalidadTodas);

                         ////////  Campo ["C 20 hasta 4-5 Ton"] //////////////////////////

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden, 'Destino','Origen','["C 20 hasta 4-5 Ton"]');

                      var cont=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrden[i].Destino == ModalidadTodasconOrden[i-1].Destino) && (ModalidadTodasconOrden[i].Origen == ModalidadTodasconOrden[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrden[i].Otros) == parseFloat(ModalidadTodasconOrden[i-1]["Costo Planificacion Otros"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["C 20 hasta 8 Ton"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'Destino','Origen','["C 20 hasta 8 Ton"]');
                       var contmin=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenMinima[i].Destino == ModalidadTodasconOrdenMinima[i-1].Destino) && (ModalidadTodasconOrdenMinima[i].Origen == ModalidadTodasconOrdenMinima[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["C 20 hasta 8 Ton"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["C 20 hasta 8 Ton"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }


                  ////////// Campo ["C 20 hasta 10 Ton"] ///////////////////////////////
                       ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'Destino','Origen', '["C 20 hasta 10 Ton"]');

                      var contGA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGA[i].Destino == ModalidadTodasconOrdenGA[i-1].Destino) && (ModalidadTodasconOrdenGA[i].Origen == ModalidadTodasconOrdenGA[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["C 20 hasta 10 Ton"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["C 20 hasta 10 Ton"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["C 20 hasta 17 Ton"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'Destino','Origen','["C 20 hasta 17 Ton"]');
                     var contCA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCA[i].Destino == ModalidadTodasconOrdenCA[i-1].Destino) && (ModalidadTodasconOrdenCA[i].Origen == ModalidadTodasconOrdenCA[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["C 20 hasta 17 Ton"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["C 20 hasta 17 Ton"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ["C 20 hasta 19 Ton"]

                   ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII,'Destino','Origen','["C 20 hasta 19 Ton"]');

                     var contGAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGAII[i].Destino == ModalidadTodasconOrdenGAII[i-1].Destino) && (ModalidadTodasconOrdenGAII[i].Origen == ModalidadTodasconOrdenGAII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAII[i]["C 20 hasta 19 Ton"]) == parseFloat(ModalidadTodasconOrdenGAII[i-1]["C 20 hasta 19 Ton"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }

                       ////////// Campo ["C 20 hasta 20 Ton"]
                       ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII,'Destino','Origen','["C 20 hasta 20 Ton"]');

                       var contCAII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAII.length-1; i++){

                          if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCAII[i].Destino == ModalidadTodasconOrdenCAII[i-1].Destino) && (ModalidadTodasconOrdenCAII[i].Origen == ModalidadTodasconOrdenCAII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAII[i]["C 20 hasta 20 Ton"]) == parseFloat(ModalidadTodasconOrdenCAII[i-1]["C 20 hasta 20 Ton"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }


                      ////////// Campo ["C 20 hasta 21 Ton"]

                    ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'Destino','Origen','["C 20 hasta 21 Ton"]');

                     var contGAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGAIII[i].Destino == ModalidadTodasconOrdenGAIII[i-1].Destino) && (ModalidadTodasconOrdenGAIII[i].Origen == ModalidadTodasconOrdenGAIII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGAIII[i]["C 20 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenGAIII[i-1]["C 20 hasta 21 Ton"]))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }

                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }


                   ////////// Campo ["C 20 hasta 25 Ton"]

                     ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'Destino','Origen','["C 20 hasta 25 Ton"]');

                     var contCAIII=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCAIII.length-1; i++){

                          if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCAIII[i].Destino == ModalidadTodasconOrdenCAIII[i-1].Destino) && (ModalidadTodasconOrdenCAIII[i].Origen == ModalidadTodasconOrdenCAIII[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCAIII[i]["C 20 hasta 25 Ton"]) == parseFloat(ModalidadTodasconOrdenCAIII[i-1]["C 20 hasta 25 Ton"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }

                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                        }
                        }

              /////////////////// ////////// Campo ["C 40 hasta 15 Ton"]  ////////////////////////////////////////////

                    ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC, 'Destino','Origen','["C 40 hasta 15 Ton"]');

                      var contCPC=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCPC.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCPC[i].Destino == ModalidadTodasconOrdenCPC[i-1].Destino) && (ModalidadTodasconOrdenCPC[i].Origen == ModalidadTodasconOrdenCPC[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCPC[i]["C 40 hasta 15 Ton"]) == parseFloat(ModalidadTodasconOrdenCPC[i-1]["C 40 hasta 15 Ton"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                        }
                        }

                   ////////// Campo ["C 40 hasta 16 Ton"]////////////////////////////

                    ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros, 'Destino','Origen','["C 40 hasta 16 Ton"]');

                       var contOTRO=0;
                       for (var i=0; i<=ModalidadTodasconOrdenotros.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenotros[i].Destino == ModalidadTodasconOrdenotros[i-1].Destino) && (ModalidadTodasconOrdenotros[i].Origen == ModalidadTodasconOrdenotros[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenotros[i]["C 40 hasta 16 Ton"]) == parseFloat(ModalidadTodasconOrdenotros[i-1]["C 40 hasta 16 Ton"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                        }
                        }

                  ////////// Campo ["C 40 hasta 17 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4017 = _.sortBy(ModalidadTodasconOrdenC4017,'Destino','Origen','["C 40 hasta 17 Ton"]');

                     var contC4017=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4017.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC4017[i].Destino == ModalidadTodasconOrdenC4017[i-1].Destino) && (ModalidadTodasconOrdenC4017[i].Origen == ModalidadTodasconOrdenC4017[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4017[i]["C 40 hasta 17 Ton"]) == parseFloat(ModalidadTodasconOrdenC4017[i-1]["C 40 hasta 17 Ton"]))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                        }
                        }

                   ////////// Campo ["C 40 hasta 17-18 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC401718 = _.sortBy(ModalidadTodasconOrdenC401718, 'Destino','Origen','["C 40 hasta 17-18 Ton"]');

                    var contC401718=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC401718.length-1; i++){

                          if (i==0)
                          {
                             contC401718= contC401718 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC401718[i].Destino == ModalidadTodasconOrdenC401718[i-1].Destino) && (ModalidadTodasconOrdenC401718[i].Origen == ModalidadTodasconOrdenC401718[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC401718[i]["C 40 hasta 17-18 Ton"]) == parseFloat(ModalidadTodasconOrdenC401718[i-1]["C 40 hasta 17-18 Ton"]))
                                {
                                  contC401718= contC401718;
                                }
                                else
                                {
                                  contC401718=contC401718 + 1;
                                }
                              }
                             else
                              {
                               contC401718=1;
                              }

                          }


                        if (contC401718==1)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-success"];
                        }
                        if (contC401718==2)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-warning"];
                        }
                        if (contC401718==3)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-danger"];
                        }
                        if (contC401718>3)
                        {
                          ModalidadTodasconOrdenC401718[i].AduC401718Pintada = [];
                        }
                        }


                   ////////// Campo ["C 40 hasta 20 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4020 = _.sortBy(ModalidadTodasconOrdenC4020, 'Destino','Origen','["C 40 hasta 20 Ton"]');

                     var contC4020=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4020.length-1; i++){

                          if (i==0)
                          {
                             contC4020= contC4020 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4020[i].Destino == ModalidadTodasconOrdenC4020[i-1].Destino) && (ModalidadTodasconOrdenC4020[i].Origen == ModalidadTodasconOrdenC4020[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4020[i]["C 40 hasta 20 Ton"]) == parseFloat(ModalidadTodasconOrdenC4020[i-1]["C 40 hasta 20 Ton"]))
                                {
                                  contC4020= contC4020;
                                }
                                else
                                {
                                  contC4020=contC4020 + 1;
                                }
                              }
                             else
                              {
                               contC4020=1;
                              }

                          }


                        if (contC4020==1)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                        }
                        if (contC4020==2)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                        }
                        if (contC4020==3)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                        }
                        if (contC4020>3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                        }
                        }

                         ////////// Campo ["C 40 hasta 21 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4021 = _.sortBy(ModalidadTodasconOrdenC4021, 'Destino','Origen','["C 40 hasta 21 Ton"]');

                    var contC4021=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4021.length-1; i++){

                          if (i==0)
                          {
                             contC4021= contC4021 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4021[i].Destino == ModalidadTodasconOrdenC4021[i-1].Destino) && (ModalidadTodasconOrdenC4021[i].Origen == ModalidadTodasconOrdenC4021[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4021[i]["C 40 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenC4021[i-1]["C 40 hasta 21 Ton"]))
                                {
                                  contC4021= contC4021;
                                }
                                else
                                {
                                  contC4021=contC4021 + 1;
                                }
                              }
                             else
                              {
                               contC4021=1;
                              }

                          }


                        if (contC4021==1)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                        }
                        if (contC4021==2)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                        }
                        if (contC4021==3)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                        }
                        if (contC4021>3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                        }
                        }

                     ////////// Campo ["C 40 hasta 22 Ton"]////////////////////////////

                    ModalidadTodasconOrdenC4022 = _.sortBy(ModalidadTodasconOrdenC4022, 'Destino','Origen','["C 40 hasta 22 Ton"]');

                      var contC4022=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4022.length-1; i++){

                          if (i==0)
                          {
                             contC4022= contC4022 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4022[i].Destino == ModalidadTodasconOrdenC4022[i-1].Destino) && (ModalidadTodasconOrdenC4022[i].Origen == ModalidadTodasconOrdenC4022[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4022[i]["C 40 hasta 21 Ton"]) == parseFloat(ModalidadTodasconOrdenC4022[i-1]["C 40 hasta 22 Ton"]))
                                {
                                  contC4022= contC4022;
                                }
                                else
                                {
                                  contC4022=contC4022 + 1;
                                }
                              }
                             else
                              {
                               contC4022=1;
                              }

                          }


                        if (contC4022==1)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-success"];
                        }
                        if (contC4022==2)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-warning"];
                        }
                        if (contC4022==3)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-danger"];
                        }
                        if (contC4022>3)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                        }
                        }

                       ////////// Campo ["C 40 hasta 30 Ton"]////////////////////////////

                   ModalidadTodasconOrdenC4030 = _.sortBy(ModalidadTodasconOrdenC4030, 'Destino','Origen','["C 40 hasta 30 Ton"]');

                    var contC4030=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC4030.length-1; i++){

                          if (i==0)
                          {
                             contC4030= contC4030 + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC4030[i].Destino == ModalidadTodasconOrdenC4030[i-1].Destino) && (ModalidadTodasconOrdenC4030[i].Origen == ModalidadTodasconOrdenC4030[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC4030[i]["C 40 hasta 30 Ton"]) == parseFloat(ModalidadTodasconOrdenC4030[i-1]["C 40 hasta 30 Ton"]))
                                {
                                  contC4030= contC4030;
                                }
                                else
                                {
                                  contC4030=contC4030 + 1;
                                }
                              }
                             else
                              {
                               contC4030=1;
                              }

                          }


                        if (contC4030==1)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-success"];
                        }
                        if (contC4030==2)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-warning"];
                        }
                        if (contC4030==3)
                        {
                               ModalidadTodasconOrdenC4030[i].AduC4030Pintada = ["label label-danger"];
                        }
                        if (contC4030>3)
                        {
                          ModalidadTodasconOrdenC4030[i].AduC4030Pintada = [];
                        }
                        }

                     ////////// Campo ["Devolucion 20$ estandar"]////////////////////////////

                    ModalidadTodasconOrdenC20EST  = _.sortBy(ModalidadTodasconOrdenC20EST , 'Destino','Origen','["Devolucion 20$ estandar"]');

                     var contC20EST=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC20EST.length-1; i++){

                          if (i==0)
                          {
                             contC20EST= contC20EST + 1;
                          }
                         else
                          {
                             if((ModalidadTodasconOrdenC20EST[i].Destino == ModalidadTodasconOrdenC20EST[i-1].Destino) && (ModalidadTodasconOrdenC20EST[i].Origen == ModalidadTodasconOrdenC20EST[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC20EST[i]["Devolucion 20$ estandar"]) == parseFloat(ModalidadTodasconOrdenC20EST[i-1]["Devolucion 20$ estandar"]))
                                {
                                  contC20EST= contC20EST;
                                }
                                else
                                {
                                  contC20EST=contC20EST + 1;
                                }
                              }
                             else
                              {
                               contC20EST=1;
                              }

                          }


                        if (contC20EST==1)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-success"];
                        }
                        if (contC20EST==2)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-warning"];
                        }
                        if (contC20EST==3)
                        {
                               ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = ["label label-danger"];
                        }
                        if (contC20EST>3)
                        {
                          ModalidadTodasconOrdenC20EST[i].AduC20ESTPintada = [];
                        }
                        }

                       ////////// Campo ["Devolucion 40$ estandar"]////////////////////////////

                    ModalidadTodasconOrdenC40EST = _.sortBy(ModalidadTodasconOrdenC40EST, 'Destino','Origen','["Devolucion 40$ estandar"]');

                      var contC40EST=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC40EST.length-1; i++){

                          if (i==0)
                          {
                             contC40EST= contC40EST + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC40EST[i].Destino == ModalidadTodasconOrdenC40EST[i-1].Destino) && (ModalidadTodasconOrdenC40EST[i].Origen == ModalidadTodasconOrdenC40EST[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC40EST[i]["Devolucion 40$ estandar"]) == parseFloat(ModalidadTodasconOrdenC40EST[i-1]["Devolucion 40$ estandar"]))
                                {
                                  contC40EST= contC40EST;
                                }
                                else
                                {
                                  contC40EST=contC40EST + 1;
                                }
                              }
                             else
                              {
                               contC40EST=1;
                              }

                          }


                        if (contC40EST==1)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-success"];
                        }
                        if (contC40EST==2)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-warning"];
                        }
                        if (contC40EST==3)
                        {
                               ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = ["label label-danger"];
                        }
                        if (contC40EST>3)
                        {
                          ModalidadTodasconOrdenC40EST[i].AduC40ESTPintada = [];
                        }
                        }

                        ///// Campo ["Devolucion 20$ expreso"]////////////////////////////

                     ModalidadTodasconOrdenC20ESP  = _.sortBy(ModalidadTodasconOrdenC20ESP , 'Destino','Origen','["Devolucion 20$ expreso"]');

                     var contC20ESP=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC20ESP.length-1; i++){

                          if (i==0)
                          {
                             contC20ESP= contC20ESP + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC20ESP[i].Destino == ModalidadTodasconOrdenC20ESP[i-1].Destino) && (ModalidadTodasconOrdenC20ESP[i].Origen == ModalidadTodasconOrdenC20ESP[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC20ESP[i]["Devolucion 20$ expreso"]) == parseFloat(ModalidadTodasconOrdenC20ESP[i-1]["Devolucion 20$ expreso"]))
                                {
                                  contC20ESP= contC20ESP;
                                }
                                else
                                {
                                  contC20ESP=contC20ESP + 1;
                                }
                              }
                             else
                              {
                               contC20ESP=1;
                              }

                          }


                        if (contC20ESP==1)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-success"];
                        }
                        if (contC20ESP==2)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-warning"];
                        }
                        if (contC20ESP==3)
                        {
                               ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = ["label label-danger"];
                        }
                        if (contC20ESP>3)
                        {
                          ModalidadTodasconOrdenC20ESP[i].AduC20ESPPintada = [];
                        }
                        }

                          ///// Campo ["Devolucion 40$ expreso"]////////////////////////////

                      ModalidadTodasconOrdenC40ESP  = _.sortBy(ModalidadTodasconOrdenC40ESP , 'Destino','Origen','["Devolucion 40$ expreso"]');

                     var contC40ESP=0;
                       for (var i=0; i<=ModalidadTodasconOrdenC40ESP.length-1; i++){

                          if (i==0)
                          {
                             contC40ESP= contC40ESP + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenC40ESP[i].Destino == ModalidadTodasconOrdenC40ESP[i-1].Destino) && (ModalidadTodasconOrdenC40ESP[i].Origen == ModalidadTodasconOrdenC40ESP[i-1].Origen))
                              {
                                if(parseFloat(ModalidadTodasconOrdenC40ESP[i]["Devolucion 40$ expreso"]) == parseFloat(ModalidadTodasconOrdenC40ESP[i-1]["Devolucion 40$ expreso"]))
                                {
                                  contC40ESP= contC40ESP;
                                }
                                else
                                {
                                  contC40ESP=contC40ESP + 1;
                                }
                              }
                             else
                              {
                               contC40ESP=1;
                              }

                          }


                        if (contC40ESP==1)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-success"];
                        }
                        if (contC40ESP==2)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-warning"];
                        }
                        if (contC40ESP==3)
                        {
                               ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = ["label label-danger"];
                        }
                        if (contC40ESP>3)
                        {
                          ModalidadTodasconOrdenC40ESP[i].AduC40ESPPintada = [];
                        }
                        }
                           var ModalidadTodasOTM=[];
                           ModalidadTodasOTM= _.sortBy(ModalidadTodas,'Destino','Origen','Email');

              /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasOTM;
                       $scope.ModalidadTodasOTM= ModalidadTodasOTM;

                       $scope.ModalidadTodasOTM = ModalidadTodasRespaldo.filter(function (el) {
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
                                el.AduC4020Pintada.length > 0 ||
                                el.AduC4030Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);



               }

            ////////////////////////////////////////////////////////////////////////////////////////////////
                    if (ModalidadConsolidado == 'MaritimasFCL') {
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

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden,'PuertoDestino','PuertoOrigen','PaisDestino','["C 20"]');

                      var cont=0;
                       for (var i=0; i<=ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrden[i].PuertoDestino == ModalidadTodasconOrden[i-1].PuertoDestino) && (ModalidadTodasconOrden[i].PuertoOrigen == ModalidadTodasconOrden[i-1].PuertoOrigen) && (ModalidadTodasconOrden[i].PaisDestino == ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrden[i]["C 20"]) == parseFloat(ModalidadTodasconOrden[i-1]["C 20"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["Baf 20"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima, 'PuertoDestino','PuertoOrigen','PaisDestino', '["Baf 20"]');

                      var contmin=0;
                       for (var i=0; i<=ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenMinima[i].PuertoDestino == ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && (ModalidadTodasconOrdenMinima[i].PuertoOrigen == ModalidadTodasconOrdenMinima[i-1].PuertoOrigen) && (ModalidadTodasconOrdenMinima[i].PaisDestino == ModalidadTodasconOrdenMinima[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrdenMinima[i]["Baf 20"]) == parseFloat(ModalidadTodasconOrdenMinima[i-1]["Baf 20"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }

                  ////////// Campo ["C 40"]///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PuertoOrigen','PaisDestino','["C 40"]');

                       var contGA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenGA.length-1; i++){

                        if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenGA[i].PuertoDestino == ModalidadTodasconOrdenGA[i-1].PuertoDestino) && (ModalidadTodasconOrdenGA[i].PuertoOrigen == ModalidadTodasconOrdenGA[i-1].PuertoOrigen) && (ModalidadTodasconOrdenGA[i].PaisDestino == ModalidadTodasconOrdenGA[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrdenGA[i]["C 40"]) == parseFloat(ModalidadTodasconOrdenGA[i-1]["C 40"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["Baf 40"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PuertoOrigen','PaisDestino','["Baf 40"]');
                       var contCA=0;
                       for (var i=0; i<=ModalidadTodasconOrdenCA.length-1; i++){

                         if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if((ModalidadTodasconOrdenCA[i].PuertoDestino == ModalidadTodasconOrdenCA[i-1].PuertoDestino) && (ModalidadTodasconOrdenCA[i].PuertoOrigen == ModalidadTodasconOrdenCA[i-1].PuertoOrigen) && (ModalidadTodasconOrdenCA[i].PaisDestino == ModalidadTodasconOrdenCA[i-1].PaisDestino))
                              {
                                if(parseFloat(ModalidadTodasconOrdenCA[i]["Baf 40"]) == parseFloat(ModalidadTodasconOrdenCA[i-1]["Baf 40"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ["C 40HC"]

                  ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["C 40HC"]');

                       var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAII[i].PuertoDestino ==  ModalidadTodasconOrdenGAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAII[i].PuertoOrigen ==  ModalidadTodasconOrdenGAII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGAII[i].PaisDestino ==  ModalidadTodasconOrdenGAII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAII[i]["C 40HC"]) == parseFloat( ModalidadTodasconOrdenGAII[i-1]["C 40HC"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }

                       ////////// Campo ["Baf 40HC"]

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["Baf 40HC"]');

                        var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                         if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].PuertoDestino ==  ModalidadTodasconOrdenCAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAII[i].PuertoOrigen ==  ModalidadTodasconOrdenCAII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCAII[i].PaisDestino ==  ModalidadTodasconOrdenCAII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]["Baf 40HC"]) == parseFloat( ModalidadTodasconOrdenCAII[i-1]["Baf 40HC"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }



                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }

                      ////////// Campo Naviera

                    ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'PuertoDestino','PuertoOrigen','PaisDestino','Naviera');

                      var contGAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIII[i].PuertoDestino ==  ModalidadTodasconOrdenGAIII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAIII[i].PuertoOrigen ==  ModalidadTodasconOrdenGAIII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGAIII[i].PaisDestino ==  ModalidadTodasconOrdenGAIII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIII[i].Naviera) == parseFloat( ModalidadTodasconOrdenGAIII[i-1].Naviera))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }


                   ////////// Campo ["Gastos Embarque"]

                   ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'PuertoDestino','PuertoOrigen','PaisDestino','["Gastos Embarque"]');

                    var contCAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIII.length-1; i++){

                          if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIII[i].PuertoDestino ==  ModalidadTodasconOrdenCAIII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAIII[i].PuertoOrigen ==  ModalidadTodasconOrdenCAIII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCAIII[i].PaisDestino ==  ModalidadTodasconOrdenCAIII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIII[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCAIII[i-1]["Gastos Embarque"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }

                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                        }
                        }



                          ////////// Campo ["C 20 + Baf 20 + Gastos Embarque"]

                   ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC,'PuertoDestino','PuertoOrigen','PaisDestino','["C 20 + Baf 20 + Gastos Embarque"]');

                     var contCPC=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPC.length-1; i++){

                         if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPC[i].PuertoDestino ==  ModalidadTodasconOrdenCPC[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCPC[i].PuertoOrigen ==  ModalidadTodasconOrdenCPC[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCPC[i].PaisDestino ==  ModalidadTodasconOrdenCPC[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPC[i]["C 20 + Baf 20 + Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCPC[i-1]["C 20 + Baf 20 + Gastos Embarque"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                        }
                        }

                   ////////// Campo ["C 40 + Baf 40 + Gastos Embarque"]////////////////////////////

                    ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros, 'PuertoDestino','PuertoOrigen','PaisDestino','["C 40 + Baf 40 + Gastos Embarque"]');

                    var contOTRO=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotros.length-1; i++){

                       if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotros[i].PuertoDestino ==  ModalidadTodasconOrdenotros[i-1].PuertoDestino) && ( ModalidadTodasconOrdenotros[i].PuertoOrigen ==  ModalidadTodasconOrdenotros[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenotros[i].PaisDestino ==  ModalidadTodasconOrdenotros[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotros[i]["C 40 + Baf 40 + Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenotros[i-1]["C 40 + Baf 40 + Gastos Embarque"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                        }
                        }

                  ////////// ["C 40HC + Baf 40HC + Gastos Embarque"]////////////////////////////

                     ModalidadTodasconOrdenC4017 = _.sortBy(ModalidadTodasconOrdenC4017,'PuertoDestino','PuertoOrigen','PaisDestino','["C 40HC + Baf 40HC + Gastos Embarque"]');

                       var contC4017=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017[i].PuertoDestino ==  ModalidadTodasconOrdenC4017[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4017[i].PuertoOrigen ==  ModalidadTodasconOrdenC4017[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenC4017[i].PaisDestino ==  ModalidadTodasconOrdenC4017[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017[i]["C 40HC + Baf 40HC + Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenC4017[i-1]["C 40HC + Baf 40HC + Gastos Embarque"]))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                        }
                        }

                  /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PuertoOrigen','PaisDestino','Email');
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
                                el.AduC2021Pintada.length > 0 ||
                                el.AduC4015Pintada.length > 0 ||
                                el.AduC4016Pintada.length > 0 ||
                                el.AduC4017Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);

                   }


                        ////////////////////////////////
                    if (ModalidadConsolidado == 'MaritimasLCL') {

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

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden, 'PuertoDestino','PuertoOrigen','PaisDestino','Minima');
                     console.log(ModalidadTodasconOrden);

                      var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                         if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PuertoOrigen ==  ModalidadTodasconOrden[i-1].PuertoOrigen) && ( ModalidadTodasconOrden[i].PaisDestino ==  ModalidadTodasconOrden[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i].Minima) == parseFloat( ModalidadTodasconOrden[i-1].Minima))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["1-5 ton/M3"] ////////////////////////////////////

                   ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima, 'PuertoDestino','PuertoOrigen','PaisDestino','["1-5 ton/M3"]');
                   console.log(ModalidadTodasconOrdenMinima);

                     var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinima[i].PuertoDestino ==  ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PuertoOrigen ==  ModalidadTodasconOrdenMinima[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenMinima[i].PaisDestino ==  ModalidadTodasconOrdenMinima[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinima[i]["1-5 ton/M3"]) == parseFloat( ModalidadTodasconOrdenMinima[i-1]["1-5 ton/M3"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }
                  ////////// Campo ["5-8 ton/M3"]///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PuertoOrigen','PaisDestino','["5-8 ton/M3"]');

                   var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGA[i].PuertoOrigen ==  ModalidadTodasconOrdenGA[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGA[i].PaisDestino ==  ModalidadTodasconOrdenGA[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i]["5-8 ton/M3"]) == parseFloat( ModalidadTodasconOrdenGA[i-1]["5-8 ton/M3"]))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["8-12 ton/M3"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PuertoOrigen','PaisDestino','["8-12 ton/M3"]');
                     var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                         if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PuertoOrigen ==  ModalidadTodasconOrdenCA[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCA[i].PaisDestino ==  ModalidadTodasconOrdenCA[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["8-12 ton/M3"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["8-12 ton/M3"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ["12-18 ton/M3"]

                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["12-18 ton/M3"]');

                     var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PuertoOrigen ==  ModalidadTodasconOrdenCA[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCA[i].PaisDestino ==  ModalidadTodasconOrdenCA[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["12-18 ton/M3"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["12-18 ton/M3"]))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }

                       ////////// Campo ["Gastos Embarque"]

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'PuertoDestino','PuertoOrigen','PaisDestino','["Gastos Embarque"]');

                     var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                          if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].PuertoDestino ==  ModalidadTodasconOrdenCAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAII[i].PuertoOrigen ==  ModalidadTodasconOrdenCAII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenCAII[i].PaisDestino ==  ModalidadTodasconOrdenCAII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCAII[i-1]["Gastos Embarque"]))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }

                      ////////// Campo Naviera

                   ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII, 'PuertoDestino','PuertoOrigen','PaisDestino','Naviera');

                    var contGAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIII[i].PuertoDestino ==  ModalidadTodasconOrdenGAIII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAIII[i].PuertoOrigen ==  ModalidadTodasconOrdenGAIII[i-1].PuertoOrigen) && ( ModalidadTodasconOrdenGAIII[i].PaisDestino ==  ModalidadTodasconOrdenGAIII[i-1].PaisDestino))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIII[i].Naviera) == parseFloat( ModalidadTodasconOrdenGAIII[i-1].Naviera))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }

                        /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PuertoOrigen','PaisDestino','Email');
                       ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodas= ModalidadTodas;
                       $scope.ModalidadTodas = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                el.AduC2010Pintada.length > 0 ||
                                el.AduC2017Pintada.length > 0 ||
                                el.AduC2019Pintada.length > 0 ||
                                el.AduC2020Pintada.length > 0 ||
                                el.AduC2021Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);

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



                       angular.forEach($scope.ConsolidadoDatos, function(consterrenacional) {
                         ModalidadDeUnProveedor = consterrenacional.TerreNacional.TerresNacional
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterrenacionalprov) {
                              consterrenacionalprov.Email = consterrenacional.Email
                              ModalidadTodas.push(consterrenacionalprov);
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

                         ModalidadTodas = _.sortBy(ModalidadTodas, 'PuertoDestino','PaisOrigen');
                         console.log(ModalidadTodas);


                         ////////  Campo ["Turbo Standar (150Cajas)"] //////////////////////////

                     ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden, 'PuertoDestino','PaisOrigen','["Turbo Standar (150Cajas)"]');

                     var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PaisOrigen ==  ModalidadTodasconOrden[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i]["Turbo Standar (150Cajas)"]) == parseFloat( ModalidadTodasconOrden[i-1]["Turbo Standar (150Cajas)"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["Turbo Especial"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima, 'PuertoDestino','PaisOrigen','["Turbo Especial"]');

                     var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinima.length-1; i++){

                         if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinima[i].PuertoDestino ==  ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinima[i]["Turbo Especial"]) == parseFloat( ModalidadTodasconOrdenMinima[i-1]["Turbo Especial"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }

                         ModalidadTodas= _.sortBy(ModalidadTodas,'PuertoDestino','PaisOrigen','Email');
                         $scope.ModalidadTodasTerreNacionalTurbo=ModalidadTodas;


                          /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodas;
                       $scope.ModalidadTodasTerreNacionalTurbo= ModalidadTodas;
                       $scope.ModalidadTodasTerreNacionalTurbo = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
                                 el.AduC8Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });
                console.log($scope.ModalidadTodas);


                       //Terrestre Nacional Sencillo

                        angular.forEach($scope.ConsolidadoDatos, function(consterrenacionalsenc) {
                         ModalidadDeUnProveedor = consterrenacionalsenc.TerreNacionalSencillo.TerresNacionalSencillo
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterrenacionalsencprov) {
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

                     ModalidadTodasconOrdenGAS = _.sortBy(ModalidadTodasconOrdenGAS,'PuertoDestino','PaisOrigen','["Sencillo Standar (150Cajas)"]');
                     console.log(ModalidadTodasconOrdenGA);
                     var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                             console.log('Es igual a cero');
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAS[i].PuertoDestino ==  ModalidadTodasconOrdenGAS[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAS[i].PaisOrigen ==  ModalidadTodasconOrdenGAS[i-1].PaisOrigen))
                              {
                               console.log('Puerto igual');
                                if(parseFloat( ModalidadTodasconOrdenGAS[i]["Sencillo Standar (150Cajas)"]) == parseFloat( ModalidadTodasconOrdenGAS[i-1]["Sencillo Standar (150Cajas)"]))
                                {
                                  contGA= contGA;
                                  console.log('numero igual');
                                  console.log(contGA);
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                  console.log('numero diferete');
                                  console.log(contGA);
                                }
                              }
                             else
                              {
                               contGA=1;
                               console.log('Puerto diferete');
                               console.log(contGA);
                              }

                          }



                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-success"];
                               console.log('verde');
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-warning"];
                               console.log('amarillo');
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGAS[i].AduC2010Pintada = ["label label-danger"];
                               console.log('rojo');
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGAS[i].AduC2010Pintada = [];
                          console.log('blanco');
                        }
                        }

                    ////////// Campo Sencillo Especial

                     ModalidadTodasconOrdenCAS = _.sortBy(ModalidadTodasconOrdenCAS, 'PuertoDestino','PaisOrigen','["Sencillo Especial"]');

                     var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                         if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAS[i].PuertoDestino ==  ModalidadTodasconOrdenCAS[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAS[i].PaisOrigen ==  ModalidadTodasconOrdenCAS[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAS[i]["Sencillo Especial"]) == parseFloat( ModalidadTodasconOrdenCAS[i-1]["Sencillo Especial"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCAS[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCAS[i].AduC2017Pintada = [];
                        }
                        }

                        ModalidadTodasTerreNacionalSencillo= _.sortBy(ModalidadTodasTerreNacionalSencillo,'PuertoDestino','PaisOrigen','Email');
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
                         ModalidadDeUnProveedor = consterrenacionalpat.TerreNacionalPatineta.TerresNacionalPatineta
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterrenacionalpatprov) {
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

                  ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PaisOrigen','Minimula');

                     var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                           if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGA[i].PaisOrigen ==  ModalidadTodasconOrdenGA[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i].Minimula) == parseFloat( ModalidadTodasconOrdenGA[i-1].Minimula))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2019Pintada = [];
                        }
                        }

                    ////////// Campo ["Gran Danes"]

                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PaisOrigen','["Gran Danes"]');

                       var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCA[i].PaisOrigen ==  ModalidadTodasconOrdenCA[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["Gran Danes"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["Gran Danes"]))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }


                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2020Pintada = [];
                        }
                        }
                        
                        ModalidadTodasPatineta= _.sortBy(ModalidadTodasPatineta,'PuertoDestino','PaisOrigen','Email');
                        $scope.ModalidadTodasTerreNacionalPatineta=ModalidadTodasPatineta;

                        ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasPatineta;
                        $scope.ModalidadTodasTerreNacionalPatineta= ModalidadTodasPatineta;
                        $scope.ModalidadTodasTerreNacionalPatineta = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2019Pintada.length > 0 ||
                                 el.AduC2020Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });


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
                         ModalidadDeUnProveedor = consterreurbano.TerreUrbano.TerresUrbano
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterreurbanoprov) {
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

                     ModalidadTodasconOrden= _.sortBy(ModalidadTodasconOrden, 'PuertoDestino','PaisOrigen','["Turbo (150Cajas)"]');
                     console.log(ModalidadTodasconOrden);

                     var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                         if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].PuertoDestino ==  ModalidadTodasconOrden[i-1].PuertoDestino) && ( ModalidadTodasconOrden[i].PaisOrigen ==  ModalidadTodasconOrden[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i]["Turbo (150Cajas)"]) == parseFloat( ModalidadTodasconOrden[i-1]["Turbo (150Cajas)"]))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }


                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }



              ////////////////// ["Turbo Especial (200Cajas)"]////////////////////////////////////
                  ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'PuertoDestino','PaisOrigen', '["Turbo Especial (200Cajas)"]');

                       var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinima.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinima[i].PuertoDestino ==  ModalidadTodasconOrdenMinima[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinima[i]["Turbo Especial (200Cajas)"]) == parseFloat( ModalidadTodasconOrdenMinima[i-1]["Turbo Especial (200Cajas)"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }


                  ////////// Campo ["Sencillo (240Cajas)"]///////////////////////////////

                    ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'PuertoDestino','PaisOrigen','["Sencillo (240Cajas)"]');

                     var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                           if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].PuertoDestino ==  ModalidadTodasconOrdenGA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i]["Sencillo (240Cajas)"]) == parseFloat( ModalidadTodasconOrdenGA[i-1]["Sencillo (240Cajas)"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }


                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ["Sencillo Especial (300Cajas)"]
                    ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA, 'PuertoDestino','PaisOrigen','["Sencillo Especial (300Cajas)"]');
                     var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                          if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].PuertoDestino ==  ModalidadTodasconOrdenCA[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]["Sencillo Especial (300Cajas)"]) == parseFloat( ModalidadTodasconOrdenCA[i-1]["Sencillo Especial (300Cajas)"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }
                      ////////// Campo ["C 40HC"] Minimula

                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII,'PuertoDestino','PaisOrigen','Minimula');

                    var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAII.length-1; i++){

                          if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAII[i].PuertoDestino ==  ModalidadTodasconOrdenGAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAII[i].Minimula) == parseFloat( ModalidadTodasconOrdenGAII[i-1].Minimula))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }
                       ////////// Campo ["Gran Danes"]

                     ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII, 'PuertoDestino','PaisOrigen','["Gran Danes"]');

                      var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                         if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].PuertoDestino ==  ModalidadTodasconOrdenCAII[i-1].PuertoDestino) && ( ModalidadTodasconOrdenMinima[i].PaisOrigen ==  ModalidadTodasconOrdenMinima[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]["Gran Danes"]) == parseFloat( ModalidadTodasconOrdenCAII[i-1]["Gran Danes"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }
                        
                        ModalidadTodasUrbano= _.sortBy(ModalidadTodasUrbano,'PuertoDestino','PaisOrigen','Email');
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
                         ModalidadDeUnProveedor = consterreurbanoviaj.TerreUrbanoViaje.TerresUrbanoViaje
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterreurbanoviajprov) {
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

                       ModalidadTodasconOrdenGAIIIv = _.sortBy(ModalidadTodasconOrdenGAIIIv,'PuertoDestino','PaisOrigen','["Turbo (150Cajas)"]');

                     var contGAIIIv=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIIv.length-1; i++){

                         if (i==0)
                          {
                             contGAIIIv= contGAIIIv + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIIIv[i].PuertoDestino ==  ModalidadTodasconOrdenGAIIIv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenGAIIIv[i].PaisOrigen ==  ModalidadTodasconOrdenGAIIIv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIIIv[i]["Turbo (150Cajas)"]) == parseFloat( ModalidadTodasconOrdenGAIIIv[i-1]["Turbo (150Cajas)"]))
                                {
                                  contGAIIIv= contGAIIIv;
                                }
                                else
                                {
                                  contGAIIIv=contGAIIIv + 1;
                                }
                              }
                             else
                              {
                               contGAIIIv=1;
                              }

                          }


                        if (contGAIIIv==1)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-success"];
                        }
                        if (contGAIIIv==2)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-warning"];
                        }
                        if (contGAIIIv==3)
                        {
                               ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = ["label label-danger"];
                        }
                        if (contGAIIIv>3)
                        {
                          ModalidadTodasconOrdenGAIIIv[i].AduC2021vPintada = [];
                        }
                        }


                   ////////// Campo ["Turbo Especial (200Cajas)"]

                     ModalidadTodasconOrdenCAIIIv = _.sortBy(ModalidadTodasconOrdenCAIIIv, 'PuertoDestino','PaisOrigen','["Turbo Especial (200Cajas)"]');

                      var contCAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIIv.length-1; i++){

                           if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIIIv[i].PuertoDestino ==  ModalidadTodasconOrdenCAIIIv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCAIIIv[i].PaisOrigen ==  ModalidadTodasconOrdenCAIIIv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIIIv[i]["Turbo Especial (200Cajas)"]) == parseFloat( ModalidadTodasconOrdenCAIIIv[i-1]["Turbo Especial (200Cajas)"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }


                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIIIv[i].AduC2025vPintada = [];
                        }
                        }



                          ////////// Campo ["Sencillo (240Cajas)"]


              ModalidadTodasconOrdenCPCv = _.sortBy(ModalidadTodasconOrdenCPCv, 'PuertoDestino','PaisOrigen','["Sencillo (240Cajas)"]');

                       var contCPC=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPCv.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPCv[i].PuertoDestino ==  ModalidadTodasconOrdenCPCv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenCPCv[i].PaisOrigen ==  ModalidadTodasconOrdenCPCv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPCv[i]["Sencillo (240Cajas)"]) == parseFloat( ModalidadTodasconOrdenCPCv[i-1]["Sencillo (240Cajas)"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPCv[i].AduC4015vPintada = [];
                        }
                        }

                   ////////// Campo ["Sencillo Especial (300Cajas)"]////////////////////////////

                    ModalidadTodasconOrdenotrosv = _.sortBy(ModalidadTodasconOrdenotrosv, 'PuertoDestino','PaisOrigen','["Sencillo Especial (300Cajas)"]');

                     var contOTRO=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotrosv.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotrosv[i].PuertoDestino ==  ModalidadTodasconOrdenotrosv[i-1].PuertoDestino) && ( ModalidadTodasconOrdenotrosv[i].PaisOrigen ==  ModalidadTodasconOrdenotrosv[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotrosv[i]["Sencillo Especial (300Cajas)"]) == parseFloat( ModalidadTodasconOrdenotrosv[i-1]["Sencillo Especial (300Cajas)"]))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotrosv[i].AduC4016vPintada = [];
                        }
                        }

                  ////////// Minimula////////////////////////////
                        ModalidadTodasconOrdenC4017v = _.sortBy(ModalidadTodasconOrdenC4017v, 'PuertoDestino','PaisOrigen','Minimula');

                     var contC4017=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017v.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017v[i].PuertoDestino ==  ModalidadTodasconOrdenC4017v[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4017v[i].PaisOrigen ==  ModalidadTodasconOrdenC4017v[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017v[i].Minimula) == parseFloat( ModalidadTodasconOrdenC4017v[i-1].Minimula))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017v[i].AduC4017vPintada = [];
                        }
                        }


                          ////////// ["Gran Danes"]////////////////////////////

                     ModalidadTodasconOrdenC401718v = _.sortBy(ModalidadTodasconOrdenC401718v,'PuertoDestino','PaisOrigen','["Gran Danes"]');

                        var contC401718=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718v.length-1; i++){

                          if (i==0)
                          {
                             contC401718= contC401718 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC401718v[i].PuertoDestino ==  ModalidadTodasconOrdenC401718v[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC401718v[i].PaisOrigen ==  ModalidadTodasconOrdenC401718v[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC401718v[i]["Gran Danes"]) == parseFloat( ModalidadTodasconOrdenC401718v[i-1]["Gran Danes"]))
                                {
                                  contC401718= contC401718;
                                }
                                else
                                {
                                  contC401718=contC401718 + 1;
                                }
                              }
                             else
                              {
                               contC401718=1;
                              }

                          }

                        if (contC401718==1)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-success"];
                        }
                        if (contC401718==2)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-warning"];
                        }
                        if (contC401718==3)
                        {
                               ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = ["label label-danger"];
                        }
                        if (contC401718>3)
                        {
                          ModalidadTodasconOrdenC401718v[i].AduC401718vPintada = [];
                        }
                        }

                         ModalidadTodasTerreUrbanoViaje= _.sortBy(ModalidadTodasTerreUrbanoViaje,'PuertoDestino','PaisOrigen','Email');

                        $scope.ModalidadTodasTerreUrbanoViaje=ModalidadTodasTerreUrbanoViaje;

                    ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasTerreUrbanoViaje;
                        $scope.ModalidadTodasTerreUrbanoViaje= ModalidadTodasTerreUrbanoViaje;
                        $scope.ModalidadTodasTerreUrbanoViaje = ModalidadTodasRespaldo.filter(function (el) {
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
                         ModalidadDeUnProveedor = consterreurbanoton.TerreUrbanoTonelada.TerresUrbanoTonelada
                         console.log( ModalidadDeUnProveedor);
                            angular.forEach(ModalidadDeUnProveedor, function(consterreurbanotonprov) {
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

                    ModalidadTodasconOrdenC4020 = _.sortBy(ModalidadTodasconOrdenC4020, 'PuertoDestino','PaisOrigen','Turbo');
                      var contC4020=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4020.length-1; i++){

                          if (i==0)
                          {
                             contC4020= contC4020 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4020[i].PuertoDestino ==  ModalidadTodasconOrdenC4020[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4020[i].PaisOrigen ==  ModalidadTodasconOrdenC4020[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4020[i].Turbo) == parseFloat( ModalidadTodasconOrdenC4020[i-1].Turbo))
                                {
                                  contC4020= contC4020;
                                }
                                else
                                {
                                  contC4020=contC4020 + 1;
                                }
                              }
                             else
                              {
                               contC4020=1;
                              }

                          }


                        if (contC4020==1)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                        }
                        if (contC4020==2)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                        }
                        if (contC4020==3)
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                        }
                        if (contC4020>3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                        }
                        }

                         ////////// Campo Sencillo////////////////////////////

                    ModalidadTodasconOrdenC4021 = _.sortBy(ModalidadTodasconOrdenC4021, 'PuertoDestino','PaisOrigen','Sencillo');

                     var contC4021=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4021.length-1; i++){

                           if (i==0)
                          {
                             contC4021= contC4021 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4021[i].PuertoDestino ==  ModalidadTodasconOrdenC4021[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4021[i].PaisOrigen ==  ModalidadTodasconOrdenC4021[i-1].PaisOrigen))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4021[i].Sencillo) == parseFloat( ModalidadTodasconOrdenC4021[i-1].Sencillo))
                                {
                                  contC4021= contC4021;
                                }
                                else
                                {
                                  contC4021=contC4021 + 1;
                                }
                              }
                             else
                              {
                               contC4021=1;
                              }

                          }



                        if (contC4021==1)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                        }
                        if (contC4021==2)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                        }
                        if (contC4021==3)
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                        }
                        if (contC4021>3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                        }
                        }

                     ////////// Campo Tractomula////////////////////////////

                     ModalidadTodasconOrdenC4022 = _.sortBy(ModalidadTodasconOrdenC4022, 'PuertoDestino','PaisOrigen','Tractomula');
                     console.log(ModalidadTodasconOrdenC4022);

                     var contC4022=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4022.length-1; i++){

                          if (i==0)
                          {
                             contC4022= contC4022 + 1;
                             console.log(' es cero verde');
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4022[i].PuertoDestino ==  ModalidadTodasconOrdenC4022[i-1].PuertoDestino) && ( ModalidadTodasconOrdenC4022[i].PaisOrigen ==  ModalidadTodasconOrdenC4022[i-1].PaisOrigen))
                              {
                                console.log('Via igual');
                                if(parseFloat( ModalidadTodasconOrdenC4022[i].Tractomula) == parseFloat( ModalidadTodasconOrdenC4022[i-1].Tractomula))
                                {
                                  console.log('campo igual');
                                  contC4022= contC4022;
                                  console.log(contC4022);
                                }
                                else
                                {
                                  contC4022=contC4022 + 1;
                                  console.log('campo difere');
                                  console.log(contC4022);
                                }
                              }
                             else
                              {
                               contC4022=1;
                               console.log('via diferen difere');
                                  console.log(contC4022);
                              }

                          }


                        if (contC4022==1)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-success"];
                        }
                        if (contC4022==2)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-warning"];
                        }
                        if (contC4022==3)
                        {
                               ModalidadTodasconOrdenC4022[i].AduC4022Pintada = ["label label-danger"];
                        }
                        if (contC4022>3)
                        {
                          ModalidadTodasconOrdenC4022[i].AduC4022Pintada = [];
                        }
                        }
                      
                      ModalidadTodasTerreUrbanoTonelada = _.sortBy(ModalidadTodasTerreUrbanoTonelada, 'PuertoDestino','PaisOrigen','Email');
                      $scope.ModalidadTodasTerreUrbanoTonelada= ModalidadTodasTerreUrbanoTonelada;

                     ////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasTerreUrbanoTonelada;
                        $scope.ModalidadTodasTerreUrbanoTonelada= ModalidadTodasTerreUrbanoTonelada;
                        $scope.ModalidadTodasTerreUrbanoTonelada = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC4020Pintada.length > 0 ||
                                 el.AduC4021Pintada.length > 0 ||
                                 el.AduC4022Pintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });

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
                         ModalidadDeUnProveedor = consotm.Aerea.Aereas
                            angular.forEach(ModalidadDeUnProveedor, function(consotmprov) {
                              consotmprov.Email = consotm.Email
                              ModalidadTodasAerea.push(consotmprov);
                              ModalidadTodasconOrden =ModalidadTodasAerea;
                              ModalidadTodasconOrdenMinima = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGAII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenGAIII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCA = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCAII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCAIII = ModalidadTodasAerea;
                              ModalidadTodasconOrdenCPC = ModalidadTodasAerea;
                              ModalidadTodasconOrdenotros = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4017 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC401718 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4020 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4021 =ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4022 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC4030 = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC20EST = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC40EST = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC20ESP = ModalidadTodasAerea;
                              ModalidadTodasconOrdenC40ESP = ModalidadTodasAerea;

                            });
                        });

                        ModalidadTodasAerea = _.sortBy(ModalidadTodasAerea,'Aeropuerto','Pais');
                         console.log(ModalidadTodasAerea);


                         ////////  Campo Minima //////////////////////////

                    ModalidadTodasconOrden = _.sortBy(ModalidadTodasconOrden,'Aeropuerto','Pais','Minima');

                    var cont=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             cont= cont + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].Aeropuerto ==  ModalidadTodasconOrden[i-1].Aeropuerto) && ( ModalidadTodasconOrden[i].Pais ==  ModalidadTodasconOrden[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i].Minima) == parseFloat( ModalidadTodasconOrden[i-1].Minima))
                                {
                                  cont= cont;
                                }
                                else
                                {
                                  cont=cont + 1;
                                }
                              }
                             else
                              {
                               cont=1;
                              }

                          }

                        if (cont==1)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-success"];
                        }
                        if (cont==2)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-warning"];
                        }
                        if (cont==3)
                        {
                               ModalidadTodasconOrden[i].AduC2045Pintada = ["label label-danger"];
                        }
                        if (cont>3)
                        {
                          ModalidadTodasconOrden[i].AduC2045Pintada = [];
                        }
                        }

              ////////////////// ["45"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinima = _.sortBy(ModalidadTodasconOrdenMinima,'Aeropuerto','Pais', '["45"]');
                    var contmin=0;
                       for (var i=0; i<= ModalidadTodasconOrden.length-1; i++){

                          if (i==0)
                          {
                             contmin= contmin + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrden[i].Aeropuerto ==  ModalidadTodasconOrden[i-1].Aeropuerto) && ( ModalidadTodasconOrden[i].Pais ==  ModalidadTodasconOrden[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrden[i]["45"]) == parseFloat( ModalidadTodasconOrden[i-1]["45"]))
                                {
                                  contmin= contmin;
                                }
                                else
                                {
                                  contmin=contmin + 1;
                                }
                              }
                             else
                              {
                               contmin=1;
                              }

                          }


                        if (contmin==1)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-success"];
                        }
                        if (contmin==2)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-warning"];
                        }
                        if (contmin==3)
                        {
                               ModalidadTodasconOrdenMinima[i].AduC8Pintada = ["label label-danger"];
                        }
                        if (contmin>3)
                        {
                          ModalidadTodasconOrdenMinima[i].AduC8Pintada = [];
                        }
                        }

                  ////////// Campo ['+100'] ///////////////////////////////
                  ModalidadTodasconOrdenGA = _.sortBy(ModalidadTodasconOrdenGA, 'Aeropuerto','Pais',"['+100']");

                      var contGA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGA.length-1; i++){

                          if (i==0)
                          {
                             contGA= contGA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGA[i].Aeropuerto ==  ModalidadTodasconOrdenGA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGA[i].Pais ==  ModalidadTodasconOrdenGA[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGA[i]['+100']) == parseFloat( ModalidadTodasconOrdenGA[i-1]['+100']))
                                {
                                  contGA= contGA;
                                }
                                else
                                {
                                  contGA=contGA + 1;
                                }
                              }
                             else
                              {
                               contGA=1;
                              }

                          }

                        if (contGA==1)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-success"];
                        }
                        if (contGA==2)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-warning"];
                        }
                        if (contGA==3)
                        {
                               ModalidadTodasconOrdenGA[i].AduC2010Pintada = ["label label-danger"];
                        }
                        if (contGA>3)
                        {
                          ModalidadTodasconOrdenGA[i].AduC2010Pintada = [];
                        }
                        }


                    ////////// Campo ['+300']

                   ModalidadTodasconOrdenCA = _.sortBy(ModalidadTodasconOrdenCA,'Aeropuerto','Pais', "['+300']");
                       var contCA=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCA.length-1; i++){

                           if (i==0)
                          {
                             contCA= contCA + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCA[i].Aeropuerto ==  ModalidadTodasconOrdenCA[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCA[i].Pais ==  ModalidadTodasconOrdenCA[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCA[i]['+300']) == parseFloat( ModalidadTodasconOrdenCA[i-1]['+300']))
                                {
                                  contCA= contCA;
                                }
                                else
                                {
                                  contCA=contCA + 1;
                                }
                              }
                             else
                              {
                               contCA=1;
                              }

                          }

                        if (contCA==1)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-success"];
                        }
                        if (contCA==2)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-warning"];
                        }
                        if (contCA==3)
                        {
                               ModalidadTodasconOrdenCA[i].AduC2017Pintada = ["label label-danger"];
                        }
                        if (contCA>3)
                        {
                          ModalidadTodasconOrdenCA[i].AduC2017Pintada = [];
                        }
                        }

                      ////////// Campo ['+500']
                    ModalidadTodasconOrdenGAII = _.sortBy(ModalidadTodasconOrdenGAII, 'Aeropuerto','Pais',"['+500']");

                         var contGAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAII.length-1; i++){

                           if (i==0)
                          {
                             contGAII= contGAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAII[i].Aeropuerto ==  ModalidadTodasconOrdenGAII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAII[i].Pais ==  ModalidadTodasconOrdenGAII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAII[i]['+500']) == parseFloat( ModalidadTodasconOrdenGAII[i-1]['+500']))
                                {
                                  contGAII= contGAII;
                                }
                                else
                                {
                                  contGAII=contGAII + 1;
                                }
                              }
                             else
                              {
                               contGAII=1;
                              }

                          }


                        if (contGAII==1)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-success"];
                        }
                        if (contGAII==2)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-warning"];
                        }
                        if (contGAII==3)
                        {
                               ModalidadTodasconOrdenGAII[i].AduC2019Pintada = ["label label-danger"];
                        }
                        if (contGAII>3)
                        {
                          ModalidadTodasconOrdenGAII[i].AduC2019Pintada = [];
                        }
                        }
                       ////////// Campo ['+1000']

                    ModalidadTodasconOrdenCAII = _.sortBy(ModalidadTodasconOrdenCAII,'Aeropuerto','Pais', "['+1000']");

                            var contCAII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAII.length-1; i++){

                           if (i==0)
                          {
                             contCAII= contCAII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAII[i].Aeropuerto ==  ModalidadTodasconOrdenCAII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAII[i].Pais ==  ModalidadTodasconOrdenCAII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAII[i]['+1000']) == parseFloat( ModalidadTodasconOrdenCAII[i-1]['+1000']))
                                {
                                  contCAII= contCAII;
                                }
                                else
                                {
                                  contCAII=contCAII + 1;
                                }
                              }
                             else
                              {
                               contCAII=1;
                              }

                          }


                        if (contCAII==1)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-success"];
                        }
                        if (contCAII==2)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-warning"];
                        }
                        if (contCAII==3)
                        {
                               ModalidadTodasconOrdenCAII[i].AduC2020Pintada = ["label label-danger"];
                        }
                        if (contCAII>3)
                        {
                          ModalidadTodasconOrdenCAII[i].AduC2020Pintada = [];
                        }
                        }

                      ////////// Campo ["FS min"]

                   ModalidadTodasconOrdenGAIII = _.sortBy(ModalidadTodasconOrdenGAIII,'Aeropuerto','Pais', '["FS min"]');

                      var contGAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIII.length-1; i++){

                          if (i==0)
                          {
                             contGAIII= contGAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIII[i].Aeropuerto ==  ModalidadTodasconOrdenGAIII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAIII[i].Pais ==  ModalidadTodasconOrdenGAIII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIII[i]["FS min"]) == parseFloat( ModalidadTodasconOrdenGAIII[i-1]["FS min"]))
                                {
                                  contGAIII= contGAIII;
                                }
                                else
                                {
                                  contGAIII=contGAIII + 1;
                                }
                              }
                             else
                              {
                               contGAIII=1;
                              }

                          }


                        if (contGAIII==1)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-success"];
                        }
                        if (contGAIII==2)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-warning"];
                        }
                        if (contGAIII==3)
                        {
                               ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = ["label label-danger"];
                        }
                        if (contGAIII>3)
                        {
                          ModalidadTodasconOrdenGAIII[i].AduC2021Pintada = [];
                        }
                        }


                   ////////// Campo ["Fs/kg"]
                      ModalidadTodasconOrdenCAIII = _.sortBy(ModalidadTodasconOrdenCAIII, 'Aeropuerto','Pais','["Fs/kg"]');

                      var contCAIII=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIII.length-1; i++){

                            if (i==0)
                          {
                             contCAIII= contCAIII + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIII[i].Aeropuerto ==  ModalidadTodasconOrdenCAIII[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAIII[i].Pais ==  ModalidadTodasconOrdenCAIII[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIII[i]["Fs/kg"]) == parseFloat( ModalidadTodasconOrdenCAIII[i-1]["Fs/kg"]))
                                {
                                  contCAIII= contCAIII;
                                }
                                else
                                {
                                  contCAIII=contCAIII + 1;
                                }
                              }
                             else
                              {
                               contCAIII=1;
                              }

                          }


                        if (contCAIII==1)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-success"];
                        }
                        if (contCAIII==2)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-warning"];
                        }
                        if (contCAIII==3)
                        {
                               ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = ["label label-danger"];
                        }
                        if (contCAIII>3)
                        {
                          ModalidadTodasconOrdenCAIII[i].AduC2025Pintada = [];
                        }
                        }




                          ////////// Campo["Gastos Embarque"]

                   ModalidadTodasconOrdenCPC = _.sortBy(ModalidadTodasconOrdenCPC,'Aeropuerto','Pais','["Gastos Embarque"]');

                       var contCPC=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPC.length-1; i++){

                          if (i==0)
                          {
                             contCPC= contCPC + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPC[i].Aeropuerto ==  ModalidadTodasconOrdenCPC[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCPC[i].Pais ==  ModalidadTodasconOrdenCPC[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPC[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCPC[i-1]["Gastos Embarque"]))
                                {
                                  contCPC= contCPC;
                                }
                                else
                                {
                                  contCPC=contCPC + 1;
                                }
                              }
                             else
                              {
                               contCPC=1;
                              }

                          }


                        if (contCPC==1)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-success"];
                        }
                        if (contCPC==2)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-warning"];
                        }
                        if (contCPC==3)
                        {
                               ModalidadTodasconOrdenCPC[i].AduC4015Pintada = ["label label-danger"];
                        }
                        if (contCPC>3)
                        {
                          ModalidadTodasconOrdenCPC[i].AduC4015Pintada = [];
                        }
                        }

                   ////////// Campo Via////////////////////////////

                  ModalidadTodasconOrdenotros = _.sortBy(ModalidadTodasconOrdenotros ,'Aeropuerto','Pais','Via');

                       var contOTRO=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotros.length-1; i++){

                          if (i==0)
                          {
                             contOTRO= contOTRO + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotros[i].Aeropuerto ==  ModalidadTodasconOrdenotros[i-1].Aeropuerto) && ( ModalidadTodasconOrdenotros[i].Pais ==  ModalidadTodasconOrdenotros[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotros[i].Via) == parseFloat( ModalidadTodasconOrdenotros[i-1].Via))
                                {
                                  contOTRO= contOTRO;
                                }
                                else
                                {
                                  contOTRO=contOTRO + 1;
                                }
                              }
                             else
                              {
                               contOTRO=1;
                              }

                          }


                        if (contOTRO==1)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-success"];
                        }
                        if (contOTRO==2)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-warning"];
                        }
                        if (contOTRO==3)
                        {
                               ModalidadTodasconOrdenotros[i].AduC4016Pintada = ["label label-danger"];
                        }
                        if (contOTRO>3)
                        {
                          ModalidadTodasconOrdenotros[i].AduC4016Pintada = [];
                        }
                        }
                    ////////// Campo ['+100 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC4017 = _.sortBy(ModalidadTodasconOrdenC4017 ,'Aeropuerto','Pais',"['+100 + Fs/kg + Gastos Embarque']");

                       var contC4017=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017.length-1; i++){

                          if (i==0)
                          {
                             contC4017= contC4017 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017[i].Aeropuerto ==  ModalidadTodasconOrdenC4017[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4017[i].Pais ==  ModalidadTodasconOrdenC4017[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017[i]['+100 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC4017[i-1]['+100 + Fs/kg + Gastos Embarque']))
                                {
                                  contC4017= contC4017;
                                }
                                else
                                {
                                  contC4017=contC4017 + 1;
                                }
                              }
                             else
                              {
                               contC4017=1;
                              }

                          }


                        if (contC4017==1)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-success"];
                        }
                        if (contC4017==2)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-warning"];
                        }
                        if (contC4017==3)
                        {
                               ModalidadTodasconOrdenC4017[i].AduC4017Pintada = ["label label-danger"];
                        }
                        if (contC4017>3)
                        {
                          ModalidadTodasconOrdenC4017[i].AduC4017Pintada = [];
                        }
                        }

               ////////// Campo ['+300 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC401718 = _.sortBy(ModalidadTodasconOrdenC401718 ,'Aeropuerto','Pais',"['+300 + Fs/kg + Gastos Embarque']");

                       var contC401718=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718.length-1; i++){

                          if (i==0)
                          {
                             contC401718= contC401718 + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC401718[i].Aeropuerto ==  ModalidadTodasconOrdenC401718[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC401718[i].Pais ==  ModalidadTodasconOrdenC401718[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC401718[i]['+300 + Fs/kg + Gastos Embarque']) == parseFloat( ModalidadTodasconOrdenC401718[i-1]['+300 + Fs/kg + Gastos Embarque']))
                                {
                                  contC401718= contC401718;
                                }
                                else
                                {
                                  contC401718=contC401718 + 1;
                                }
                              }
                             else
                              {
                               contC401718=1;
                              }

                          }


                        if (contC401718==1)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-success"];
                        }
                        if (contC401718==2)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-warning"];
                        }
                        if (contC401718==3)
                        {
                               ModalidadTodasconOrdenC401718[i].AduC401718Pintada = ["label label-danger"];
                        }
                        if (contC401718>3)
                        {
                          ModalidadTodasconOrdenC401718[i].AduC401718Pintada = [];
                        }
                        }
                   ////////// Campo ['+500 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                    ModalidadTodasconOrdenC4020 = _.sortBy(ModalidadTodasconOrdenC4020, "['+500 + Fs/kg + Gastos Embarque']");
                     
                     var contC4020=0;
                        for (var i=0; i<=ModalidadTodasconOrdenC4020.length-1; i++){                                                    
                          if (i==0){                            
                            contC4020= contC4020 + 1;
                          }
                          else
                              {         
                              if(parseFloat(ModalidadTodasconOrdenC4020[i]['+500 + Fs/kg + Gastos Embarque']) == parseFloat(ModalidadTodasconOrdenC4020[i-1]['+500 + Fs/kg + Gastos Embarque'])) 
                              {                                 
                                contC4020= contC4020;
                              }
                              else
                              {
                                contC4020=contC4020 + 1;                               }
                            }                                                        
                          

                        if (contC4020==1) 
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-success"];
                        }
                        if (contC4020==2) 
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-warning"];
                        }
                        if (contC4020==3) 
                        {
                               ModalidadTodasconOrdenC4020[i].AduC4020Pintada = ["label label-danger"];
                        }
                        if (contC4020>3)
                        {
                          ModalidadTodasconOrdenC4020[i].AduC4020Pintada = [];
                        }
                        }       

                         ////////// Campo ['+1000 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                    ModalidadTodasconOrdenC4021 = _.sortBy(ModalidadTodasconOrdenC4021, "['+1000 + Fs/kg + Gastos Embarque']");
                     
                     var contC4021=0;
                        for (var i=0; i<=ModalidadTodasconOrdenC4021.length-1; i++){                                                    
                          if (i==0){                            
                            contC4021= contC4021 + 1;
                          }
                          else
                              {         
                              if(parseFloat(ModalidadTodasconOrdenC4021[i]['+1000 + Fs/kg + Gastos Embarque']) == parseFloat(ModalidadTodasconOrdenC4021[i-1]['+1000 + Fs/kg + Gastos Embarque'])) 
                              {                                 
                                contC4021= contC4021;
                              }
                              else
                              {
                                contC4021=contC4021 + 1;                               }
                            }                                                        
                          

                        if (contC4021==1) 
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-success"];
                        }
                        if (contC4021==2) 
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-warning"];
                        }
                        if (contC4021==3) 
                        {
                               ModalidadTodasconOrdenC4021[i].AduC4021Pintada = ["label label-danger"];
                        }
                        if (contC4021>3)
                        {
                          ModalidadTodasconOrdenC4021[i].AduC4021Pintada = [];
                        }
                        } 


                     ModalidadTodasAerea = _.sortBy(ModalidadTodasAerea, 'Aeropuerto','Pais','Email');
                     $scope.ModalidadTodasAerea=ModalidadTodasAerea;

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasAerea;
                       $scope.ModalidadTodasAerea= ModalidadTodasAerea;
                       console.log(ModalidadTodasRespaldo);
                       $scope.ModalidadTodasAerea = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045Pintada.length > 0 ||
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
                                el.AduC40120Pintada.length > 0 ||
                                el.AduC4021Pintada.length > 0 ||                              
                                $scope.ModalidadesSemaforo == false);
                      });


                ////////////////////////////Aerea Pasajero /////////////////////////////////////////
                ModalidadTodasAereaPasajero=[];
                       angular.forEach($scope.ConsolidadoDatos, function(consotm) {
                         ModalidadDeUnProveedor = consotm.AereaPasajero.AereasPasajeros
                            angular.forEach(ModalidadDeUnProveedor, function(consotmprov) {
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

                      ModalidadTodasconOrdenP = _.sortBy(ModalidadTodasconOrdenP,'Aeropuerto','Pais', 'Minima');
                      var contP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenP.length-1; i++){

                          if (i==0)
                          {
                             contP= contP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenP[i].Aeropuerto ==  ModalidadTodasconOrdenP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenP[i].Pais ==  ModalidadTodasconOrdenP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenP[i].Minima) == parseFloat( ModalidadTodasconOrdenP[i-1].Minima))
                                {
                                  contP= contP;
                                }
                                else
                                {
                                  contP=contP + 1;
                                }
                              }
                             else
                              {
                               contP=1;
                              }

                          }


                        if (contP==1)
                        {
                               ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-success"];
                        }
                        if (contP==2)
                        {
                               ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-warning"];
                        }
                        if (contP==3)
                        {
                               ModalidadTodasconOrdenP[i].AduC2045PPintada = ["label label-danger"];
                        }
                        if (contP>3)
                        {
                          ModalidadTodasconOrdenP[i].AduC2045PPintada = [];
                        }
                        }

              ////////////////// ["45"] ////////////////////////////////////

                  ModalidadTodasconOrdenMinimaP = _.sortBy(ModalidadTodasconOrdenMinimaP, 'Aeropuerto','Pais','["45"]');

                      var contminP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenMinimaP.length-1; i++){

                         if (i==0)
                          {
                             contminP= contminP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenMinimaP[i].Aeropuerto ==  ModalidadTodasconOrdenMinimaP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenMinimaP[i].Pais ==  ModalidadTodasconOrdenMinimaP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenMinimaP[i]["45"]) == parseFloat( ModalidadTodasconOrdenMinimaP[i-1]["45"]))
                                {
                                  contminP= contminP;
                                }
                                else
                                {
                                  contminP=contminP + 1;
                                }
                              }
                             else
                              {
                               contminP=1;
                              }

                          }


                        if (contminP==1)
                        {
                               ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-success"];
                        }
                        if (contminP==2)
                        {
                               ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-warning"];
                        }
                        if (contminP==3)
                        {
                               ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = ["label label-danger"];
                        }
                        if (contminP>3)
                        {
                          ModalidadTodasconOrdenMinimaP[i].AduC8PPintada = [];
                        }
                        }

                   ////////// Campo ['+100'] ///////////////////////////////
                  ModalidadTodasconOrdenGAP = _.sortBy(ModalidadTodasconOrdenGAP, 'Aeropuerto','Pais',"['+100']");

                      var contGAP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAP.length-1; i++){

                          if (i==0)
                          {
                             contGAP= contGAP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAP[i].Aeropuerto ==  ModalidadTodasconOrdenGAP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAP[i].Pais ==  ModalidadTodasconOrdenGAP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAP[i]['+100']) == parseFloat( ModalidadTodasconOrdenGAP[i-1]['+100']))
                                {
                                  contGAP= contGAP;
                                }
                                else
                                {
                                  contGAP=contGAP + 1;
                                }
                              }
                             else
                              {
                               contGAP=1;
                              }

                          }

                        if (contGAP==1)
                        {
                               ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-success"];
                        }
                        if (contGAP==2)
                        {
                               ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-warning"];
                        }
                        if (contGAP==3)
                        {
                               ModalidadTodasconOrdenGAP[i].AduC2010PPintada = ["label label-danger"];
                        }
                        if (contGAP>3)
                        {
                          ModalidadTodasconOrdenGAP[i].AduC2010PPintada = [];
                        }
                        }


                    ////////// Campo ['+300']

                    ModalidadTodasconOrdenCAP = _.sortBy(ModalidadTodasconOrdenCAP,'Aeropuerto','Pais', "['+300']");
                     var contCAP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAP.length-1; i++){

                           if (i==0)
                          {
                             contCAP= contCAP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAP[i].Aeropuerto ==  ModalidadTodasconOrdenCAP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAP[i].Pais ==  ModalidadTodasconOrdenCAP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAP[i]['+300']) == parseFloat( ModalidadTodasconOrdenCAP[i-1]['+300']))
                                {
                                  contCAP= contCAP;
                                }
                                else
                                {
                                  contCAP=contCAP + 1;
                                }
                              }
                             else
                              {
                               contCAP=1;
                              }

                          }


                        if (contCAP==1)
                        {
                               ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-success"];
                        }
                        if (contCAP==2)
                        {
                               ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-warning"];
                        }
                        if (contCAP==3)
                        {
                               ModalidadTodasconOrdenCAP[i].AduC2017PPintada = ["label label-danger"];
                        }
                        if (contCAP>3)
                        {
                          ModalidadTodasconOrdenCAP[i].AduC2017PPintada = [];
                        }
                        }

                      ////////// Campo ['+500']

                   ModalidadTodasconOrdenGAIIP = _.sortBy(ModalidadTodasconOrdenGAIIP, 'Aeropuerto','Pais',"['+500']");

                      var contGAIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIP.length-1; i++){

                          if (i==0)
                          {
                             contGAIIP= contGAIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIIP[i].Aeropuerto ==  ModalidadTodasconOrdenGAIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAIIP[i].Pais ==  ModalidadTodasconOrdenGAIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIIP[i]['+500']) == parseFloat( ModalidadTodasconOrdenGAIIP[i-1]['+500']))
                                {
                                  contGAIIP= contGAIIP;
                                }
                                else
                                {
                                  contGAIIP=contGAIIP + 1;
                                }
                              }
                             else
                              {
                               contGAIIP=1;
                              }

                          }

                        if (contGAIIP==1)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-success"];
                        }
                        if (contGAIIP==2)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-warning"];
                        }
                        if (contGAIIP==3)
                        {
                               ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = ["label label-danger"];
                        }
                        if (contGAIIP>3)
                        {
                          ModalidadTodasconOrdenGAIIP[i].AduC2019PPintada = [];
                        }
                        }

                       ////////// Campo ['+1000']

                      ModalidadTodasconOrdenCAIIP = _.sortBy(ModalidadTodasconOrdenCAIIP, 'Aeropuerto','Pais',"['+1000']");

                     var contCAIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIP.length-1; i++){

                           if (i==0)
                          {
                             contCAIIP= contCAIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIIP[i].Aeropuerto ==  ModalidadTodasconOrdenCAIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAIIP[i].Pais ==  ModalidadTodasconOrdenCAIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIIP[i]['+1000']) == parseFloat( ModalidadTodasconOrdenCAIIP[i-1]['+1000']))
                                {
                                  contCAIIP= contCAIIP;
                                }
                                else
                                {
                                  contCAIIP=contCAIIP + 1;
                                }
                              }
                             else
                              {
                               contCAIIP=1;
                              }

                          }


                        if (contCAIIP==1)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-success"];
                        }
                        if (contCAIIP==2)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-warning"];
                        }
                        if (contCAIIP==3)
                        {
                               ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = ["label label-danger"];
                        }
                        if (contCAIIP>3)
                        {
                          ModalidadTodasconOrdenCAIIP[i].AduC2020PPintada = [];
                        }
                        }
                      ////////// Campo ["FS min"]

                   ModalidadTodasconOrdenGAIIIP = _.sortBy(ModalidadTodasconOrdenGAIIIP,'Aeropuerto','Pais','["FS min"]');

                      var contGAIIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenGAIIIP.length-1; i++){

                          if (i==0)
                          {
                             contGAIIIP= contGAIIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenGAIIIP[i].Aeropuerto ==  ModalidadTodasconOrdenGAIIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenGAIIIP[i].Pais ==  ModalidadTodasconOrdenGAIIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenGAIIIP[i]["FS min"]) == parseFloat( ModalidadTodasconOrdenGAIIIP[i-1]["FS min"]))
                                {
                                  contGAIIIP= contGAIIIP;
                                }
                                else
                                {
                                  contGAIIIP=contGAIIIP + 1;
                                }
                              }
                             else
                              {
                               contGAIIIP=1;
                              }

                          }


                        if (contGAIIIP==1)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-success"];
                        }
                        if (contGAIIIP==2)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-warning"];
                        }
                        if (contGAIIIP==3)
                        {
                               ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = ["label label-danger"];
                        }
                        if (contGAIIIP>3)
                        {
                          ModalidadTodasconOrdenGAIIIP[i].AduC2021PPintada = [];
                        }
                        }


                   ////////// Campo ["Fs/kg"]

                      ModalidadTodasconOrdenCAIIIP = _.sortBy(ModalidadTodasconOrdenCAIIIP,'Aeropuerto','Pais','["Fs/kg"]');

                      var contCAIIIP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCAIIIP.length-1; i++){

                          if (i==0)
                          {
                             contCAIIIP= contCAIIIP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCAIIIP[i].Aeropuerto ==  ModalidadTodasconOrdenCAIIIP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCAIIIP[i].Pais ==  ModalidadTodasconOrdenCAIIIP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCAIIIP[i]["Fs/kg"]) == parseFloat( ModalidadTodasconOrdenCAIIIP[i-1]["Fs/kg"]))
                                {
                                  contCAIIIP= contCAIIIP;
                                }
                                else
                                {
                                  contCAIIIP=contCAIIIP + 1;
                                }
                              }
                             else
                              {
                               contCAIIIP=1;
                              }

                          }


                        if (contCAIIIP==1)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-success"];
                        }
                        if (contCAIIIP==2)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-warning"];
                        }
                        if (contCAIIIP==3)
                        {
                               ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = ["label label-danger"];
                        }
                        if (contCAIIIP>3)
                        {
                          ModalidadTodasconOrdenCAIIIP[i].AduC2025PPintada = [];
                        }
                        }



                          ////////// Campo["Gastos Embarque"]

                    ModalidadTodasconOrdenCPCP = _.sortBy(ModalidadTodasconOrdenCPCP,'Aeropuerto','Pais','["Gastos Embarque"]');
                    var contCPCP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenCPCP.length-1; i++){

                          if (i==0)
                          {
                             contCPCP= contCPCP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenCPCP[i].Aeropuerto ==  ModalidadTodasconOrdenCPCP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenCPCP[i].Pais ==  ModalidadTodasconOrdenCPCP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenCPCP[i]["Gastos Embarque"]) == parseFloat( ModalidadTodasconOrdenCPCP[i-1]["Gastos Embarque"]))
                                {
                                  contCPCP= contCPCP;
                                }
                                else
                                {
                                  contCPCP=contCPCP + 1;
                                }
                              }
                             else
                              {
                               contCPCP=1;
                              }

                          }

                        if (contCPCP==1)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-success"];
                        }
                        if (contCPCP==2)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-warning"];
                        }
                        if (contCPCP==3)
                        {
                               ModalidadTodasconOrdenCPCP[i].AduC4015PPintada = ["label label-danger"];
                        }
                        if (contCPCP>3)
                        {
                          ModalidadTodasconOrdenCPCP[i].AduCPCPintada = [];
                        }
                        }

                   ////////// Campo Via////////////////////////////

                    ModalidadTodasconOrdenotrosP = _.sortBy(ModalidadTodasconOrdenotrosP,'Aeropuerto','Pais', 'Via');

                        var contOTROP=0;
                       for (var i=0; i<= ModalidadTodasconOrdenotrosP.length-1; i++){

                          if (i==0)
                          {
                             contOTROP= contOTROP + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenotrosP[i].Aeropuerto ==  ModalidadTodasconOrdenotrosP[i-1].Aeropuerto) && ( ModalidadTodasconOrdenotrosP[i].Pais ==  ModalidadTodasconOrdenotrosP[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenotrosP[i].Via) == parseFloat( ModalidadTodasconOrdenotrosP[i-1].Via))
                                {
                                  contOTROP= contOTROP;
                                }
                                else
                                {
                                  contOTROP=contOTROP + 1;
                                }
                              }
                             else
                              {
                               contOTROP=1;
                              }

                          }

                        if (contOTROP==1)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-success"];
                        }
                        if (contOTROP==2)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-warning"];
                        }
                        if (contOTROP==3)
                        {
                               ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = ["label label-danger"];
                        }
                        if (contOTROP>3)
                        {
                          ModalidadTodasconOrdenotrosP[i].AduC4016PPintada = [];
                        }
                        }

                        ////////// Campo ['+100 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC4017P = _.sortBy(ModalidadTodasconOrdenC4017P ,'Aeropuerto','Pais',"['+100 + Fs/kg']");

                       var contC4017P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4017P.length-1; i++){

                          if (i==0)
                          {
                             contC4017P= contC4017P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4017P[i].Aeropuerto ==  ModalidadTodasconOrdenC4017P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4017P[i].Pais ==  ModalidadTodasconOrdenC4017P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4017P[i]['+100 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4017P[i-1]['+100 + Fs/kg']))
                                {
                                  contC4017P= contC4017P;
                                }
                                else
                                {
                                  contC4017P=contC4017P + 1;
                                }
                              }
                             else
                              {
                               contC4017P=1;
                              }

                          }


                        if (contC4017P==1)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-success"];
                        }
                        if (contC4017P==2)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-warning"];
                        }
                        if (contC4017P==3)
                        {
                               ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = ["label label-danger"];
                        }
                        if (contC4017P>3)
                        {
                          ModalidadTodasconOrdenC4017P[i].AduC4017PPintada = [];
                        }
                        }

               ////////// Campo ['+300 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                     ModalidadTodasconOrdenC401718P = _.sortBy(ModalidadTodasconOrdenC401718P ,'Aeropuerto','Pais',"['+300 + Fs/kg']");

                       var contC401718P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC401718P.length-1; i++){

                          if (i==0)
                          {
                             contC401718P= contC401718P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC401718P[i].Aeropuerto ==  ModalidadTodasconOrdenC401718P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC401718P[i].Pais ==  ModalidadTodasconOrdenC401718P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC401718P[i]['+300 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC401718P[i-1]['+300 + Fs/kg']))
                                {
                                  contC401718P= contC401718P;
                                }
                                else
                                {
                                  contC401718P=contC401718P + 1;
                                }
                              }
                             else
                              {
                               contC401718P=1;
                              }

                          }


                        if (contC401718P==1)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-success"];
                        }
                        if (contC401718P==2)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-warning"];
                        }
                        if (contC401718P==3)
                        {
                               ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = ["label label-danger"];
                        }
                        if (contC401718P>3)
                        {
                          ModalidadTodasconOrdenC401718P[i].AduC401718PPintada = [];
                        }
                        }
                   ////////// Campo ['+500 + Fs/kg + Gastos Embarque']////////////////////////////              
                       
                     ModalidadTodasconOrdenC4020P = _.sortBy(ModalidadTodasconOrdenC4020P ,'Aeropuerto','Pais',"['+500 + Fs/kg']");

                       var contC4020P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4020P.length-1; i++){

                          if (i==0)
                          {
                             contC4020P= contC4020P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4020P[i].Aeropuerto ==  ModalidadTodasconOrdenC4020P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4020P[i].Pais ==  ModalidadTodasconOrdenC4020P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4020P[i]['+500 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4020P[i-1]['+500 + Fs/kg']))
                                {
                                  contC4020P= contC4020P;
                                }
                                else
                                {
                                  contC4020P=contC4020P + 1;
                                }
                              }
                             else
                              {
                               contC4020P=1;
                              }

                          }


                        if (contC4020P==1)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-success"];
                        }
                        if (contC4020P==2)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-warning"];
                        }
                        if (contC4020P==3)
                        {
                               ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = ["label label-danger"];
                        }
                        if (contC4020P>3)
                        {
                          ModalidadTodasconOrdenC4020P[i].AduC4020PPintada = [];
                        }
                        }
                       
                     ////////// Campo ['+10000 + Fs/kg + Gastos Embarque']////////////////////////////
                       
                      ModalidadTodasconOrdenC4021P = _.sortBy(ModalidadTodasconOrdenC4021P ,'Aeropuerto','Pais',"['+1000 + Fs/kg']");

                       var contC4021P=0;
                       for (var i=0; i<= ModalidadTodasconOrdenC4021P.length-1; i++){

                          if (i==0)
                          {
                             contC4021P= contC4021P + 1;
                          }
                         else
                          {
                              if(( ModalidadTodasconOrdenC4021P[i].Aeropuerto ==  ModalidadTodasconOrdenC4021P[i-1].Aeropuerto) && ( ModalidadTodasconOrdenC4021P[i].Pais ==  ModalidadTodasconOrdenC4021P[i-1].Pais))
                              {
                                if(parseFloat( ModalidadTodasconOrdenC4021P[i]['+1000 + Fs/kg']) == parseFloat( ModalidadTodasconOrdenC4021P[i-1]['+1000 + Fs/kg']))
                                {
                                  contC4021P= contC4021P;
                                }
                                else
                                {
                                  contC4021P=contC4021P + 1;
                                }
                              }
                             else
                              {
                               contC4021P=1;
                              }

                          }


                        if (contC4021P==1)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = ["label label-success"];
                        }
                        if (contC4021P==2)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = ["label label-warning"];
                        }
                        if (contC4021P==3)
                        {
                               ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = ["label label-danger"];
                        }
                        if (contC4021P>3)
                        {
                          ModalidadTodasconOrdenC4021P[i].AduC4021PPintada = [];
                        }
                        }

                    ModalidadTodasAereaPasajero = _.sortBy(ModalidadTodasAereaPasajero, 'Aeropuerto','Pais','Email');
                    //$scope.ModalidadTodasAereaPasajero=ModalidadTodasAereaPasajero;

                     /////////////////////////////////Filtro////////////////////////////////
                       ModalidadTodasRespaldo = ModalidadTodasAereaPasajero;
                       $scope.ModalidadTodasAereaPasajero= ModalidadTodasAereaPasajero;
                       $scope.ModalidadTodasAereaPasajero = ModalidadTodasRespaldo.filter(function (el) {
                         return (el.AduC2045PPintada.length > 0 ||
                                 el.AduC8PPintada.length > 0 ||
                                el.AduC2010PPintada.length > 0 ||
                                el.AduC2017PPintada.length > 0 ||
                                el.AduC2019PPintada.length > 0 ||
                                el.AduC2020PPintada.length > 0 ||
                                el.AduC2021PPintada.length > 0 ||
                                el.AduC2025PPintada.length > 0 ||
                                el.AduC4015PPintada.length > 0 ||
                                el.AduC4016PPintada.length > 0 ||
                                el.AduC4017PPintada.length > 0 ||
                                el.AduC401718PPintada.length > 0 ||
                                el.AduC4020PPintada.length > 0 ||
                                el.AduC4021PPintada.length > 0 ||
                                $scope.ModalidadesSemaforo == false);
                      });

               }


                    ///////////////////////////////////////////////////////////////////////////

                  }, function errorCallback(response) {
                    alert(response.statusText);
                });
            }

            $scope.FiltroS= function  (){
              $scope.ModalidadesSemaforo == true;
              $scope.GetConsolidadoDatos()

              }



             $scope.GetConsolidadoDatos();


       }])

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
