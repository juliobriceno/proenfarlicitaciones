var fs = require('fs');
var XLSX = require('xlsx');

module.exports = {
    parse: function(path, constructor, condiciones, next){
        var workbook = XLSX.readFile(path);
        var first_sheet_name = workbook.SheetNames[0];
	    var sheet = workbook.Sheets[first_sheet_name];
	    var range = XLSX.utils.decode_range(sheet['!ref']);
    	var MAXLEN = range.e.r;
    	var MAXCOL = range.e.c;

    	var data = [];
    	var errores = [];
    	var atributo;
    	var nombres = new nombresConstructor();

    	var empleados_err = [];
    	for(var row = 1; row <=MAXLEN; ++row){
    		var col = -1;
    		var fila = new constructor();
    		for(atributo in fila){
    			fila[atributo] = "";
    			++col;

    		    // Busca la columna de la hoja cuyo encabezado es igual al nombre del atributo del constructor, si no lo consigue no lo incluyó el usuario
    		    // por lo que salta validación
    			col = -1;
    			for (var fCol = 0; fCol <= MAXCOL; ++fCol) {
    			    var Rcell_address = XLSX.utils.encode_cell({ c: fCol, r: 0 });
    			    var Rcell = sheet[Rcell_address];
    			    if (Rcell.v == atributo)
    			    {
    			        col = fCol;
    			    }
    			}

    		    // La columna a validar no está en el excel. No valida nada
    			if (col != -1)
    			{
    			    var cell_address = XLSX.utils.encode_cell({ c: col, r: row });
    			    var cell = sheet[cell_address];
    			    var valor = null;
    			    if (cell == undefined) {
    			        valor = "";
    			    } else {
    			        if (atributo === "fnacimiento" || atributo === "fcontratacion" || atributo === "fantiguedad") {
    			            var fecha = XLSX.SSF.parse_date_code(cell.v, { date1904: false });
    			            valor = fecha.y + "/" + fecha.m + "/" + fecha.d;
    			        } else {
    			            valor = cell.v + "";
    			        }
    			        valor = valor.replace(/\s*$/, "");
    			    }
    			    var res = "";
    			    if (atributo === "rfc" || atributo === "curp") {
    			        res = condiciones[atributo](valor, fila["appaterno"], fila["apmaterno"], fila["nombre"], fila["fnacimiento"]);
    			    } else {
    			        res = condiciones[atributo](valor);
    			    }
    			    if (res != '') {
    			        errores.push({
    			            id: row,
    			            atributo: nombres[atributo],
    			            error: res,
    			        });
    			        if (empleados_err[empleados_err.length - 1] != row) {
    			            empleados_err.push(row);
    			        }
    			    }
    			    fila[atributo] = valor;
    			}

    		}

    		data.push(fila);
    	}
    	workbook = null;
    	sheet = null;
    	if(errores.length > 0){
    	    return next(errores, empleados_err.length);
    	} else{
    	    return next(null, data);
    	}


    },
    constructorNomina: function () {
        this.Cliente = ";";
        this.Nomina = ";";
        this.NombreCompleto = ";";
        this.Rfc = ";";
        this.Periodo = "";
    },
}

var nombresConstructor = function(){
        this.Cliente = "Cliente";
        this.Nomina = "Nomina";
        this.NombreCompleto = "NombreCompleto";
        this.Rfc = "Rfc";
        this.Periodo = "Periodo";
}
