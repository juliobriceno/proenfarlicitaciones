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
    
                     // Mostrar modalidades mensjaes
               $scope.ModalidadesMostrar = {
                   Bodegajes: true,
                   Aduanas: true,
                   OTM: true,
                   MaritimasFcl: true,
                   MaritimasLcl: true,
                   TerrestreNacional: true,
                   TerrestreUrbano: true,
                   Areas: true
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
                    alert("La plantilla no corresponde a esta modalidad");
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
                alert("La plantilla no corresponde a esta modalidad");
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
                alert("La plantilla no corresponde a esta modalidad");
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
                alert("La plantilla no corresponde a esta modalidad");
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
                     alert("La plantilla no corresponde a esta modalidad");
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
                    alert("La plantilla no corresponde a esta modalidad");
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
                  alert("La plantilla no corresponde a esta modalidad");
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
                     alert("La plantilla no corresponde a esta modalidad");
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
                   Data.Email = 'mafer.bello@gmail.com' //localStorage.UserConnected;
                   $http({
                       method: 'POST',
                       url: '/GetModalidadesProveedor',
                       headers: { 'Content-Type': 'application/json' },
                       data: Data
                   }).then(function successCallback(response) {
                       $loading.finish('myloading');
                       $scope.ModalidadesProveedor = response.data.ModalidadesProveedor;
                       //console.log($scope.ModalidadesProveedor);
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