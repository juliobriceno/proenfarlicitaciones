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

            
          //carga en Excel

        $scope.read = function (workbook) {
          console.log(workbook);            
           var result = {};
           var resultado = {};
           var Data={};
           var repeatadu={};
           $loading.start('myloading');
           $scope.erroresimportacion = [];
           var pattern = /^\d+(\.\d+)?$/; ///^\d+$/;
        
              
           workbook.SheetNames.forEach(function(sheetName) {
                  var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw: true});
                  if(roa.length) result[sheetName] = roa;//var b = XLSX.utils.sheet_to_json(workbook.Sheets.Aduana, {raw: true});
                   });
           var exceljson = JSON.stringify(result, 2, 2);
           var data = angular.fromJson(exceljson);
       
          ////////////////////////////Bodegajes ////////////////////////////////////////////
          angular.forEach(data.Bodegajes , function(bodegaje) {
               console.log("Submodalidad ::: ", bodegaje.Submodalidad);
            if(bodegaje.Submodalidad=="Aduanero"){ 
          ////////////////////////////valida si es numerico o null ///////////////        
                 if(pattern.test(bodegaje.TarifaValor)){                 
                    $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaValor = bodegaje.TarifaValor;                   
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='TarifaValor';
                    $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                              
                  } 

                 if(pattern.test(bodegaje.TarifaMinima)){ 
                    $scope.ModalidadesProveedor.Bodegajes.Aduanero.TarifaMinima = bodegaje.TarifaMinima;                   
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='TarifaMinima';
                    $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                  
                  } 

                 if(pattern.test(bodegaje.Otros)){ 
                    $scope.ModalidadesProveedor.Bodegajes.Aduanero.Otros = bodegaje.Otros;                   
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='Otros';
                    $scope.erroresimportacion.push({fila: 2, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                  
                  } 
            }

            if(bodegaje.Submodalidad=="Maquinaria"){ 

             if(pattern.test(bodegaje.TarifaValor)){                 
                    $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Tarifa = bodegaje.TarifaValor;                   
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='TarifaValor';
                    $scope.erroresimportacion.push({fila: 3, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                              
                  } 

                 if(pattern.test(bodegaje.TarifaMinima)){ 
                    $scope.ModalidadesProveedor.Bodegajes.Maquinaria.TarifaMinima = bodegaje.TarifaMinima;
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='TarifaMinima';
                    $scope.erroresimportacion.push({fila: 3, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                  
                  } 

                 if(pattern.test(bodegaje.FMM)){ 
                   $scope.ModalidadesProveedor.Bodegajes.Maquinaria.Fmm = bodegaje.FMM;       
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='FMM';
                    $scope.erroresimportacion.push({fila: 3, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                  
                  }   
            }   
            
            if(bodegaje.Submodalidad=="Materia Prima"){   
                   ////////////////////////////valida si es numerico o null ///////////////        
                 if(pattern.test(bodegaje.TarifaValor)){                 
                     $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Tarifa = bodegaje.TarifaValor;
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='TarifaValor';
                    $scope.erroresimportacion.push({fila: 4, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                              
                  } 

                 if(pattern.test(bodegaje.TarifaMinima)){ 
                    $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.TarifaMinima = bodegaje.TarifaMinima;
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='TarifaMinima';
                    $scope.erroresimportacion.push({fila: 4, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                  
                  } 

                 if(pattern.test(bodegaje.FMM)){ 
                    $scope.ModalidadesProveedor.Bodegajes.MateriaPrima.Fmm = bodegaje.FMM;
                    $scope.$apply();   
                  }
                  else
                  {
                    var valor='FMM';
                    $scope.erroresimportacion.push({fila: 4, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor);                  
                  }  
            }            
          });

   ///////////////////Aduana ////////////////////////////////////////////
           var filaTarifa=1;
           var filaMinima=1;
           var filaGastosAdicionales=1;
           var filaConceptosAdicionales=1;
           var filaGastosAdicionales2=1;
           var filaConceptosAdicionales2=1;
           var filaGastosAdicionales3=1;
           var filaConceptosAdicionales3=1;
           var filaCostoPlanificacionCaja=1;
           var filaOtros=1;        

             angular.forEach(data.Aduanas , function(aduana) {
               /////////////Tarifa////////////////////////////////////                           
                  if(pattern.test(aduana.Tarifa)){ 
                     filaTarifa=filaTarifa +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
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
                     $scope.$apply();
                    }
                  else
                  {   
                  filaMinima=filaMinima +1;                           
                    var valor='Minima';
                    $scope.erroresimportacion.push({fila: filaMinima, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////GastosAdicionales//////////////////////////
                  if(pattern.test(aduana.GastosAdicionales)){ 
                    filaGastosAdicionales=filaGastosAdicionales +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaGastosAdicionales=filaGastosAdicionales +1;                           
                    var valor='GastosAdicionales';
                    $scope.erroresimportacion.push({fila: filaGastosAdicionales, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////ConceptosAdicionales//////////////////////////
                  if(pattern.test(aduana.ConceptosAdicionales)){ 
                    filaConceptosAdicionales=filaConceptosAdicionales +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaConceptosAdicionales=filaConceptosAdicionales +1;                           
                    var valor='ConceptosAdicionales';
                    $scope.erroresimportacion.push({fila: filaConceptosAdicionales, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
          //////////////////GastosAdicionales2//////////////////////////
                  if(pattern.test(aduana.GastosAdicionales2)){ 
                    filaGastosAdicionales2=filaGastosAdicionales2 +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaGastosAdicionales2=filaGastosAdicionales2 +1;                           
                    var valor='GastosAdicionales2';
                    $scope.erroresimportacion.push({fila: filaGastosAdicionales2, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////ConceptosAdicionales2//////////////////////////
                  if(pattern.test(aduana.ConceptosAdicionales2)){ 
                    filaConceptosAdicionales2=filaConceptosAdicionales2 +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaConceptosAdicionales2=filaConceptosAdicionales2 +1;                           
                    var valor='ConceptosAdicionales2';
                    $scope.erroresimportacion.push({fila: filaConceptosAdicionales2, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
            //////////////////GastosAdicionales3//////////////////////////
                  if(pattern.test(aduana.GastosAdicionales3)){ 
                    filaGastosAdicionales3=filaGastosAdicionales3 +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaGastosAdicionales3=filaGastosAdicionales3 +1;                           
                    var valor='GastosAdicionales3';
                    $scope.erroresimportacion.push({fila: filaGastosAdicionales3, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////ConceptosAdicionales3//////////////////////////
                  if(pattern.test(aduana.ConceptosAdicionales3)){ 
                    filaConceptosAdicionales3=filaConceptosAdicionales3 +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaConceptosAdicionales3=filaConceptosAdicionales3 +1;                           
                    var valor='ConceptosAdicionales3';
                    $scope.erroresimportacion.push({fila: filaConceptosAdicionales3, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////CostoPlanificacionCaja//////////////////////////
                  if(pattern.test(aduana.CostoPlanificacionCaja)){ 
                    filaCostoPlanificacionCaja=filaCostoPlanificacionCaja +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaCostoPlanificacionCaja=filaCostoPlanificacionCaja +1;                           
                    var valor='CostoPlanificacionCaja';
                    $scope.erroresimportacion.push({fila: filaCostoPlanificacionCaja, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////Otros/////////////////////////////////////////
                  if(pattern.test(aduana.Otros)){ 
                    filaOtros=filaOtros +1;
                     $scope.ModalidadesProveedor.Aduana.Aduanas= data.Aduanas;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaOtros=filaOtros +1;                           
                    var valor='Otros';
                    $scope.erroresimportacion.push({fila: filaOtros, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
          }); 

  ///////////////////OTM ////////////////////////////////////////////
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
               /////////////cveintecuatroconcinco////////////////////////////////////                           
                  if(pattern.test(otm.cveintecuatroconcinco)){ 
                     filacveintecuatroconcinco=filacveintecuatroconcinco +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveintecuatroconcinco=filacveintecuatroconcinco +1;                        
                    var valor='cveintecuatroconcinco';
                    $scope.erroresimportacion.push({fila: filacveintecuatroconcinco, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////cveinteoocho//////////////////////////
                  if(pattern.test(otm.cveinteoocho)){ 
                    filacveinteoocho=filacveinteoocho +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveinteoocho=filacveinteoocho +1;                           
                    var valor='cveinteoocho';
                    $scope.erroresimportacion.push({fila: filacveinteoocho, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////cveintendiez//////////////////////////
                  if(pattern.test(otm.cveintendiez)){ 
                    filacveintendiez=filacveintendiez +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveintendiez=filacveintendiez +1;                           
                    var valor='cveintendiez';
                    $scope.erroresimportacion.push({fila: filacveintendiez, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////cveintendiezsiete//////////////////////////
                  if(pattern.test(otm.cveintendiezsiete)){ 
                    filacveintendiezsiete=filacveintendiezsiete +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveintendiezsiete=filacveintendiezsiete +1;                           
                    var valor='cveintendiezsiete';
                    $scope.erroresimportacion.push({fila: filacveintendiezsiete, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
          //////////////////cveintendieznueve//////////////////////////
                  if(pattern.test(otm.cveintendieznueve)){ 
                    filacveintendieznueve=filacveintendieznueve +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveintendieznueve=filacveintendieznueve +1;                           
                    var valor='cveintendieznueve';
                    $scope.erroresimportacion.push({fila: filacveintendieznueve, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////cveinteveinte//////////////////////////
                  if(pattern.test(otm.cveinteveinte)){ 
                    filacveinteveinte=filacveinteveinte +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveinteveinte=filacveinteveinte +1;                           
                    var valor='cveinteveinte';
                    $scope.erroresimportacion.push({fila: filacveinteveinte, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
            //////////////////cveinteveinteyuno//////////////////////////
                  if(pattern.test(otm.cveinteveinteyuno)){ 
                    filacveinteveinteyuno=filacveinteveinteyuno +1;
                     $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveinteveinteyuno=filacveinteveinteyuno +1;                           
                    var valor='cveinteveinteyuno';
                    $scope.erroresimportacion.push({fila: filacveinteveinteyuno, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////cveinteveinteycinco//////////////////////////
                  if(pattern.test(otm.cveinteveinteycinco)){ 
                    filacveinteveinteycinco=filacveinteveinteycinco +1;
                     $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filacveinteveinteycinco=filacveinteveinteycinco +1;                           
                    var valor='cveinteveinteycinco';
                    $scope.erroresimportacion.push({fila: filacveinteveinteycinco, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////ccuarentaquince//////////////////////////
                  if(pattern.test(otm.ccuarentaquince)){ 
                    filaccuarentaquince=filaccuarentaquince +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaccuarentaquince=filaccuarentaquince +1;                           
                    var valor='ccuarentaquince';
                    $scope.erroresimportacion.push({fila: filaccuarentaquince, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////ccuarentadiezyseis/////////////////////////////////////////
                  if(pattern.test(otm.ccuarentadiezyseis)){ 
                    filaccuarentadiezyseis=filaccuarentadiezyseis +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaccuarentadiezyseis=filaccuarentadiezyseis +1;                           
                    var valor='ccuarentadiezyseis';
                    $scope.erroresimportacion.push({fila: filaccuarentadiezyseis, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                        //////////////////ccuarentadiezysiete//////////////////////////
                  if(pattern.test(otm.ccuarentadiezysiete)){ 
                    filaccuarentadiezysiete=filaccuarentadiezysiete +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaccuarentadiezysiete=filaccuarentadiezysiete +1;                           
                    var valor='ccuarentadiezysiete';
                    $scope.erroresimportacion.push({fila: filaccuarentadiezysiete, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////ccuarentaveinte/////////////////////////////////////////
                  if(pattern.test(otm.ccuarentaveinte)){ 
                    filaccuarentaveinte=filaccuarentaveinte +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaccuarentaveinte=filaccuarentaveinte +1;                           
                    var valor='ccuarentaveinte';
                    $scope.erroresimportacion.push({fila: filaccuarentaveinte, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               //////////////////ccuarentaveinteyuno//////////////////////////
                  if(pattern.test(otm.ccuarentaveinteyuno)){ 
                    filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaccuarentaveinteyuno=filaccuarentaveinteyuno +1;                           
                    var valor='ccuarentaveinteyuno';
                    $scope.erroresimportacion.push({fila: filaccuarentaveinteyuno, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////ccuarentaveinteydos/////////////////////////////////////////
                  if(pattern.test(otm.ccuarentaveinteydos)){ 
                    filaccuarentaveinteydos=filaccuarentaveinteydos +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaccuarentaveinteydos=filaccuarentaveinteydos +1;                           
                    var valor='ccuarentaveinteydos';
                    $scope.erroresimportacion.push({fila: filaccuarentaveinteydos, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
             //////////////////ccuarentatreinta//////////////////////////
                  if(pattern.test(otm.ccuarentatreinta)){ 
                    filaccuarentatreinta=filaccuarentatreinta +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaccuarentatreinta=filaccuarentatreinta +1;                           
                    var valor='ccuarentatreinta';
                    $scope.erroresimportacion.push({fila: filaccuarentatreinta, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////devolucionveinteestandar/////////////////////////////////////////
                  if(pattern.test(otm.devolucionveinteestandar)){ 
                    filadevolucionveinteestandar=filadevolucionveinteestandar +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filadevolucionveinteestandar=filadevolucionveinteestandar +1;                           
                    var valor='devolucionveinteestandar';
                    $scope.erroresimportacion.push({fila: filadevolucionveinteestandar, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////devolucioncuarentaestandar//////////////////////////
                  if(pattern.test(otm.devolucioncuarentaestandar)){ 
                    filadevolucioncuarentaestandar=filadevolucioncuarentaestandar +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filadevolucioncuarentaestandar=filadevolucioncuarentaestandar +1;                           
                    var valor='devolucioncuarentaestandar';
                    $scope.erroresimportacion.push({fila: filadevolucioncuarentaestandar, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              //////////////////devolucionveinteexpreso/////////////////////////////////////////
                  if(pattern.test(otm.devolucionveinteexpreso)){ 
                    filadevolucionveinteexpreso=filadevolucionveinteexpreso +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filadevolucionveinteexpreso=filadevolucionveinteexpreso +1;                           
                    var valor='devolucionveinteexpreso';
                    $scope.erroresimportacion.push({fila: filadevolucionveinteexpreso, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }
              //////////////////devolucioncuarentaexpreso/////////////////////////////////////////
                  if(pattern.test(otm.devolucioncuarentaexpreso)){ 
                    filadevolucioncuarentaexpreso=filadevolucioncuarentaexpreso +1;
                      $scope.ModalidadesProveedor.Otm.Otms= data.OTM;
                     $scope.$apply();
                    }
                  else
                  {   
                  filadevolucioncuarentaexpreso=filadevolucioncuarentaexpreso +1;                           
                    var valor='devolucioncuarentaexpreso';
                    $scope.erroresimportacion.push({fila: filadevolucioncuarentaexpreso, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }  
          }); 

   ///////////////////MaritimasFcl ////////////////////////////////////////////
           var filaC20=1;
           var filaBaf20=1;
           var filaC40=1;
           var filaBaf40=1;
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
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
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
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
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
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaC40=filaC40 +1;                        
                    var valor='C40';
                    $scope.erroresimportacion.push({fila: filaC40, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                 /////////////Baf40////////////////////////////////////                           
                  if(pattern.test(maritimasfcl.Baf40)){ 
                     filaBaf40=filaBaf40 +1;
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaBaf40=filaBaf40 +1;                        
                    var valor='Baf40';
                    $scope.erroresimportacion.push({fila: filaBaf40, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                 /////////////Baf40HC////////////////////////////////////                           
                  if(pattern.test(maritimasfcl.Baf40HC)){ 
                     filaBaf40HC=filaBaf40HC +1;
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaBaf40HC=filaBaf40HC +1;                        
                    var valor='Baf40HC';
                    $scope.erroresimportacion.push({fila: filaBaf40HC, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                 /////////////Observaciones////////////////////////////////////                           
                  if(pattern.test(maritimasfcl.Observaciones)){ 
                     filaObservacionesmf=filaObservacionesmf +1;
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaObservacionesmf=filaObservacionesmf +1;                        
                    var valor='Observaciones';
                    $scope.erroresimportacion.push({fila: filaObservacionesmf, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////GastosEmbarque////////////////////////////////////                           
                  if(pattern.test(maritimasfcl.GastosEmbarque)){ 
                     filaGastosEmbarquemf=filaGastosEmbarquemf +1;
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaGastosEmbarquemf=filaGastosEmbarquemf +1;                        
                    var valor='GastosEmbarque';
                    $scope.erroresimportacion.push({fila: filaGastosEmbarquemf, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////Time////////////////////////////////////                           
                  if(pattern.test(maritimasfcl.Time)){ 
                     filaTimemf=filaTimemf +1;
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaTimemf=filaTimemf +1;                        
                    var valor='Time';
                    $scope.erroresimportacion.push({fila: filaTimemf, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }                     
               /////////////Naviera////////////////////////////////////                           
                  if(pattern.test(maritimasfcl.Naviera)){ 
                     filaNavierafcl=filaNavierafcl +1;
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaNavierafcl=filaNavierafcl +1;                        
                    var valor='Naviera';
                    $scope.erroresimportacion.push({fila: filaNavierafcl, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////Frecuencia////////////////////////////////////                           
                  if(pattern.test(maritimasfcl.Frecuencia)){ 
                     filaFrecuenciafcl=filaFrecuenciafcl +1;
                     $scope.ModalidadesProveedor.MaritimaFcl.MaritimasFcl= data.MaritimasFcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaFrecuenciafcl=filaFrecuenciafcl +1;                        
                    var valor='Frecuencia';
                    $scope.erroresimportacion.push({fila: filaFrecuenciafcl, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }            
          });

   ///////////////////MaritimasLcl ////////////////////////////////////////////
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
                     $scope.$apply();
                    }
                  else
                  {   
                  filaMinima=filaMinima +1;                        
                    var valor='Minima';
                    $scope.erroresimportacion.push({fila: filaMinima, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////ton15////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.ton15)){ 
                     filaton15=filaton15 +1;
                     $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaton15=filaton15 +1;                        
                    var valor='ton15';
                    $scope.erroresimportacion.push({fila: filaton15, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////ton58////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.ton58)){ 
                     filaton58=filaton58 +1;
                     $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaton58=filaton58 +1;                        
                    var valor='ton58';
                    $scope.erroresimportacion.push({fila: filaton58, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                 /////////////ton812////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.ton812)){ 
                     filaton812=filaton812 +1;
                     $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaton812=filaton812 +1;                        
                    var valor='ton812';
                    $scope.erroresimportacion.push({fila: filaton812, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                 /////////////ton1218////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.ton1218)){ 
                     filaton1218=filaton1218 +1;
                     $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaton1218=filaton1218 +1;                        
                    var valor='ton1218';
                    $scope.erroresimportacion.push({fila: filaton1218, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                /////////////GastosEmbarque////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.GastosEmbarque)){ 
                     filaGastosEmbarqueml=filaGastosEmbarqueml +1;
                     $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaGastosEmbarqueml=filaGastosEmbarqueml +1;                        
                    var valor='GastosEmbarque';
                    $scope.erroresimportacion.push({fila: filaGastosEmbarqueml, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                  } 
                 /////////////Observaciones////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.Observaciones)){ 
                     filaObservacionesml=filaObservacionesml +1;
                     $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaObservacionesml=filaObservacionesml +1;                        
                    var valor='Observaciones';
                    $scope.erroresimportacion.push({fila: filaObservacionesml, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////Time////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.Time)){ 
                     filaTimeml=filaTimeml +1;
                    $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
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
               /////////////Frecuencia////////////////////////////////////                           
                  if(pattern.test(maritimaslcl.Frecuencia)){ 
                     filaFrecuencialcl=filaFrecuencialcl +1;
                    $scope.ModalidadesProveedor.MaritimaLcl.MaritimasLcl= data.MaritimasLcl;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaFrecuencialcl=filaFrecuencialcl +1;                        
                    var valor='Frecuencia';
                    $scope.erroresimportacion.push({fila: filaFrecuencialcl, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }             
          }); 

   ///////////////////Terrestre Nacional ////////////////////////////////////////////
           var filaEstandarna=1;
           var filaEspecialna=1;

             angular.forEach(data.TerrestreNacional, function(terrestrenacional) {
               /////////////Estandar////////////////////////////////////                           
                  if(pattern.test(terrestrenacional.Estandar)){ 
                     filaEstandarna=filaEstandarna +1;
                     $scope.ModalidadesProveedor.TerreNacional.TerresNacional= data.TerrestreNacional;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaEstandarna=filaEstandarna +1;                        
                    var valor='Estandar';
                    $scope.erroresimportacion.push({fila: filaEstandarna, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////Especial////////////////////////////////////                           
                  if(pattern.test(terrestrenacional.Especial)){ 
                     filaEspecialna=filaEspecialna +1;
                     $scope.ModalidadesProveedor.TerreNacional.TerresNacional= data.TerrestreNacional;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaEspecialna=filaEspecialna +1;                        
                    var valor='Especial';
                    $scope.erroresimportacion.push({fila: filaEspecialna, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }  
          }); 

 ///////////////////Terrestre Urbano ////////////////////////////////////////////
           var filaEstandartu=1;
           var filaEspecialtu=1;

             angular.forEach(data.TerrestreUrbano, function(terrestreurbano) {
               /////////////Estandar////////////////////////////////////                           
                  if(pattern.test(terrestreurbano.Estandar)){ 
                     filaEstandartu=filaEstandartu +1;
                     $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.TerrestreUrbano;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaEstandartu=filaEstandartu +1;                        
                    var valor='Estandar';
                    $scope.erroresimportacion.push({fila: filaEstandartu, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////Especial////////////////////////////////////                           
                  if(pattern.test(terrestreurbano.Especial)){ 
                     filaEspecialtu=filaEspecialtu +1;
                     $scope.ModalidadesProveedor.TerreUrbano.TerresUrbano= data.TerrestreUrbano;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaEspecialtu=filaEspecialtu +1;                        
                    var valor='Especial';
                    $scope.erroresimportacion.push({fila: filaEspecialtu, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }  
          }); 

   ///////////////////Aereas Carguero////////////////////////////////////////////
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
                     $scope.$apply();
                    }
                  else
                  {   
                  filaMinimaca=filaMinimaca +1;                        
                    var valor='Minima_Carguero';
                    $scope.erroresimportacion.push({fila: filaMinimaca, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////aerea45////////////////////////////////////                           
                  if(pattern.test(aereacarguero.aerea45)){ 
                     filaaerea45=filaaerea45 +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea45=filaaerea45 +1;                        
                    var valor='aerea45_Carguero';
                    $scope.erroresimportacion.push({fila: filaaerea45, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }  
              /////////////aerea100////////////////////////////////////                           
                  if(pattern.test(aereacarguero.aerea100)){ 
                     filaaerea100=filaaerea100 +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea100=filaaerea100 +1;                        
                    var valor='aerea100_Carguero';
                    $scope.erroresimportacion.push({fila: filaaerea100, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                 /////////////aerea300////////////////////////////////////                           
                  if(pattern.test(aereacarguero.aerea300)){ 
                     filaaerea300=filaaerea300 +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea300=filaaerea300 +1;                        
                    var valor='aerea300_Carguero';
                    $scope.erroresimportacion.push({fila: filaaerea300, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
             /////////////aerea500////////////////////////////////////                           
                  if(pattern.test(aereacarguero.aerea500)){ 
                     filaaerea500=filaaerea500 +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea500=filaaerea500 +1;                        
                    var valor='aerea500_Carguero';
                    $scope.erroresimportacion.push({fila: filaaerea500, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////aerea1000////////////////////////////////////                           
                  if(pattern.test(aereacarguero.aerea1000)){ 
                     filaaerea1000=filaaerea1000 +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea1000=filaaerea1000 +1;                        
                    var valor='aerea1000_Carguero';
                    $scope.erroresimportacion.push({fila: filaaerea1000, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////FSmin////////////////////////////////////                           
                  if(pattern.test(aereacarguero.FSmin)){ 
                     filaFSmin=filaFSmin +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
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
                     $scope.$apply();
                    }
                  else
                  {   
                  filaFskg=filaFskg +1;                        
                    var valor='Fskg_Carguero';
                    $scope.erroresimportacion.push({fila: filaFskg, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////GastosEmbarque////////////////////////////////////                           
                  if(pattern.test(aereacarguero.GastosEmbarque)){ 
                     filaGastosEmbarqueca=filaGastosEmbarqueca +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaGastosEmbarqueca=filaGastosEmbarqueca +1;                        
                    var valor='GastosEmbarque_Carguero';
                    $scope.erroresimportacion.push({fila: filaGastosEmbarqueca, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                /////////////Observaciones////////////////////////////////////                           
                  if(pattern.test(aereacarguero.Observaciones)){ 
                     filaObservacionesca=filaObservacionesca +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaObservacionesca=filaObservacionesca +1;                        
                    var valor='Observaciones_Carguero';
                    $scope.erroresimportacion.push({fila: filaObservacionesca, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////Time////////////////////////////////////                           
                  if(pattern.test(aereacarguero.Time)){ 
                     filaTimeca=filaTimeca +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaTimeca=filaTimeca +1;                        
                    var valor='Time_Carguero';
                    $scope.erroresimportacion.push({fila: filaTimeca, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////Via////////////////////////////////////                           
                  if(pattern.test(aereacarguero.Via)){ 
                     filaTimeca=filaVia +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaVia=filaVia +1;                        
                    var valor='Via_Carguero';
                    $scope.erroresimportacion.push({fila: filaVia, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////Frecuencia////////////////////////////////////                           
                  if(pattern.test(aereacarguero.Frecuencia)){ 
                     filaFrecuenciaac=filaFrecuenciaac +1;
                    $scope.ModalidadesProveedor.Aerea.Aereas= data.Aerea_Carguero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaFrecuenciaac=filaFrecuenciaac +1;                        
                    var valor='Frecuencia_Carguero';
                    $scope.erroresimportacion.push({fila: filaFrecuenciaac, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
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
                     $scope.$apply();
                    }
                  else
                  {   
                  filaMinimapa=filaMinimapa +1;                        
                    var valor='Minima_Pasajero';
                    $scope.erroresimportacion.push({fila: filaMinimapa, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////aerea45////////////////////////////////////                           
                  if(pattern.test(aereapasajero.aerea45)){ 
                     filaaerea45=filaaerea45 +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea45=filaaerea45 +1;                        
                    var valor='aerea45_Pasajero';
                    $scope.erroresimportacion.push({fila: filaaerea45, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   }  
              /////////////aerea100////////////////////////////////////                           
                  if(pattern.test(aereapasajero.aerea100)){ 
                     filaaerea100=filaaerea100 +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea100=filaaerea100 +1;                        
                    var valor='aerea100_Pasajero';
                    $scope.erroresimportacion.push({fila: filaaerea100, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                 /////////////aerea300////////////////////////////////////                           
                  if(pattern.test(aereapasajero.aerea300)){ 
                     filaaerea300=filaaerea300 +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea300=filaaerea300 +1;                        
                    var valor='aerea300_Pasajero';
                    $scope.erroresimportacion.push({fila: filaaerea300, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
             /////////////aerea500////////////////////////////////////                           
                  if(pattern.test(aereapasajero.aerea500)){ 
                     filaaerea500=filaaerea500 +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea500=filaaerea500 +1;                        
                    var valor='aerea500_Pasajero';
                    $scope.erroresimportacion.push({fila: filaaerea500, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////aerea1000////////////////////////////////////                           
                  if(pattern.test(aereapasajero.aerea1000)){ 
                     filaaerea1000=filaaerea1000 +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaaerea1000=filaaerea1000 +1;                        
                    var valor='aerea1000_Pasajero';
                    $scope.erroresimportacion.push({fila: filaaerea1000, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
               /////////////FSmin////////////////////////////////////                           
                  if(pattern.test(aereapasajero.FSmin)){ 
                     filaFSmin=filaFSmin +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
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
                     $scope.$apply();
                    }
                  else
                  {   
                  filaFskg=filaFskg +1;                        
                    var valor='Fskg_Pasajero';
                    $scope.erroresimportacion.push({fila: filaFskg, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////GastosEmbarque////////////////////////////////////                           
                  if(pattern.test(aereapasajero.GastosEmbarque)){ 
                     filaGastosEmbarquepa=filaGastosEmbarquepa +1;
                   $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaGastosEmbarquepa=filaGastosEmbarquepa +1;                        
                    var valor='GastosEmbarque_Pasajero';
                    $scope.erroresimportacion.push({fila: filaGastosEmbarquepa, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                /////////////Observaciones////////////////////////////////////                           
                  if(pattern.test(aereapasajero.Observaciones)){ 
                     filaObservacionespa=filaObservacionespa +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaObservacionespa=filaObservacionespa +1;                        
                    var valor='Observacione_Pasajeros';
                    $scope.erroresimportacion.push({fila: filaObservacionespa, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////Time////////////////////////////////////                           
                  if(pattern.test(aereapasajero.Time)){ 
                     filaTimepa=filaTimepa +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaTimepa=filaTimepa +1;                        
                    var valor='Time_Pasajero';
                    $scope.erroresimportacion.push({fila: filaTimepa, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
              /////////////Via////////////////////////////////////                           
                  if(pattern.test(aereapasajero.Via)){ 
                     filaTimeca=filaVia +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaVia=filaVia +1;                        
                    var valor='Via_Pasajero';
                    $scope.erroresimportacion.push({fila: filaVia, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
                    /////////////Frecuencia////////////////////////////////////                           
                  if(pattern.test(aereapasajero.Frecuencia)){ 
                     filaFrecuenciaaap=filaFrecuenciaaap +1;
                    $scope.ModalidadesProveedor.AereaPasajero.AereasPasajeros= data.Aerea_Pasajero;
                     $scope.$apply();
                    }
                  else
                  {   
                  filaFrecuenciaaap=filaFrecuenciaaap +1;                        
                    var valor='Frecuencia_Pasajero';
                    $scope.erroresimportacion.push({fila: filaFrecuenciaaap, campo:valor, error:'Valor NO numérico'});
                    $scope.AbrirModal(valor); 
                   } 
          }); 

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

            // Actualiza las modalidades para éste proveedores
          $scope.UpdateModalidades = function () {
            var Data = {};
           // Usuario o proveedor que se va a modificar viene del login, pero mientras se cree
            Data.ModalidadesProveedor = $scope.ModalidadesProveedor;
              console.log(Data.ModalidadesProveedor);
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