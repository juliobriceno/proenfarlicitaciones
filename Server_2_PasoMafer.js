//////////////////// Generar Plantilla Excel Bodegaje/////////

app.get('/GetTemplateBodegaje', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Bodegajes');
     //xlVeryHidden

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });

    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
    ///////////////Bodegajes////////////////////////////
        ws.cell(1, 1).string('Submodalidad').style(style);
        ws.cell(2, 1).string('Aduanero').style(style);
        ws.cell(3, 1).string('Maquinaria').style(style);
        ws.cell(4, 1).string('Materia Prima').style(style);
        ws.cell(1, 2).string('TarifaValor').style(style);
        ws.cell(1, 3).string('TarifaMinima').style(style);
        ws.cell(1, 4).string('Otros').style(style);
        ws.cell(1, 5).string('FMM').style(style);
   

    wb.write('ExcelFile.xlsx', res);
        }); 

//////////////////// Generar Plantilla Excel Aduana/////////

app.get('/GetTemplateAduana', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws2 = wb.addWorksheet('Aduanas');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
    ///////////////Aduana///////////////////////////////
      MyMongo.Find('Aduanas', {}, function (result) {
          var Aduana = result;
     
         var col = 0 
       Aduana.forEach(function(aduana){
        col = col + 1;
        ws2.cell(1, 1).string('Via').style(style);
        ws2.cell(1, 2).string('Tarifa').style(style);
        ws2.cell(1, 3).string('Minima').style(style);
        ws2.cell(1, 4).string('GastosAdicionales').style(style);
        ws2.cell(1, 5).string('ConceptosAdicionales').style(style);
        ws2.cell(1, 6).string('GastosAdicionales2').style(style);
        ws2.cell(1, 7).string('ConceptosAdicionales2').style(style);
        ws2.cell(1, 8).string('GastosAdicionales3').style(style);
        ws2.cell(1, 9).string('ConceptosAdicionales3').style(style);
        ws2.cell(1, 10).string('CostoPlanificacionCaja').style(style);
        ws2.cell(1, 11).string('Otros').style(style);
        ws2.cell(col + 1, 1 ).string(aduana.Via).style(style);
        });
   

    wb.write('ExcelFile.xlsx', res);
        }); 
  });

//////////////////// Generar Plantilla Excel OTM/////////

app.get('/GetTemplateOTM', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws3 = wb.addWorksheet('OTM');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
   ///////////////OTM///////////////////////////////
      MyMongo.Find('Otms', {}, function (result) {
          var OTm = result;  

        var col = 0 
        OTm.forEach(function(otm){        
        col = col + 1;
        ws3.cell(1, 1).string('Origen').style(style);
        ws3.cell(1, 2).string('Destino').style(style);
        ws3.cell(1, 3).string('cveintecuatroconcinco').style(style);
        ws3.cell(1, 4).string('cveinteoocho').style(style);
        ws3.cell(1, 5).string('cveintendiez').style(style);
        ws3.cell(1, 6).string('cveintendiezsiete').style(style);
        ws3.cell(1, 7).string('cveintendieznueve').style(style);
        ws3.cell(1, 8).string('cveinteveinte').style(style);
        ws3.cell(1, 9).string('cveinteveinteyuno').style(style);
        ws3.cell(1, 10).string('cveinteveinteycinco').style(style);
        ws3.cell(1, 11).string('ccuarentaquince').style(style);
        ws3.cell(1, 12).string('ccuarentadiezyseis').style(style);
        ws3.cell(1, 13).string('ccuarentadiezysiete').style(style);
        ws3.cell(1, 14).string('ccuarentaveinte').style(style);
        ws3.cell(1, 15).string('ccuarentaveinteyuno').style(style);
        ws3.cell(1, 16).string('ccuarentaveinteydos').style(style);
        ws3.cell(1, 17).string('ccuarentatreinta').style(style);
        ws3.cell(1, 18).string('devolucionveinteestandar').style(style);
        ws3.cell(1, 19).string('devolucioncuarentaestandar').style(style);
        ws3.cell(1, 20).string('devolucionveinteexpreso').style(style);
        ws3.cell(1, 21).string('devolucioncuarentaexpreso').style(style);
        ws3.cell(col + 1, 1).string(otm.Origen).style(style);       
        ws3.cell(col + 1, 2).string(otm.Destino).style(style);
        }); 
   

        wb.write('ExcelFile.xlsx', res);
        }); 
  });


//////////////////// Generar Plantilla Excel MaritimasFcl/////////

app.get('/GetTemplateMariFcl', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws4 = wb.addWorksheet('MaritimasFcl');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
    ///////////////MaritimasLcl///////////////////////////////
      MyMongo.Find('MaritimasFcl', {}, function (result) {
          var MaritFcl= result;  

        var col = 0 
        MaritFcl.forEach(function(maritFcl){        
        col = col + 1;
        ws4.cell(1, 1).string('PaisDestino').style(style);
        ws4.cell(1, 2).string('PuertoOrigen').style(style);
        ws4.cell(1, 3).string('PuertoDestino').style(style);
        ws4.cell(1, 4).string('C20').style(style);
        ws4.cell(1, 5).string('Baf20').style(style);
        ws4.cell(1, 6).string('C40').style(style);
        ws4.cell(1, 7).string('Baf40').style(style);
        ws4.cell(1, 8).string('Baf40HC').style(style);
        ws4.cell(1, 9).string('Observaciones').style(style);
        ws4.cell(1, 10).string('GastosEmbarque').style(style);
        ws4.cell(1, 11).string('Time').style(style);
        ws4.cell(1, 12).string('Naviera').style(style);
        ws4.cell(1, 13).string('Frecuencia').style(style);
        ws4.cell(col + 1, 1).string(maritFcl.PaisDestino).style(style);       
        ws4.cell(col + 1, 2).string(maritFcl.PuertoOrigen).style(style);        
        ws4.cell(col + 1, 3).string(maritFcl.PuertoDestino).style(style);
        }); 
   

    wb.write('ExcelFile.xlsx', res);
        }); 
  });

app.get('/GetTemplateMariLcl', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws5 = wb.addWorksheet('MaritimasLcl');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
   ///////////////MaritimasLcl///////////////////////////////
      MyMongo.Find('MaritimasLcl', {}, function (result) {
          var MaritLcl= result;  

      var Valortime = [{ Name: '2-3' }, {Name: '3-4' }, {Name: '4-5' }, {Name: '1' }, {Name: '2' }, {Name: '3' },
                          {Name: '4' },{Name: '5' }, {Name: '6' }, {Name: '7' }, {Name: '8' }, {Name: '9' }, {Name: '10' }];

        var col = 0 
        MaritLcl.forEach(function(maritlcl){        
        col = col + 1;
        ws5.cell(1, 1).string('PaisDestino').style(style);
        ws5.cell(1, 2).string('PuertoOrigen').style(style);
        ws5.cell(1, 3).string('PuertoDestino').style(style);
        ws5.cell(1, 4).string('Minima').style(style);
        ws5.cell(1, 5).string('ton15').style(style);
        ws5.cell(1, 6).string('ton58').style(style);
        ws5.cell(1, 7).string('ton812').style(style);
        ws5.cell(1, 8).string('ton1218').style(style);
        ws5.cell(1, 9).string('GastosEmbarque').style(style);
        ws5.cell(1, 10).string('Observaciones').style(style);        
        ws5.cell(1, 11).string('Time').style(style);
        ws5.cell(1, 12).string('Naviera').style(style);
        ws5.cell(1, 13).string('Frecuencia').style(style);
        ws5.cell(col + 1, 1).string(maritlcl.PaisDestino).style(style);       
        ws5.cell(col + 1, 2).string(maritlcl.PuertoOrigen).style(style);       
        ws5.cell(col + 1, 3).string(maritlcl.PuertoDestino).style(style);
        }); 
   

    wb.write('ExcelFile.xlsx', res);
        }); 
        }); 


app.get('/GetTemplateTerreNacional', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws6 = wb.addWorksheet('TerrestreNacional');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
///////////////Terrestre Nacional///////////////////////////////
      MyMongo.Find('TerresNacional', {}, function (result) {
          var TerrestNacional= result;  

        var col = 0 
        TerrestNacional.forEach(function(terrestnacional){        
        col = col + 1;
        ws6.cell(1, 1).string('PaisOrigen').style(style);
        ws6.cell(1, 2).string('PuertoDestino').style(style);
        ws6.cell(1, 3).string('Estandar').style(style);
        ws6.cell(1, 4).string('Especial').style(style);
        ws6.cell(col + 1, 1).string(terrestnacional.PaisOrigen).style(style);       
        ws6.cell(col + 1, 2).string(terrestnacional.PuertoDestino).style(style);
        });

    wb.write('ExcelFile.xlsx', res);
        }); 
        }); 


app.get('/GetTemplateTerreUrbano', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws7 = wb.addWorksheet('TerrestreUrbano');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
    ///////////////Terrestre Urbano///////////////////////////////
      MyMongo.Find('TerresUrbano', {}, function (result) {
          var TerrestUrbano= result;  

        var col = 0 
        TerrestUrbano.forEach(function(terresturbano){        
        col = col + 1;
        ws7.cell(1, 1).string('PaisOrigen').style(style);
        ws7.cell(1, 2).string('PuertoDestino').style(style);
        ws7.cell(1, 3).string('Estandar').style(style);
        ws7.cell(1, 4).string('Especial').style(style);        
        ws7.cell(col + 1, 1).string(terresturbano.PaisOrigen).style(style);      
        ws7.cell(col + 1, 2).string(terresturbano.PuertoDestino).style(style);
        });  

    wb.write('ExcelFile.xlsx', res);
        });     
  });
     



app.get('/GetTemplateAerea', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws8 = wb.addWorksheet('Aerea_Carguero');
    var ws9 = wb.addWorksheet('Aerea_Pasajero');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',            
            size: 12
        },

        numberFormat: '$#,##0.00; ($#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
   ///////////////Aereas Crguero///////////////////////////////
      MyMongo.Find('Aereas', {}, function (result) {
          var AereasC= result;  

        var col = 0 
        AereasC.forEach(function(aereasc){        
        col = col + 1;
        ws8.cell(1, 1).string('Pais').style(style);
        ws8.cell(1, 2).string('Aeropuerto').style(style);
        ws8.cell(1, 3).string('Minima').style(style);
        ws8.cell(1, 4).string('aerea45').style(style); 
        ws8.cell(1, 5).string('aerea100').style(style);       
        ws8.cell(1, 6).string('aerea300').style(style);
        ws8.cell(1, 7).string('aerea500').style(style);
        ws8.cell(1, 8).string('aerea1000').style(style);
        ws8.cell(1, 9).string('FSmin').style(style);
        ws8.cell(1, 10).string('Fskg').style(style);
        ws8.cell(1, 11).string('GastosEmbarque').style(style);
        ws8.cell(1, 12).string('Observaciones').style(style);
        ws8.cell(1, 13).string('Time').style(style);
        ws8.cell(1, 14).string('Via').style(style);
        ws8.cell(1, 15).string('Frecuencia').style(style);
        ws8.cell(col + 1, 1).string(aereasc.Pais).style(style);      
        ws8.cell(col + 1, 2).string(aereasc.Aeropuerto).style(style);
        }); 

    ///////////////Aereas Pasajero///////////////////////////////
      MyMongo.Find('AereasPasajeros', {}, function (result) {
          var AereasP= result;  

        var col = 0 
        AereasP.forEach(function(aereasp){        
        col = col + 1;
        ws9.cell(1, 1).string('Pais').style(style);
        ws9.cell(1, 2).string('Aeropuerto').style(style);
        ws9.cell(1, 3).string('Minima').style(style);
        ws9.cell(1, 4).string('aerea45').style(style); 
        ws9.cell(1, 5).string('aerea100').style(style);       
        ws9.cell(1, 6).string('aerea300').style(style);
        ws9.cell(1, 7).string('aerea500').style(style);
        ws9.cell(1, 8).string('aerea1000').style(style);
        ws9.cell(1, 9).string('FSmin').style(style);
        ws9.cell(1, 10).string('Fskg').style(style);
        ws9.cell(1, 11).string('GastosEmbarque').style(style);
        ws9.cell(1, 12).string('Observaciones').style(style);
        ws9.cell(1, 13).string('Time').style(style);
        ws9.cell(1, 14).string('Via').style(style);
        ws9.cell(1, 15).string('Frecuencia').style(style);
        ws9.cell(col + 1, 1).string(aereasp.Pais).style(style);      
        ws9.cell(col + 1, 2).string(aereasp.Aeropuerto).style(style);
        });  

    wb.write('ExcelFile.xlsx', res);
        }); 
       }); 
       }); 