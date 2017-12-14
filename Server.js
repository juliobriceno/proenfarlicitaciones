var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/listado-empleados.html'));
});

app.get('/webservices',function(req,res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
	var Data = {};
	Data.Enterprises = [{Name: "http://www.google.com"}, {Name: "http://www.ptree.com.mx"}];
	Data.CostCenters = [{Name: "Centro Costo 1"}, {Name: "Centro Costo 2"}];
	Data.PayrollTypes = [{Name: "Quincenal"}, {Name: "Mensual"}];
    res.end(JSON.stringify(Data));
});

app.post('/connection',function(req,res){
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://localhost:27017/mydb';
	console.log(req.body);
	MongoClient.connect(url, function (err, db) {
	  if (err) {
		console.log('Tremendo Error!!!!');
	  }
	  else {
		var filter = {$and : [{"id":{$ne:""}}]};
		var orEnterprises = {$or: [{}]};
		var orCostCenters = {$or: [{}]};
		var orPayrollTypes = {$or: [{}]};
		
		if (req.body.selectedEnterprises.length > 0) {orEnterprises.$or = []};
		for (var i = 0; i < req.body.selectedEnterprises.length; i++) {
			orEnterprises.$or.push({"enterprise": req.body.selectedEnterprises[i].Name});
		}		
		
		if (req.body.selectedCostCenters.length > 0) {orCostCenters.$or = []};
		for (var i = 0; i < req.body.selectedCostCenters.length; i++) {
			orCostCenters.$or.push({"costcenter": req.body.selectedCostCenters[i].Name});
		}		
		
		if (req.body.selectedPayrollTypes.length > 0) {orPayrollTypes.$or = []};
		for (var i = 0; i < req.body.selectedPayrollTypes.length; i++) {
			orPayrollTypes.$or.push({"payrolltype": req.body.selectedPayrollTypes[i].Name});
		}		
		
		filter.$and.push(orEnterprises);
		filter.$and.push(orCostCenters);
		filter.$and.push(orPayrollTypes);
		
		if (req.body.txtId != "") {
			filter.$and.push({"id": req.body.txtId});
		} 
		
		if (req.body.txtName != "") {
			filter.$and.push({'name': {'$regex': req.body.txtName, $options: 'i'}});
		} 
		
		console.log(filter);
		var collection = db.collection('Employees');
		collection.find(filter).toArray(function (err, result) {
		  var Data = {};
		  if (err) {
			console.log(err);
		  } else if (result.length) {
			console.log('Found:', result);
			res.writeHead(200, { 'Content-Type': 'application/json' });
			Data.Employees = result;
			res.end(JSON.stringify(Data));
		  } else {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			Data.Employees = []; 
			res.end(JSON.stringify(Data));
			console.log('No document(s) found with defined "find" criteria!');
		  }
		});
	  }
      db.close();
	});
});

app.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/sitemap.html'));
});

app.listen(3000);

console.log("Running at Port 3000 Ok");