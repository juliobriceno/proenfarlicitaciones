var express = require("express");
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');
var session = require('client-sessions');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var MyDrive = require('./js/drive.js');
var MySheet = require('./js/sheets.js');
var MyMongo = require('./js/mymongo.js');
var MyUnderScore = require('./js/underscore.js');
var MyMail = require('./js/mails.js');
var MyConst = require('./js/constantes.js');
var passport = require('passport');
var util = require('util');
var RedisStore = require('connect-redis')(expressSession)
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var Parser = require("./js/parser.js");
var Validador = require("./js/fiscalValidaciones.js");

app.use(cookieParser());
app.use(expressSession({ secret: '2828AAAA', resave: true, saveUninitialized: true }));
// Para crear Log de App
var fsLog = require('fs')
  , Log = require('log')
  , log = new Log('debug', fsLog.createWriteStream('licitacionesProenfar.log'));
  // Fin Para crear Log de App

app.use(function (req, res, next) {
    // Archivos estáticos si los devuelve
    if (req.path.indexOf('/js') >= 0 || req.path.indexOf('/css') >= 0 || req.path.indexOf('/img') >= 0 || req.path.indexOf('/font') >= 0){
      next();
    }
    // Si el usuario no está log in vuelve al login
    else if (req.path.indexOf('/Login') >= 0 || req.path.indexOf('/RecoverPassword') >= 0){
      next();
    }
    // Si el usuario no está log in vuelve al login
    else if (typeof req.session.user == 'undefined' && req.path.indexOf('index.html') == -1){
      res.redirect('/index.html');
    }
    else if ((req.path.indexOf('notificaciones.html') >= 0 || req.path.indexOf('proveedores.html') >= 0 || req.path.indexOf('usuarios.html') >= 0 || req.path.indexOf('nuevo_usuario.html') >= 0 || req.path.indexOf('preguntas.html') >= 0 || req.path.indexOf('requisitos.html') >= 0)  && (req.session.user.Perfil == 3))  {
      res.redirect('/index.html');
    }
    // Si es usuario comercio exterior no ve éstas pantallas
    else if ((req.path.indexOf('cuenta_proveedor.html') >= 0 || req.path.indexOf('licitacion.html') >= 0 || req.path.indexOf('contactos_modalidad.html') >= 0)  && (req.session.user.Perfil == 1))  {
      res.redirect('/index.html');
    }
    else{
      next();
    }
});

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/lib", express.static(__dirname + '/lib'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/", express.static(__dirname + '/'));
app.use(fileUpload());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

//app.use(bodyParser.json());

var GOOGLE_CLIENT_ID = "571842273805-k0dts5d0mbv7bmqmmrcb6on4kn83s8fm.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET = "khF17HdaTIfFbHcAW9a-WrsC";

var googleapis = require('googleapis')
  , drive = googleapis.drive('v3')

var key = require('./path/serviceaccount.json');
const fs = require('fs');

var jwtClient = new googleapis.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/gmail.readonly'
    , 'https://www.googleapis.com/auth/gmail.send'
  ],
  null
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8086/auth/google/callback",
    passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
          return done(null, profile);
      });
  }
));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'somesecrettokenhere',
    name: 'julio',
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379
    }),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/extgoogle', function (req, res) {
    if (typeof req.query.startpage == 'undefined') {
        req.session.startpage = 'solicitudes';
    }
    req.session.startpage = req.query.startpage;
    console.log(req.session.startpage);
    res.redirect('/auth/google');
    res.end();
});

app.get('/auth/google', passport.authenticate('google', {
    scope: [
           'https://www.googleapis.com/auth/plus.login',
           'https://www.googleapis.com/auth/plus.profile.emails.read']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
      MyMongo.Find('Usuarios', { Email: req.user.email }, function (result) {
          if (result.length > 0) {
              req.session.user = result;
              res.redirect('/solicitudes.html');
              return 0;
          }
          else {
              res.redirect('/index.html?error=1');
              return 0;
          }
      }
      );
  });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

app.get('/Solicitudes', function (req, res) {
    res.sendFile(path.join(__dirname + '/solicitudes.html'));
});

app.post('/GetSolicitudes', function (req, res) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://juliobricenoro:juliobricenoro@ds121464.mlab.com:21464/smartjobs'; // Después de la URL (Fija con puerto por defecto Mongo) viene la BD
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Se generó error. Debe haber guardado de Log y gestión en e cliente');
        }
        else {
            var collection = db.collection('Solicitudes');
            var filter = { $and: [{ "Fecha": { $gt: new Date(req.body.txtStartDate) } }, { "Fecha": { $lte: new Date(req.body.txtEndDate) } }] };

            filter.$and.push({ "Nomina": { $in: req.session.user[0].Nominas.map(e => e.Name) } });

            if (req.body.selectedEstatus.Id != 0) {
                filter.$and.push({ "Estatus": req.body.selectedEstatus.Name });
            }
            if (req.session.user[0].Email != "admin@gmail.com") {
                filter.$and.push({ "Usuario": req.session.user[0].Email });
            }
            collection.find(filter).toArray(function (err, result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                var Data = {};
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    console.log('Found:', result);
                    Data.Solicitudes = result;
                    Data.User = req.session.user[0];
                    res.end(JSON.stringify(Data));
                } else {
                    Data.Solicitudes = [];
                    Data.User = req.session.user[0];
                    res.end(JSON.stringify(Data));
                    console.log('No document(s) found with defined "find" criteria!');
                }
            });
        }
        db.close();
    });
});

app.post('/Ejemplo', function (req, res) {
    console.log('Dale');
});

app.post('/UpdateComment', function (req, res) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://juliobricenoro:juliobricenoro@ds121464.mlab.com:21464/smartjobs';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Se generó error. Debe haber guardado de Log y gestión en e cliente');
        }
        else {
            var Data = {};
            var collection = db.collection('Solicitudes');
            var o_id = new mongodb.ObjectID(req.body._id);
            var iSet = {};
            if (req.body.Estatus == "En Proceso")
            {
                iSet = { Comentarios: req.body.Comentarios };
            }
            else
            {
                iSet = { Estatus: req.body.Estatus, Comentarios: req.body.Comentarios };
            }
            collection.update({ "_id": o_id }, { $set: iSet }, function (err, result) {
                if (err) {
                    console.log('Se generó error. Debe haber guardado de Log y gestión en e cliente');
                }
                else {
                    Data.User = req.session.user[0];
                    Data.Respuesta = 'Ok';
                    MyMail.SendEmail("<b>Hubo un nuevo comentario!</b><p>", "juliob@ptree.com.mx", "Nuevo comentario");
                    res.end(JSON.stringify(Data));
                }
            });
        }
        db.close();
    });
});

app.post('/AddSolicitud', function (req, res) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://juliobricenoro:juliobricenoro@ds121464.mlab.com:21464/smartjobs';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Se generó error. Debe haber guardado de Log y gestión en e cliente');
        }
        else {
            var collection = db.collection('Solicitudes');
            collection.insert({ Fecha: new Date(), Solicitud: req.body.Solicitud, Tipo: req.body.Tipo, Estatus: 'En Proceso', Usuario: req.body.ActiveUser, Nomina: req.body.Nomina, Periodo: req.body.Periodo, Empleado: req.body.Empleado, UltimoArchivoId: "SD", Comentarios: [{ "Fecha": new Date(), "LeidoAdmin": "No", "LeidoUser": "No", "Comentario": req.body.Solicitud, "Usuario": req.body.ActiveUser }] }, function (err, result) {
                if (err) {
                    console.log('Se generó error. Debe haber guardado de Log y gestión en e cliente');
                }
                else {
                    MyMail.SendEmail("<b>Tienes una nueva solicitud!</b><p>", "juliob@ptree.com.mx", "Nueva solicitud");
                    res.end(JSON.stringify({ Respuesta: 'Ok' }));
                }
            });
        }
        db.close();
    });
});

app.post('/GetUsuarios', function (req, res) {

    MyMongo.Find('Usuarios', {}, function (result) {
        var Data = {};
        Data.Usuarios = result;
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/GetUsuariosfill', function (req, res) {

    MyMongo.Find('Usuarios', { Email: req.body.Email }, function (result)  {
        var Data = {};
        Data.Usuarios = result;
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/DeleteContacto', function (req, res) {

    MyMongo.Remove('contactomodalidad', { email: req.body.Email }, function (result) {
        var Data = {};
        Data.Result = 'Ok';
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/DeleteUser', function (req, res) {

    MyMongo.Remove('Usuarios', { User: req.body.User }, function (result) {
        var Data = {};
        Data.Result = 'Ok';
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/GetRights', function (req, res) {

    MyMongo.Find('Rights', {}, function (result) {
        var Data = {};
        Data.Rights = result;
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/UpdateRights', function (req, res) {

    for (var i = 0; i < req.body.Rights.length; i++) {
        MyMongo.UpdateCriteria('Rights', { Id: req.body.Rights[i].Id }, { Solicitudes: req.body.Rights[i].Solicitudes, NuevaSolicitud: req.body.Rights[i].NuevaSolicitud, RecibosAsimilados: req.body.Rights[i].RecibosAsimilados, AdministracionUsuario: req.body.Rights[i].AdministracionUsuario, NuevoUsuario: req.body.Rights[i].NuevoUsuario, ControlPerfiles: req.body.Rights[i].ControlPerfiles }, function (resp) {
            var a = true;
        }
        );
    }

    var Data = {};
    Data.Result = 'Ok';
    res.end(JSON.stringify(Data))
    return 0;

});

app.post('/updatePassword', function (req, res) {

    var Data = {};

    if (typeof req.session.user == 'undefined') {
        Data.Result = 'nc';
        res.end(JSON.stringify(Data));
        return 0;
    }

    MyMongo.UpdateCriteria('Usuarios', { 'User': req.session.user.User }, { 'Password': req.body.Password }, function (result) {
        if (result == 'Ok') {
            Data.Result = 'Ok';
            res.end(JSON.stringify(Data))
        };
    });
});

app.post('/closeSession', function (req, res) {

    delete req.session.user;
    var Data = {};
    Data.Result = 'Ok';
    res.end(JSON.stringify(Data));

});

// Julio HOY
app.post('/GetUsuario', function (req, res) {
  MyMongo.Find('Usuarios', { User: req.body.User }, function (result) {

    var DataProveedor = result;

    MyMongo.Find('proveedorfiles', { User: req.body.User }, function (result) {
      var Data = {};
      Data.Result = 'Ok';
      Data.data = DataProveedor;
      Data.ProveedorFiles = result;
      req.session.proveedorfiles = result;

      res.end(JSON.stringify(Data));
    })

  })
});

// Julio HOY
app.post('/GetContactoModalidad', function (req, res) {
  MyMongo.Find('contactomodalidad', { email: req.body.Email }, function (result) {
    var Data = {};
    Data.Result = 'Ok';
    Data.contactomodalidad = result[0];
    res.end(JSON.stringify(Data));
  })
});

// Mafer para validar que al finalizar licitacion ddebe tener algun contacto cargado

app.post('/GetContactoModalidadProveedor', function (req, res) {
  MyMongo.Find('contactomodalidad', { Proveedor: req.body.Proveedor }, function (result) {
    var Data = {};
    Data.Result = 'Ok';
    Data.contactomodalidadproveedor = result[0];
    res.end(JSON.stringify(Data));
    console.log( res.end(JSON.stringify(Data)));
  })
});
// Julio HOY
app.post('/SaveUsuarioComplete', function (req, res) {
  MyMongo.Remove('Usuarios', { Email: req.body.Usuario.Email }, function (result) {
    MyMongo.Insert('Usuarios', req.body.Usuario, function (result) {
        if (result == 'Ok') {
            req.session.user =req.body.Usuario;
            var Data = {};
            Data.Result = 'Ok';
            res.end(JSON.stringify(Data))
            return 0;
        };
    }
    );
  }
  );
});

// Julio HOY
app.post('/api/uploadFileNotificationEmail', function (req, res) {

    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.file;

    if (typeof req.session.emailfiles == 'undefined'){
      req.session.emailfiles = [];
      req.session.emailfiles.push({file: sampleFile});
    }
    else{
      req.session.emailfiles.push({file: sampleFile});
    }

    var Data = {};
    Data.Result = 'Ok';
    res.end(JSON.stringify(Data))
    return 0;

});

// Julio HOY
app.post('/api/uploadFile', function (req, res) {
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.file;

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        var Data = {};

        var FolderId = '';

        // Envía la plantilla de empleados a Drive
        MyDrive.createFolder(jwtClient, req.body.Nit + '_' + req.body.RazonSocial, '1q9EtO-3di6s8LhxIl8ybpfp6_e5w7tKI', function (err, files) {
            MyDrive.createFolder(jwtClient, 'Documentos', files, function (err, files) {

                if (err) {
                    console.log(err);
                } else {
                    console.log(files);

                    if (err) {
                        console.log(err);
                    } else {
                        console.log(files);
                        FolderId = files;

                        var fileMetadata = {
                            'name': sampleFile.name,
                            parents: [FolderId]
                        };
                        var media = {
                            mimeType: sampleFile.mimetype,
                            body: sampleFile.data
                        };
                        drive.files.create({
                            auth: jwtClient,
                            resource: fileMetadata,
                            media: media,
                            fields: 'id, webContentLink'
                        }, function (err, file) {
                            if (err) {
                                console.log(err);
                            }

                            else {

                                // Por cada archivo crea un registro en una colección donde estarán todos los documentos por proveedore
                                // si no está creada la matriz para almacenar los valores de files la crea
                                if (typeof req.session.proveedorfiles == 'undefined'){
                                  req.session.proveedorfiles = [];
                                }

                                req.session.proveedorfiles.push( { User: req.session.user.User, FileName: sampleFile.name, Id: file.id } );

                                MyMongo.Remove('proveedorfiles', { User: req.session.user.User }, function (result) {
                                  MyMongo.Insert('proveedorfiles', req.session.proveedorfiles, function (result) {
                                      if (result == 'Ok') {
                                          Data.Result = 'Ok';
                                          Data.ProveedorFiles = req.session.proveedorfiles;
                                          res.end(JSON.stringify(Data));
                                          return 0;
                                      };
                                  }
                                  );
                                }
                                );

                            }
                        });


                    }

                }

            });
        });

    });

});

app.post('/SaveUser', function (req, res) {

    var Data = {};

    console.log('Paso por aqui 1');
    console.log(req.body.EditUser);

    if (req.session.user.Perfil == 3){
      console.log('Paso por aqui 2');
      Data.Result = 'noallow';
      res.end(JSON.stringify(Data));
      return 0;
    }

    if (req.body.EditUser == '') {
        MyMongo.Find('Usuarios', {$or: [{User: req.body.UserName}, {Email: req.body.Email}]}, function (result) {
        //MyMongo.Find('Usuarios', { User: req.body.User }, function (result) {
            if (result.length > 0) {
                Data.Result = 'ex';
                res.end(JSON.stringify(Data));
            }
            else {

                // Genera contraseña nueva (Para casos de usuarios nuevos)
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                MyMongo.Insert('Usuarios', { Email: req.body.Email, Password: text, Level: req.body.Level, Perfil: req.body.Perfil, NombrePerfil: req.body.NombrePerfil, Name: req.body.UserName, User: req.body.User, Nit: req.body.Nit, Phone: req.body.Phone, RazonSocial: req.body.RazonSocial }, function (result) {

                    var msg = MyConst.CorreoHTML;

                    msg = msg.replace('@@Encabezado', 'Acceso a plataforma de proveedores de Proenfar.');

                    var msgBody = 'Puede ingresar a la plataforma de Licitaciones de Proenfar con el usuario: ' + req.body.User +  ' y clave: ' + text;

                    msg = msg.replace('@@Body', msgBody);
                    msg = msg.replace('@@boton', '<a href="http://licita.proenfar.com">Portal Proenfar</a>');
                    msg = msg.replace('@@Pie', "href='http://licita.proenfar.com'>Ir al <b>Portal</b>");

                    var subject = "Acceso a plataforma de proveedores Proenfar.";

                    // Sólo envía contraseña si Perfil No es proveedor que se envía con notificación
                    if (req.body.Perfil != 3){
                      MyMail.SendEmail(msg, req.body.Email, subject);
                    }

                    if (result == 'Ok') {
                        Data.Result = 'Ok';
                        res.end(JSON.stringify(Data))
                        return 0;
                    };
                }
                );
            }
        }
    );
    }
    else {
        MyMongo.UpdateCriteria('Usuarios', { User: req.body.EditUser }, { Email: req.body.Email, Password: req.body.Password, Level: req.body.Level, Perfil: req.body.Perfil, NombrePerfil: req.body.NombrePerfil, Name: req.body.UserName, User: req.body.User, Nit: req.body.Nit, Phone: req.body.Phone, RazonSocial: req.body.RazonSocial }, function (resp) {
            Data.Result = 'Ok';
            res.end(JSON.stringify(Data))
            return 0;
        }
        );
    }
});

app.post('/SaveContactoModalidad', function (req, res) {

    var Data = {};

    if (req.body.ContactoPorModalidadEmail == '') {
        MyMongo.Find('contactomodalidad', { email: req.body.contactomodalidad.email }, function (result) {
            if (result.length > 0) {
                Data.Result = 'ex';
                res.end(JSON.stringify(Data));
            }
            else {

                MyMongo.Insert('contactomodalidad', req.body.contactomodalidad, function (result) {

                    if (result == 'Ok') {
                        Data.Result = 'Ok';
                        res.end(JSON.stringify(Data))
                        return 0;
                    };
                }
                );
            }
        }
    );
    }
    else {

      MyMongo.Remove('contactomodalidad', { email: req.body.contactomodalidad.email }, function (result) {
        MyMongo.Insert('contactomodalidad', req.body.contactomodalidad, function (result) {
            if (result == 'Ok') {
                Data.Result = 'Ok';
                res.end(JSON.stringify(Data))
                return 0;
            };
        }
        );
      }
      );

    }
});

app.post('/SaveUserProveedor', function (req, res) {

    var Data = {};

    if (req.body.EditUser == '') {
        MyMongo.Find('Proveedor', { Email: req.body.Email }, function (result) {
            if (result.length > 0) {
                Data.Result = 'ex';
                res.end(JSON.stringify(Data));
            }
            else {
                MyMongo.Insert('Proveedor', { Email: req.body.Email, Password: req.body.Password, Name: req.body.UserName, User: req.body.User, Nit: req.body.Nit, Phone: req.body.Phone }, function (result) {
                    if (result == 'Ok') {
                        Data.Result = 'Ok';
                        res.end(JSON.stringify(Data))
                        return 0;
                    };
                }
                );
            }
        }
    );
    }
    else {
        MyMongo.UpdateCriteria('Proveedor', { Email: req.body.EditUser }, { Password: req.body.Password, Name: req.body.UserName, User: req.body.User, Nit: req.body.Nit, Phone: req.body.Phone }, function (resp) {
            Data.Result = 'Ok';
            res.end(JSON.stringify(Data))
            return 0;
        }
        );
    }
});

app.post('/GetContactosPorModalidades', function (req, res) {
    MyMongo.Find('contactomodalidad', { Proveedor: req.body.Proveedor }, function (result) {
      var Data = {};
      Data.Result = 'ok';
      Data.contactosmodalidades = result;
      res.end(JSON.stringify(Data));
    }
    );
});

app.post('/RecoverPassword', function (req, res) {

    MyMongo.Find('Usuarios', { User: req.body.Usuario }, function (result) {

        var myUser = result[0];

        if (result.length == 0) {
            var Data = {};
            Data.Result = 'No';
            res.end(JSON.stringify(Data))
        }
        else {

          console.log('tres');

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            MyMongo.UpdateCriteria('Usuarios', { 'User': req.body.Usuario }, { 'Password': text }, function (result) {
                if (result == 'Ok') {

                  console.log('cuatro');


                    var msg = "<table style='max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;'><tr><td style='background-color: #fff; text-align: left; padding: 0;'><img width='20%' style='display:block; margin: 2% 3%' src=''></a></td></tr><tr><td style='padding: 0'></td></tr><tr><td style='background-color: #fff'><div style='color: #34495e; text-align: justify;font-family: sans-serif'><div style='color: #fff; margin: 0 0 5%; text-align:center; height: 120px; background-color: #3498db; padding: 4% 10% 2%; font-size: 23px;'><b>La nueva clave de su usuario para acceso al portal Licitaciones Proenfar es: <label>" + text + "</label> </b> <br><br><a href=''></a></b></div><p style='margin: 2%px; font-size: 15px; margin: 4% 10% 2%;'><br></p><div style='width: 100%;margin:20px 0; display: inline-block;text-align: center'></div><div style='width: 100%; text-align: center'><a style='text-decoration: none; border-radius: 5px; padding: 11px 23px; color: white; background-color: #3498db' href='http://licita.proenfar.com'>Ir al <b>Portal</b></a></div><p style='color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0; padding:20px 0 0;  background-color:#3498db; height: 30px'>Portal Licitaciones Proenfar.</p></div></td></tr></table>";

                    MyMail.SendEmail(msg, myUser.Email, "Se generó una nueva clave para su cuenta en el portal Licitaciones Proenfar.");

                    var Data = {};
                    Data.Result = 'Ok';
                    res.end(JSON.stringify(Data))
                };
            }
            );


        }
    });

});

app.post('/GetBuscarUsuario', function (req, res) {

    MyMongo.Find('Usuarios', { $and: [{ Name: { '$regex': req.body.params.usuario, '$options': 'i' }}, { "Perfil": 3 }] }, function (result) {

        if (result.length > 0) {
            var Data = {};
            Data.Result = 'ok';
            Data.Usuarios = result;
            res.end(JSON.stringify(Data));
        }
        else {
            var Data = {};
            Data.Result = 'Error';
            res.end(JSON.stringify(Data));
        }
    }
    );
});

app.post('/GetBuscarUsuarioByRazon', function (req, res) {

    MyMongo.Find('Usuarios', { $and: [{ RazonSocial: { '$regex': req.body.params.usuario, '$options': 'i' }}, { "Perfil": 3 }] }, function (result) {

        if (result.length > 0) {
            var Data = {};
            Data.Result = 'ok';
            Data.Usuarios = result;
            res.end(JSON.stringify(Data));
        }
        else {
            var Data = {};
            Data.Result = 'Error';
            res.end(JSON.stringify(Data));
        }
    }
    );
});

app.post('/GetUsuarioProveedor', function (req, res) {
  MyMongo.Find('Usuarios', { NombrePerfil: 'Proveedor' }, function (result) {
    var Data = {};
    Data.Result = 'Ok';
    Data.data = result;
    res.end(JSON.stringify(Data));
  })
});

app.post('/GetUsuarioProveedordiligenciado', function (req, res) {

  // Para poder saber qué proveedores fueron marcados como seleccionados
  MyMongo.Find('LicitacionProveedor', {} , function (result) {
    var LicitacionProveedor = result;
     console.log("aqui lici");
     console.log(result);
    MyMongo.Find('Usuarios', {} , function (result) {
      var Data = {};
       console.log("moda");
       console.log(result);

      // Filtra sólo seleccionados
      result = result.filter(function(el){
        var ret = false;
        LicitacionProveedor.forEach(function(element) {
            console.log("filter");
            //console.log(element.Modalidad);
               // console.log(req.body.Modalidad);                    
              if (el.User == element.Email && element.Cerrado == true  && element.Diligenciada == true){
                 ret = true;
                 console.log("aqui 4");
              }
            
        });
        return ret;
      });
      var Data = {};
      Data.proveedordiligenciado = result;      
      res.end(JSON.stringify(Data));
      console.log(Data.proveedordiligenciado);

 });
  });
});

function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}




app.post('/EnviarEmailProveedores', function (req, res) {


    // Recorre todos los proveedores que se seleccionaron y envía un correo
    req.body.Proveedores.forEach(function(element) {

      var msgCorreo = '<table style="min-width: 650px; padding: 10px; margin:0 auto; border-collapse: collapse;">'+
      '  <tbody>'+
      '    <tr>'+
      '      <td style="background-color: #fff">'+
      '        <div style="color: #5d1868; text-align: center;font-family: sans-serif">'+
      '          <div style="color: #fff; margin: 0 0 5%; text-align:center; height: 30px; background-color: #5d1868; padding: 4% 10% 1%; font-size: 14px;">'+
      '            <b>LICITACIÓN DE TRANSPORTE PROENFAR</b> <br>'+
      '          </div>'+
      '        </div>'+
      '      </td>'+
      '    </tr>'+
      '    <tbody>'+
      '    @@Mensaje'+
      '    </br>'+
      '      <tr bgcolor="#f7f8fa">'+
      '        <td>'+
      '          <table style="border-top-left-radius:5px;border-top-right-radius:5px; font-family: sans-serif" width="100%" cellspacing="0" cellpadding="0" border="0">'+
      '            <tr>'+
      '              <td style="background: #4CAF50; padding:7px; width:25%;color:#fff; font-size:12px;" >'+
      '                <b>Link de acceso</b>'+
      '              </td>'+
      '              <td style="background: #f7f8fa; padding:7px; font-size:12px;" >'+
      '                http://licita.proenfar.com'+
      '              </td>'+
      '            </tr>'+
      '            <tr>'+
      '              <td style="background: #4CAF50; padding:7px; width:20%;color:#fff; font-size:12px;" >'+
      '                <b>Usuario</b>'+
      '              </td>'+
      '              <td style="background: #f7f8fa; padding:7px; font-size:12px;" >'+
      '                @@Usuario'+
      '              </td>'+
      '            </tr>'+
      '            <tr>'+
      '              <td style="background: #4CAF50; padding:7px; width:20%;color:#fff; font-size:12px;" >'+
      '                <b>Contraseña</b>'+
      '              </td>'+
      '              <td style="background: #f7f8fa; padding:7px; font-size:12px;" >'+
      '                @@Contrasena'+
      '              </td>'+
      '            </tr>'+
      '            <tr>'+
      '              <td style="background: #4CAF50; padding:7px; width:20%;color:#fff; font-size:12px;" >'+
      '                <b>Contacto</b>'+
      '              </td>'+
      '              <td style="background: #f7f8fa; padding:7px;font-size:12px;" >'+
      '                @@Contacto'+
      '              </td>'+
      '            </tr>'+
      '          </table>'+
      '          <tbody>'+
      '            <tr>'+
      '              <td>'+
      '                <tbody>'+
      '                  <tr>'+
      '                    <td align="center">'+
      '                      <br>'+
      '                      <p style="font-family: sans-serif;font-size:12px;line-height:20px;color:#333333;padding-left:5px;margin:0 0 10px 0;text-align:left;font-family:Helvetica,Arial,sans-serif">'+
      '                        <b>Nota: </b>El proceso de Licitación estara disponible desde el @@FechaInicio hasta el @@FechaFin, agradecemos su atención.'+
      '                      </p>'+
      '                    </td>'+
      '                  </tr>'+
      '                  <tr>'+
      '                    <td>'+
      '                      <p style="font-family: sans-serif;font-size:12px;padding-left:5px;margin:0 0 20px 0;"><br>'+
      '                        En el archivo adjunto encontrá el manual de uso del aplicativo.</p>'+
      '                      </td>'+
      '                    </tr>'+
      '                  </tbody>'+
      '                </td>'+
      '              </tr>'+
      '            </tbody>'+
      '          </td>'+
      '        </tr>'+
      '      </tbody>'+
      '    </tbody>'+
      '    <tr>'+
      '      <td style="padding: 0">'+
      '      </td>'+
      '    </tr>'+
      '    <tr>'+
      '      <td style="background-color: #fff">'+
      '        <div style="color: #5d1868; text-align: justify;font-family: sans-serif">'+
      '          <div style="color: #fff; margin: 0 0 5%; text-align:center; height: 30px; background-color: #8d928b; padding: 4% 10% 1%; font-size: 14px;">'+
      '            <b>PROENFAR S.A.S "EMPAQUES PARA UNA VIDA MEJOR"</b> <br>'+
      '          </div>'+
      '        </div>'+
      '      </td>'+
      '    </tr>'+
      '  </tbody>'+
      '</table>';

      msgCorreo = msgCorreo.replace('@@Usuario', element.User);
      msgCorreo = msgCorreo.replace('@@Contrasena', element.Password);
      msgCorreo = msgCorreo.replace('@@Contacto', element.Name);
      msgCorreo = msgCorreo.replace('@@Mensaje', req.body.Mensaje);
      msgCorreo = msgCorreo.replace('@@FechaInicio', convertDate(req.body.FechaInicio));
      msgCorreo = msgCorreo.replace('@@FechaFin', convertDate(req.body.FechaFin));

      var subject = "Invitación a licitación proenfar.";

      var attachments = [];

      req.session.emailfiles.forEach(function(File) {

        var buf = Buffer.from(File.file.data, 'utf8');

        var attachment =
            {   // binary buffer as an attachment
                filename: File.file.name,
                content: buf
            }

        attachments.push(attachment);

      });

      // Busca los archivos fijos del correo en drive
      jwtClient.authorize(function (err, tokens) {

          drive.files.list({
            auth: jwtClient,
            q:"'1w2BroI12Qd45zfmJsQTxC2e-NC91vara' in parents",
            pageSize: 10,
            fields: "nextPageToken, files(id, name)"
          }, function(err, response) {
            if (err) {
              console.log('The API returned an error: ' + err);
              return;
            }
            var files = response.files;

            if (files.length == 0) {
              console.log('No files found aqui.');

              res.status(404)        // HTTP status 404: NotFound
              .send('No se encontró el archivo que busca. Puede que no haya sido cargado.');
              res.end();

            } else {
              console.log('Files:');

              // Por cada archivo encontrado busca la metadata y lo agrega a los attachment
              var qtyFiles = files.length;

              files.forEach(function(File) {


                // Cicla para buscar la metadata
                FileId = File.id;

                drive.files.get({
                    auth: jwtClient,
                    fileId: FileId,
                    alt: 'media'
                }, {
                    encoding: null // make sure that we get the binary data
                }, function (err, buffer) {
                    // I wrap this in a promise to handle the data
                    if (err) console.log('Error during download', err);
                    else {

                        drive.files.get({
                            auth: jwtClient,
                            fileId: FileId,
                            alt: ''
                        }, {
                            encoding: null // make sure that we get the binary data
                        }, function (err, metadata) {
                            // I wrap this in a promise to handle the data
                            if (err) console.log('Error during download', err);
                            else {

                                 console.log(metadata);

                                 var attachment =
                                     {   // binary buffer as an attachment
                                         filename: File.name,
                                         content: buffer
                                     }

                                 attachments.push(attachment);

                                 qtyFiles = qtyFiles - 1;


                                 if (qtyFiles == 0){
                                   console.log('Envío el correo y creó licitación');

                                   MyMongo.Remove('LicitacionProveedor', { Email: element.User }, function (result) {
                                     MyMongo.Insert('LicitacionProveedor', { Email: element.User, Bloqueado: false }, function (result) {
                                         if (result == 'Ok') {
                                         };
                                     }
                                     );
                                   }
                                   );

                                   MyMail.SendEmail(msgCorreo, element.Email, subject, attachments);
                                 }

                                // res.setHeader('Content-disposition', 'attachment; filename=' + metadata.name);
                                // res.setHeader('Content-type', metadata.mimeType);
                                // res.send(buffer);
                                //
                                // res.end();

                            }
                        });


                    }
                });
                // Fin del cliclo para buscar metada


              });
              // Fin Por cada archivo encontrado busca la metadata y lo agrega a los attachment

            }
          });

      });
      // Fin de búsqueda archivos fijos en el servidor drive

    });

    req.session.emailfiles = [];

    // Envía la respuesta al cliente de acción exitosa
    var Data = {};
    Data.Result = 'Ok';
    res.end(JSON.stringify(Data));

});

app.post('/Login', function (req, res) {

    var email = '';
    var password = '';

    email = req.body.Usuario;
    password = req.body.Contrasena;

    console.log(email);
    console.log(password);

    MyMongo.Find('Usuarios', { $and: [{ "User": email }, { "Password": password }] }, function (result) {

        if (result.length > 0) {
          var Data = {};
          Data.Result = 'Ok';
          Data.Login = true;
          Data.Perfil = result[0].Perfil;
          Data.Name = result[0].Name;

          req.session.user = result[0];

          res.end(JSON.stringify(Data));
        }
        else {
            var Data = {};
            Data.Result = 'Error';
            Data.Login = false;
            res.end(JSON.stringify(Data));
        }
    }
    );

});

app.post('/processNomina', function (req, res) {

    var Data = {};

    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return 0;
    }

    sampleFile = req.files.file;

    if (typeof sampleFile == 'undefined') {
        Data.Result = 'nd';
        res.end(JSON.stringify(Data))
        return 0;
    }

    if (sampleFile.mimetype.trim() != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        Data.Result = 'nt';
        res.end(JSON.stringify(Data));
        return 0;
    }

    if (sampleFile.data.byteLength > 250000) {
        Data.Result = 'ns';
        res.end(JSON.stringify(Data))
        return 0;
    }

    // Guarda en disco el stream de data. PENDIENTE Solucionar el nombre de archivo igual Puede dar conflictos de simultaneidad
    var newPath = __dirname + "/uploads/output.xlsx";
    fs.writeFile(newPath, sampleFile.data, function (err) {
        // La data a validar
        var constructor = Parser.constructorNomina;
        // Las condiciones de validación
        var condiciones = Validador;
        // Va a leer el excel file para extraer la data
        Parser.parse(newPath, constructor, condiciones, function (errores, data) {
            console.log('1');
            if (errores) {
                console.log('Viene a grabar 2');
                console.log(errores)
                Data.Result = 'err'
                Data.Errors = {
                    code: -1,
                    errores: errores,
                    empleados_error: data
                };
                res.end(JSON.stringify(Data));
            } else {

              if (data.length == 0){
                Data.Result = 'sd'
                res.end(JSON.stringify(Data));
                return 0;
              }

              data.forEach(function(Nomina) {
                console.log(Nomina);
                MyMongo.Remove('EmpleadosNomina', {Rfc: Nomina.Rfc}, function (result) {
                    MyMongo.Insert('EmpleadosNomina', Nomina, function (result) {
                      var ResponseData = 'Hace falta hacer una promesa para esperar por todas las respuestas antes de enviar ';
                    });
                });
              });

              Data.Result = 'ok'
              res.end(JSON.stringify(Data));
              console.log(data);

            }
        });
    });

});

app.post('/procesarTxtEmpleados', function (req, res) {

    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.file;

    var textChunk = sampleFile.data.toString('utf8');

    textChunk = textChunk.split(/\r?\n/);

    var lines = [];
    for(var i = 0; i < textChunk.length; i++){
        var currentEmpleadoArray = textChunk[i].split(/[\|]/);
        var EmployeeNomina = {};
        EmployeeNomina.RFC = currentEmpleadoArray[1]
        EmployeeNomina.VALIDO = currentEmpleadoArray[2]
        lines.push(EmployeeNomina);
    }

    req.session.CurrentTxtEmpleados = lines;
    console.log(req.session.CurrentTxtEmpleados);

    res.status(200)
    res.send('ok');
    res.end();

});

app.post('/procesarpdfRecibo', function (req, res) {

    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.file;

    var fileName = sampleFile.name.split('.');
    console.log(req.body.selectedNomina);
    console.log(req.body.selectedPeriodo);
    console.log(fileName[0]);

    MyMongo.Find('EmpleadosNomina', { $and: [{ "Nomina": req.body.selectedNomina }, { "Periodo": req.body.selectedPeriodo }, { "Rfc": fileName[0] }] }, function (result)
    {
        var Data = {};
        if (result.length == 0){
          Data.Result = 'norfc';
          res.end(JSON.stringify(Data));
        }
        else{

          jwtClient.authorize(function (err, tokens) {

              var fileMetadata = {
                  'name': result[0].PeriodoFile + '.pdf',
                  parents: ['0BykPGdMUS9o9dFI5aTFXLXhVWnc']
              };
              var media = {
                  mimeType: sampleFile.mimetype,
                  body: sampleFile.data
              };
              drive.files.create({
                  auth: jwtClient,
                  resource: fileMetadata,
                  media: media,
                  fields: 'id, webContentLink'
              }, function (err, file) {
                  if (err) {
                      console.log(err);
                  } else {
                      Data.Result = 'ok';
                      res.end(JSON.stringify(Data));
                      console.log('File Id: ', file.id);
                      console.log('weblink: ', file.webContentLink);
                  }
              });

          });

        }
    }
    );

});

app.post('/upload', function (req, res) {
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.file;

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        var FolderId = '';

        MyDrive.createFolder(jwtClient, req.body.Empleado, '0BxzULAzVRMIhb2ZRcU5lRWlKVHc', function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(files);

                    MyDrive.createFolder(jwtClient, req.body.Periodo, files, function (err, files) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(files);
                            FolderId = files;

                            var fileMetadata = {
                                'name': sampleFile.name,
                                parents: [FolderId]
                            };
                            var media = {
                                mimeType: sampleFile.mimetype,
                                body: sampleFile.data
                            };
                            drive.files.create({
                                auth: jwtClient,
                                resource: fileMetadata,
                                media: media,
                                fields: 'id, webContentLink'
                            }, function (err, file) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.status(200)
                                    res.send('ok');
                                    res.end();
                                    console.log('File Id: ', file.id);
                                    console.log('weblink: ', file.webContentLink);

                                    MyMongo.Update('Solicitudes', req.body._id, { UltimoArchivoId: file.id }, function (resp)
                                        {
                                        console.log(res);
                                        return 0;
                                        }
                                    );

                                }
                            });


                        }
                    });

                }
            }
        )

    });

});

app.get('/download', function (req, res) {

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        var fileId = '0BxzULAzVRMIhVV94MTM2VmJxYXh1enVhRjJvdGw5aFZubnMw';
        var dest = fs.createWriteStream('./path/recibo');
        drive.files.get({
            auth: jwtClient,
            fileId: fileId,
            alt: 'media'
        })
    .on('end', function () {
        console.log('Done');
        var tempFile = './path/recibo';
        fs.readFile(tempFile, function (err, data) {
            res.contentType("application/pdf");
            res.send(data);
        });
    })
    .on('error', function (err) {
        console.log('Error during download', err);
    })
    .pipe(dest);

    });

});

app.get('/download2', function (req, res) {

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        var fileId = req.query.fileid;

        drive.files.get({
            auth: jwtClient,
            fileId: fileId,
            alt: 'media'
        }, {
            encoding: null // make sure that we get the binary data
        }, function (err, buffer) {
            // I wrap this in a promise to handle the data
            if (err) console.log('Error during download', err);
            else {
                console.log('Vale aquí está tu archivo de verga');
                const fileType = require('file-type');
                res.contentType(fileType(buffer).mime);
                res.send(buffer);
                console.log(buffer);
                res.end();
            }
        });

    });

});

app.post('/GetEmpleadoFileId', function (req, res) {

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        MyMongo.Find('Solicitudes', { $and: [{ "Nomina": req.body.Nomina }, { "Periodo": req.body.Periodo }, { "Empleado": req.body.Empleado }] }, function (result)
        {
            var Data = {};
            Data.FileId = result[0].UltimoArchivoId;
            res.end(JSON.stringify(Data));
        }
        );

    });

});

function getSheetValuesValidData(values) {
    var a = values;
    var objm = [];
    for (var i = 1; i < a.length; i++) {
        if (a[i][0] == "") {
            return (objm);
        }
        var obj = {};
        for (var b = 0; b < a[i].length; b++) {
            obj[a[0][b]] = a[i][b];
        }
        objm.push(obj);
    }
    return (objm);
}

// Actualiza los datos para modalidades por proveedor
app.post('/UpdateModalidadesProveedor', function (req, res) {
    // Atom Update to avoid concurrency errors
    log.info('Guardando Modalidades');
    log.info('Guardando Modalidades de:' + req.body.ModalidadesProveedor.Email);
   MyMongo.Save('ModalidadesProveedor', {Email: req.body.ModalidadesProveedor.Email}, req.body.ModalidadesProveedor, function (result) {
    var Data = {};   
    res.end(JSON.stringify(Data));
  });

   /*MyMongo.Remove('ModalidadesProveedor', { Email: req.body.ModalidadesProveedor.Email }, function (result) {
      MyMongo.Insert('ModalidadesProveedor', req.body.ModalidadesProveedor, function (result) {
        var Data = {};
        res.end(JSON.stringify(Data));
      });
  });*/
});

// Obtiene los datos para modalidades por proveedor
app.post('/GetModalidadesProveedor', function (req, res) {

    var Data = {};
    // Si ya tiene modalidad trae la que tenga guardada, sino crea el primer objeto vacío de valores de modalidades
    MyMongo.Find('ModalidadesProveedor', { Email: req.body.Email }, function (result) {
      if (result.length == 0){

         console.log('poraqui');

        // Las Aduanas
        MyMongo.Find('Aduanas', {}, function (result) {
          var myAduanas = result;

         // Los Otms

         MyMongo.Find('Otms', {}, function (result) {

         var myOtms = result;

         // Las Maritimas FCL

          MyMongo.Find('MaritimasFcl', {}, function (result) {
          var myMaritimasFcl = result;

          // Las Maritimas LCL

          MyMongo.Find('MaritimasLcl', {}, function (result) {
          var myMaritimasLcl = result;

          // Terrestre Nacional
         MyMongo.Find('TerresNacional', {}, function (result) {
         var myTerresNacional = result;

          // Terrestre Nacional Sencillo
         MyMongo.Find('TerresNacionalSencillo', {}, function (result) {
         var myTerresNacionalSencillo = result;

          // Terrestre Nacional Patineta
         MyMongo.Find('TerresNacionalPatineta', {}, function (result) {
         var myTerresNacionalPatineta = result;

         // Terrestre Urbano
         MyMongo.Find('TerresUrbano', {}, function (result) {
         var myTerresUrbano = result;

        // Terrestre Urbano Viaje
         MyMongo.Find('TerresUrbanoViaje', {}, function (result) {
         var myTerresUrbanoViaje = result;

         // Terrestre Urbano Tonelada
         MyMongo.Find('TerresUrbanoTonelada', {}, function (result) {
         var myTerresUrbanoTonelada = result;

           // Aereas
         MyMongo.Find('Aereas', {}, function (result) {
         var myAereas = result;

          MyMongo.Find('AereasPasajeros', {}, function (result) {
         var myAereasPasajeros = result;

             MyMongo.Find('Preguntas', {}, function (result) {
             var myPreguntas = result;

               MyMongo.Find('Requisitos', {}, function (result) {
               var myRequisitos = result;

                 Data.ModalidadesProveedor = {
                   Email: req.body.Email,
                   Bodegajes: {
                     Version:1,
                     Aduanero: {TarifaValor: null, TarifaMinima: null, Otros: null},
                     Maquinaria: {Tarifa: null, TarifaMinima: null, Fmm: null},
                     MateriaPrima: {Tarifa: null, TarifaMinima: null, Fmm: null}
                   },
                   Aduana: {
                     Version:1,
                     Aduanas: myAduanas
                   },
                   Otm: {
                    Version:1,
                     Otms: myOtms
                   },
                   MaritimaFcl: {
                    Version:1,
                     MaritimasFcl: myMaritimasFcl
                 },
                  MaritimaLcl: {
                    Version:1,
                     MaritimasLcl: myMaritimasLcl
                 },
                  TerreNacional: {
                    Version:1,
                     TerresNacional: myTerresNacional
                   },
                   TerreNacionalSencillo: {
                    Version:1,
                     TerresNacionalSencillo: myTerresNacionalSencillo
                   },
                   TerreNacionalPatineta: {
                    Version:1,
                     TerresNacionalPatineta: myTerresNacionalPatineta
                   },
                  TerreUrbano: {
                    Version:1,
                     TerresUrbano: myTerresUrbano
                   },
                   TerreUrbanoViaje: {
                    Version:1,
                     TerresUrbanoViaje: myTerresUrbanoViaje
                   },
                   TerreUrbanoTonelada: {
                    Version:1,
                     TerresUrbanoTonelada: myTerresUrbanoTonelada
                   },
                    Aerea: {
                        Version:1,
                     Aereas: myAereas
                   },
                   AereaPasajero: {
                    Version:1,
                     AereasPasajeros: myAereasPasajeros
                   }
                   };

                   Data.Preguntas = myPreguntas;
                   Data.Requisitos = myRequisitos;

                   res.end(JSON.stringify(Data));

                 });


             });




});
            });
         });
         });

         });
           });
         });
         });

         });

        });

        });

        });


      }
      else {

        var myModalidadesProveedor = result[0];

        MyMongo.Find('Preguntas', {}, function (result) {
          var myPreguntas = result;

          MyMongo.Find('Requisitos', {}, function (result) {
            var myRequisitos = result;

            Data.ModalidadesProveedor = myModalidadesProveedor;
            Data.Preguntas = myPreguntas;
            Data.Requisitos = myRequisitos;

            res.end(JSON.stringify(Data));

          });

        });

      }
    } );

});

// function Ejecutar (){
//   // Para traer únicamente los proveedores seleccionados
//   MyMongo.Find('ProveedorSeleccionado', {} , function (result) {
//       var ProveedoresSeleccionado = result;
//       // Para saber qué proveedores le dieron finalizar licitación
//       // Son los que tienen a menos una modalidad con Cerrado = true en LicitacionProveedor
//       MyMongo.Find('LicitacionProveedor', {Cerrado: true} , function (result) {
//         var ProveedoresLicitacionCerrada = result;
//         MyMongo.Find('ModalidadesProveedor', {} , function (result) {
//           var Data = {};
//           Data.ConsolidadoDatos = result;
//           console.log('YA');
//           console.log(Data.ConsolidadoDatos);
//         });
//       });
//   });
// }
//
// Ejecutar();

////////////Consolidado de Datos/////////////////////////////////////////////////////////////////////////////////////////

app.post('/GetConsolidadoDatos', function (req, res) {

  if (req.body.Modalidad =='Terrestre Nacional')   { req.body.Modalidad = 'TerrestreNacional';  }
  if (req.body.Modalidad =='Terrestre Urbano')   { req.body.Modalidad = 'TerrestreUrbano';  }
  //if (mModalidad =='TerrestreUrbano')   { mModalidad = 'TerreUrbano';  }

  // Buscas todos los proveedores. Ésto es para poner el name en consolidados
  MyMongo.Find('Usuarios', {} , function (result) {
    var ProveedoreesTodos = result;

    // Para poder saber qué proveedores fueron marcados como seleccionados
    MyMongo.Find('LicitacionProveedor', {} , function (result) {
      var LicitacionProveedor = result;
      MyMongo.Find('ModalidadesProveedor', {} , function (result) {
        var Data = {};

        // Filtra sólo seleccionados
        result = result.filter(function(el){
          var ret = false;
          LicitacionProveedor.forEach(function(element) {
              //console.log(element.Modalidad);
                 // console.log(req.body.Modalidad);
              if (req.body.ProveedorSeleccionado == true){
                if (el.Email == element.Email && element.Cerrado == true && element.Modalidad == req.body.Modalidad && element.Seleccionado == true && element.Diligenciada == true){
                  ret = true;
                }
              }
              else{
                if (el.Email == element.Email && element.Cerrado == true && element.Modalidad == req.body.Modalidad && element.Diligenciada == true){
                   ret = true;
                }
              }
          });
          return ret;
        });

        var Data = {};
        Data.ConsolidadoDatos = result;

        // Recorre todos los proveedores que quedaron para cambiar el Email por razón RazonSocial
        Data.ConsolidadoDatos.forEach(function(ProveedorModalidad){
          var ProveedorData = ProveedoreesTodos.filter(function(ProveedorFiltrado){
            return ProveedorFiltrado.User ==  ProveedorModalidad.Email;
          })
          ProveedorModalidad.RazonSocial = ProveedorData[0].RazonSocial;
        });
        // Fin Recorre todos los proveedores que quedaron para cambiar el Email por razón RazonSocial

        // Recorre todas las modalidades proveedor de todos los proveedor 
      Data.ConsolidadoDatos.forEach(function(ModalidadProveedor) {
        // Recorre de la modalidad del proveedor que se está recorriendo todas aéreas
        ModalidadProveedor.Aerea.Aereas.forEach(function(ProveedorAerea) {

            if (ProveedorAerea["+100"]=='') {ProveedorAerea["+100"]=parseFloat(0);}
            if (ProveedorAerea["Gastos Embarque"]=='') {ProveedorAerea["Gastos Embarque"]=parseFloat(0);}
            if (ProveedorAerea["+300"]=='') {ProveedorAerea["+300"]=parseFloat(0);}
            if (ProveedorAerea["+500"]=='') {ProveedorAerea["+500"]=parseFloat(0);}
            if (ProveedorAerea["+1000"]=='') {ProveedorAerea["+1000"]=parseFloat(0);}
            if (ProveedorAerea["Fs/kg"]=='') {ProveedorAerea["Fs/kg"]=parseFloat(0);}
           
          // Por cada aérea de cada proveedor recalcula el campo de suma 

          console.log(ProveedorAerea["FS min"]);
          ProveedorAerea["+100 + Fs/kg + Gastos Embarque"] = parseFloat(ProveedorAerea["+100"]) + parseFloat(ProveedorAerea["Fs/kg"]) + parseFloat(ProveedorAerea["Gastos Embarque"]);
          ProveedorAerea["+300 + Fs/kg + Gastos Embarque"] = parseFloat(ProveedorAerea["+300"]) + parseFloat(ProveedorAerea["Fs/kg"]) + parseFloat(ProveedorAerea["Gastos Embarque"]);
          ProveedorAerea["+500 + Fs/kg + Gastos Embarque"] = parseFloat(ProveedorAerea["+500"]) + parseFloat(ProveedorAerea["Fs/kg"]) + parseFloat(ProveedorAerea["Gastos Embarque"]);
          ProveedorAerea["+1000 + Fs/kg + Gastos Embarque"] = parseFloat(ProveedorAerea["+1000"]) + parseFloat(ProveedorAerea["Fs/kg"]) + parseFloat(ProveedorAerea["Gastos Embarque"]);
        });

        /////////////////////////Aerea Pasajero //////////////////////////////////////////
         ModalidadProveedor.AereaPasajero.AereasPasajeros.forEach(function(ProveedorAereaPasajero) {

            if (ProveedorAereaPasajero["+100"]=='') {ProveedorAereaPasajero["+100"]=parseFloat(0);}
            if (ProveedorAereaPasajero["Gastos Embarque"]=='') {ProveedorAereaPasajero["Gastos Embarque"]=parseFloat(0);}
            if (ProveedorAereaPasajero["+300"]=='') {ProveedorAereaPasajero["+300"]=parseFloat(0);}
            if (ProveedorAereaPasajero["+500"]=='') {ProveedorAereaPasajero["+500"]=parseFloat(0);}
            if (ProveedorAereaPasajero["+1000"]=='') {ProveedorAereaPasajero["+1000"]=parseFloat(0);}
            if (ProveedorAereaPasajero["Fs/kg"]=='') {ProveedorAereaPasajero["Fs/kg"]=parseFloat(0);}
           
          // Por cada aérea de cada proveedor recalcula el campo de suma 

          console.log(ProveedorAereaPasajero["FS min"]);
          ProveedorAereaPasajero["+100 + Fs/kg"] = parseFloat(ProveedorAereaPasajero["+100"]) + parseFloat(ProveedorAereaPasajero["Fs/kg"]) + parseFloat(ProveedorAereaPasajero["Gastos Embarque"]);
          ProveedorAereaPasajero["+300 + Fs/kg"] = parseFloat(ProveedorAereaPasajero["+300"]) + parseFloat(ProveedorAereaPasajero["Fs/kg"]) + parseFloat(ProveedorAereaPasajero["Gastos Embarque"]);
          ProveedorAereaPasajero["+500 + Fs/kg"] = parseFloat(ProveedorAereaPasajero["+500"]) + parseFloat(ProveedorAereaPasajero["Fs/kg"]) + parseFloat(ProveedorAereaPasajero["Gastos Embarque"]);
          ProveedorAereaPasajero["+1000 + Fs/kg"] = parseFloat(ProveedorAereaPasajero["+1000"]) + parseFloat(ProveedorAereaPasajero["Fs/kg"]) + parseFloat(ProveedorAereaPasajero["Gastos Embarque"]);
        });

          /////////////////////////Maritimas Fcl //////////////////////////////////////////
         ModalidadProveedor.MaritimaFcl.MaritimasFcl.forEach(function(ProveedorMaritimaFcl) {

            if (ProveedorMaritimaFcl["C 20"]=='' || ProveedorMaritimaFcl["C 20"]=='undefined') {ProveedorMaritimaFcl["C 20"]=parseFloat(0);}
            if (ProveedorMaritimaFcl["C 40"]=='') {ProveedorMaritimaFcl["C 40"]=parseFloat(0);}
            if (ProveedorMaritimaFcl["Baf 20"]=='' ) {ProveedorMaritimaFcl["Baf 20"]=parseFloat(0);}
            if (ProveedorMaritimaFcl["Baf 40"]=='') {ProveedorMaritimaFcl["Baf 40"]=parseFloat(0);}
            if (ProveedorMaritimaFcl["C 40HC"]=='') {ProveedorMaritimaFcl["C 40HC"]=parseFloat(0);}
            if (ProveedorMaritimaFcl["Baf 40HC"]=='') {ProveedorMaritimaFcl["Baf 40HC"]=parseFloat(0);}
            if (ProveedorMaritimaFcl["Gastos Embarque"]=='') {ProveedorMaritimaFcl["Gastos Embarque"]=parseFloat(0);}

            ProveedorMaritimaFcl["C 20 +Baf 20 + Gastos Embarque"]= parseFloat(ProveedorMaritimaFcl["C 20"]) + parseFloat(ProveedorMaritimaFcl["Baf 20"]) + parseFloat(ProveedorMaritimaFcl["Gastos Embarque"]);
            ProveedorMaritimaFcl["C 40 + Baf 40 + Gastos Embarque"]= parseFloat(ProveedorMaritimaFcl["C 40"]) + parseFloat(ProveedorMaritimaFcl["Baf 40"]) + parseFloat(ProveedorMaritimaFcl["Gastos Embarque"]);
            ProveedorMaritimaFcl["C 40HC + Baf 40HC + Gastos Embarque"]= parseFloat(ProveedorMaritimaFcl["C 40HC"]) + parseFloat(ProveedorMaritimaFcl["Baf 40HC"]) + parseFloat(ProveedorMaritimaFcl["Gastos Embarque"]);
        });


      });
      // Fin Recorre todas las modalidades proveedor de todos los proveedor

        res.end(JSON.stringify(Data));
        //console.log(Data.ConsolidadoDatos);

   });
    });


  });
  // Fin Buscas todos los proveedores. Ésto es para poner el name en consolidados

});

app.post('/ExportarExcelModalidad', function (req, res) {

   var NombreModalidad = req.body.Modalidad;
   var Modalidad = req.body.ModalidadesProveedor;
   var Modalidad2 = req.body.ModalidadesProveedor2;
   var Modalidad3 = req.body.ModalidadesProveedor3;
   console.log(Modalidad);


   var Data={};


    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    if (NombreModalidad == 'Aduanas') { var ws2 = wb.addWorksheet('Aduanas');}
    if (NombreModalidad=='OTM'){var ws2 = wb.addWorksheet('OTM');}
    if (NombreModalidad=='MaritimasFcl'){var ws2 = wb.addWorksheet('MaritFCL');}
    if (NombreModalidad=='MaritimasLcl'){var ws2 = wb.addWorksheet('MaritLCL');}

    if (NombreModalidad == 'Bodegajes')
        {
            var ws2 = wb.addWorksheet('Aduanero');
            var ws3 = wb.addWorksheet('Maquinaria');
            var ws4 = wb.addWorksheet('MateriaPrima');
        }

     if (NombreModalidad == 'Terrestre Nacional')
        {
            var ws2 = wb.addWorksheet('Turbo');
            var ws3 = wb.addWorksheet('Sencillo');
            var ws4 = wb.addWorksheet('Patineta');
        }

     if (NombreModalidad == 'Terrestre Urbano')
        {
            var ws2 = wb.addWorksheet('Urbano');
            var ws3 = wb.addWorksheet('Viaje');
            var ws4 = wb.addWorksheet('Tonelada');
        }

     if (NombreModalidad == 'Aereas')
        {
            var ws2 = wb.addWorksheet('Aerea_Carguero');
            var ws3 = wb.addWorksheet('Aerea_Pasajero');
        }

    // Create a reusable style
    var style1 = wb.createStyle({
        font: {
            color: '#000000',
            size: 14
        },

        //numberFormat: '#,##0.00; (#,##0.00); -',
        numberFormat: '#,##0.00',

    });

     var style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12
        },

        //numberFormat: '0,00.00; (0,000.00); -',
         numberFormat: '#,##0.00',
    });

      var styleverde = wb.createStyle({
        font: {
            color: '#000000',
            size: 12
        },

         fill: {
            type: 'pattern', // the only one implemented so far.
            patternType: 'solid', // most common.
            fgColor: '088A08', // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
            // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
        },

        //numberFormat: '#,##0.00; (#,##0.00); -',
        numberFormat: '#,##0.00',

    });

        var stylerojo = wb.createStyle({
        font: {
            color: '#000000',
            size: 12
        },

         fill: {
            type: 'pattern', // the only one implemented so far.
            patternType: 'solid', // most common.
            fgColor: 'FF0000', // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
            // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
        },

        //numberFormat: '#,##0.00; (#,##0.00); -',
        numberFormat: '#,##0.00',

    });

        var styleamarillo = wb.createStyle({
        font: {
            color: '#000000',
            size: 12
        },

         fill: {
            type: 'pattern', // the only one implemented so far.
            patternType: 'solid', // most common.
            fgColor: 'FFFF00', // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
            // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
        },

        //numberFormat: '#,##0.00; (#,##0.00); -',
        numberFormat: '#,##0.00',

    });


          var valor = '';
          var myProp = '_id';
          var pattern = /^\d+(\.\d+)?$/; ///^\d+$/;


        ////////////////////////////Primera hoja/////////////////////////////////////////
             if (NombreModalidad == 'Bodegajes' || NombreModalidad == 'Aduanas' || NombreModalidad == 'OTM'  || NombreModalidad == 'MaritimasFcl'  || NombreModalidad == 'MaritimasLcl' || NombreModalidad == 'Terrestre Nacional'  || NombreModalidad == 'Terrestre Urbano')
            {
                if (NombreModalidad == 'MaritimasFcl')
                {
                var fila = 1;
          var filabody = 1;
          var col = 1;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                  if (header =='RazonSocial'){
                    ws2.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PaisDestino'){
                    ws2.cell(1, 2).string('PaisDestino').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,2).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoOrigen'){
                    ws2.cell(1, 3).string('PuertoOrigen').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,3).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoDestino'){
                    ws2.cell(1, 4).string('PuertoDestino').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,4).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='C 20')
                    {                      
                    ws2.cell(1, 5).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,5).number(valor).style(style);
                             }
                  }
                  if (header =='Baf 20')
                    {                      
                    ws2.cell(1, 6).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,6).number(valor).style(style);
                             }
                  }
                  if (header =='C 40')
                    {                      
                    ws2.cell(1, 7).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,7).number(valor).style(style);
                             }
                  }
                  if (header =='Baf 40')
                    {                      
                    ws2.cell(1, 8).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,8).number(valor).style(style);
                             }
                  }
                   if (header =='C 40HC')
                    {                      
                    ws2.cell(1, 9).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,9).number(valor).style(style);
                             }
                  }
                   if (header =='Baf 40HC')
                    {                      
                    ws2.cell(1, 10).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,10).number(valor).style(style);
                             }
                  }
                   if (header =='Gastos Embarque')
                    {                      
                    ws2.cell(1, 11).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,11).number(valor).style(style);
                             }
                  }
                    if (header =='Observaciones'){
                    ws2.cell(1, 12).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,12).string(valor).style(style);
                      //console.log(header);
                  }
                    if (header =='Lead Time(dias)'){
                    ws2.cell(1, 13).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,13).string(valor).style(style);
                      //console.log(header);
                  }
                   if (header =='Naviera'){
                    ws2.cell(1, 14).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,14).string(valor).style(style);
                      //console.log(header);
                  }
                   if (header =='Frecuencia Semanal')
                      {                      
                    ws2.cell(1, 15).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,15).string('').style(style);
                             }
                             else
                             {                             
                              ws2.cell(2,15).string('X').style(style);
                             }
                  }
                   if (header =='Frecuencia Quincenal')
                      {                      
                    ws2.cell(1, 16).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,16).string('').style(style);
                             }
                             else
                             {                             
                              ws2.cell(2,16).string('X').style(style);
                             }
                  }
                   if (header =='Frecuencia Mensual')
                      {                      
                    ws2.cell(1, 17).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,17).string('').style(style);
                             }
                             else
                             {                             
                              ws2.cell(2,17).string('X').style(style);
                             }
                  }
                   if (header =='C 20 + Baf 20 + Gastos Embarque')
                     {                      
                    ws2.cell(1, 18).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,18).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,18).number(valor).style(style);
                             }
                  }
                   if (header =='C 40 + Baf 40 + Gastos Embarque')
                     {                      
                    ws2.cell(1, 19).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,19).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,19).number(valor).style(style);
                             }
                  }
                   if (header =='C 40HC + Baf 40HC + Gastos Embarque')
                     {                      
                    ws2.cell(1, 20).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,20).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,20).number(valor).style(style);
                             }
                  }
                  if (header =='Version'){
                    ws2.cell(1, 21).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,21).string(valor).style(style);                      //console.log(header);
                  }
                    
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                //console.log(modalid[header]);
                     if (header =='RazonSocial'){
                    valor = modalid[header].toString();
                    ws2.cell(fila + 1,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PaisDestino'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,2).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoOrigen'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,3).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoDestino'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,4).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='C 20')
                    {                      
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,5).number(valor).style(style);
                             }
                  }
                  if (header =='Baf 20')
                    {    
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,6).number(valor).style(style);
                             }
                  }
                  if (header =='C 40')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,7).number(valor).style(style);
                             }
                  }
                  if (header =='Baf 40')
                    {                      
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,8).number(valor).style(style);
                             }
                  }
                   if (header =='C 40HC')
                    {                      
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,9).number(valor).style(style);
                             }
                  }
                   if (header =='Baf 40HC')
                    {                      
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,10).number(valor).style(style);
                             }
                  }
                   if (header =='Gastos Embarque')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,11).number(valor).style(style);
                             }
                  }
                    if (header =='Observaciones'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,12).string(valor).style(style);
                      //console.log(header);
                  }
                    if (header =='Lead Time(dias)'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,13).string(valor).style(style);
                      //console.log(header);
                  }
                   if (header =='Naviera'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,14).string(valor).style(style);
                      //console.log(header);
                  }
                   if (header =='Frecuencia Semanal')
                      {                      
                    
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,15).string('').style(style);
                             }
                             else
                             {                             
                              ws2.cell(fila+1,15).string('X').style(style);
                             }
                  }
                   if (header =='Frecuencia Quincenal')
                      {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,16).string('').style(style);
                             }
                             else
                             {                             
                              ws2.cell(fila+1,16).string('X').style(style);
                             }
                  }
                   if (header =='Frecuencia Mensual')
                      {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,17).string('').style(style);
                             }
                             else
                             {                             
                              ws2.cell(fila+1,17).string('X').style(style);
                             }
                  }
                   if (header =='C 20 + Baf 20 + Gastos Embarque')
                     {                      
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,18).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,18).number(valor).style(style);
                             }
                  }
                   if (header =='C 40 + Baf 40 + Gastos Embarque')
                     {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,19).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,19).number(valor).style(style);
                             }
                  }
                   if (header =='C 40HC + Baf 40HC + Gastos Embarque')
                     {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,20).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,20).number(valor).style(style);
                             }
                  }
                  if (header =='Version'){                  
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,21).string(valor).style(style);
                      //console.log(header);
                  }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });
                }

                  else if (NombreModalidad == 'MaritimasLcl')
                {
                 var fila = 1;
          var filabody = 1;
          var col = 1;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                  if (header =='RazonSocial'){
                    ws2.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PaisDestino'){
                    ws2.cell(1, 2).string('PaisDestino').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,2).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoOrigen'){
                    ws2.cell(1, 3).string('PuertoOrigen').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,3).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoDestino'){
                    ws2.cell(1, 4).string('PuertoDestino').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,4).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Minima')
                    {                      
                    ws2.cell(1, 5).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,5).number(valor).style(style);
                             }
                  }
                  if (header =='1-5 ton/M3')
                    {                      
                    ws2.cell(1, 6).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,6).number(valor).style(style);
                             }
                  }
                  if (header =='5-8 ton/M3')
                    {                      
                    ws2.cell(1, 7).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,7).number(valor).style(style);
                             }
                  }
                  if (header =='8-12 ton/M3')
                    {                      
                    ws2.cell(1, 8).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,8).number(valor).style(style);
                             }
                  }
                   if (header =='12-18 ton/M3')
                    {                      
                    ws2.cell(1, 9).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,9).number(valor).style(style);
                             }
                  }
                   if (header =='Gastos Embarque')
                    {                      
                    ws2.cell(1, 10).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,10).number(valor).style(style);
                             }
                  }
                   
                    if (header =='Observaciones'){
                    ws2.cell(1, 11).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,12).string(valor).style(style);
                      //console.log(header);
                  }
                    if (header =='Lead time(dias)'){
                    ws2.cell(1, 12).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,12).string(valor).style(style);
                      //console.log(header);
                  }
                   if (header =='Naviera'){
                    ws2.cell(1, 13).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,13).string(valor).style(style);
                      //console.log(header);
                  }
                  else if (header =='Frecuencia Dia Lunes')
                    {
                    ws2.cell(1, 14).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,14).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,14).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Martes')
                    {
                    ws2.cell(1, 15).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,15).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,15).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Miercoles')
                    {
                    ws2.cell(1, 16).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,16).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,16).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Jueves')
                    {
                    ws2.cell(1, 17).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,17).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,17).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Viernes')
                    {
                    ws2.cell(1, 18).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,18).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,18).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Sabado')
                    {
                    ws2.cell(1, 19).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,19).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,19).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Domingo')
                    {
                    ws2.cell(1, 20).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,20).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,20).string('X').style(style);
                             }
                  }
                  if (header =='Version'){
                    ws2.cell(1, 21).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,21).string(valor).style(style);                      //console.log(header);
                  }
                    
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                //console.log(modalid[header]);
                     if (header =='RazonSocial'){
                    valor = modalid[header].toString();
                    ws2.cell(fila + 1,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PaisDestino'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,2).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoOrigen'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,3).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='PuertoDestino'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,4).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Minima')
                    {                      
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,5).number(valor).style(style);
                             }
                  }
                  if (header =='1-5 ton/M3')
                    {    
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,6).number(valor).style(style);
                             }
                  }
                  if (header =='5-8 ton/M3')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,7).number(valor).style(style);
                             }
                  }
                  if (header =='8-12 ton/M3')
                    {                      
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,8).number(valor).style(style);
                             }
                  }
                   if (header =='12-18 ton/M3')
                    {                      
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,9).number(valor).style(style);
                             }
                  }
                  
                   if (header =='Gastos Embarque')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,10).number(valor).style(style);
                             }
                  }
                    if (header =='Observaciones'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,11).string(valor).style(style);
                      //console.log(header);
                  }
                    if (header =='Lead time(dias)'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,12).string(valor).style(style);
                      //console.log(header);
                  }
                   if (header =='Naviera'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,13).string(valor).style(style);
                      //console.log(header);
                  }
                  else if (header =='Frecuencia Dia Lunes')
                    {
                    ws2.cell(1, 14).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,14).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,14).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Martes')
                    {
                    ws2.cell(1, 15).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,15).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,15).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Miercoles')
                    {
                    ws2.cell(1, 6).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,16).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,16).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Jueves')
                    {
                    ws2.cell(1, 17).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,17).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,17).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Viernes')
                    {
                    ws2.cell(1, 18).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,18).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,18).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Sabado')
                    {
                    ws2.cell(1, 19).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,19).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,19).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Domingo')
                    {
                    ws2.cell(1, 20).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,20).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,20).string('X').style(style);
                             }
                  }
                  if (header =='Version'){                  
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,21).string(valor).style(style);
                      //console.log(header);
                  }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });
                }



                   else if (NombreModalidad == 'OTM')
                {
                  var fila = 1;
          var filabody = 1;
          var col = 1;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                  if (header =='RazonSocial'){
                    ws2.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Origen'){
                    ws2.cell(1, 2).string('Origen').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,2).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Destino'){
                    ws2.cell(1, 3).string('Destino').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,3).string(valor).style(style);
                      //console.log(header);
                  }

                 

                  if (header =='C 20 hasta 4-5 Ton')
                    {                      
                    ws2.cell(1, 4).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,4).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 8 Ton')
                    {                      
                    ws2.cell(1, 5).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,5).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 10 Ton')
                    {                      
                    ws2.cell(1, 6).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,6).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 17 Ton')
                    {                      
                    ws2.cell(1, 7).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,7).number(valor).style(style);
                             }
                  }

                   if (header =='C 20 hasta 19 Ton')
                    {                      
                    ws2.cell(1, 8).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,8).number(valor).style(style);
                            }
                             
                  }
                  
                   if (header =='C 20 hasta 20 Ton')
                    {                      
                    ws2.cell(1, 9).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,9).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 21 Ton')
                    {                      
                    ws2.cell(1, 10).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,10).number(valor).style(style);
                             }
                  }

                    if (header =='C 20 hasta 25 Ton')
                    {                      
                    ws2.cell(1, 11).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,11).number(valor).style(style);
                             }
                  }

                    if (header =='C 40 hasta 15 Ton')
                    {                      
                    ws2.cell(1, 12).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,12).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 16 Ton')
                    {                      
                    ws2.cell(1, 13).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,13).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,13).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 17 Ton')
                    {                      
                    ws2.cell(1, 14).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,14).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,14).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 17-18 Ton')
                    {                      
                    ws2.cell(1, 15).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,15).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,15).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 20 Ton')
                    {                      
                    ws2.cell(1, 16).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,16).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,16).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 21 Ton')
                    {                      
                    ws2.cell(1, 17).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,17).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,17).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 22 Ton')
                    {                      
                    ws2.cell(1, 18).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,18).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,18).number(valor).style(style);
                             }
                  }

                  if (header =='C 40 hasta 30 Ton')
                    {                      
                    ws2.cell(1, 19).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,19).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,19).number(valor).style(style);
                             }
                  }

                  if (header =='Devolucion 20$ estandar')
                    {                      
                    ws2.cell(1, 20).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,20).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,20).number(valor).style(style);
                             }
                  }

                   if (header =='Devolucion 40$ estandar')
                    {                      
                    ws2.cell(1, 21).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,21).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,21).number(valor).style(style);
                             }
                  }

                   if (header =='Devolucion 20$ expreso')
                    {                      
                    ws2.cell(1, 22).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,22).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,22).number(valor).style(style);
                             }
                  }
                   if (header =='Devolucion 40$ expreso')
                    {                      
                    ws2.cell(1, 23).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,23).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,23).number(valor).style(style);
                             }
                  }
                   
                   
                  if (header =='Version'){
                    ws2.cell(1, 24).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,24).string(valor).style(style);                      //console.log(header);
                  }
                    
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                //console.log(modalid[header]);
                     if (header =='RazonSocial'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Origen'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,2).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Destino'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,3).string(valor).style(style);
                      //console.log(header);
                  }

                 

                  if (header =='C 20 hasta 4-5 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,4).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 8 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,5).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 10 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,6).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 17 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,7).number(valor).style(style);
                             }
                  }

                   if (header =='C 20 hasta 19 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,8).number(valor).style(style);
                            }
                             
                  }
                  
                   if (header =='C 20 hasta 20 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,9).number(valor).style(style);
                             }
                  }

                  if (header =='C 20 hasta 21 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,10).number(valor).style(style);
                             }
                  }

                    if (header =='C 20 hasta 25 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,11).number(valor).style(style);
                             }
                  }

                    if (header =='C 40 hasta 15 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,12).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 16 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,13).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,13).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 17 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,14).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,14).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 17-18 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,15).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,15).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 20 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,16).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,16).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 21 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,17).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,17).number(valor).style(style);
                             }
                  }

                   if (header =='C 40 hasta 22 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,18).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,18).number(valor).style(style);
                             }
                  }

                  if (header =='C 40 hasta 30 Ton')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,19).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,19).number(valor).style(style);
                             }
                  }

                  if (header =='Devolucion 20$ estandar')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,20).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,20).number(valor).style(style);
                             }
                  }

                   if (header =='Devolucion 40$ estandar')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,21).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,21).number(valor).style(style);
                             }
                  }

                   if (header =='Devolucion 20$ expreso')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,22).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,22).number(valor).style(style);
                             }
                  }
                   if (header =='Devolucion 40$ expreso')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,23).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,23).number(valor).style(style);
                             }
                  }
                   
                   
                  if (header =='Version'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,24).string(valor).style(style);                      //console.log(header);
                  }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });
                }

      else if (NombreModalidad == 'Aduanas')
                {
                  var fila = 1;
          var filabody = 1;
          var col = 1;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                  if (header =='RazonSocial'){
                    ws2.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Via'){
                    ws2.cell(1, 2).string('Vía').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,2).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Tarifa % Advalorem/ FOB')
                    {                      
                    ws2.cell(1, 3).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,3).number(valor).style(style);
                             }
                  }

                 

                  if (header =='Minima')
                    {                      
                    ws2.cell(1, 4).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,4).number(valor).style(style);
                             }
                  }

                  if (header =='Gastos Adicionales')
                    {                      
                    ws2.cell(1, 5).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,5).number(valor).style(style);
                             }
                  }

                  if (header =='Conceptos Adicionales')
                    {                      
                   ws2.cell(1, 6).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,6).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Gastos Adicionales dos')
                    {                      
                    ws2.cell(1, 7).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,7).number(valor).style(style);
                             }
                  }

                   if (header =='Conceptos Adicionales dos')
                    {                      
                   ws2.cell(1, 8).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,8).string(valor).style(style);
                      //console.log(header);
                  }
                  
                   if (header =='Gastos Adicionales tres')
                    {                      
                    ws2.cell(1, 9).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,9).number(valor).style(style);
                             }
                  }

                  if (header =='Conceptos Adicionales tres')
                    {                      
                   ws2.cell(1, 10).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,10).string(valor).style(style);
                      //console.log(header);
                  }

                    if (header =='Costo Plastificación Caja')
                    {                      
                    ws2.cell(1, 11).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,11).number(valor).style(style);
                             }
                  }

                    if (header =='Otros')
                    {                      
                    ws2.cell(1, 12).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,12).number(valor).style(style);
                             }
                  }                  
                   
                  if (header =='Version'){
                    ws2.cell(1, 13).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,13).string(valor).style(style);                      //console.log(header);
                  }
                    
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                //console.log(modalid[header]);
                     if (header =='RazonSocial'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Via'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,2).string(valor).style(style);
                      //console.log(header);
                  }

                   if (header =='Tarifa % Advalorem/ FOB')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,3).number(valor).style(style);
                             }
                  }

                 

                  if (header =='Minima')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,4).number(valor).style(style);
                             }
                  }

                  if (header =='Gastos Adicionales')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,5).number(valor).style(style);
                             }
                  }

                  if (header =='Conceptos Adicionales')
                  {
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,6).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Gastos Adicionales dos')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,7).number(valor).style(style);
                             }
                  }

                   if (header =='Conceptos Adicionales dos')
                  {
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,8).string(valor).style(style);
                      //console.log(header);
                  }
                  
                   if (header =='Gastos Adicionales tres')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,9).number(valor).style(style);
                             }
                  }

                  if (header =='Conceptos Adicionales tres')
                    {
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,10).string(valor).style(style);
                      //console.log(header);
                  }

                    if (header =='Costo Plastificación Caja')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,11).number(valor).style(style);
                             }
                  }

                    if (header =='Otros')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,12).number(valor).style(style);
                             }
                  }

                
                   
                  if (header =='Version'){
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,13).string(valor).style(style);                      //console.log(header);
                  }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });
                }

             if (NombreModalidad == 'Bodegajes')
                {
                var fila = 1;
          var filabody = 1;
          var col = 1;
          var stylecolor=style;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada'  && header !='Aeropuerto' && /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ 
                     header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada'    && header !='Email')
                {

                      if (header =='AdutarifaPintada')
                    {     
                        console.log('entro aquiiiii')
                            if (modalid[header] == "label label-success")
                             {
                               stylecolor=styleverde;
                             }
                             else if (modalid[header] == "label label-warning")
                             {
                              stylecolor=stylerojo;
                             }
                             else if (modalid[header] == "label label-danger")
                             {
                              stylecolor=styleamarillo;
                             }
                             else 
                             {
                             stylecolor=style;
                             }

                             console.log(stylecolor);
                  }


                  if (header =='RazonSocial'){
                    ws2.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='TarifaValor')
                    {                      
                    ws2.cell(1, 2).string(header).style(style1);
                    console.log(stylecolor);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,2).number(valor).style(stylecolor);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,2).number(valor).style(stylecolor);
                             }
                  }

                  

                  if (header =='TarifaMinima')
                    {                      
                    ws2.cell(1, 3).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,3).number(valor).style(style);
                             }
                  }
                  if (header =='Otros')
                    {                      
                    ws2.cell(1, 4).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,4).number(valor).style(style);
                             }
                  }
                 
                  if (header =='Version'){
                    ws2.cell(1, 5).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,5).string(valor).style(style);                      //console.log(header);
                  }
                    
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                //console.log(modalid[header]);
                     if (header =='RazonSocial'){
                    valor = modalid[header].toString();
                    ws2.cell(fila + 1,1).string(valor).style(style);
                      //console.log(header);
                  }

                 

                  if (header =='TarifaValor')
                    {                      
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,2).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,2).number(valor).style(style);
                             }
                  }
                  if (header =='TarifaMinima')
                    {    
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,3).number(valor).style(style);
                             }
                  }
                  if (header =='Otros')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,4).number(valor).style(style);
                             }
                  }
                 
                  if (header =='Version'){                  
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,5).string(valor).style(style);
                      //console.log(header);
                  }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });

//////////////////////segunda hoja
          var fila = 1;
          var filabody = 1;
          var col = 1;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad2.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                  if (header =='RazonSocial'){
                    ws3.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws3.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Tarifa')
                    {                      
                    ws3.cell(1, 2).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,2).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,2).number(valor).style(style);
                             }
                  }
                  if (header =='TarifaMinima')
                    {                      
                    ws3.cell(1, 3).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,3).number(valor).style(style);
                             }
                  }
                  if (header =='Fmm')
                    {                      
                    ws3.cell(1, 4).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,4).number(valor).style(style);
                             }
                  }
                 
                  if (header =='Version'){
                    ws3.cell(1, 5).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws3.cell(2,5).string(valor).style(style);                      //console.log(header);
                  }
                    
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                //console.log(modalid[header]);
                     if (header =='RazonSocial'){
                    valor = modalid[header].toString();
                    ws3.cell(fila + 1,1).string(valor).style(style);
                      //console.log(header);
                  }

                 

                  if (header =='Tarifa')
                    {                      
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,2).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,2).number(valor).style(style);
                             }
                  }
                  if (header =='TarifaMinima')
                    {    
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,3).number(valor).style(style);
                             }
                  }
                  if (header =='Fmm')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,4).number(valor).style(style);
                             }
                  }
                 
                  if (header =='Version'){                  
                    valor = modalid[header].toString();
                    ws3.cell(fila+1,5).string(valor).style(style);
                      //console.log(header);
                  }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });

///////////////////////tercera hoja

      var fila = 1;
          var filabody = 1;
          var col = 1;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad3.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                  if (header =='RazonSocial'){
                    ws4.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws4.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  if (header =='Tarifa')
                    {                      
                    ws4.cell(1, 2).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws4.cell(2,2).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws4.cell(2,2).number(valor).style(style);
                             }
                  }
                  if (header =='TarifaMinima')
                    {                      
                    ws4.cell(1, 3).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws4.cell(2,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws4.cell(2,3).number(valor).style(style);
                             }
                  }
                  if (header =='Fmm')
                    {                      
                    ws4.cell(1, 4).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws4.cell(2,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws4.cell(2,4).number(valor).style(style);
                             }
                  }
                 
                  if (header =='Version'){
                    ws4.cell(1, 5).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws4.cell(2,5).string(valor).style(style);                      //console.log(header);
                  }
                    
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada'  && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada' && header !='AdumaqpfmmPintada' && header !='Email')
                {
                //console.log(modalid[header]);
                     if (header =='RazonSocial'){
                    valor = modalid[header].toString();
                    ws4.cell(fila + 1,1).string(valor).style(style);
                      //console.log(header);
                  }

                 

                  if (header =='Tarifa')
                    {                      
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws4.cell(fila+1,2).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws4.cell(fila+1,2).number(valor).style(style);
                             }
                  }
                  if (header =='TarifaMinima')
                    {    
                     if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws4.cell(fila+1,3).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws4.cell(fila+1,3).number(valor).style(style);
                             }
                  }
                  if (header =='Fmm')
                    {                      
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws4.cell(fila+1,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws4.cell(fila+1,4).number(valor).style(style);
                             }
                  }
                 
                  if (header =='Version'){                  
                    valor = modalid[header].toString();
                    ws4.cell(fila+1,5).string(valor).style(style);
                      //console.log(header);
                  }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });








                }
              

               

            else
            {







          var fila = 1;
          var filabody = 1;
          var col = 1;
                console.log('no debe pasar por aqui aerea hoja 1');
             Modalidad.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada' && header !='Email' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                  if (header =='RazonSocial'){
                    ws2.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }
                  else {
                    col = col + 1;
                   ws2.cell(1, col).string(header).style(style1);
                   if (modalid[header] == null || modalid[header] == '' || modalid[header] == 'undefined') { 
                            valor =parseFloat(0.00);
                            ws2.cell(2,col).number(valor).style(style);                        
                    }
                    else
                    {
                       if (pattern.test(modalid[header])){

                    if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                     {
                        ws2.cell(2,col).string('').style(style);
                     }
                     else
                     {
                             valor = parseFloat(modalid[header]);
                             ws2.cell(2,col).number(valor).style(style);
                      }
                       }
                       else
                       {
                        if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                     {
                        ws2.cell(2,col).string('X').style(style);
                     }
                     else
                     {

                            valor = modalid[header].toString();
                            ws2.cell(2,col).string(valor).style(style);
                        }

                       }
                    }

                  }
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Aeropuerto' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' &&  header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada' && header !='Email' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                //console.log(modalid[header]);
                    if (modalid[header] == null || modalid[header] == '' || modalid[header] == 'undefined') {
                        
                            valor =parseFloat(0.00);
                            col = col + 1;
                           ws2.cell(fila+1,col).number(valor).style(style);
                       
                    }
                    else
                    {
                       if (pattern.test(modalid[header])){
                         if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                        {
                        col = col + 1;
                        ws2.cell(fila+1,col).string('').style(style);
                        }
                        else
                        {
                            valor = parseFloat(modalid[header]);
                           col = col + 1;
                          ws2.cell(fila+1,col).number(valor).style(style);
                        }
                       }
                       else
                       {
                         if (header =='RazonSocial')
                         {
                            valor = modalid[header].toString();
                            ws2.cell(fila+1,1).string(valor).style(style);
                         }
                          else
                         {
                             if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                     {
                        col = col + 1;
                            ws2.cell(fila+1,col).string('X').style(style);
                     }
                     else
                     {
                           valor = modalid[header].toString();
                            col = col + 1;
                            ws2.cell(fila+1,col).string(valor).style(style);
                        }
                         }
                       }
                    }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });
}

       ////////////////////////////Segunda Hoja////////////////////////////////
        if (NombreModalidad == 'Bodegajes' || NombreModalidad == 'Terrestre Nacional' || NombreModalidad == 'Terrestre Urbano')
         {
              fila=1;
              col=1;
           console.log('no debe pasar por aqui aerea hoja 2');
             Modalidad2.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)'  && header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada' && header !='Email' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                  if (header =='RazonSocial'){
                    ws3.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws3.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }
                  else {
                    col = col + 1;
                   ws3.cell(1, col).string(header).style(style1);
                   if (modalid[header] == null || modalid[header] == '' || modalid[header] == 'undefined') {

                            valor =parseFloat(0.00);
                            ws3.cell(2,col).number(valor).style(style);
                       
                    }
                    else
                    {
                       if (pattern.test(modalid[header])){
                          if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                        {
                        ws3.cell(2,col).string('').style(style);
                        }
                        else
                        {
                             valor = parseFloat(modalid[header]);
                             ws3.cell(2,col).number(valor).style(style);
                        }
                       }
                       else
                       {
                         if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                         {
                           ws3.cell(2,col).string('X').style(style);
                         }
                         else
                         {
                            valor = modalid[header].toString();
                            ws3.cell(2,col).string(valor).style(style);
                        }

                       }
                    }

                  }
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' && header !='Frecuencia' && */header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='Observaciones' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='Email' && header !='AdumaqpPintada' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                //console.log(modalid[header]);
                    if (modalid[header] == null || modalid[header] == '' || modalid[header] == 'undefined' ) {

                            valor =parseFloat(0.00);
                            col = col + 1;
                            ws3.cell(fila+1,col).number(valor).style(style);
                        
                    }
                    else
                    {
                       if (pattern.test(modalid[header])){
                         if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                        {
                        col = col + 1;
                           ws3.cell(fila+1,col).string('').style(style);
                        }
                        else
                        {
                             valor = parseFloat(modalid[header]);
                           col = col + 1;
                           ws3.cell(fila+1,col).number(valor).style(style);
                        }
                       }
                       else
                       {
                         if (header =='RazonSocial')
                         {
                            valor = modalid[header].toString();
                            ws3.cell(fila+1,1).string(valor).style(style);
                         }
                          else
                         {
                             if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                             {
                              col = col + 1;
                            ws3.cell(fila+1,col).string('X').style(style);
                             }
                             else
                             {
                           valor = modalid[header].toString();
                            col = col + 1;
                            ws3.cell(fila+1,col).string(valor).style(style);
                        }
                         }
                       }
                    }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              col=1;
            });

    }


          //////////////////////////////////////////////Tercera Hoja////////////////////////////////
       if (NombreModalidad == 'Bodegajes' || NombreModalidad == 'Terrestre Nacional' || NombreModalidad == 'Terrestre Urbano')
             {
              fila=1;
              col=1;
                console.log('no debe pasar por aqui aerea hoja 3');
             Modalidad3.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada'  &&  header !='AduGAIIPintada'  &&  header !='Aeropuerto' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' && header !='Observaciones' && header !='Frecuencia' && */header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='Email' && header !='AdumaqpPintada' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                  if (header =='RazonSocial'){
                    ws4.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws4.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }
                  else {
                    col = col + 1;
                   ws4.cell(1, col).string(header).style(style1);
                   if (modalid[header] == null || modalid[header] == '' || modalid[header] == 'undefined' ) {
                   
                            valor =parseFloat(0.00);
                            ws4.cell(2,col).number(valor).style(style);
                        
                    }
                    else
                    {
                       if (pattern.test(modalid[header])){
                         if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                        {
                        ws4.cell(2,col).string('').style(style)
                        }
                        else
                        {
                             valor = parseFloat(modalid[header]);
                             ws4.cell(2,col).number(valor).style(style);
                         }
                       }
                       else
                       {
                        if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                        {
                          ws4.cell(2,col).string('X').style(style);
                        }
                        else
                        {
                            valor = modalid[header].toString();
                            ws4.cell(2,col).string(valor).style(style);
                        }

                       }
                    }

                  }
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada'  &&  header !='Aeropuerto' && header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time(dias)' && header !='Lead time(dias)' && header !='Observaciones' && header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='Email' && header !='AdumaqpPintada' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                //console.log(modalid[header]);
                    if (modalid[header] == null || modalid[header] == '' || modalid[header] == 'undefined' ) {
                       
                            valor =parseFloat(0.00);
                            col = col + 1;
                            ws4.cell(fila+1,col).number(valor).style(style);
                        
                    }
                    else
                    {
                       if (pattern.test(modalid[header])){
                         if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                        {
                        col = col + 1;
                           ws4.cell(fila+1,col).string('').style(style);
                        }
                        else
                        {
                             valor = parseFloat(modalid[header]);
                           col = col + 1;
                           ws4.cell(fila+1,col).number(valor).style(style);
                       }
                       }
                       else
                       {
                         if (header =='RazonSocial')
                         {
                            valor = modalid[header].toString();
                            ws4.cell(fila+1,1).string(valor).style(style);
                         }
                          else
                         {
                            if (header =='Frecuencia Mensual' || header =='Frecuencia Semanal' || header =='Frecuencia Quincenal' ||
                         header =='Frecuencia Dia Lunes' || header =='Frecuencia Dia Martes' || header =='Frecuencia Dia Miercoles' || header =='Frecuencia Dia Jueves' || header =='Frecuencia Dia Viernes' ||
                        header =='Frecuencia Dia Sabado' || header =='Frecuencia Dia Domingo' || header =='Frecuencia')
                            {
                            col = col + 1;
                            ws4.cell(fila+1,col).string('X').style(style);
                            }
                            else
                            {
                           valor = modalid[header].toString();
                            col = col + 1;
                            ws4.cell(fila+1,col).string(valor).style(style);
                        }
                         }
                       }
                    }
                   //
                }

               });
                  }

              // Aumenta la fila
              fila++
              filabody++
              col=1;
            });
         }
         }

        else
        {
             ///////////////////////////////////////////////Aerea Primera Hoja /////////////////////////////////

         if (NombreModalidad == 'Aereas')

            console.log('paso por aqui aerea hoja 1');
         {
         fila=1;
         col=5;
             Modalidad.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' && header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    //header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    //header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time (dias)' && header !='Lead time(dias)' && header !='Observaciones' && header !='Frecuencia' && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada' && header !='Email' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                  if (header =='RazonSocial'){
                    ws2.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,1).string(valor).style(style);
                      console.log('RazonSocial');
                  }

                  else if (header =='Pais'){
                    ws2.cell(1, 2).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,2).string(valor).style(style);
                      console.log('pais');
                  }

                  else if (header =='Aeropuerto'){
                    ws2.cell(1, 3).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,3).string(valor).style(style);
                      console.log('Aeropuerto');
                  }

                 else if (header =='Minima')
                    {
                        console.log(header);
                        console.log(modalid[header]);
                    ws2.cell(1, 4).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,4).number(valor).style(style);
                             }

                      console.log('minima');
                  }

                else if (header =='45')
                    {
                    ws2.cell(1, 5).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,5).number(valor).style(style);
                             }
                             console.log('45');
                  }

                  else if (header =='+100')
                    {
                    ws2.cell(1, 6).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,6).number(valor).style(style);
                             }
                             console.log('+100');
                  }

                  else if (header =='+300')
                    {
                    ws2.cell(1, 7).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,7).number(valor).style(style);
                             }
                             console.log('+300');
                  }

                   else if (header =='+500')
                    {
                    ws2.cell(1, 8).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,8).number(valor).style(style);
                             }
                             console.log('+500');
                  }

                   else if (header =='+1000')
                    {
                    ws2.cell(1, 9).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,9).number(valor).style(style);
                             }
                             console.log('+1000');
                  }

                   else if (header =='Fs/kg')
                    {
                         ws2.cell(1, 10).string(header).style(style1);
                        if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,10).number(valor).style(style);
                             }
                  }

                   else if (header =='FS min')
                    {
                    ws2.cell(1, 11).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,11).number(valor).style(style);
                             }
                  }

                   else if (header =='Gastos Embarque')
                    {
                    ws2.cell(1, 12).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,12).number(valor).style(style);
                             }
                  }

                  else if (header =='Observaciones')
                    {
                    ws2.cell(1, 13).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws2.cell(2,13).string(valor).style(style);                             
                  }

                  else if (header =='Lead Time (dias)')
                    {
                    ws2.cell(1, 14).string(header).style(style1);
                     valor = modalid[header].toString();
                    ws2.cell(2,14).string(valor).style(style);                             
                  }

                  else if (header =='Naviera')
                    {
                    ws2.cell(1, 15).string(header).style(style1);
                     valor = modalid[header].toString();
                    ws2.cell(2,15).string(valor).style(style);                             
                  }

                   else if (header =='Frecuencia Dia Lunes')
                    {
                    ws2.cell(1, 16).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,16).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,16).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Martes')
                    {
                    ws2.cell(1, 17).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,17).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,17).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Miercoles')
                    {
                    ws2.cell(1, 18).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,18).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,18).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Jueves')
                    {
                    ws2.cell(1, 19).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,19).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,19).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Viernes')
                    {
                    ws2.cell(1, 20).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,20).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,20).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Sabado')
                    {
                    ws2.cell(1, 21).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,21).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,21).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Domingo')
                    {
                    ws2.cell(1, 22).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(2,22).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(2,22).string('X').style(style);
                             }
                  }

                  else if (header =='+100 + Fs/kg + Gastos Embarque')
                    {
                    ws2.cell(1, 23).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,23).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,23).number(valor).style(style);
                             }
                  }

                  else if (header =='+300 + Fs/kg + Gastos Embarque')
                    {
                    ws2.cell(1, 24).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,24).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,24).number(valor).style(style);
                             }
                  }

                  else if (header =='+500 + Fs/kg + Gastos Embarque')
                    {
                    ws2.cell(1, 25).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,25).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,25).number(valor).style(style);
                             }
                  }

                  else if (header =='+1000 + Fs/kg + Gastos Embarque')
                    {
                    ws2.cell(1, 26).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(2,26).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(2,26).number(valor).style(style);
                             }
                  }

                       else  (header =='Version')
                    {
                        ws2.cell(1, 27).string(header).style(style1);
                         if (modalid[header] == null || modalid[header] == '')
                      {
                        ws2.cell(2,27).string('1').style(style); 
                      }
                      else
                      {                         
                      valor = modalid[header].toString();
                    ws2.cell(2,27).string(valor).style(style);                             
                  }
              }

                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada'  && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time (dias)' && header !='Lead time(dias)' && header !='Observaciones' && header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada' && header !='Email' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                //console.log(modalid[header]);

                    if (header =='RazonSocial')
                         {
                            valor = modalid[header].toString();
                            ws2.cell(fila+1,1).string(valor).style(style);
                         }
                         else if (header =='Pais')
                         {
                            valor = modalid[header].toString();
                            ws2.cell(fila+1,2).string(valor).style(style);
                         }
                         else if (header =='Aeropuerto')
                         {
                            valor = modalid[header].toString();
                            ws2.cell(fila+1,3).string(valor).style(style);
                         }

                        else if (header =='Minima' )
                         {
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,4).number(valor).style(style);
                             }
                         }
                         else if (header =='45' )
                         {
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,5).number(valor).style(style);
                             }
                         }

                          else if (header =='+100')
                    {if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,6).number(valor).style(style);
                             }
                  }

                   else if (header =='+300')
                    {
                        if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,7).number(valor).style(style);
                             }
                  }

                   else if (header =='+500')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,8).number(valor).style(style);
                             }
                  }

                   else if (header =='+1000')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,9).number(valor).style(style);
                             }
                  }

                   else if (header =='Fs/kg')
                    {
                        if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,10).number(valor).style(style);
                             }
                  }

                  else if (header =='FS min')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,11).number(valor).style(style);
                             }
                  }

                   else if (header =='Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,12).number(valor).style(style);
                             }
                  }

                  else if (header =='Observaciones')
                    {
                        valor = modalid[header].toString();
                    ws2.cell(fila+1,13).string(valor).style(style);                             
                  }

                    else if (header =='Lead Time (dias)')
                    {
                        valor = modalid[header].toString();
                    ws2.cell(fila+1,14).string(valor).style(style);                             
                  }

                  else if (header =='Naviera')
                    {
                        valor = modalid[header].toString();
                    ws2.cell(fila+1,15).string(valor).style(style);                             
                  }



                  else if (header =='Frecuencia Dia Lunes')
                    {                    
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,16).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(fila+1,16).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Martes')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,17).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(fila+1,17).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Miercoles')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,18).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(fila+1,18).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Jueves')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,19).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(fila+1,19).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Viernes')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,20).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(fila+1,20).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Sabado')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,21).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(fila+1,21).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Domingo')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws2.cell(fila+1,22).string('').style(style);
                             }
                             else
                             {
                              ws2.cell(fila+1,22).string('X').style(style);
                             }
                  }

                  else if (header =='+100 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,23).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,23).number(valor).style(style);
                             }
                  }

                  else if (header =='+300 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,24).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,24).number(valor).style(style);
                             }
                  }

                  else if (header =='+500 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,25).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,25).number(valor).style(style);
                             }
                  }

                  else if (header =='+1000 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws2.cell(fila+1,26).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws2.cell(fila+1,26).number(valor).style(style);
                             }
                  }

                    else  (header =='Version')
                    {
                        if (modalid[header] == null || modalid[header] == '')
                      {
                         ws2.cell(fila+1,27).string('1').style(style);
                      }
                      else
                      {
                    valor = modalid[header].toString();
                    ws2.cell(fila+1,27).string(valor).style(style);  
                    }                           
                  }                           
                  
                  
                   //
                }

               });
                  }
              // Aumenta la fila
              fila++
              col=5;
            });

             fila=1;
              col=5;
          /////////////////////////////////////////////////////Segunda Hoja Aerea //////////////////////////////
                Modalidad2.forEach(function(modalid) {
              // Si es primera fila se crea el encabezado
              var Encabezados = Object.keys(modalid);
              // Recorre cada encabezado
              if (fila == 1){
                Encabezados.forEach(function(header) {
                 if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada' /*&& header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead Time (dias)' && header !='Lead time(dias)' && header !='Observaciones' && header !='Frecuencia'*/ && header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                  if (header =='RazonSocial'){
                    ws3.cell(1, 1).string('Proveedor').style(style1);
                    valor = modalid[header].toString();
                    ws3.cell(2,1).string(valor).style(style);
                      //console.log(header);
                  }

                  else if (header =='Pais'){
                    ws3.cell(1, 2).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws3.cell(2,2).string(valor).style(style);
                      //console.log(header);
                  }

                  else if (header =='Aeropuerto'){
                    ws3.cell(1, 3).string(header).style(style1);
                    valor = modalid[header].toString();
                    ws3.cell(2,3).string(valor).style(style);
                      //console.log(header);
                  }

                  else if (header =='Minima')
                    {
                    ws3.cell(1, 4).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,4).number(valor).style(style);
                             }

                      //console.log(header);
                  }

                     else if (header =='45')
                    {
                    ws3.cell(1, 5).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,5).number(valor).style(style);
                             }

                      //console.log(header);
                  }


                  else if (header =='+100')
                    {
                    ws3.cell(1, 6).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,6).number(valor).style(style);
                             }
                  }

                  else if (header =='+300')
                    {
                    ws3.cell(1, 7).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,7).number(valor).style(style);
                             }
                  }

                   else if (header =='+500')
                    {
                    ws3.cell(1, 8).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,8).number(valor).style(style);
                             }
                  }

                   else if (header =='+1000')
                    {
                    ws3.cell(1, 9).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,9).number(valor).style(style);
                             }
                  }

                   else if (header =='Fs/kg')
                    {
                    ws3.cell(1, 10).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                              ws3.cell(2,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,10).number(valor).style(style);
                             }
                  }

                   else if (header =='FS min')
                    {
                    ws3.cell(1, 11).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,11).number(valor).style(style);
                             }
                  }                  

                   else if (header =='Gastos Embarque')
                    {
                    ws3.cell(1, 12).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,12).number(valor).style(style);
                             }
                  }

                  else if (header =='Observaciones')
                    {
                   ws3.cell(1, 13).string(header).style(style1);
                    valor = modalid[header].toString();
                   ws3.cell(2,13).string(valor).style(style);                             
                  }

                   else if (header =='Lead time (dias)')
                    {
                    ws3.cell(1, 14).string(header).style(style1);
                     valor = modalid[header].toString();
                    ws3.cell(2,14).string(valor).style(style);                             
                  }

                  else if (header =='Naviera')
                    {
                    ws3.cell(1, 15).string(header).style(style1);
                     valor = modalid[header].toString();
                    ws3.cell(2,15).string(valor).style(style);                             
                  }

                   else if (header =='Frecuencia Dia Lunes')
                    {
                    ws3.cell(1, 16).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(2,16).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(2,16).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Martes')
                    {
                    ws3.cell(1, 17).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(2,17).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(2,17).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Miercoles')
                    {
                    ws3.cell(1, 18).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(2,18).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(2,18).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Jueves')
                    {
                    ws3.cell(1, 19).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(2,19).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(2,19).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Viernes')
                    {
                    ws3.cell(1, 20).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(2,20).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(2,20).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Sabado')
                    {
                    ws3.cell(1, 21).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(2,21).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(2,21).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Domingo')
                    {
                    ws3.cell(1, 22).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(2,22).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(2,22).string('X').style(style);
                             }
                  }

                  else if (header =='+100 + Fs/kg + Gastos Embarque')
                    {
                    ws3.cell(1, 23).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,23).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,23).number(valor).style(style);
                             }
                  }

                  else if (header =='+300 + Fs/kg + Gastos Embarque')
                    {
                    ws3.cell(1, 24).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,24).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,24).number(valor).style(style);
                             }
                  }

                  else if (header =='+500 + Fs/kg + Gastos Embarque')
                    {
                    ws3.cell(1, 25).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,25).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,25).number(valor).style(style);
                             }
                  }

                  else if (header =='+1000 + Fs/kg + Gastos Embarque')
                    {
                    ws3.cell(1, 26).string(header).style(style1);

                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(2,26).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(2,26).number(valor).style(style);
                             }
                  }

                    else  (header =='Version')
                    {
                        ws3.cell(1, 27).string(header).style(style1);
                         if (modalid[header] == null || modalid[header] == '')
                      {
                        ws3.cell(2,27).string('1').style(style); 
                      }
                      else
                      {                         
                      valor = modalid[header].toString();
                    ws3.cell(2,27).string(valor).style(style);                             
                  }
              }
                  
                  }
                });
              }
              // Recorre cada registro
             else {
                 Encabezados.forEach(function(header) {
                if (header !='_id' && header !='AdutarifaPintada' && header !='AdutarifaminPintada' && header !='AdutarifaotroPintada' && header !='AduC2045Pintada' && header !='AduC8Pintada' && header !='AduC2010Pintada' && header !='AduC2017Pintada' && header !='AduC2019Pintada' && header !='AduC2020Pintada' &&
                    header !='AduC2021Pintada' && header !='AduC2025Pintada' && header !='AduC4015Pintada' && header !='AduC4016Pintada' && header !='AduC4017Pintada' && header !='AduC401718Pintada' && header !='AduC4020Pintada' &&
                    header !='AduC4021Pintada' && header !='AduC4022Pintada' && header !='AduC4030Pintada' && header !='AduC20ESTPintada' && header !='AduC40ESTPintada' && header !='AduC20ESPPintada' && header !='AduC40ESPPintada' &&
                    header !='AdutarifaPintada' &&  header !='AduMinimaPintada' &&  header !='AduGAPintada' &&  header !='AduCAPintada' &&  header !='AduGAIIPintada' &&  header !='AduCAIIPintada' &&  header !='AduGAIIIPintada' &&
                    header !='AduCAIIIPintada' &&  header !='AduCPCPintada' &&  header !='AduotroPintada'  && /*header !='Frecuencia Mensual' && header !='Frecuencia Semanal' && header !='Frecuencia Quincenal' &&
                    header !='Frecuencia Dia Lunes' && header !='Frecuencia Dia Martes' && header !='Frecuencia Dia Miercoles' && header !='Frecuencia Dia Jueves' && header !='Frecuencia Dia Viernes' &&
                    header !='Frecuencia Dia Sabado' && header !='Frecuencia Dia Domingo' && header !='Lead time (dias)' && header !='Lead time(dias)' && header !='Observaciones' && header !='Frecuencia' &&*/ header !='AdumaqtPintada' &&
                    header !='AdumaqtminPintada' && header !='AdumaqtfmmPintada' && header !='AduC2021vPintada' && header !='AduC2025vPintada' && header !='AduC4015vPintada' && header !='AduC4016vPintada' && header !='AduC4017vPintada' && header !='AduC401718vPintada' &&
                    header !='AduC2045PPintada' && header !='AduC8PPintada' && header !='AduC2010PPintada' && header !='AduC2017PPintada' && header !='AduC2019PPintada' && header !='AduC2020PPintada' &&
                    header !='AduC2021PPintada' && header !='AduC2025PPintada' && header !='AduC4015PPintada' && header !='AduC4016PPintada' && header !='AduC4017PPintada' && header !='AduC401718PPintada' && header !='AduC4020PPintada' &&
                    header !='AduC4021PPintada' && header !='AdumaqpPintada' && header !='Email' && header !='AdumaqpminPintada' && header !='AdumaqpfmmPintada')
                {
                //console.log(modalid[header]);

                    if (header =='RazonSocial')
                         {
                            valor = modalid[header].toString();
                            ws3.cell(fila+1,1).string(valor).style(style);
                         }
                         else if (header =='Pais')
                         {
                            valor = modalid[header].toString();
                            ws3.cell(fila+1,2).string(valor).style(style);
                         }
                         else if (header =='Aeropuerto')
                         {
                            valor = modalid[header].toString();
                            ws3.cell(fila+1,3).string(valor).style(style);
                         }
                             else if (header =='Minima' )
                         {
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,4).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,4).number(valor).style(style);
                             }
                         }
                         else if (header =='45' )
                         {
                            if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,5).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,5).number(valor).style(style);
                             }
                         }

                               else if (header =='+100')
                    {if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,6).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,6).number(valor).style(style);
                             }
                  }

                   else if (header =='+300')
                    {
                        if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,7).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,7).number(valor).style(style);
                             }
                  }

                   else if (header =='+500')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,8).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,8).number(valor).style(style);
                             }
                  }

                   else if (header =='+1000')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,9).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,9).number(valor).style(style);
                             }
                  }

                    else if (header =='Fs/kg')
                    {
                        if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,10).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,10).number(valor).style(style);
                             }
                  }

                     else if (header =='FS min')
                    {
                        if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,11).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,11).number(valor).style(style);
                             }
                  }

                   else if (header =='Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,12).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,12).number(valor).style(style);
                             }
                  }

                  else if (header =='Observaciones')
                    {
                        valor = modalid[header].toString();
                    ws3.cell(fila+1,13).string(valor).style(style);                             
                  }

                    else if (header =='Lead time (dias)')
                    {
                        valor = modalid[header].toString();
                    ws3.cell(fila+1,14).string(valor).style(style);                             
                  }

                  else if (header =='Naviera')
                    {
                        valor = modalid[header].toString();
                    ws3.cell(fila+1,15).string(valor).style(style);                             
                  }



                  else if (header =='Frecuencia Dia Lunes')
                    {                    
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(fila+1,16).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(fila+1,16).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Martes')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(fila+1,17).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(fila+1,17).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Miercoles')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(fila+1,18).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(fila+1,18).string('X').style(style);
                             }
                  }

                  else if (header =='Frecuencia Dia Jueves')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(fila+1,19).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(fila+1,19).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Viernes')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(fila+1,20).string('').style(style);
                             }
                             else
                             {
                             ws3.cell(fila+1,20).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Sabado')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(fila+1,21).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(fila+1,21).string('X').style(style);
                             }
                  }

                   else if (header =='Frecuencia Dia Domingo')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               ws3.cell(fila+1,22).string('').style(style);
                             }
                             else
                             {
                              ws3.cell(fila+1,22).string('X').style(style);
                             }
                  }

                  else if (header =='+100 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,23).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,23).number(valor).style(style);
                             }
                  }

                  else if (header =='+300 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                              ws3.cell(fila+1,24).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,24).number(valor).style(style);
                             }
                  }

                  else if (header =='+500 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,25).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,25).number(valor).style(style);
                             }
                  }

                  else if (header =='+1000 + Fs/kg + Gastos Embarque')
                    {
                    if (modalid[header] == null || modalid[header] == '')
                             {
                               valor =parseFloat(0.00);
                               ws3.cell(fila+1,26).number(valor).style(style);
                             }
                             else
                             {
                              valor = parseFloat(modalid[header]);
                              ws3.cell(fila+1,26).number(valor).style(style);
                             }
                  }

                    else  (header =='Version')
                    {

                      if (modalid[header] == null || modalid[header] == '')
                      {
                         ws3.cell(fila+1,27).string('1').style(style);
                      }
                      else
                      {
                    valor = modalid[header].toString();
                    ws3.cell(fila+1,27).string(valor).style(style);  
                    }                           
                  }
                  
                   //
                }

               });
                  }
              // Aumenta la fila
              fila++
              col=5;
            });
         }


        }



        wb.writeToBuffer().then(function (buffer) {
          Data.ExcelBase64 = buffer.toString('base64');
          res.end(JSON.stringify(Data));

        });




console.log('Si va');
    //wb.write('Aduana.xlsx', res);

  });


/////////////Fin Consolidado de Datos///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/GetEmpleadosData', function (req, res) {


                var Data = {};

      MyMongo.Find('Usuarios', { User: req.body.EditUser }, function (result) {
       Data.Usuario = result[0];
       res.end(JSON.stringify(Data));

            } );
        });


app.post('/GetEmpleadosNomina', function (req, res) {

  MyMongo.Find('EmpleadosNomina', {}, function (result) {
    var sheetEmpleados = result;
    var Nominas = MyUnderScore.keys(MyUnderScore.countBy(sheetEmpleados, function (sheetEmpleados) { return sheetEmpleados.Nomina; }));
    Nominas = Nominas.map(function (elem) {
        return { "Name": elem };
    });
    var Periodos = MyUnderScore.keys(MyUnderScore.countBy(sheetEmpleados, function (sheetEmpleados) { return sheetEmpleados.Periodo; }));
    Periodos = Periodos.map(function (elem) {
        return { "Name": elem };
    });
    var Empleados = MyUnderScore.keys(MyUnderScore.countBy(sheetEmpleados, function (sheetEmpleados) { return sheetEmpleados.NombreCompleto; }));
    Empleados = Empleados.map(function (elem) {
        return { "Name": elem };
    });
    var Data = {};
    Data.Nominas = Nominas;

    if (req.session.user[0].Level != '1'){
      Data.Nominas = Data.Nominas.filter(function (o) {
          return req.session.user[0].Nominas.some(function (i) {
              return i.Name === o.Name;
          });
      });
    }

    Data.Periodos = Periodos;
    Data.Empleados = Empleados;
    Data.tEmpleados = sheetEmpleados;
    Data.User = req.session.user[0];
    console.log(req.body.EditUser);
    if (req.body.EditUser != '') {
        MyMongo.Find('Usuarios', { Email: req.body.EditUser }, function (result) {
            Data.Usuario = result[0];
            res.end(JSON.stringify(Data));
        }
        );
    }
    else{
      Data.Usuario = {};
      res.end(JSON.stringify(Data));
    }
  }
  );

});

 function downloadURI(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
          }

function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function mes(periodo){
  if (periodo.indexOf('ENE') !== -1){
    return '01'
  }
  if (periodo.indexOf('FEB') !== -1){
    return '02'
  }
  if (periodo.indexOf('MAR') !== -1){
    return '03'
  }
  if (periodo.indexOf('ABR') !== -1){
    return '04'
  }
  if (periodo.indexOf('MAY') !== -1){
    return '05'
  }
  if (periodo.indexOf('JUN') !== -1){
    return '06'
  }
  if (periodo.indexOf('JUL') !== -1){
    return '07'
  }
  if (periodo.indexOf('AGO') !== -1){
    return '08'
  }
  if (periodo.indexOf('SEP') !== -1){
    return '09'
  }
  if (periodo.indexOf('OCT') !== -1){
    return '10'
  }
  if (periodo.indexOf('NOV') !== -1){
    return '11'
  }
  if (periodo.indexOf('DIC') !== -1){
    return '12'
  }
  return -1;
}

app.post('/ReadGoogleSheet', function (req, res) {
  var Data = {};
  // Si no ha subido Txt manda error
  if (typeof req.session.CurrentTxtEmpleados == 'undefined'){
    Data.Result = 'notxt'
    res.end(JSON.stringify(Data));
    return 0;
  }
  jwtClient.authorize(function (err, tokens) {
      if (err) {
          console.log('Error autenticacion');
          return console.log(err);
      }
      else {
        var surl = req.body.url;
        var surlVal = req.body.urlValidacion;

          surl = getIdFromUrl(surl);
          MySheet.GetSheetRange(jwtClient, 'ASIMILADOS!A:M', surl,  function (sheetEmpleados) {
              var sheetEmpleados = getSheetValuesValidData(sheetEmpleados);

              if (sheetEmpleados.length == 0){
                Data.Result = 'sd'
                res.end(JSON.stringify(Data));
                return 0;
              }

              surlVal = getIdFromUrl(surlVal);
              MySheet.GetSheetRange(jwtClient, 'ASIMILADOS!A:M', surlVal,  function (sheetEmpleadosValidar) {
                  var sheetEmpleadosValidar = getSheetValuesValidData(sheetEmpleadosValidar);


                  if (sheetEmpleadosValidar.length == 0){
                    Data.Result = 'sd'
                    res.end(JSON.stringify(Data));
                    return 0;
                  }

                  var errores = [];
                  var empleados = [];
                  var Fila = 1;

                  sheetEmpleados.forEach(function (nominaempleado) {
                    console.log(nominaempleado);
                    Fila++;

                    var CuentaValidada = false;
                    sheetEmpleadosValidar.forEach(function (nominaempleadoValidar) {
                      if (nominaempleado['CLABE INTERBANCARIA2'] == nominaempleadoValidar['CLABE INTERBANCARIA2']){
                        CuentaValidada = true;
                      }
                    })

                    if (!CuentaValidada){
                      var lerror = {};
                      lerror.id = Fila;
                      lerror.error = 'Cuenta no válida';
                      lerror.atributo = 'CLABE INTERBANCARIA2';
                      errores.push(lerror);
                    }
                    if (typeof nominaempleado['EMPRESA DISPERSORA'] == 'undefined'){
                      var lerror = {};
                      lerror.id = Fila;
                      lerror.error = 'Falta valor en el campo';
                      lerror.atributo = 'EMPRESA DISPERSORA';
                      errores.push(lerror);
                    }
                    else {
                      if (nominaempleado['EMPRESA DISPERSORA'].trim() == ''){
                        var lerror = {};
                        lerror.id = Fila;
                        lerror.error = 'Falta valor en el campo';
                        lerror.atributo = 'EMPRESA DISPERSORA';
                        errores.push(lerror);
                      }
                    }
                    if (typeof nominaempleado['PROYECTO/Nomina'] == 'undefined'){
                      var lerror = {};
                      lerror.id = Fila;
                      lerror.error = 'Falta valor en el campo';
                      lerror.atributo = 'PROYECTO/Nomina';
                      errores.push(lerror);
                    }
                    else{
                      if (nominaempleado['PROYECTO/Nomina'].trim() == ''){
                        var lerror = {};
                        lerror.id = Fila;
                        lerror.error = 'Falta valor en el campo';
                        lerror.atributo = 'PROYECTO/Nomina';
                        errores.push(lerror);
                      }
                    }
                    if (typeof nominaempleado['NOMBRE'] == 'undefined'){
                      var lerror = {};
                      lerror.id = Fila;
                      lerror.error = 'Falta valor en el campo';
                      lerror.atributo = 'NOMBRE';
                      errores.push(lerror);
                    }
                    else{
                      if (nominaempleado['NOMBRE'].trim() == ''){
                        var lerror = {};
                        lerror.id = Fila;
                        lerror.error = 'Falta valor en el campo';
                        lerror.atributo = 'NOMBRE';
                        errores.push(lerror);
                      }
                    }
                    if (typeof nominaempleado['RFC'] == 'undefined'){
                      var lerror = {};
                      lerror.id = Fila;
                      lerror.error = 'Falta valor en el campo';
                      lerror.atributo = 'RFC';
                      errores.push(lerror);
                    }
                    else{
                      if (nominaempleado['RFC'].trim() == ''){
                        var lerror = {};
                        lerror.id = Fila;
                        lerror.error = 'Falta valor en el campo';
                        lerror.atributo = 'RFC';
                        errores.push(lerror);
                      }
                    }
                    if (typeof nominaempleado['PERIODO DE PAGO'] == 'undefined'){
                      var lerror = {};
                      lerror.id = Fila;
                      lerror.error = 'Falta valor en el campo';
                      lerror.atributo = 'PERIODO DE PAGO';
                      errores.push(lerror);
                    }
                    else{
                      if (nominaempleado['PERIODO DE PAGO'].trim() == ''){
                        var lerror = {};
                        lerror.id = Fila;
                        lerror.error = 'Falta valor en el campo';
                        lerror.atributo = 'PERIODO DE PAGO';
                        errores.push(lerror);
                      }
                      else{
                        var txt=nominaempleado['PERIODO DE PAGO'].trim();

                        var re1='((?:(?:[0-2]?\\d{1})|(?:[3][01]{1})))(?![\\d])'; // Day 1
                        var re2='(\\s+)'; // White Space 1
                        var re3='((?:[a-z][a-z]+))';  // Word 1
                        var re4='(\\s+)'; // White Space 2
                        var re5='((?:(?:[0-2]?\\d{1})|(?:[3][01]{1})))(?![\\d])'; // Day 2
                        var re6='(\\s+)'; // White Space 3
                        var re7='((?:[a-z][a-z]+))';  // Word 2
                        var re8='(\\s+)'; // White Space 4
                        var re9='((?:[a-z][a-z]+))';  // Word 3
                        var re10='(\\s+)';  // White Space 5
                        var re11='((?:(?:[1]{1}\\d{1}\\d{1}\\d{1})|(?:[2]{1}\\d{3})))(?![\\d])';  // Year 1

                        var p = new RegExp(re1+re2+re3+re4+re5+re6+re7+re8+re9+re10+re11,["i"]);
                        var m = p.exec(txt);
                        if (m == null)
                        {
                          var lerror = {};
                          lerror.id = Fila;
                          lerror.error = 'No se reconoce periodo válido';
                          lerror.atributo = 'PERIODO DE PAGO';
                          errores.push(lerror);
                        }
                        else{
                          var lnominaempleado = {};
                          lnominaempleado.Cliente = nominaempleado['EMPRESA DISPERSORA'];
                          lnominaempleado.Nomina = nominaempleado['PROYECTO/Nomina'];
                          lnominaempleado.NombreCompleto = nominaempleado['NOMBRE'];
                          lnominaempleado.Rfc = nominaempleado['RFC'];
                          lnominaempleado.Periodo = nominaempleado['PERIODO DE PAGO'];
                          var Periodo = '';
                          var DiaInicio = '';
                          DiaInicio = pad(nominaempleado['PERIODO DE PAGO'].substring(0, 2).toString(), 2);
                          var ano = '';
                          ano = nominaempleado['PERIODO DE PAGO'].substr(nominaempleado['PERIODO DE PAGO'].length - 4);
                          var DiaFin = '';
                          DiaFin = pad(nominaempleado['PERIODO DE PAGO'].substring(6, 8).toString(), 2);

                          if (mes(nominaempleado['PERIODO DE PAGO']) == -1){
                            var lerror = {};
                            lerror.id = Fila;
                            lerror.error = 'No se reconoce periodo válido';
                            lerror.atributo = 'PERIODO DE PAGO';
                            errores.push(lerror);
                          }

                          Periodo = nominaempleado['PROYECTO/Nomina'] + '@' + nominaempleado['RFC'] + '@' + mes(nominaempleado['PERIODO DE PAGO']) + DiaInicio + ano + '-' + mes(nominaempleado['PERIODO DE PAGO']) + DiaFin + ano;
                          console.log(Periodo);
                          lnominaempleado.PeriodoFile = Periodo;
                          empleados.push(lnominaempleado);
                        }
                      }
                    }
                  })

                  if (errores.length > 0){
                    Data.Result = 'err'
                    Data.Errors = {
                        code: -1,
                        errores: errores,
                        empleados_error: empleados
                    };

                    var row = ' '

                    var table = '<table style="width:100%">  <tr>    <th>Fila</th>    <th>Error</th>     <th>Campo</th>  </tr> @@rows  </table>'

                    errores.forEach(function (ierror) {
                      row = row + ' <tr>    <td>' + ierror.id + '</td>    <td>' + ierror.error + '</td>     <td>' + ierror.atributo + '</td>  </tr> '
                    })

                    table = table.replace('@@rows', row);

                    var msg = MyConst.CorreoHTML;

                    msg = msg.replace('@@Encabezado', 'Se produjeron errores al tratar de importar una plantilla de empleados.');

                    var msgBody = 'Los errores fueron al tratar de importar las plantillas: <br><br>';
                    msgBody += '<a href="https://docs.google.com/spreadsheets/d/' + surl + '">Plantilla empleados</a>';
                    msgBody += '<br><a href="https://docs.google.com/spreadsheets/d/' + surlVal + '">Plantilla validadora</a>';
                    msgBody += '<br><br> Los errores se muestran en la tabla: <br><br> ';
                    msgBody += table;

                    msg = msg.replace('@@Body', msgBody);
                    msg = msg.replace('@@boton', '<a href="http://licita.proenfar.com">Portal Licitaciones Proenfar</a>');
                    msg = msg.replace('@@Pie', "href='http://licita.proenfar.com'>Ir al <b>Portal</b>");

                    var subject = "Se produjeron errores al tratar de importar una plantilla de empleados.";

                    MyMail.SendEmail(msg, "juliob@ptree.com.mx", subject);


                    res.end(JSON.stringify(Data));
                    return 0;
                  }
                  else{

                    if (empleados.length == 0){
                      Data.Result = 'sd'
                      res.end(JSON.stringify(Data));
                      return 0;
                    }
                    else{

                      var lempleadosconerrores = [];

                      Fila = 0;
                      empleados.forEach(function(Nomina) {
                        Fila = Fila + 1;
                        //Por cada empleado agrega una columna si el empleado está o no en el txt de RFC válido
                        var searchEmployeeInTxt = req.session.CurrentTxtEmpleados.filter(function (el){
                          return el.RFC == Nomina.Rfc && el.VALIDO == 'V'
                        })
                        console.log(searchEmployeeInTxt);
                        if (searchEmployeeInTxt.length == 0){
                          Nomina.RfcValido = false;

                          var lerror = {};
                          lerror.id = Fila;
                          lerror.error = 'Se cargó el empleado, pero su RFC es inválido';
                          lerror.atributo = 'RFC';
                          lempleadosconerrores.push(lerror);

                        }
                        else {
                          Nomina.RfcValido = true;
                        }

                        console.log(Nomina);
                        MyMongo.Remove('EmpleadosNomina', { $and: [{ Nomina: Nomina.Nomina }, { Rfc: Nomina.Rfc }, { Periodo: Nomina.Periodo }] }, function (result) {
                            MyMongo.Insert('EmpleadosNomina', Nomina, function (result) {
                              var ResponseData = 'Hace falta hacer una promesa para esperar por todas las respuestas antes de enviar ';
                            });
                        });
                      });


                      var msg = MyConst.CorreoHTML;

                      var row = ' '

                      var table = '<table style="width:100%">  <tr>    <th>Fila</th>    <th>Error</th>     <th>Campo</th>  </tr> @@rows  </table>'

                      lempleadosconerrores.forEach(function (ierror) {
                        row = row + ' <tr>    <td>' + ierror.id + '</td>    <td>' + ierror.error + '</td>     <td>' + ierror.atributo + '</td>  </tr> '
                      })

                      table = table.replace('@@rows', row);

                      msg = msg.replace('@@Encabezado', 'Se produjeron errores al tratar de importar una plantilla de empleados.');

                      var msgBody = 'Los errores no impidieron se importara la data, pero se muestran en la siguiente tabla: <br><br>';
                      msgBody += table;

                      msg = msg.replace('@@Body', msgBody);
                      msg = msg.replace('@@boton', '<a href="http://licita.proenfar.com">Portal de Licitaciones Proenfar</a>');
                      msg = msg.replace('@@Pie', "href='http://licita.proenfar.com'>Ir al <b>Portal</b>");

                      var subject = "Se produjeron errores al tratar de importar una plantilla de empleados.";

                      MyMail.SendEmail(msg, "juliob@ptree.com.mx", subject);


                      Data.Result = 'ok'
                      Data.EmpleadosErrores = lempleadosconerrores;
                      res.end(JSON.stringify(Data));
                      return 0;
                    }

                  }

              }
              );

          }
          );
      }
  });

});

// Generación de todos los templates Modalidades
//////////////////// Generar Plantilla Excel Bodegaje/////////

app.get('/GetTemplateBodegaje', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Aduanero');
    var ws1 = wb.addWorksheet('Maquinaria');
    var ws2 = wb.addWorksheet('Materia_Prima');
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
        ws.cell(1, 1).string('Tarifa Valor/FOB').style(style);
        ws.cell(1, 2).string('Tarifa Minima').style(style);
        ws.cell(1, 3).string('Otros').style(style);
        ws1.cell(1, 1).string('Tarifa').style(style);
        ws1.cell(1, 2).string('Tarifa Minima').style(style);
        ws1.cell(1, 3).string('FMM').style(style);
        ws2.cell(1, 1).string('Tarifa').style(style);
        ws2.cell(1, 2).string('Tarifa Minima').style(style);
        ws2.cell(1, 3).string('FMM').style(style);

    wb.write('Bodegajes.xlsx', res);
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
        ws2.cell(1, 2).string("Tarifa % Advalorem/ FOB").style(style);
        ws2.cell(1, 3).string('Minima').style(style);
        ws2.cell(1, 4).string('Gastos Adicionales').style(style);
        ws2.cell(1, 5).string('Conceptos Adicionales').style(style);
        ws2.cell(1, 6).string('Gastos Adicionales dos').style(style);
        ws2.cell(1, 7).string('Conceptos Adicionales dos').style(style);
        ws2.cell(1, 8).string('Gastos Adicionales tres').style(style);
        ws2.cell(1, 9).string('Conceptos Adicionales tres').style(style);
        ws2.cell(1, 10).string('Costo Planificacion Caja').style(style);
        ws2.cell(1, 11).string('Otros').style(style);
        ws2.cell(col + 1, 1 ).string(aduana.Via).style(style);
        });


    wb.write('Aduana.xlsx', res);
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
        ws3.cell(1, 1).string('Origen').style(style);
        ws3.cell(1, 2).string('Destino').style(style);
        ws3.cell(1, 3).string('C 20 hasta 4-5 Ton').style(style);
        ws3.cell(1, 4).string('C 20 hasta 8 Ton').style(style);
        ws3.cell(1, 5).string('C 20 hasta 10 Ton').style(style);
        ws3.cell(1, 6).string('C 20 hasta 17 Ton').style(style);
        ws3.cell(1, 7).string('C 20 hasta 19 Ton').style(style);
        ws3.cell(1, 8).string('C 20 hasta 20 Ton').style(style);
        ws3.cell(1, 9).string('C 20 hasta 21 Ton').style(style);
        ws3.cell(1, 10).string('C 20 hasta 25 Ton').style(style);
        ws3.cell(1, 11).string('C 40 hasta 15 Ton').style(style);
        ws3.cell(1, 12).string('C 40 hasta 16 Ton').style(style);
        ws3.cell(1, 13).string('C 40 hasta 17 Ton').style(style);
        ws3.cell(1, 14).string('C 40 hasta 17-18 Ton').style(style);
        ws3.cell(1, 15).string('C 40 hasta 20 Ton').style(style);
        ws3.cell(1, 16).string('C 40 hasta 21 Ton').style(style);
        ws3.cell(1, 17).string('C 40 hasta 22 Ton').style(style);
        ws3.cell(1, 18).string('C 40 hasta 30 Ton').style(style);
        ws3.cell(1, 19).string('Devolucion 20$ estandar').style(style);
        ws3.cell(1, 20).string('Devolucion 40$ estandar').style(style);
        ws3.cell(1, 21).string('Devolucion 20$ expreso').style(style);
        ws3.cell(1, 22).string('Devolucion 40$ expreso').style(style);

        var col = 0
        OTm.forEach(function(otm){
        col = col + 1;
        ws3.cell(col + 1, 1).string(otm.Origen).style(style);
        ws3.cell(col + 1, 2).string(otm.Destino).style(style);
        });


        wb.write('OTM.xlsx', res);
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

        numberFormat: '#,##0.00; (#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
    ///////////////Maritimasfcl///////////////////////////////
      MyMongo.Find('MaritimasFcl', {}, function (result) {
          var MaritFcl= result;

        ws4.cell(1, 1).string('PaisDestino').style(style);
        ws4.cell(1, 2).string('PuertoOrigen').style(style);
        ws4.cell(1, 3).string('PuertoDestino').style(style);
        ws4.cell(1, 4).string('C 20').style(style);
        ws4.cell(1, 5).string('Baf 20').style(style);
        ws4.cell(1, 6).string('C 40').style(style);
        ws4.cell(1, 7).string('Baf 40').style(style);
        ws4.cell(1, 8).string('C 40HC').style(style);
        ws4.cell(1, 9).string('Baf 40HC').style(style);
        ws4.cell(1, 10).string('Observaciones').style(style);
        ws4.cell(1, 11).string('Gastos Embarque').style(style);
        ws4.cell(1, 12).string('Lead Time(dias)').style(style);
        ws4.cell(1, 13).string('Naviera').style(style);
        ws4.cell(1, 14).string('Frecuencia Semanal').style(style);
        ws4.cell(1, 15).string('Frecuencia Quincenal').style(style);
        ws4.cell(1, 16).string('Frecuencia Mensual').style(style);
        /*ws4.cell(1, 17).string('C 20 + Baf 20 + Gastos Embarque').style(style);
        ws4.cell(1, 18).string('C 40 + Baf 40 + Gastos Embarque').style(style);
        ws4.cell(1, 19).string('C 40HC + Baf 40HC + Gastos Embarque').style(style);*/


        var col = 0;
        //var cel = 0;
        MaritFcl.forEach(function(maritFcl){
        col = col + 1;
       /* cel = col +1;
        var Dcell = 'D' + cel ;
        var Ecell = 'E' + cel;
        var Kcell = 'K' + cel;
        var Fcell = 'F' + cel;
        var Gcell = 'G' + cel;
        var Hcell = 'H' + cel;
        var Icell = 'I' + cel;*/
        ws4.cell(col + 1, 1).string(maritFcl.PaisDestino).style(style);
        ws4.cell(col + 1, 2).string(maritFcl.PuertoOrigen).style(style);
        ws4.cell(col + 1, 3).string(maritFcl.PuertoDestino).style(style);
        /*ws4.cell(col + 1, 14).string('').style(style);
        ws4.cell(col + 1, 15).string('').style(style);
        ws4.cell(col + 1, 16).string('').style(style);
        ws4.cell(col + 1, 17).formula(Dcell+"+"+Ecell+"+"+Kcell).style(style);
        ws4.cell(col + 1, 18).formula(Fcell+"+"+Gcell+"+"+Kcell).style(style);
        ws4.cell(col + 1, 19).formula(Hcell+"+"+Icell+"+"+Kcell).style(style);*/
        });


    wb.write('MaritimasFCL.xlsx', res);
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

        numberFormat: '#,##0.00; (#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
   ///////////////MaritimasLcl///////////////////////////////
      MyMongo.Find('MaritimasLcl', {}, function (result) {
          var MaritLcl= result;
        ws5.cell(1, 1).string('PaisDestino').style(style);
        ws5.cell(1, 2).string('PuertoOrigen').style(style);
        ws5.cell(1, 3).string('PuertoDestino').style(style);
        ws5.cell(1, 4).string('Minima').style(style);
        ws5.cell(1, 5).string('1-5 ton/M3').style(style);
        ws5.cell(1, 6).string('5-8 ton/M3').style(style);
        ws5.cell(1, 7).string('8-12 ton/M3').style(style);
        ws5.cell(1, 8).string('12-18 ton/M3').style(style);
        ws5.cell(1, 9).string('Gastos Embarque').style(style);
        ws5.cell(1, 10).string('Observaciones').style(style);
        ws5.cell(1, 11).string('Lead time(dias)').style(style);
        ws5.cell(1, 12).string('Naviera').style(style);
        ws5.cell(1, 13).string('Frecuencia Dia Lunes').style(style);
        ws5.cell(1, 14).string('Frecuencia Dia Martes').style(style);
        ws5.cell(1, 15).string('Frecuencia Dia Miercoles').style(style);
        ws5.cell(1, 16).string('Frecuencia Dia Jueves').style(style);
        ws5.cell(1, 17).string('Frecuencia Dia Viernes').style(style);
        ws5.cell(1, 18).string('Frecuencia Dia Sabado').style(style);
        ws5.cell(1, 19).string('Frecuencia Dia Domingo').style(style);


        var col = 0
        MaritLcl.forEach(function(maritlcl){
        col = col + 1;
        ws5.cell(col + 1, 1).string(maritlcl.PaisDestino).style(style);
        ws5.cell(col + 1, 2).string(maritlcl.PuertoOrigen).style(style);
        ws5.cell(col + 1, 3).string(maritlcl.PuertoDestino).style(style);
        ws5.cell(col + 1, 13).string('').style(style);
        ws5.cell(col + 1, 14).string('').style(style);
        ws5.cell(col + 1, 15).string('').style(style);
        ws5.cell(col + 1, 16).string('').style(style);
        ws5.cell(col + 1, 17).string('').style(style);
        ws5.cell(col + 1, 18).string('').style(style);
        ws5.cell(col + 1, 19).string('').style(style);
        });


    wb.write('MaritimasLCL.xlsx', res);
        });
        });


app.get('/GetTemplateTerreNacional', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws6 = wb.addWorksheet('Terrestre_Nacional_Turbo');
    var ws7 = wb.addWorksheet('Terrestre_Nacional_Sencillo');
    var ws8 = wb.addWorksheet('Terrestre_Nacional_Patineta');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12
        },

        numberFormat: '#,##0.00; (#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
///////////////Terrestre Nacional///////////////////////////////
      MyMongo.Find('TerresNacional', {}, function (result) {
          var TerrestNacional= result;
        ws6.cell(1, 1).string('PaisOrigen').style(style);
        ws6.cell(1, 2).string('PuertoDestino').style(style);
        ws6.cell(1, 3).string('Turbo Standar (150Cajas)').style(style);
        ws6.cell(1, 4).string('Turbo Especial').style(style);

        var col = 0
        TerrestNacional.forEach(function(terrestnacional){
        col = col + 1;
        ws6.cell(col + 1, 1).string(terrestnacional.PaisOrigen).style(style);
        ws6.cell(col + 1, 2).string(terrestnacional.PuertoDestino).style(style);
        });
///////////////Terrestre NacionalSencillo///////////////////////////////
      MyMongo.Find('TerresNacionalSencillo', {}, function (result) {
          var TerrestNacionalSencillo= result;
        ws7.cell(1, 1).string('PaisOrigen').style(style);
        ws7.cell(1, 2).string('PuertoDestino').style(style);
        ws7.cell(1, 3).string('Sencillo Standar (150Cajas)').style(style);
        ws7.cell(1, 4).string('Sencillo Especial').style(style);

        var col = 0
        TerrestNacionalSencillo.forEach(function(terrestnacionalsencillo){
        col = col + 1;
        ws7.cell(col + 1, 1).string(terrestnacionalsencillo.PaisOrigen).style(style);
        ws7.cell(col + 1, 2).string(terrestnacionalsencillo.PuertoDestino).style(style);
        });

///////////////Terrestre NacionalPatineta///////////////////////////////
      MyMongo.Find('TerresNacionalPatineta', {}, function (result) {
          var TerrestNacionalPatineta= result;
        ws8.cell(1, 1).string('PaisOrigen').style(style);
        ws8.cell(1, 2).string('PuertoDestino').style(style);
        ws8.cell(1, 3).string('Minimula').style(style);
        ws8.cell(1, 4).string('Gran Danes').style(style);

        var col = 0
        TerrestNacional.forEach(function(terrestnacionalpatineta){
        col = col + 1;
        ws8.cell(col + 1, 1).string(terrestnacionalpatineta.PaisOrigen).style(style);
        ws8.cell(col + 1, 2).string(terrestnacionalpatineta.PuertoDestino).style(style);
        });



    wb.write('TerrestreNacional.xlsx', res);
        });
    });
      });
      });


app.get('/GetTemplateTerreUrbano', function (req, res) {

    // Require library
    var xl = require('excel4node');

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws7 = wb.addWorksheet('Terrestre_Urbano_Dia');
    var ws8 = wb.addWorksheet('Terrestre_Urbano_Viaje');
    var ws9 = wb.addWorksheet('Terrestre_Urbano_Tonelada');

    // Create a reusable style
    var style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12
        },

        numberFormat: '#,##0.00; (#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
    ///////////////Terrestre Urbano///////////////////////////////
      MyMongo.Find('TerresUrbano', {}, function (result) {
          var TerrestUrbano= result;
        ws7.cell(1, 1).string('Origen').style(style);
        ws7.cell(1, 2).string('Destino').style(style);
        ws7.cell(1, 3).string('Turbo (150Cajas)').style(style);
        ws7.cell(1, 4).string('Turbo Especial (200Cajas)').style(style);
        ws7.cell(1, 5).string('Sencillo (240Cajas)').style(style);
        ws7.cell(1, 6).string('Sencillo Especial (300Cajas)').style(style);
        ws7.cell(1, 7).string('Minimula').style(style);
        ws7.cell(1, 8).string('Gran Danes').style(style);

        var col = 0
        TerrestUrbano.forEach(function(terresturbano){
        col = col + 1;
        ws7.cell(col + 1, 1).string(terresturbano.PaisOrigen).style(style);
        ws7.cell(col + 1, 2).string(terresturbano.PuertoDestino).style(style);
        });

  ///////////////Terrestre Urbano Viaje///////////////////////////////
      MyMongo.Find('TerresUrbanoViaje', {}, function (result) {
          var TerrestUrbanoViaje= result;
         ws8.cell(1, 1).string('PaisOrigen').style(style);
        ws8.cell(1, 2).string('PuertoDestino').style(style);
        ws8.cell(1, 3).string('Turbo (150Cajas)').style(style);
        ws8.cell(1, 4).string('Turbo Especial (200Cajas)').style(style);
        ws8.cell(1, 5).string('Sencillo (240Cajas)').style(style);
        ws8.cell(1, 6).string('Sencillo Especial (300Cajas)').style(style);
        ws8.cell(1, 7).string('Minimula').style(style);
        ws8.cell(1, 8).string('Gran Danes').style(style);

        var col = 0
        TerrestUrbanoViaje.forEach(function(terresturbanoviaje){
        col = col + 1;
        ws8.cell(col + 1, 1).string(terresturbanoviaje.PaisOrigen).style(style);
        ws8.cell(col + 1, 2).string(terresturbanoviaje.PuertoDestino).style(style);
        });

    ///////////////Terrestre Urbano Tonelada///////////////////////////////
      MyMongo.Find('TerresUrbanoTonelada', {}, function (result) {
          var TerrestUrbanoTonelada= result;

        var col = 0
        TerrestUrbanoTonelada.forEach(function(terresturbanotonelada){
        col = col + 1;
        ws9.cell(1, 1).string('PaisOrigen').style(style);
        ws9.cell(1, 2).string('PuertoDestino').style(style);
        ws9.cell(1, 3).string('Turbo').style(style);
        ws9.cell(1, 4).string('Sencillo').style(style);
        ws9.cell(1, 5).string('Tractomula').style(style);
        ws9.cell(col + 1, 1).string(terresturbanotonelada.PaisOrigen).style(style);
        ws9.cell(col + 1, 2).string(terresturbanotonelada.PuertoDestino).style(style);
        });



    wb.write('TerrestreUrbano.xlsx', res);
        });
  });
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

        numberFormat: '#,##0.00; (#,##0.00); -',

    });


    // Busqueda Node ADoN3iVumhUgWasJoJsNbaSVd6cAHRcfcu0zK0CKQWuAAUKmjRRDQEB4SAIMcGnigfnh
   ///////////////Aereas Crguero///////////////////////////////
      MyMongo.Find('Aereas', {}, function (result) {
          var AereasC= result;
        ws8.cell(1, 1).string('Pais').style(style);
        ws8.cell(1, 2).string('Aeropuerto').style(style);
        ws8.cell(1, 3).string('Minima').style(style);
        ws8.cell(1, 4).string("45").style(style);
        ws8.cell(1, 5).string("+100").style(style);
        ws8.cell(1, 6).string("+300").style(style);
        ws8.cell(1, 7).string("+500").style(style);
        ws8.cell(1, 8).string("+1000").style(style);
        ws8.cell(1, 9).string('FS min').style(style);
        ws8.cell(1, 10).string('Fs/kg').style(style);
        ws8.cell(1, 11).string('Gastos Embarque').style(style);
        ws8.cell(1, 12).string('Observaciones').style(style);
        ws8.cell(1, 13).string('Lead Time (dias)').style(style);
        ws8.cell(1, 14).string('Naviera').style(style);
        ws8.cell(1, 15).string('Frecuencia Dia Lunes').style(style);
        ws8.cell(1, 16).string('Frecuencia Dia Martes').style(style);
        ws8.cell(1, 17).string('Frecuencia Dia Miercoles').style(style);
        ws8.cell(1, 18).string('Frecuencia Dia Jueves').style(style);
        ws8.cell(1, 19).string('Frecuencia Dia Viernes').style(style);
        ws8.cell(1, 20).string('Frecuencia Dia Sabado').style(style);
        ws8.cell(1, 21).string('Frecuencia Dia Domingo').style(style);
        /*ws8.cell(1, 22).string("+100 + Fs/kg + Gastos Embarque").style(style);
        ws8.cell(1, 23).string("+300 + Fs/kg + Gastos Embarque").style(style);
        ws8.cell(1, 24).string("+500 + Fs/kg + Gastos Embarque").style(style);
        ws8.cell(1, 25).string("+1000 + Fs/kg + Gastos Embarque").style(style);*/



        var col = 0;
        //var cel = 0;
        AereasC.forEach(function(aereasc){
        col = col + 1;
        /*cel = col +1;
        var Jcell = 'J' + cel ;
        var Ecell = 'E' + cel;
        var Kcell = 'K' + cel;
        var Fcell = 'F' + cel;
        var Gcell = 'G' + cel;
        var Hcell = 'H' + cel;*/
        ws8.cell(col + 1, 1).string(aereasc.Pais).style(style);
        ws8.cell(col + 1, 2).string(aereasc.Aeropuerto).style(style);
       /* ws8.cell(col + 1, 15).string('').style(style);
        ws8.cell(col + 1, 16).string('').style(style);
        ws8.cell(col + 1, 17).string('').style(style);
        ws8.cell(col + 1, 18).string('').style(style);
        ws8.cell(col + 1, 19).string('').style(style);
        ws8.cell(col + 1, 20).string('').style(style);
        ws8.cell(col + 1, 21).string('').style(style);
        ws8.cell(col + 1, 22).formula(Ecell+"+"+Jcell+"+"+Kcell).style(style);
        ws8.cell(col + 1, 23).formula(Fcell+"+"+Jcell+"+"+Kcell).style(style);
        ws8.cell(col + 1, 24).formula(Gcell+"+"+Jcell+"+"+Kcell).style(style);
        ws8.cell(col + 1, 25).formula(Hcell+"+"+Jcell+"+"+Kcell).style(style);*/
        });

    ///////////////Aereas Pasajero///////////////////////////////
      MyMongo.Find('AereasPasajeros', {}, function (result) {
          var AereasP= result;
        ws9.cell(1, 1).string('Pais').style(style);
        ws9.cell(1, 2).string('Aeropuerto').style(style);
        ws9.cell(1, 3).string('Minima').style(style);
        ws9.cell(1, 4).string("45").style(style);
        ws9.cell(1, 5).string("+100").style(style);
        ws9.cell(1, 6).string("+300").style(style);
        ws9.cell(1, 7).string("+500").style(style);
        ws9.cell(1, 8).string("+1000").style(style);
        ws9.cell(1, 9).string('FS min').style(style);
        ws9.cell(1, 10).string('Fs/kg').style(style);
        ws9.cell(1, 11).string('Gastos Embarque').style(style);
        ws9.cell(1, 12).string('Observaciones').style(style);
        ws9.cell(1, 13).string('Lead time (dias)').style(style);
        ws9.cell(1, 14).string('Naviera').style(style);
        ws9.cell(1, 15).string('Frecuencia Dia Lunes').style(style);
        ws9.cell(1, 16).string('Frecuencia Dia Martes').style(style);
        ws9.cell(1, 17).string('Frecuencia Dia Miercoles').style(style);
        ws9.cell(1, 18).string('Frecuencia Dia Jueves').style(style);
        ws9.cell(1, 19).string('Frecuencia Dia Viernes').style(style);
        ws9.cell(1, 20).string('Frecuencia Dia Sabado').style(style);
        ws9.cell(1, 21).string('Frecuencia Dia Domingo').style(style);
        /*ws9.cell(1, 22).string("+100 + Fs/kg").style(style);
        ws9.cell(1, 23).string("+300 + Fs/kg").style(style);
        ws9.cell(1, 24).string("+500 + Fs/kg").style(style);
        ws9.cell(1, 25).string("+1000 + Fs/kg").style(style);*/


        var col = 0;
        //var cellp = 0;
        AereasP.forEach(function(aereasp){
        col = col + 1;
       /* cellp = col + 1;
        var Jcellp = 'J' + cellp;
        var Ecellp = 'E' + cellp;
        var Kcellp = 'K' + cellp;
        var Fcellp = 'F' + cellp;
        var Gcellp = 'G' + cellp;
        var Hcellp = 'H' + cellp;*/
        ws9.cell(col + 1, 1).string(aereasp.Pais).style(style);
        ws9.cell(col + 1, 2).string(aereasp.Aeropuerto).style(style);
       /* ws9.cell(col + 1, 15).string('').style(style);
        ws9.cell(col + 1, 16).string('').style(style);
        ws9.cell(col + 1, 17).string('').style(style);
        ws9.cell(col + 1, 18).string('').style(style);
        ws9.cell(col + 1, 19).string('').style(style);
        ws9.cell(col + 1, 20).string('').style(style);
        ws9.cell(col + 1, 21).string('').style(style);
        ws9.cell(col + 1, 22).formula(Ecellp+"+"+Jcellp).style(style);
        ws9.cell(col + 1, 23).formula(Fcellp+"+"+Jcellp).style(style);
        ws9.cell(col + 1, 24).formula(Gcellp+"+"+Jcellp).style(style);
        ws9.cell(col + 1, 25).formula(Hcellp+"+"+Jcellp).style(style);*/
        });

    wb.write('Aereo.xlsx', res);
        });
       });
       });

// Fin de la generación de todos los templates de Máfer Modalidades


////////////Preguntas y Respuestas Licitacion///////////////

app.post('/GetPreguntas', function (req, res) {

     MyMongo.Find('Preguntas', { Modalidad: req.body.Modalidad }, function (result) {
        var Data = {};
        Data.Preguntas = result;
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/GetModalidadesProveedorSuma', function (req, res) {

     MyMongo.Find('ModalidadesProveedor', { Email: req.body.Email }, function (result) {
        var Data = {};
        Data.data = result;
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/SavePreguntas', function (req,res) {
     console.log("por aqui pasosavepregutasserver2");
    MyMongo.Insert('Preguntas', { Modalidad: req.body.Modalidad, Preguntas: req.body.Preguntas, Respuestas: req.body.Respuestas }, function (result) {
        if (result == 'Ok') {
            var Data = {};
            Data.Result = 'Ok';
            res.end(JSON.stringify(Data))
            return 0;
        };
    }
    );

});

app.post('/Deletepregunta', function (req, res) {

    MyMongo.Remove('Preguntas', { $and:[{ Modalidad: req.body.Modalidad }, { Preguntas: req.body.Preguntas }]}, function (result) {
        var Data = {};
        Data.Result = 'Ok';
        res.end(JSON.stringify(Data));
    }
    );

});

////////////Requisitos y Soportes///////////////

app.post('/GetRequisitos', function (req, res) {

     MyMongo.Find('Requisitos', { Modalidad: req.body.Modalidad }, function (result) {
        var Data = {};
        Data.Requisitos = result;
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/SaveRequisitos', function (req,res) {
     console.log("por aqui pasosavepregutasserver2");
    MyMongo.Insert('Requisitos', { Modalidad: req.body.Modalidad, Requisitos: req.body.Requisitos, Soportes: req.body.Soportes }, function (result) {
        if (result == 'Ok') {
            var Data = {};
            Data.Result = 'Ok';
            res.end(JSON.stringify(Data))
            return 0;
        };
    }
    );

});

app.post('/Deleterequisito', function (req, res) {

    MyMongo.Remove('Requisitos', { $and:[{ Modalidad: req.body.Modalidad }, { Requisitos: req.body.Requisitos }]}, function (result) {
        var Data = {};
        Data.Result = 'Ok';
        res.end(JSON.stringify(Data));
    }
    );

});

////////////////////////Requiitos  Preguntas  y Ayuda Cargar en Cuentas proveedor y licitacion

app.post('/GetFormularioVisto', function (req, res) {

     MyMongo.Find('FormularioVisto', { Formulario: req.body.Formulario, User: req.body.User }, function (result) {
        console.log(result.length);
        var Data = {};
        Data.Formularios = result;
        res.end(JSON.stringify(Data));
    }
    );

});

app.post('/GetAceptarRequisitocuenta', function (req, res) {

     MyMongo.Find('Requisitos', { Modalidad: req.body.Modalidad }, function (result) {
        console.log(result.length);
           if (result.length > 0){
            console.log('paso por aqui GetAceptarRequisitocuenta');
              MyMongo.Insert('FormularioVisto',{Formulario: req.body.Formulario, Visto:"X", User: req.body.User }, function (result) {
              var Data = {};
              res.end(JSON.stringify(Data))
               });
            }
       });

});

app.post('/GetAceptarAyudacarga', function (req, res) {

              MyMongo.Insert('FormularioVisto',{Formulario: req.body.Formulario, Visto:"X", User: req.body.User}, function (result) {
              var Data = {};
              res.end(JSON.stringify(Data))
               });
  });

  ///////////////////////////////Boton Finalizar Modalidad//////////////////////////////////////////////
  app.post('/GetFinalizarModalidades', function (req, res) {
     log.info('Finalizar Modalidad a Negociar');
     log.info('Finalizar Modalidade  de :' + req.body.Email + 'en' + req.body.Modalidad);


                MyMongo.Remove('LicitacionProveedor', { $and: [ { Email: req.body.Email }, { Modalidad: req.body.Modalidad } ] }, function (result) {
                MyMongo.Insert('LicitacionProveedor', { Email: req.body.Email, Bloqueado: true, Modalidad: req.body.Modalidad }, function (result) {
                    var Data = {};
                   res.end(JSON.stringify(Data))
                 });
                 });
    });

 ///////////////////////////////Boton Finalizar Modalidad//////////////////////////////////////////////
     app.post('/GetFinalizarModalidadesTodas', function (req, res) {


       MyMongo.Find('contactomodalidad', { Proveedor: req.body.Email }, function (result) {
         var Data = {};
         if (result.length == 0){
           Data.Result = 'nocontacts';
           res.end(JSON.stringify(Data));
           return 0;
         }

         else {

           log.info('Finalizar Modalidad');
           log.info('Finalizar Modalidad  de :' + req.body.Email);


        jwtClient.authorize(function (err, tokens) {

          // Busca o crea la carpeta para éste proveedor
          MyDrive.createFolder(jwtClient, req.session.user.Nit + '_' + req.session.user.RazonSocial, '1q9EtO-3di6s8LhxIl8ybpfp6_e5w7tKI', function (err, files) {
              MyDrive.createFolder(jwtClient, 'Documentos', files, function (err, files) {
                // En la carpeta del proveedor debe haber a menos un file cargado

                    drive.files.list({
                      auth: jwtClient,
                      q:"'" + files + "' in parents",
                      pageSize: 10,
                      fields: "nextPageToken, files(id, name)"
                    }, function(err, response) {
                      if (err) {
                        console.log('The API returned an error: ' + err);
                        return;
                      }
                      var files = response.files;

                      if (files.length == 0) {

                        var Data = {};
                        Data.Result = 'nofiles';
                        res.end(JSON.stringify(Data))

                      } else {

                        MyMongo.Remove('LicitacionProveedor', { Email: req.body.Email }, function (result) {
                        MyMongo.Insert('LicitacionProveedor', req.body.lockObject, function (result) {
                          var Data = {};
                          Data.Result = 'ok';
                          res.end(JSON.stringify(Data))
                         });
                         });

                      }
                    });

                // Fin de búsqueda archivos fijos en el servidor drive

              });
          });

        });

         }
       })

    });

////////////////////////////////////////Habiliar o Desahabilitar Input ///////////////////////////////
app.post('/GetEstatusproveedor', function (req, res) {

     MyMongo.Find('LicitacionProveedor', { $and: [ { Email: req.body.Email }, { Modalidad: req.body.Modalidad } ] } , function (result) {
           var Data = {};
            Data.LicitacionProveedor= result[0];
            res.end(JSON.stringify(Data));

       });

});



app.post('/deletefilebyid', function (req, res) {

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        var fileId = req.body.fileid;

        drive.files.delete({
            auth: jwtClient,
            fileId: fileId
        }, function (err, buffer) {
            // I wrap this in a promise to handle the data
            if (err) console.log('Error during download', err);
            else {


              req.session.proveedorfiles = req.session.proveedorfiles.filter(function(el){
                return el.Id != fileId
              })


              MyMongo.Remove('proveedorfiles', { User: req.session.user.User }, function (result) {
                if (req.session.proveedorfiles.length > 0){

                  MyMongo.Insert('proveedorfiles', req.session.proveedorfiles, function (result) {
                      if (result == 'Ok') {
                          var Data = {};
                          Data.Result= 'Ok';
                          res.end(JSON.stringify(Data));
                          return 0;
                      };
                  }
                  );

                }
                else{
                  var Data = {};
                  Data.Result= 'Ok';
                  res.end(JSON.stringify(Data));
                  return 0;
                }
              }
              );

            }
        });

    });

});

// Envía al navegar cualquier file por id
app.get('/downloadanybyid', function (req, res) {

    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        var fileId = req.query.fileid;

        drive.files.get({
            auth: jwtClient,
            fileId: fileId,
            alt: 'media'
        }, {
            encoding: null // make sure that we get the binary data
        }, function (err, buffer) {
            // I wrap this in a promise to handle the data
            if (err) console.log('Error during download', err);
            else {

                drive.files.get({
                    auth: jwtClient,
                    fileId: fileId,
                    alt: ''
                }, {
                    encoding: null // make sure that we get the binary data
                }, function (err, metadata) {
                    // I wrap this in a promise to handle the data
                    if (err) console.log('Error during download', err);
                    else {

                        res.setHeader('Content-disposition', 'attachment; filename=' + metadata.name);
                        res.setHeader('Content-type', metadata.mimeType);
                        res.send(buffer);
                        res.end();

                    }
                });


            }
        });

    });

});

//////////////////////////////Vista Datos Proveedor ////////////////////////////////
app.post('/GetProveedorModalidadName', function (req, res) {
    console.log(req.body.RazonSocial);

    MyMongo.Find('Usuarios', { RazonSocial: req.body.RazonSocial }, function (result) {
    var Data = {};
    Data.ProveedorEmailModalidad = result[0];
    var myUserProveedorModalidad =Data.ProveedorEmailModalidad.User;


     MyMongo.Find('LicitacionProveedor', {Email: myUserProveedorModalidad, Diligenciada: true} , function (result) {
           var Data = {};
            Data.data= result;
            res.end(JSON.stringify(Data));
       });


      })

});

app.post('/GetProveedoresModalidadesName', function (req, res) {

     MyMongo.Find('LicitacionProveedor',{Bloqueado:true}, function (result) {
           var Data = {};
            Data.data= result;
            res.end(JSON.stringify(Data));
            console.log(Data.data);
       });

});

app.post('/GetDesbloquearmodalidad', function (req, res) {
     log.info('Desbloquear Modalidad');
     log.info('Desbloquear Modalidades  de :' + req.body.Email);


      MyMongo.Remove('LicitacionProveedor', { $and: [ { Email: req.body.Email }, { Modalidad: req.body.Modalidad } ] }, function (result) {
            var Data = {};
             res.end(JSON.stringify(Data))
       });

});

// Funcionalidad para negociar modalidad de un proveedor
app.post('/GetNegociarmodalidad', function (req, res) {

    log.info('Guardando Modalidad a Negociar');
    log.info('Guardando Modalidades a Negociar de :' + req.body.Email);

  var mModalidad = req.body.Modalidad;
  var Modalidaddesbloquear= req.body.Modalidad;
  var mEmail = req.body.Email;

  if (mModalidad =='Aduanas')   { mModalidad = 'Aduana';  }
  if (mModalidad =='OTM')   { mModalidad = 'Otm';  }
  if (mModalidad =='MaritimasFcl')   { mModalidad = 'MaritimaFcl';  }
  if (mModalidad =='MaritimasLcl')   { mModalidad = 'MaritimaLcl';  }
  if (mModalidad =='TerrestreNacional')   { mModalidad = 'TerreNacional';  }
  if (mModalidad =='TerrestreUrbano')   { mModalidad = 'TerreUrbano';  }
  if (mModalidad =='Aereas')   { mModalidad = 'Aerea';  }

  MyMongo.Find('ModalidadesProveedor', { Email: mEmail }, function (result) {
    // Se aumenta la versión a la modalidad específica que se va a aumentar. OJO se asume que viene Version siempre (1 si es la primera vez)
    // por lo que hay que hacer un query para actualizar todas las anteriores y hacer los cambios para que cuando sea por primera vez coloque 1
    // en las versiones. En la lína inmediata de abajo se simulña que viene 1 eso no será así es sólo simulación
    //result[0][req.body.Modalidad].Version = 1;  // No va es EJEMPLO  Ojo lo cambias por la modalidad que viene Negociar
    var newVersion = result[0][mModalidad].Version + 1;
    var ModalidadesProveedorRes = result;
    var ModalidadesProveedorRes1 = result;
    var ModalidadesProveedorResTU = result;
    var ModalidadesProveedorResTUT = result;
    var ModalidadesProveedorResAP = result;
    var mModalidadObject =  result[0][mModalidad];

     //MyMongo.Remove('ModalidadesProveedorRespaldo', { Email: req.body.Email } , function (result) {
     //});
    delete result[0]._id;
    // Respalda la version de la modalidad anterior (Toda las modalidades del proveedor)
    MyMongo.Insert('ModalidadesProveedorRespaldo', result[0] , function (result) {

      // Se crea un objeto para insertar nuevas OTMs CON IGUALES DATOS con nueva versión
      mModalidadObject.Version = newVersion;

      /*console.log(newVersion);

      console.log(mModalidadObject);*/console.log(mModalidad);


      // Se actualiza modalidades proveedor de éste proveedor con la modalidad vacía y nueva version

      var mupdate = {};
      mupdate[mModalidad] = mModalidadObject;

      MyMongo.UpdateCriteria('ModalidadesProveedor', {Email: mEmail}, mupdate, function (result) {

      }); // Fin actualizar la modalidad actual para agregar versión aumentada y vacía


       if (mModalidad=='TerreNacional') {
        mupdate = {};
        newVersion = ModalidadesProveedorRes[0]['TerreNacionalSencillo'].Version + 1;
        mModalidadObject.Version = newVersion;
        mModalidadObject = ModalidadesProveedorRes[0]['TerreNacionalSencillo'];
        mupdate['TerreNacionalSencillo'] = mModalidadObject;
        MyMongo.UpdateCriteria('ModalidadesProveedor', {Email: mEmail}, mupdate, function (result) {
        });
    }
       if (mModalidad=='TerreNacional') {
        mupdate = {};
        newVersion = ModalidadesProveedorRes1[0]['TerreNacionalPatineta'].Version + 1;
        mModalidadObject.Version = newVersion;
        mModalidadObject = ModalidadesProveedorRes1[0]['TerreNacionalPatineta'];
        mupdate['TerreNacionalPatineta'] = mModalidadObject;
        MyMongo.UpdateCriteria('ModalidadesProveedor', {Email: mEmail}, mupdate, function (result) {
        });
       }

        if (mModalidad=='TerreUrbano') {
        mupdate = {};
        newVersion = ModalidadesProveedorResTU[0]['TerreUrbanoViaje'].Version + 1;
        mModalidadObject.Version = newVersion;
        mModalidadObject = ModalidadesProveedorResTU[0]['TerreUrbanoViaje'];
        mupdate['TerreUrbanoViaje'] = mModalidadObject;
        MyMongo.UpdateCriteria('ModalidadesProveedor', {Email: mEmail}, mupdate, function (result) {
        });
    }
    if (mModalidad=='TerreUrbano') {
        mupdate = {};
        newVersion = ModalidadesProveedorResTU[0]['TerreUrbanoTonelada'].Version + 1;
        mModalidadObject.Version = newVersion;
        mModalidadObject = ModalidadesProveedorResTU[0]['TerreUrbanoTonelada'];
        mupdate['TerreUrbanoTonelada'] = mModalidadObject;
        MyMongo.UpdateCriteria('ModalidadesProveedor', {Email: mEmail}, mupdate, function (result) {
        });
       }

        if (mModalidad=='Aerea') {
        mupdate = {};
        newVersion = ModalidadesProveedorResAP[0]['AereaPasajero'].Version + 1;
        mModalidadObject.Version = newVersion;
        mModalidadObject = ModalidadesProveedorResAP[0]['AereaPasajero'];
        mupdate['AereaPasajero'] = mModalidadObject;
        MyMongo.UpdateCriteria('ModalidadesProveedor', {Email: mEmail}, mupdate, function (result) {
        });
       }

    });

  });
console.log(req.body.Email);
console.log(req.body.Modalidad);
   MyMongo.Remove('LicitacionProveedor', { $and: [ { Email: req.body.Email }, { Modalidad: req.body.Modalidad } ] }, function (result) {
             var Data = {};
             res.end(JSON.stringify(Data))
       });
             // Fin de buscar todas las modalidad del proveedor que se pasó a la función
});

//////////////////////////////////////////////////// Modulo Seleccionar Proveedores //////////////////////////
app.post('/GetSeleccionarProveedor', function (req, res) {

    // Buscas todos los proveedores. Ésto es para poner el name en consolidados
  MyMongo.Find('Usuarios', {} , function (result) {
    var ProveedoreesTodosSeleccionado = result;

 MyMongo.Find('LicitacionProveedor', { $and: [{ Modalidad: req.body.Modalidad } ,{Bloqueado:true},{Cerrado:true}, {Diligenciada:true}]}, function (result) {
           var Data = {};
            Data.SeleccionarProveedor= result;

        // Recorre todos los proveedores que quedaron para cambiar el Email por razón RazonSocial
        Data.SeleccionarProveedor.forEach(function(ProveedorModalidadSeleccionado){
          var ProveedorData = ProveedoreesTodosSeleccionado.filter(function(ProveedorFiltradoSeleccionado){
           return ProveedorFiltradoSeleccionado.User ==  ProveedorModalidadSeleccionado.Email;
          })
          ProveedorModalidadSeleccionado.RazonSocial = ProveedorData[0].RazonSocial;
        });
        // Fin Recorre todos los proveedores que quedaron para cambiar el Email por razón RazonSocial


            res.end(JSON.stringify(Data));
});
     });

});

app.post('/GetProveedorSeleccionado', function (req, res) {

 MyMongo.Find('LicitacionProveedor', { $and: [ { Email: req.body.Email }, { Modalidad: req.body.Modalidad } , {Bloqueado:true} , {Seleccionado:true}] } , function (result) {
         if (result.length == 0){

            // MyMongo.Insert('ProveedorSeleccionado', { Email: req.body.Email, Modalidad: req.body.Modalidad }, function (result) {
             MyMongo.UpdateCriteria('LicitacionProveedor', {Email: req.body.Email, Modalidad: req.body.Modalidad,Bloqueado:true},{Seleccionado:true}, function (result) {
             var Data = {};
             res.end(JSON.stringify(Data))
             });
         }
         else
         {
           MyMongo.UpdateCriteria('LicitacionProveedor', {Email: req.body.Email, Modalidad: req.body.Modalidad, Bloqueado:true},{Seleccionado:false}, function (result) {
            var Data = {};
             res.end(JSON.stringify(Data))

             });
         }

     });

});

///////////////////////////////////////////////////////////////////////////

app.get('/downloadanybyname', function (req, res) {

  var filename = req.query.filename;
  var FileId = '';

  jwtClient.authorize(function (err, tokens) {

      drive.files.list({
        auth: jwtClient,
        q:"name contains '" + filename + "' and '0BykPGdMUS9o9dFI5aTFXLXhVWnc' in parents",
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var files = response.files;

        if (files.length == 0) {
          console.log('No files found aqui.');

          res.status(404)        // HTTP status 404: NotFound
          .send('No se encontró el archivo que busca. Puede que no haya sido cargado.');
          res.end();

        } else {
          console.log('Files:');

          FileId = files[0].id;

          drive.files.get({
              auth: jwtClient,
              fileId: FileId,
              alt: 'media'
          }, {
              encoding: null // make sure that we get the binary data
          }, function (err, buffer) {
              // I wrap this in a promise to handle the data
              if (err) console.log('Error during download', err);
              else {

                  drive.files.get({
                      auth: jwtClient,
                      fileId: FileId,
                      alt: ''
                  }, {
                      encoding: null // make sure that we get the binary data
                  }, function (err, metadata) {
                      // I wrap this in a promise to handle the data
                      if (err) console.log('Error during download', err);
                      else {

                           console.log(metadata);

                          res.setHeader('Content-disposition', 'attachment; filename=' + metadata.name);
                          res.setHeader('Content-type', metadata.mimeType);
                          res.send(buffer);

                          res.end();

                      }
                  });


              }
          });

        }
      });

  });

});

var server = app.listen(9099);

server.timeout = 600000;

function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}

function Execute() {

    var mail = new Buffer(
        "From: julio.briceno@gmail.com\n" +
        "To: juliob@ptree.com.mx\n" +
        "Subject: Subject Text\n\n" +

        "Message text"
    ).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');


    jwtClient.authorize(function (err, tokens) {
        if (err) {
            return console.log(err);
        }

        var google = require('googleapis');
        var gmail = google.gmail('v1');

        gmail.users.messages.send({
            auth: jwtClient,
            userId: 'me',
            resource: {
                raw: mail
            }
        }, function (err, response) {
            console.log(err || response);
        });

    });

}

function Connect() {
    var rpc = require('node-json-rpc');
    var options = {
        // int port of rpc server, default 5080 for http or 5433 for https
        port: 80,
        // string domain name or ip of rpc server, default '127.0.0.1'
        host: 'inexserp.cloudapp.net',
        // string with default path, default '/'
        path: '/webservice/cargaExcel?session_id=a03da3273798428261144cdcbb00dc364b09b4ac',
        // boolean false to turn rpc checks off, default true
        strict: true
    };
    params_auth = {
        'cliente_id': 22,
        'b64file': 'UEsDBBQABgAIAAAAIQARfDixowEAAFIJAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCi BAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAADMlstOwzAQRfdI/EPkLWpc3gg1ZcFjhQCJ8gHGnjZWHdvyuND+PRP3oQqV VlUjkU0sx557j0fxTHp308pkXxBQO1uw07zLMrDSKW1HBfsYPHVuWIZRWCWMs1CwGSC7 6x8f9QYzD5hRtMWClTH6W85RllAJzJ0HSytDFyoRaRpG3As5FiPgZ93uFZfORrCxE2sN 1u89wFBMTMwep/R6ThLAIMvu5xtrr4IJ742WIhIp/7Lql0tn4ZBTZNqDpfZ4QhiMb3So V/42WMS9UmqCVpC9iRBfREUYfGr4twvjT+fG+XaRDZRuONQSlJOTijKQow8gFJYAsTJ5 GvNKaLvk3uKfNiNPw2nDIPX5kvCeHGct4ThvCcdFSzguW8Jx1RKO63/iACpwwQrzrO0Y +fqs6Ru8rr3jEkcq2sDT83CKJLPDEOPMADZdO5PoLudSBFDvMVB7axxgXXsHhxRG3pdU 5xtOwkp3mz81n7fgPFIbDrA/wLLP1tEdT0IQooZVp93UsVaO1MIPPnH9ZVsFal9vOcHo qoPt5zIbzHn6I+r/AAAA//8DAFBLAwQUAAYACAAAACEAE16+ZQIBAADfAgAACwAIAl9y ZWxzLy5yZWxzIKIEAiigAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAKySTUsDMRCG74L/Icy9O9sqItJsL0XoTWT9ATGZ/WA3 mZCkuv33RkF0obYeepyvd555mfVmsqN4oxB7dhKWRQmCnGbTu1bCS/24uAcRk3JGjexI woEibKrrq/UzjSrlodj1Poqs4qKELiX/gBh1R1bFgj25XGk4WJVyGFr0Sg+qJVyV5R2G 3xpQzTTFzkgIO3MDoj74vPm8NjdNr2nLem/JpSMrkKZEzpBZ+JDZQurzNaJWoaUkwbB+ yumIyvsiYwMeJ1r9n+jva9FSUkYlhZoDneb57DgFtLykRXMTf9yZRnznMLwyD6dYbi/J ovcxsT1jzlfPNxLO3rL6AAAA//8DAFBLAwQUAAYACAAAACEA2fVtDEgBAAAqBwAAGgAI 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 y1jmEstrlgXPksqlkmUsc4nl1bvkWTJZyTJWRqyEy5JniXtZh1ayjGUusWztzLNkspal zGVMuCydLKmsZSlzGRMuSydLW4bHYuUBQeYytsGLAidLKmtZylzGNnhR4GRJZS1LmcvY Bi8KnCyprGSZyFxi+dJPooBnyWTtuUnmMrG5jALnyYnIoZJlInOJ5bXdIc+SyUqWicwl li1vniWTlSwT5WHS5jJyhlW4l3VoLUuZy8QGLwqdLKmsZSlzmRDwQidLIkdaljKXiQ2e dX1eRrFEjSJl9J3IWGJ5PZ8RH30zWRl9JzKWWLa8+eibycroO5WxxLLlvfaD5ZwwWRki pzKWWLa8+TCWycoQOZWxxPLqHfMnKSYrWaYylli2vHmWTFayTGUssWx58yyZrGWpTPMQ 7mInSyprWcpYpoS72MmSylqWMpYpuR9aU1vPfZDKWpYylynhMnGypLKWpcxlSrhMnCyp rGSZyVxiee0nCc+SyUqWmcwlli1vniWTlSwzmUssr97WTNeSJZOVLDOZSyxb3jxLJitZ ZjKXWLa8eZZM1rKUucwIeKmTJZW1LGUuMwJe6mRJZS1LmcuMgOfMVjFZy1LmMiPgObNV TNaylLnMCHjObBWTlSxzmUssr/3Emo5a+jeTlSxzmUssW948SyYrWeYyl1heva05o+d2 U1nJEt9wCdMnWP4/byorQ+Rc5hLLljcfIjNZe8cgc4lvvixv5y0DlZUhci5ziWXLmw+R mawMkXOZSyxb3nyITGVtSimXucTy6u1MKTFZy1LmMidcOlNKTFayLGQusWy1m2fJZO2V kcxlQbh0ppSYrGRZyFxi2Wo3z5LK2pRSIXOJ5dXbmVJispJlIXOJZcubc8lkLUuZy4KA VzpZUlnLUuayIFw6U0pM1rKUuSwIl86UEpFjbUqpkLnE8uV8x86UEpO1LGUuC5vL2JlS YrKSZSlziWWr3TxLJitZljKXWLa8+TWWyUqWsL5Duqdh2fJ23ucS2ZlSWtZoLKsf+uq+ +aMa7tvz6J1gtQgs99hARxmWdRbzZ1hHMlehY9+ZaTLdy7cjrM1pYJVEsEnDsAjSl39J Cd34YMykibAOA4/7uZkeeq+v+mb43H6HRSkY0rI8BT4d2mGcPsFmHx+6u9nJ98zQwhqe eenOzu/NMA1VO/new9h8GtozHO92WUUCqzjA4Qibfzew/em2b+cKLFuaWjjCy/fa9G0z b4xLQy4LlG5+AAAA//8DAFBLAwQUAAYACAAAACEAzRlqlVsCAACQBAAAGAAAAHhsL3dv cmtzaGVldHMvc2hlZXQyLnhtbIyUS2/bMAyA7wP2HwTd69fiNAniFG2DYj1sKNY9zopM x0IlU5OUpO2vH2XXWdBuQH2wRVL8SJGUlxePRrM9OK+wq3ieZJxBJ7FW3bbiP77fnM04 80F0tdDYQcWfwPOL1ccPywO6B98CBEaEzle8DcEu0tTLFozwCVroyNKgMyKQ6Laptw5E 3TsZnRZZNk2NUB0fCAv3HgY2jZKwRrkz0IUB4kCLQPn7Vlk/0ox8D84I97CzZxKNJcRG aRWeeihnRi5utx06sdF07sd8IuTI7oU3eKOkQ49NSAiXDom+PfM8nadEWi1rRSeIZWcO mopf5ourgqerZV+fnwoO/mTNnhHNvRQxlTynJh3lr7HA+kUbm7JBfIjut3XFM4rjQYOM 5WGCPnu4Bk3br/PY2N996LimwOkx8ul6zOKmb+SdYxvh4Rr1L1WHlsJSLjU0YqfDX+U8 ybP5p/PyaPqGh8+gtm0gh0kyidEkakLTmxkVJ48KLh4jryC3wwhPynIynREp5je49Fmu RRCrpcMDo6khX29FnMF8UdCJZVRekpbCeZL3q7JYpvtIeDFenRrz4vxoTQl55Bb/5JL2 yJ2Wr7inxryYveIOFR5yt2ILX4Tbqs4zDQ0hs+ScMzdUqV8HtL2WCrLBENCMUkvXCOiM WVLm+Swrx2cyn3LWIIb/GamKMe49hJ1lVlhw9+qZRoqa6IfholWjnA93tO3rzmx6Emfo FF23/pZV3KILTqjA2c7DnVMdxVsPM0A9IEJL25+R9uu1Vb2G/jBBUYRRlmgV9JtjY4// ktUfAAAA//8DAFBLAwQUAAYACAAAACEAHE+EfZICAABrBQAAGAAAAHhsL3dvcmtzaGVl dHMvc2hlZXQzLnhtbIyUS0/jMBCA7yvtf7B8J4nTtJCqKQIqtBwWoWUfZzdxGos447Xd Fvj1jB0SutCV6KHxPPLNM16cP6qW7ISxErqCsiihRHQlVLLbFPTXz+uTM0qs413FW+hE QZ+EpefLr18WezAPthHCESR0tqCNc3oex7ZshOI2Ai06tNRgFHcomk1stRG8Ci+pNk6T ZBYrLjvaE+bmMwyoa1mKFZRbJTrXQ4xoucP8bSO1HWiq/AxOcfOw1SclKI2ItWylewpQ SlQ5v9l0YPi6xbofWcbLgR2ED3glSwMWahchLu4T/VhzHucxkpaLSmIFvu3EiLqgF2x+ mdF4uQj9+S3F3h6cyTOAui+5T4UxHNIo3/oGt69aP5Q1wIN//aYqaIJxrGhF6dtDOD52 4kq06H7F/GD/htD+jIHjMfLhecjiOgzyzpA1t+IK2j+ycg2GxVwqUfNt696UecSSfHI6 HU0/YP9NyE3j8IUsCmWW0CIa/4mSfvOw4fwxPPev5DTKMpYls3Tqsxs908EzQQMZnJNo Os1mZxjTV9LDQz0r7vhyYWBPcL8witXcbyubp9ib0isvUIuJWZR3y+lkEe884dV4eWhk aT5aY0SOXMzpCBe1I/c0e8c9NLJJcpw7OcpF7cjN2TvuoZFN3qz/5Jsd5aJ25LLkLaXQ JVzOA+skfZdwvzx9szXfiO/cbGRnSStqZCbRKSWmX4BwdqCDFie4BudADVKDN4TAoeA8 GTtLpsMvy2eU1ADuf0Ycu497L9xWE821MPfyGb8W3E/bfzd4qqWx7g7dbrdqHUiUgJF4 k4QLpKAajDNcOkq2VtwZ2WG8Vb/euDRIaND9GdC/XWkZNHh5OokRBrkELUVw9ps4XpPL FwAAAP//AwBQSwMEFAAGAAgAAAAhAPAC8QeNEQAAWVoAABgAAAB4bC93b3Jrc2hlZXRz L3NoZWV0MS54bWzMnHtv4kgSwP8/6b4DiyLtnpQJfj9QkpV5JCEhkIVMhuV0GhHiTKwB zIHzmD3dd79qtw1d1Y0DyiHNrjQ47upHVXXXz91u9/Hvb9NJ6SVcLKN4dlLWj7RyKZyN 44do9u2k/Pn27JNXLi2T0exhNIln4Un5R7gs/376978dv8aL78unMExKUMJseVJ+SpJ5 tVJZjp/C6Wh5FM/DGaQ8xovpKIE/F98qy/kiHD2kmaaTiqFpTmU6imZlXkJ1sU0Z8eNj NA4b8fh5Gs4SXsginIwSaP/yKZov89Km422Km44W35/nn8bxdA5F3EeTKPmRFlouTcfV 1rdZvBjdT0DvN90ajfOy0z+k4qfReBEv48fkCIqr8IbKOvsVvwIlnR4/RKABM3tpET6e lAO9GvR1rVw5PU4tdBeFr0vhupSM7vvhJBwn4QM4qlxK4nk7fEzq4WQCuZtw5684nvbH I9ZcHUpa/91hTgCp9C5z3H0cf2cVtKAoDdqyTAtmbRmNk+glzArtGOD8f/PmwTU0rbJq m3idt/MsdfbNonQ/Wob1ePIlekieoFpoy0P4OHqeJOub/pGu+aZrr5J68etFGH17SiCD dWSx2sbxBIqGf0vTiPVOcMro7aTslEuveclHtm05HhTDxbmgmwnCbyZomSvB0lP08BDy 4sbPyySe5s1EZUC/TyuD3+LK/EyQaSlLwuD5kToEFa7nqrCL4uJ18EHaEHaxdflmngku 3infykXhIreWfmSahmbqBrhnO3PpIMmbCRd5jf6R5zmuTt2jgwO57NqTlrN7lbmb9bWf 9U1V5u7UwV3FBjHAj2nr2EUmClfbmcHIHcsu8nrMVVdXdgYj9zC7yPPYgjnUuXIXG2u/ 6ZpyODAvco3Wvtleo9xZxrvDzsgdwi52tlzuIVM5jsThbeZGNgWD+WiAmbl12MWqOzKU KUajmQ8B810VzVxFdrHtaDRXqr0bTMw8mrCLXU1o5T2XXRR3cis3IbvYuZ68w1rvdj0r 73rsIqvH0NZhoXQfLpOziMX8cqkgGlurkKGx3qxUrsJxkRKqMUpGp8eL+LUETxVQ9HI+ Ys8oehXaAURhdwN2+6QMLoHal3D35VQ7rrwA18aZRE2W0LFEXZYwsERDljCxBCM3aYeF Jc5kCRtLnMsSDpa4kCVcLNHiEtDvVvbwsMSlLOFjiSuFxYhR23IhOrHqtaIUYtaOQoTY tasQIYa9UYgQy/6hECGm7SlEiG37ChFi3FuFCLHuZ9l0BrHunUKEWPeLXJFBrDtQiBDr /qkQIdYdKkSIdQPFIDSIeQPFMDSIfQPVQCQGDhRD0SAWTh+jyWA0iYkDxXA0iY2DbECK g8kkRg4UQ9IkVg6yQSkGKZOYOciGJZKhds4GJmoPtXM2MgFsqwBgUjtnQxPJUDtnYxPJ UDtng1OUsaids9GJZKids+GJZKids/GJZKidswGKZNZ2rgBIVjRhcyIFTYyUILqvkSbW QH5lT4v4pY4SiUMaWWKygKIfT/+p/+vs9uaXBrjkkcHq/HPQawSNLqGJMlMzz3TX7AUE Lkyfk7LYEFMn5jnnMvAoxTTJ2nPX7navPt/8dmYcNmGF4CFe/nIQHOjVg9qBaRwah9o/ soZOdG32dfr2FYSScHm0CJdfx/HzLFn84LdY2v2Y4AoZhvSwFm+Onlrc9EgfvUJZScdr i1kNw9ZIp7vewhpsVqyww/U+7NBFyhguscRNkWO6xmE9en4YPYTgmdqBUT2oHxiW7al8 M46SSOkbSPjBHKQZXzWNdIs/eO1W6gfLcG0y8no8nT1xvZxahuWQodEXlbNJ4q3ayn3j sDaCBap1Z/OVne1+NPu+PNJc0qTPov9d3zV8z7V8InSH+pdhm7YJ/xhk7H7B2jvUNwOk HaniT7V2A+PwPJyFi3g1lJBysIgT4nEyRJXQqBYUdY+hcfgrH7ilevQSTX5d1WmJPWQJ K4G01gCCGvOpDmt4NGqjkGZTVuUxLc1uU0o1cYegXSI4w+kWJVgWp3hgsDTddQzTcahV LlAptIxLlEr5x4ILm0fw0AMLJJbvarZEUi6FSqKUzCKNOqYGbePwNprHnRgWvkYrxzii Y/7APSHIw1IWFaltWSSBlm+oryPVlwZyHXW/O1IjRB/WC6h9ISwoJlMBRAPVbQgC+DaC LTRXBVszhy0ZVrVMvTTZIV2zjhJJuGlgw+SwBa8x2LIV6io0ZAxLq7CIvQwXL2H59KLZ 6wSdRnNYIgxWltXMyjq9Dnq3rU5zSDjMVH2Pw1xmA4fNfXAY2YxYu8WbwweDTePjFcpK OklbzOpCDKYc3sIaHbUdrvdhh66oDKCOcrjIMV1z3xzmtW/mME9fc5j4sS8qJ3FYbeW+ +TEOi/63TNO2ALJ4QNyJIiY8uKQQZj9Y7ouoveHrJol8A6Qd5bBau4G5K4dRJRKHi7rH 0PwAh7NACBiWOCy2yKGEysMdD5SUck3cIWQO43SL5j9H3tU1w/U13/XpJPACNZEC8hKl 0rwsuqxAbFnwdGkbnk3LyMJMMYiLnBO0zd1BLDbc9CQQF9bXkerbBsS8G0gg5rdpz+ip b0MUKAAxrPSqQMxjDsx6Sd01kF/Nel3SgkaWSCa24OIC1ga9LsWssphmVsxpo1kCONPZ LtPjPcpyGXVkOLP2QVlkLfJk0uLN4ZSlU6jLPFGwNglxV6hwymGxcEO3LDKCrrewVwf7 IV8XuN6HpbqiMgoOF7mua+2bw7z2zRzm6WsOE2f0ReUkDqut3Lc+xmHR/zZwmDAYJzMI W9I8WNQaFgHonG+AtKL8VWs1sHblL+rkdNYZFHWLobUVf2GnyCIKH8gUCOIcC5qugr+o RRQCeQjkuSmdm7gjyPzF6XTQBufIbY5vu7ZmW560AI2aSCHOQssqhNvSRFiswnFsXbMM R6eGb3OpYv4WOSdoW7vzV2y4gr+F9XWk+rbhL+8FEn/5bYm/6tsw+gv4Cy89VfzlsQT4 SyxfA/k1f0lQr6NE8mTVyBIJnHXQIl12bndv6NS1qczSXGUJetfNTqNFUcxUeg/FXGYD iu19oFi0jUdc1+LN4SjWNbqydIXyEoy3xbyMtMTu11uYo4MNvSLtPgzRFZVRkLbIM117 36TltW8mLU9fk5YMj76onERatZX79sdIK/ofJrvsfwJbJMFZS6a6otqmZukEHAOkFkWt Wq2BvStqUSXSVLeoXwztD0x1uTMdBWnFBnm0QXk8S4OrRwGVhy6+Hq3LpMUdhQ7a4Fz0 maFrnmdCIZpEWtRE+jBwiVLpwwCLKquZbkpa3XDolCrIwksxaYt8AyXsTlqx4QrSFtbX kerbhrS8F0ik5bcl0qpvw+gvIC3sNFKR1smXnIn3aiC/3jBDHpMaWSKFKbAhhWk96PVa 7TZ9h6vM1WTbZNJcnKdBr0WXkFnT3yMql9lAVGcfREUGoq9yeXOyJWSLMPNSTCU+v0LF 0te8YkaArfSadwtLdbAXVrDdh426ojIK2BY5revsG7a89s2w5elr2JIR0heVk2CrtnLf +RhsUbcyHdtxHTI077CIRVeVRaUBtRrpuAOkFEWtWqmBsytqxUp8uvclKOoVQ2cr1MJG yvg1XNBZLQ92lrQ9IqijFlHM5eEuDZU+DdJN3A9k1pJ0Gs3PRY8Ba00Pln3hMYo0/gI1 UdoshVKlbVJiFSlrHUOnewiCNpcqZm2Rc6CE3VkrNlzB2sL6OlJ927CW9wKJtfy2xFr1 bRj8BayF/VYq1ro5a8mzUE3cn+WTxDpKpCDOEimIoQdns9ph908yQW0q8zT1PE+/e9uk 6D5jGr2HYC6zAcHuPhCMTEMRzJvDEexKC8xiKolAV6hYimAxI5vv0je8W1iqgz2wQvA+ bNRFe//kN7xFTuu6+0Ywr30zgnn6GsFkbPRF5SQEq63cdz+GYNH/puVYNtuMQ2a8ogy8 AiazXVFp03YdimCkFEWwWqmBuyuCxUp06S1rUNQthu5WDH6IXuLFWF5a5lFQBWHcJvpc 0MDJFNJ5WNs45cV9xZYwjByrO77rmgb1TXCBG0EhcomTKaVZZMFzXh82pdJC2lyqmMNF Dgra7u4cFluu4HBhfR2pvm04zDuCxGF+W+Kw+jZEgAIOs498FXuavZzDhKY1ca+5rpGn qEaWSlkLCvBJ70VwJy0hK/M02UbkbLPzbavZ60mbpljD38Mtl9mAW28fuMXmIUGvxduT TXnpJrUrnJcYvi3mBaiyJXbxi6XrLezRwaZeQXUfluiK2ijmtUWu6Xr7hiqvfTNUefoa qvSjHlE5CapqK/e9j0FV9D9MfgCpdDvUHepeqz1T9MuDL6LyhqXR2eUAKUfhqlZu4O0K V7ESV3prW9Q7ht5H3trywKZCq9gi+ECdzC3z0MbjIh19QRP3CHmGS9IltIq+M3QPFi4M y9OlGS5qJP16LrgUkz1pOVmsg01xDc2y2JxGjCNBFmiK0VrkHyhhd7SKDVegtbC+jlTf NmjlHUFCK78toVV9u09vox3M8MmVCq1+jlbyUFsTP9HSqV8aWSpFKwydzVun0je2dO+U sqAme4Gf8vYuaDc7w8/NNn1py9R5D7hcZgNw/X0AFxuNuLPF25MBly4xi4l05xQulsSn NsqpW3RP8PUWpupgN6xYvA8jdUVtFCwu8lrX3zeLee2bWczT1ywmw6YvKiexWG3lvv8x Fov+T/cnS1uT75AI27rMNlClP2SqK6pvGgZd2xog9SiN1eoN/F1pLFYi07iofwz9j9CY x0IVjcUW6fRtd5BHw4zG0i5m3CdkGpN0icai92C92fJcQ7M9Ot2+wI2UtjGjZLpPJ7gS KwEce7aum3RSEGSxphjHRQ6CEnbHsdhyBY4L6+tI9W2DY94TJBzz2xKO1bchFBTMdNkp PcrDINgxSPBFG2xUx0OzxnKsXvDqOt0ulSdTJMND245IVpfUZI9/65fFw26fIjlV6T0m Z0IboKxr+6Aythw9qqCVNQlOCVib16B4VgpRTpOKSP9pr8pgHoZZs09nzdtYsEPcs2L1 XmzXRSopaF3oT8i9b15n9W8GdiawJjYZOOysM2F/KfH77QZrQ66PQRv1hZTEBicyWZlG cpzulgXrnHSNGtnB1DS6XDrAalJ0b1ATcu0KbzwG5IXqwg4zhPq2+Rh401I1FJ5+4614 YYzbZUgfBJN06ZNg0k1kilMBCePIlfDBruf68LmQRifGF6Ql0ofBxMLSmjWqh82sgeM6 fakR5NGomOWF3mJl7E5z1HwFzourhPBHq9wG6FnHkIie3ZeQvuE+CxYqqPPjCPlhTw9w 5NPdaBLBLzsLspSeMcE/1cZJpeTHHL7jnUTLpFwaTSbxa20CpwXwc6Ke4tfWbP6cXIfL 5egbO0kRnhfgZnOxiBfoJj8XsWtUWayGAzrg7MPnyUg/bcFW516zfvtbx2AnYOS3jyu4 FXDOFGnx6fEcarweLb5F0PwJnO0IhzMewfuEBT8VMb2GUx/Tu7C17j5O4PDC/K8nOFoz hGOt4Ag4Xfc0O//P8mFnwGMcJ5sS4WQ1Vm8/TJ7npfloHi760V+gOHtQ4odJwtVjtFgm NyDWeZ7epyWVSzF8DzGDMz3Sk0Pn8SJZjCKw6PMyvFlEM6ivwc98hPUCdtociP8Vg/yk MY/SO3DqaBJBDfnf43gOZ1CwJGhS+Ja0l0n6W3peQIb/1OtNJ7Bt95Pv1uqfrHvP/xQ0 as6nhl/3zXoQ1MzG2X+FEzo/cD5neirp6TEc81nd0KvApumxp9U3cAA5+VR5Dmj4Ng7F M09Vpf9fOiYveN3t3qbVx1N8QEsAB7QcV9IE+AElkXR64OfpmVE907XStVG9ZsucIMzv 8wy0K8uW2p8u0rkIwQGE6mJt4DyFKouaP7MiEE7h+Jx3HQPnPFQDiMY/lSroSJbggB2o UuyQvlGFmP5T6YAOXgkO3lVhYFThMe2nUkH5CBccwJNKsTeGXNmiEZ7GCQlYFQjTALI8 WFdWh0Kf/k8AAAAA//8DAFBLAwQUAAYACAAAACEAwPS021oDAAC+CgAADQAAAHhsL3N0 eWxlcy54bWysVl1vmzAUfZ+0/4D8ToEUsiQCpiUpUqWumtRO2qsDJrHmD2Q7Vdi0/75r QxL6na7LS+yLfe7xPfdeO/2848y7I0pTKTIUnYXII6KUFRXrDH2/LfwJ8rTBosJMCpKh lmj0Of/4IdWmZeRmQ4jxAELoDG2MaWZBoMsN4VifyYYI+FJLxbGBqVoHulEEV9pu4iwY heE44JgK1CHMeHkKCMfq57bxS8kbbOiKMmpah4U8Xs4u10IqvGJAdRfFuNxju8kjeE5L JbWszRnABbKuaUkes5wG0wCQ8lRsecGN9kq5FQaidTB53ZfLCozjGHndoReyAhpVFXAe tC0K8jToEfK0luIIFAOQNeSp/uXdYQYokV1eSiaVp9arDBVF6H7WLDAn3bIFZnSlqDXW mFPWduaR27zBSoM6HZ7z3vn4756CJ3HDk07wVQqpG1ySkwgaSC0IqYN+ZxQcaQ1xo4wd FHVCgCFPIbcMUaKAidePb9sGfAsog46rW2e3v7B6rXAbjZLTN2jJaGXTYb0Yil8UC5Df wqz6D1RUZEcg4SDfbGYNCMOso/UKuYe++ug6vLe4cd4glCupKugkw/LoTHnKSG2ApaLr jf03srFHkcZA2eVpRfFaCszsOfY7+gHAloSxG9ttftT3sHf1oOygb9kstBVoh6BKP+zw uonFH6J12EPYEEL/dlxvVx8c3NsdT0+hddju4aZh7fWWr4gqXN+0TQZYv4NSh1lAbF7B ip4N2wN+z2FFrvG9psEbD9u30/+MOsiW0XuP/XTmAeww8x6GEPLzFTnOj7xg+BJWL20v 9DPIw0w8GfphJt7PpUcOXW1BNQ1K9l7BHkrPs707Q9c2xRnc0H31eKstZYaKJ4oVMKvd sfxdJzT2mneN4eAFtKhIjbfM3B4+Zug4/koquuWgTb/qG72TxkFk6Di+sl0qGtvCIztz peFehn9vq2iGfl/MP02XF8XIn4TziR+fk8SfJvOln8SL+XJZTMNRuPgzeHW8483h3kZQ /FE80wxeJqo/bE/+5mjL0GDS0XeXAtAecp+OxuGXJAr94jyM/HiMJ/5kfJ74RRKNluN4 fpEUyYB78m/cozCIou5hZ8knM0M5YVTstdorNLSCSDB94RDBXong+PDM/wIAAP//AwBQ SwMEFAAGAAgAAAAhAJk3UGL6eAAAPZoDABQAAAB4bC9zaGFyZWRTdHJpbmdzLnhtbKx9 y3IbWZLlfszmH8K0aJtZtBLgS1J3VnYFQJAEBT4KANmV2qQFgRAZVCACFUCwSOzqU7TU IhdluUvrHX6sjztIKgvuJMA4NOvpsU4Kfm/c69efx91//K/bURrcxMUkybM/vam/rb0J 4myQD5Ps8k9vzvp7//7+TTCZRtkwSvMs/tObu3jy5r9++r//58fJZBrgt9nkT2+uptPx f/zww2RwFY+iydt8HGf4y+e8GEVT/J/F5Q+TcRFHw8lVHE9H6Q8btdrOD6Moyd4Eg7zM pn968+799vaboMySv5Vxc/GftuvbG29++nGS/PTj9Kfj/Mcfpj/9+IP8X4v/cloko7gI jvPRRREv/7EXX5bZMH/ir+E4TtMEfz6NpnGRGdKPfz/y/97KpskwGgad6CIvonR58aU/ B+3d5X/RjNLU7Pk4fxu0brGhJC+WfyB/a2f+35o5LiaJzBrz34bJJb4xx+3ZPeI/Ds2H t/S/ehtOSnywWUL/q/PP9+LBVYQNJ4MkD5p5Ni2iqVls8Y+GcRDiOC/n/xM7KzQisOLy svofvU2WcTa155BGF+asm+VonMbR/J/5ZJn6fpzFhVlz8V+dRe+PrJncJE8ccqB/c37a i9IIl728ge5e0xz0Wfd0+b/txuOomEYjfLN9G2U8sf/1eP47XkweyOOQ/y8fJA5j4Fma D9mNJwM53Bx3+jnPoptkurydTnkZFQFu8zgaJKPE21UzTkt88fIv+8k41x/Ofxslmbm/ pT8756j/Ak9qUKbmJP74N+en570jI1fyYiB8dB0HvfCZPzajMb50iv83/y175t+FExxH isdmOK0ZdjsnPSM9jrvtv5y1rMgYjfGqDCefdtvn4W4YtHudMGiedE+Ow90Ts51O+HPY C3ZbQb99eBYem+9qllE5Tabp/GsWtGcDiKfEvLrw+KTbN/s68OVvnkJY5f8v+v/meZ2d N9/t1Ou1raf/Ut862KrVlv8+iIovyZf47budP19GONK3g3y0/G8Ow0671zTf/5cyyXCp lttPHy97mVJ4tn/W6xtKR+HxWatjLifsdFpBuH8W9prYQeu43zL32m2dnjU67aY9+6sE rGS446i8js1bOWgdhe8+1Gu1dxv775Z38f2PB73Tbne/9mH5X4yirIzTXybpeBTf/vkq n8pj986x1zHyJjze7dqvemC//VY3PG5bbm4sbwFcehA2cUS79iCiCZ5J4DDNATj83XZt p/ah0X5vPjsM7/94cNjsHh/XNpb/BYyXIp78chUV+Yfnvhof02u2O/bVt7r2P/bxjI7s N5x02sf61DpB86x5cGb/SUN+2PqrOZiT8PT9Zm2rXmv8xfB+5/GPR40m7rZWX/75uEgm A8iZtymsr9n7zT9fPnW3/VYz7LeChtEyvbADUXLSNU/hPIDQ6LY+Lf9hrxs2m0H35KjV NQ/loGcXOIe94MmEZhj23m/Vtmob22fm8r7/8eD8U7fbsdc7grFxA84pnrvbczBos3tm vuGk2Q/P22b7Lfn3XStJm4cnx8FRuOt88eI0Wp2g29o727ckd5MbSJvEMbugBU4+vKtv 1LaOjzYtXzz88aDX+dRvWsGYD6bQyLACZ9FdtPn+6ZvvgTXBSeZ+u/0zc4Fi2v/HBCoO Jj9s90lc3MRvfoJ067S+H0GwTOq0e3Jwsh8aFgLP91p7bSs398Od7fpGfTvcMsKqGT78 8aDRPOh3azvuu/47vI7oJp49d/k/hyf9T+2Ds7BvRPdRu9fGlfbC46C9fwzJZFgBzzg8 DQ+WF8cnnTS6oZHznZPzn9+/h6zaOHq3bS/z8Y8QsZ2+fcd3UT6dJe+fucX9zkm3bS7x MIQ5ARltNwSV9QkiJzAio3MCMWC0yHF790QshQ6kGDQaxKHzic399+DW2odeaB5U5+Th j0f4RO+9Xqb5WyjzIpnlk+i5axtF1kv6DA/T/tcJvFX7X0eySGzclr/D9fu71a1DfZ/2 n4eNZgAOaPdDwzxpvZb9Mrr95SLKvkze1jeNboJ8hHm24nc7dWMLhc1++xgiaJl/lhc0 0iLca3ePjJH2rz+r7RghG34MrYb711/tOF8HwQ+D5jho/fUUtoHhk6Xd1uxuey3DyEur btu9nvVP9trHK45mw97FJ9F8q35m3kPj36LR+D+NHbO0zbpR2Y3w0MqSpYvYdH51ZL2O 5XM0gnCJrFWREFbNk2AvXE1804gJ/S0Mlv7zR4eQjiMimyenp9ZeXmZje+jh8WGr22xb A3zpU+tGbSyfxap/8M4wGD6423IU+BLlbcNhS5+14x1IzyjB5cfp8ES3CQdu1fPaMF/a aIS9FbKgvmV0VKNxHgb3l75CANXq9vCOTo6tcbt0Mt7Pzjp9iMpVAs+ud9bBD5sfg+aq J7ppTctGsJ6g3dkwr6LZCNpw87rN0EQQluWmuVD89vD06KS7H66QYjtbzm93W2f9XvNg xcXubBjua7aDxklnlXjZsRKg2VZ2WHE3W0a8NzsrePaDtX+aJ0enYbcfHllfcllq2LM5 Oe6drbVV+9Nua7fdD3pn7d7KJ2NPdr0rqW8YPd/q9btnTZjf4ndZ73qJk6yEFTcFQZ9V vLBlRBUUqOeELms1w0P4HW7obBXfbtroTmPVO7G8cLDbDnqtfTgnK/hoZ9Ns9KB9CvMW NnE7DPZa8NdWWm87K+R5zQqB9nHjrLvqQdXs5trHu62VZuEHq8bbx/srHmHdHIRKKbFD IZdXHGNt0yhi/fU6T8r7yPNViqC2bXRW+6+rrFcrxw9Pg3WkKYKOy6f38awHw/75M93Z tj55u9GCjDJ5naXn886sdxSe7q18rdamOQp7YOQV27TsAvO82+50gs7Px03jvy4/dWMH HLX3VllutS2jU1X9r9TFNohxDM9llU2/afZ4ovp7xcFsmE2enC6eQ9A6EsdFhESnJfHx ToAg9wmk8iqJahn3pAshs2In9n0hYLJ35oRfflq6ng3DSogynXRtdHHpd/aCEOlA6HLl XmvWKUVgvd8OIQw+rvAEtoz0hxQ/6v+86p0ZI6v3ETu1sY7lb1xh4u9smAfcgwe5ltO6 s214DszRRZB3hSTe2bSL9k1QfflLjPTunSH20EPsYRWPmzPotzotqOpVWnfLiPz+QQsx 3Z/DjjgBK666boVOX2TjKlFlFz35+LOJvC0ZfDWjoM8avXU2uWkO5+w43O+uDD2Y2zg7 dvI3y4LU7BKa3on3L//MHAl+ZtOAyxah4c7zVnB60kWIepW7WDf8ed5q9m30f3lF+3kn nY+9/w73W6vE95Z53/8ddv79CNb+Kq/PyJNPZwg8rVJpG+ZIFz87X6VJndjRZRlNkBaV vHY8eWq7QE/gr28l16SwluLuF/1PEiKMLs3PGtF1FCBvnQAoAwAHwCrF1OR3H47/OdoX AxN5WSLdK4sqm74YVPrWASJmy8s1r5KrMsL/VNnHAD+u+DvzAc0cu0CirBI9/NZ8WJ4m o4rULNAimUyLBDiLvXgYO9Cidbhh+Hl5i7tlEWWXBhuxFjH7s/0yLgoHIrMOuUsHWVNG WXRdOgChtQhamMsBsFlpta+9sj87xPucWAzSOnu7fgp2JWiXo/m326QaXeTul2/4KBlc 5dEA8I0qbD3Crw3FvIhTi1lZ57tHDn4NmUnwdZXNZdHd8s+Oy/gmDzqxA7xZZ3+ZeXYn 0W00qPSG88jcxWkZX1QTL+PSiP+/4LHNv02BXKhydn+zPxMoDNCcUdDNK5Jc3kgPoK00 r3R6SNsZalEWdMpkAtziNJ/Mf63y2cC3GLJ5BqhmJWK52WM/uoA1UOn4ptHF8ib60Sgq 08SBAK3DzEAAjo2O66fRLayVSt8LsKhh6XPookFRzqqcH6DFyz/7uRxE04qy6q40xs4n vN1pPLAQqnXObxYZej2kmB2smDGo/2JkZpxNSiv0jQu2lwjOGWp+mcDe8n8IL/Fco9Qi dY3v0hGKQx+NaPLPxg89jwfxJLgHpE6gnH7NkpGV/ufL+1uYt8nwh8Rk2TNAU5f/uf1X 4UUE0OFTfAV8ZeIa1PjDnVjVm/VfajZuDKITwGEqU61/8Kg+cNPKTdXdTa3984331Oq1 bf9I4mvA958051d+1EbNJTuIBvldBO+o8mHX3j1B+Dp+2htavV3uDjaf+tqnZerKLemH WjQDjLbRxTP6fT12c+hGIGtMp/WZ2GejAQD58ZO+2Hrv1dvrOJ4+5xyud7gmohEOojG4 3hYFrH8M7mMUumU6UNj6YTn/WsRPqsbV17fxBP9PY1uZsr4QEf73DnoaA0ZeXTJis+9M WAzHMU0IoltPnYDg0avvdZOSoyoCzAm+7AI8hlyA7OEB0owjx+ZescL4scLp/Bs4M9hL LuFFPG2hryf73ZVmwN1V17MbwqQW+zaIbnNEfPSguNv39gwDMqrOVMoVzrXmKWzG6psV YetsNs9wDpWpbuz472oa52Nis3prJu4cDqYUVT1Ywwvry2l57M69lHCuYEBHGnKRd5AG K+JDq18DrEObUgwHMOhntppr/S944rZQMlXdPBYzxrkq0V0cs3pHneL7GXGgLOAol3L+ T8K89J8WLNagkcKYUc5oT8viIhk+GXxfrcSF/awkk1V2cdjVCeNMALR23EKAoCUnwfk4 VuTIjlFZy5hMKnaqK86a79LBEU6TlHgLdXlf9oOvcuumrq/kfSMZWQ5YRJTxokL2SZzv an4Us9X5WGyslPoC5pnWxWB1aaO8k5ArG74ZiMNUuirB42Lg1M+sL2NlCSu6sMQr3JbJ NoagO8s5g1v5wELZr8oY/yMVm9Ulo5I2mXFsehQNCXnrO0zXYLyL6lTrIl+tIkOGhbVk LCYsvC4frE/wXApxmF8ipUsoTHkwluu+2DrrtRlZ416WZBo5Qbv1pZlISEN0/g+hGvQR FEU1mC1AXn/PtV/qOwbGFKYRApdUZMr3g9KLJMuDT3ExxXVWV8DySup1o4Ah6GYRPAmR SqsSouuFAKyST4cwXqvH1VwVsPZtIVpVtxCRlwUxrZJIPwOYwHlgKgqslZhe53i3nDS0 ZQkh+nRkjF0okeTqXk1N7tC8yPXvUMwTR0qMEBy/I4Wx1Xbpgqy8iDDFm54kBWOfyt6d N/F9ETp+IitYnfL9M9KgO/+V9JMcRh2rsSE2IufXWasgHed3yINR0T3vRJBjxF1Wj0O4 XBymC7JEkFMj6g6PIF3OBU08moib3hKxGFEjzlME1KdTDqQriyqSaYKQncTsGlK6+jT8 YnWgXTx/a9ylU2TVs0suouCYTOlNVDCGubj+VsvC9ADdPDhBh6fLZ8AeqxWsa9msL0ch xZ2PHsGmpZ6bGC6W1YSsk5Ve38nxE2oaB2PDPlbqo8MXE6TXJ2yFMKiiXQu8VHkWiN7t FWgiBRACl2W0wviP66TBudeW6yUWE/qyGEtRlqBSLqKmrKwH2YQ6+bpwn3vyZORd37I1 /bDhh7xEE423GNPA1yd/WADAtaAbo1MdpWGdsvyRAMVexebfcDEG4ShGHyvl+kaefSY8 xA0/rTiiBZbziECToyssbpXVKLnlwzLeJeazvLrtpQ6hfTfZ/Ctl0inmxCGLVlfQB9Pk aQDgetrP6hmYARkSIoSBK1rV2zKCJuHC/W7mxaz6AqocrOjLLrFA9y2g8xdMpErllLd9 NEwEYLq6BelmHOb/AKIqmgT9oryOmMQ+oijvnMtEC8UyD46eR+2uzm2JaLXUmSCb+uv2 EgF3jPNAOcXi4Na3dfwM8iPxfQDfGfddyFsWgQcnIXQKnCBvx4rSMXCbnMfp2KkgysSJ Nd7vbXWGgCCXSa9bc0mAQA+dCBe9QdHcFE1Eo+IGoSOD3F4/ICX61lol4wSmNoFgEKoO g+RAYhJ+uFB1TjxnlYBz3NCF1Q910zcyFBtV3fTy80uIKLHZPyOFXhK7rtWtEJM9CW42 LoaUE+RLXYmhjRi3VzNqNugAupRAUAvIsmcBwCEqg6rHSNQEsiwqIpzxFsTPsVeHJq+p bZq8vuIRJnX2ygJArBVcJDfo+0qigKyIQve1MZEV8dUX+n0PkaRfeO3wwdAtOILfXt2U 8iMkBdoYz38lggE+1Aa8GxGhMbVWnfsr8jvpucxoGT+BiGpRar9uhP1FeCXH2Jigz+7E a4m8fhxFpKFl2In2lK7u0SuuxBoAqGAYwJYjI6L22idlpp2hYbmgEodFAUg01wry72uU d7rCNSEmZAlr+T8u0b5FYRCJZfDRaI9LHAvqk3X5ZQ2rmx7XOBnkZExBFrCC/3EBlF4N cgBW0Bm8utiTNazKQlrjOiasSnFm7NFMkdgHOkOCWg0oBSAkiSUgrx2ZgCVomIY98u8R YjZRJ+LVOW4Zg0GhJB3cADZNAKYlZvsEUViiTMWTELbCcRpLGWF1Ppakl3OwTFhTVLfD C3huCiThstoe78JBHFOePtSsd7T3dOXdfULy7BJ4Eo7ZrH6A148e+TTY1wmhgrI0USDe h0TfbFOjEIRFHKWik8WMTBHSYixIDV5Y7YxloPNJdSZeunvoyBQzkgNYN++Rp0ig4NSZ 6oW6pAadZ55i+gMj9oXFrcU2TWO4mtKUvHqUSHzN9xY0Nk0T5ojVg/W4AuYHAcsQZvNE CIDxcggMOsnFEYVT9B6hbFffsVCQgLxuEU59pgBBgr8O7OH7AnQAWBSX8wgF5qBfgAXY ILB8g/NoAKGqnkVSTV4dGKbSs25yzVPZk1zaAjlBViV6QggLvII15wl+xGHJaLJTlIOH RyKkbdPPUIlygW/bkQ5UpX5IcoiMtSGSzT0HIZ6xcHFn21AcMjRIBz8BrMNEqOUpWy1y i1LbZ5ptrM5+inKybo+WGFIJDFWmVvRIaFXlJmKh0YwIXEr01rYeDW8pVa38Yd38Oym+ 5so3VCTZ67tjHqAesbdbuJOMGyUsYZ2IuxzDB2cLrRdy4Gt0S9j8YD0fRGm4kmZ5IpaX QTaHOfQ6uBQRIM41atXQK8R/rNV1x9meciTOXQpRBY8hDN1JACCsHjlUs84aABiTNsap CF6nOizNz0rO8rv57xSM19pEDSYjqfUm5iEKyeH8m+gsNkFh3orQdoYFrp/vFavNjlIQ I+OZRlCrARISfzA8jM1KhyQKdOxu9koa8dwQmQ6JpRuBge2iWRx5ZdY6bMy/Dkozku9F 5UfOYAhklBAdea4/4OpLc+sgGhFOV2UEBopKt0VCQuCYrU3bAANnnDXnQnlBN42JaJFW lRiRiUNAJxp0AuRSjZ7gkdOlanfVtnDYGC0HAAogckLyPBzRc5OAlVkxYcNmDYxpm5BZ V2shN2IpfEpF2Z1I51UOb+eIIQxLjoJzdCbl4NeOwMCo3REKHqThqeK8J0Go//czvdzW 6QRUd44+zmQVtmZIatvfGb/7ZYUEhNcv4ZrqPxfIsR338yKNavOyL4LQ2I7MLwJcuNd6 HY2gJNHVIyUSFbhWa1c3BM2Sz+Zf0aOOKjxwtFqupaNk4krFohVfkkYlN2zc2kaOPm92 OPPLkvrWbsq/5Bds+z/jrDTy1J3svT6viU9hN4sJqzFXuCBsZqRHoxxM0SagegcxNc6t dsTAbszFzCgss5gKjkZQ0pRCkG4czrN4JCz6oFnOv0H1VK/lU8fNskdZXBKVddqe0SEK 9YgSKwbs5Nrq6zOtuJJGGAAjD/BsLnMwn+tcvzqKhidhLVyhjo4cnN9jLFFBzKCbNV1X Zk0lxeIMrubfiOitoCicLcPEje+miz5TkrGsbpRq5Y7R8s3oYYXDBDZSxsT2hVOMeGti 4j3TCkcetMN+afQFGejq6tNFlGBoAlgEEUs2Ae2cQsqUGSog2ggHmfEguyU0nbRftapD CI+QWuSAA96tfUmyp3tvr7bBBbdpFB12i1ZsBD5YQjrOwwC6jmExVZ/eGbCYJWcCI/rV IJ3KNa1xiwNwtnyjIWueg+wNBSxS1KWxJptQlVDC1fWGqEojhF9kjHqPCZsC3H6RvLmO iSZI2snOURLALWtTmrfBEdqKMIgfWcFOD8a55oOSA3Nohqh6pURNnr4JlmvF7zDi69Og fT84QhtmOWoENARC9wrYQuMb5+5Qjk6ALyVwYF2KJnpTkhkht1E16AI6RYRr3NYo91SB kufUuaMYdLsgHHRyTEW54qCz1q/AznEcRHxXTtllauAOle32UE0yRsfdGFOihnb+yfpR EgnxGF8O+59EVwM7O2J9umK2Og8Hs0BgQBAdoUV7Wg+xKf2x51+h6EbyKDHsBjdc3cOF 9bNhB9XpIlzRtSSCnVMpJJNB9WSX5+6oveJi/hvlLTk+GNqPD+HqEw6H2wli/bigCypE weYwd6ZorO/PirXnmNIF5ANjmkpEw3nKhfSMCKWoHL4yA6XWjq2OOYmipepep2pVj590 rwFGDhVEFbUaE45UnjBM5aZWmhFo3gPyuLSN97omCfpUSa3wZEqj4Z2J7yDLxRV1NIcj 3BfbXdid0V11sxj3WN92TJcpcEjXhPMplW02PN4UJCBTPK1s5zzFKWJKZM2gc8i32pWX QyJvOLpiJmNV5O4OdCxeddNFj8O+8Xj4zBzA1alvke2WJWANMVEDPwYWoxZ6Ov+di605 fhnmYHDvWW0Uy2iIiDLgUFF7znVlUwIDuSFEbYhDoITpDTfQyDtYqDoMWatukAhzWVWH 3eZBOCOifvoU3GPQRHEPM+JO8S6IAILs3D7mKwEdTRPpi5NUPxbZ/bbdPYhj3t0XJCsr H7gyspVtV1KMQ4WcpRjH2lpXEmaVfoF66vTcBFnE23yKfKXWKWn0vBdPiK63Er2wOe6m fIkMoOVapoketODqPxBnGo6J4+dxJDuqwb9X4oiVvT1mAfRkyrSrUCPXezeI7nLQE4tb x6UxzolygrfV7EteHQGnz9sq6yvA1C84mWGFtBBV1zxnpmPBf3af9JhCfUM4O7FN2XGm 0qh6ukN8SveAuckFInQ8yYYgCFvQoRVU7vWViPhrj0wKm+KKB+ybb1rpZBOuUOhK9RJD WMVxzECWQYxJoYUTaQBVrjeeqypuEnSzqc7AcgDW6LyCI3bLSQhH9YC70isiXqVC0nkW aN7CjHWTI3BEb3Iv0PiWgx7jgjqFYNWzcJ5xgmQN2R3BbU7cvBLKZE3vRvU0kNphjqSV XfFD47a8k4SBN0rYYbKedBFMNNd9TE5j2xQj4I6Aw58waBRlK+fpgjBGclOiVlS7T3lU TjAantI6nnrHnmVmMNGNTvwuR94IYYTzBxRK4qkdv0a6dcs/5wxMx8bXnHCgcB0ASkxP anUB3Dd4W6blhcSjLwgOETvYSXRcYSwZWc27baPcV8mlNC++7zlZPRYiT9zGmEA9E6QS iyWxhaCQHiBNF4PaQMXLYBQe6wI8NERYNJ9SJolnPjEtIFUIO34raC6qD2T+OXf/nvBJ 7+2SVynJtxoZbIDQBuXEiUHlnovQZR+cJyVSVmiqU+RxXkrFHxDe2fQEhOC1HhrSBJIn bBQRE41FqMdVrSPY22T9fx1q2/0G0H6FgQEuaaIsQFp+Opm8q0QsAQJYrArKYxDQXcQ9 9tFMF3k3ooxO1rDzzPAe4ZTTz8bde4IZs2QPXC9aIzWm6Jhd3aBzqx9xELBfJOT60CCi 8Uo1WBJH9lwLsdFRlEBX2G86ahz1OiPGa1Vmcele5bTP4gQE8qR6PGBD0F/OAcNqJGcR 7zg7LaVCFjW+ZKzF2S8GWXLMoJfmhBpA+I7xU8S89cgCHEqPkPYshLIoRyXTkUwsBCuR MKsqiy/VeNpLMXiAwNeJGrCv4w8LfALOnW/c6agaAebzIsOxVXGXCIKPyZpZy9Yy8zWd zr+hUT7nKm9amy8ph9EQxjC67kXzXwm8nl+1sSC/FxeoNOfwgELfWmoL+uhUSzm3Wmph n+eC+JGU4ZDAdecl6bnr+CkuG+8wODo9PI4Ueo2CVrEwHeccy6Bki+wxpXl/60Tl4kGj gR4XN3dKRxaEH1rFHOaIxYHzpbd40J4BNEW0hdbaQ/9TXmG+1qaVC7ncstgo4syez7/O pJlRcIpeERElmgXJaiUFgot0PNwpFwMLwewHEBPDIYmXIMVS3p75qNcmFxJ3oojyyYjF BQcR1D85MNWJXoP8vf3NdkkWaJJ7qDJBRZiPQ8xsWrG4EChMnRAsLcdlfR1BtWUD+qi8 l6i7jDVim04iRvDOxk5Qhc8GKlV+W1sLdUNk429r0r6suYMj0tAfhHMLHNRqHnNNIUVH bVnbI78i6Up40vE88yuZMcrBVjet25UjCXB3ryxQGROQBrzaTI62u37wwUQpdeffLktg RKnst519tn68Wnp3OZyPyh0OtbvlEaUG9wgYzJG1qHSloxtOqDdHcJDwU+RYHQ4DUbU8 q4fUn9A4I8ar0ufr7VahgcKmu7CifpXJiNX9HwXMO/pslGdDorFfDfAlp6w6B9nPeVE9 21L3i8NyAPomU2oehDvYqol0bDxeTEdp8K1EVPY4qvL7IjLaAutIgU9C2cLSBMORcn9c KQ1OCP9Q+wc4ivD7CqfzrwDXER6o2MYOa2LWRTEkKjs1aGi9ZhRHLJp7NXkulSJM5+Vm X4i0nUIuPaKo9UHOR4JbsJvzCYxz7sw9l5nMwmsPHY9Z7lufHpbAyTdLFHjCL68uhSU2 5zyvcQR3hQldK3bFMaQ47Ki04Hd3m3IlYULXeTbIDAIhT3WCl2yg40rI0JEhXYPqHAXS JGwstSYq3z72+W+o+bwgbSlHhmD4O4qqqfyUF/wRskwbabXY/e0ybotfUI0WTvFlgtJy ojbery2H5YBQF9FlSzbsvOMJ1/DGb0EASQy7UqFt2iIsKsaEYFZj0LGzJ4KrufeO6Mmz uohjNaCpPd4hjcNy6uIRx/yVeC5iDTpsPUFbPcJREjPNi0+BbIwQNaKV1dFC4pI7kg6k +VSAk9oB2oYaoKoc4SiTaXJNhrgdopjgRSbOJNli+GH99gAS13De2O0CHUBduoOphS4e xWq19dAVn2g8Jn0CnG3fIdFBzfp1p0Y1MSN0FNMowU1HzCwmQ1YHv6qWq95rScONjoF9 h57FIsEBCpn/OiUn1Xhy5WEBlKmLIqoeQZNMjicEuLkFilBytOasZCDQG36EoJDpgGQz B6fJSxldw5QEOm5RSFYAFU6giNwRV3BfrpNsAXwilI/eoeVC7clX/WkoVaspgfZNOAUh nZqdwupHwnreZCZaxLLVmQBDSAeNe+QFcZs+hgi9ya6AXUCXsurWvPijRjC/LAhc/eca oKmeA9R+utZll5Zt/IxUJ4OmhBmkv7K4VYMPdLXvBVraXcMurx7Wl6pMq7lkjSRDsx9C dmsZknWulTQZShcYhPf2selH32EfhYkCJmigqVB0SSkhCT1SWrjuKEmyVaCOZzIX96I2 2w5cbbGpBeCaguM7WboyuiUHoqpotmY28Cn3Bk2YoWHLsLozoyxrE0rloCzI0RGOEYOo uABbv1V/uxKUdZ6B1HiinSaRvZWognMMAI9FN8woI2VaRwQv0rfqOZwW+SXyBMTmxWR0 JNpiDUHopAG9iDKKY9NI/0QyoekUMsGClMyDtvPbR7uxgoLBSSzA27pITqqjn5rVLuUZ CSVwYrSY8k5OaxQryeET1ChUN72k1ah3uKiBzJiePPIgnZeeDdmRlZLmdQ7hbyUTxZIB qw5muZxISQI6jTJzjtSKc2xnAEskky5G0WmSzRgEgNpdjpSS6MYCz3kuLp0sRU8P18ic c7MS6iCSXtIUw6GKMyInfljrfze+zHEaRI5A2MXCZHbR1RVJQMINktIY4+WDbHAMQCsR c5fEurFCdhPMl1K3kJQe5tp28wG68gUhOnsR/Qm12usp2s18Un3XStm4Kfe73s/xFr9i ZFp1K0d8TiOi7skfMTkZgV5Y0PYuqvdhgGCo0TBK0X2rWWYPNaptAOfHaB4Oww3Z6eNo kHBdVl2pDggM5oqjiVvBNZYFcVsht4sNAxOgRgThNEqho7EPd4u3iCiiCkzy9a+C5JEH bJZZ38UR89jyJdiRawJnQVy7s5gdgmAt1t1ZMpyhmpFt6mg9V1BOF8YkV0urrQKMKr6n zj98JW/lLEZ1z79Wl1ZC1SLBd1EyP4hKmO9U2bzFO7cuMPO0uict6R8j+1rIKilsXbp7 Q1YxkV+tWTY2u6zAdYpRukbdtFB8Dpu1IN0Be38tGMLAPwTHGPJQXdMI7tsIjNY1PSN5 0x5EupDv1XNkUoZvrZAXxX/sz1uphssgvnUkZNBDfhhVadX5VwBvJgQoq+QTJumsGE/v UAEYYFp9qynj7XdBN+jH2LUkT6kac0kwGPcCh9KajAXWRZ228zTSYE9alBNRMenU753K flEy3drV7vcO4iAh6k4Qhdiwah/H28Hsrt+IVCRksW3YInQxaZhDfLiHe0QPtLPOD3aL Ejs4998IJ0XQeMatAuVjNBjMrjllt23MCRBmQL2ih3aqAyjqIsCcPTE9XxSt69G8leGh ZGYEWsEGy16EF9lx7jb/vjXRDIuCFbDSJVVoIYFIY9/hvk9T2DcIKMhShznQSTJjNqQi 2pI6tKELWSsvMKczqR4NEFX0zhOOaGhEjIUQ2fgU2Rt6yo3NzuAo+qgPonCe9p210BQQ Hb1zxMnGgIJQeKOd6olj7exOJPDkUZlXsf6jktHPRKZOQrRWXCBMnZIjI60j24IThBzP ojxEynGQQCUiNxLXs/Z0NkFgg+jDWhMorRVSYDAKaiQpnR0TbWiNo1ku6UXCcBD2cQhj fBUCSMGBGGcc9NBxO4GvvpRien6Ukg30tCZA4WFMCFGhr+3GrewHLPciZtDmktOxb2WC 3k0ZhZ8Vut52QZdxBUR5eOc7xqwbsAdXN2JZbjLGfNWMaLulb8RGC0i/RVv92CgHqDIq wy3pbU1RJX6dEycrCT67V2SfXqH3laU7g8OZSEuYVxhrbBTg/dy8h6lb7CQrxT8apttL UqBrYQIc0QaA/QCJ1CMWnweakENenPCeJetnvec9VGhQU0OkUZ2RSHt4hoME0i5oYxwp ByaUQJBNOa+PyXNF2/cNdmK6raMRGN+pf9JprMRzFKVt3Ls95G8ybpCc+AvGqn+kK55J vyivqdguOMPK/j0o7ikzBVvmnHk7X5DFOHrJkpOdsWw882HbD1mz6n6EaERjMz6QJ1Or RoDsRxeFiNdPmN1LFHdJMahNYO9HKK4h+iYJ0oF42BrLdL5YUZFcNtbIs31Y9AJdzoew s6p7efLojAIBbbwHhIy5vq9wwmxg5IE2ZryWSItiBCWdQLC2+OMiyNkwbo88bOP2PBBv ZQVafsaIIU+BgCTvwAjsx1VYA12Y0rrSD+TvDZL5P7JLmWdHAVBtuOBxlUfl24X2KYtL xJfIAzMa6GGtA+TDcxSOvsZgTLFPnnwdaE2QfYaphSgspT40UGbs0IfPOU3LKWDVedBK cWYTTPtMqXuC3LRBrofFehqvR6oIa90weB3BATz5SX1yIoow9JO30i/im2T+TwLMKuSf fI40+kyf45PM+6mMZiURmZC9G1W+P/9thN54e9rpj3jiUiJYPSan4VXj0L+o+/6Tn4a2 fxLY4WDdVnHTQKoNd/qy9EpDPJm0rKxFALI0OEEtIPtygXnVRt9EklBTj3bTQlmSMFQY 3AJu9kuo5DS6RoKsOldIMNVw7IIywnFMEwGdwWUZTjddMnUP4pxVD3zr7Vcv91JNRgT9 RXp5vIebxKGIB9gFmvbXgoA2CvjX+lKLO5U1WhTMQIhb1fFwqwiZCKyU6DokuVEbbH1Z rvFprgvuxLogJj0o+3gPBvmN+IaYYq/fXV13KOrUqsUS09lvSIyG9Q5QGjViyxm8M5wh hMB085LLscE2wFKR+o0Wid8SOQb2bTnWx/+gApYhK0rUvKoXGQ7WQ3xRsM56yOs/Odm8 NffK+CZWiPNBObrI0+GUQyA5QhMNvW7UvSZjnTWBTjlvZ0Ffs5VAiwyJnKUaSc4KU1Rl I748Y0NFmuswL+pATEZm3KOiWg1bHsSDGAOKoi9U0wwZ121O5CAWoB26IqXAabCRLk0r GU0vS+QTKowr5VhWzIAwWrBGqLS/b7kfLDCe2tQIUm1MdpvzvmRpwQO0VtDBZLImF2JX I8JylPnGw1LQRfeNlV6lbmnLYbjlk+2n0S01SA+ft/mBMONcBOrLBG51ca/ShIB+CHKE +HbhfiPuH+patA5WauO5Pj02JHW/ANsrWySlDQ4BGgq8BNOqXex6+0IxY+iCLI1zjhqV W2z5hk2GHKBH7u9cCYvtVXSAZqF3VMDVTrs8yMeifqgZq6J8zAM6QGtc9GIfAxrINZYE ddtJHrJZ4gtMEk71jrHGReij9TdToSClh1YXo5UOpnQkE3IKkAVjYscjcqCaVO9ZPQG6 5S3dTV8i4h5t9O4Ejo0tMrFsh+KV+a98ZwWXsGRvuH77di4Jri8rkbLhMnJWWJbSMXBw xQwtUJPPWi1w+ibRBemxOioJ3vWi5dkJWm4Q9p2CLaxKRecm7JohrBLD42WEgPA/ACBS wtlRpNgzxxuinz0ZJ3Ym39zVJ823lHTlPVfhJQAcTyg/zjZCIgvT2oiRXtJj0ztq9D6W qSTkZMB3Jn8FwTGLUilDrh6vllNxJF2MmRrihXAIEWMUA0UrhJkxKrLh6sa2CDTvIBfb ovpoSRGoI4QfKcvIG51nz4kIR/r8yxLkVB0cUN32DL2/N5jf1TlNqtGd9xdfy7weitUk SukdCyhz5bHKLY4eia/nv8N0obJEnqSIr0u1lXU8EgZ8Ee9abGZHYGCF+9b33fiOMUTl GTrcjqGL0aA6g/uuMCQGkF/VT1uoei/zju4ma+uQ8VKUrESMSCtGXWuPr9GvVgbyEBOP xNz3+PpunFNtm7We3FMnd7hBGYDGyT6fMoZ9UochKsHRVFdE8kkDvQ7NReMxskjFsccB KRJe1tDoKzQQVc5z+AOtbDH1h4v1unVSBxi4kHC3KOVGziNPimhEzFtQzKh34NOklPET nH3kEpa2H9VFqPbue5KuckgvLoZsx1A7eA9XCG3LdpOXt+jvHtOZtd0BRhTtaXSRKA/R IgKPv6VpQMqVkYmZ4738W96c9tibEtdS2OR5Wlk5YDuQWYXbvpSSxYeeFSjHJ/LoKqCM MfmwAp020by34Y/2pUTw7ntu/EuTqeqmicTGnO+Qhche3jZ43EY7oVcY9/7OaOE2qoen qPDhuoG+N65ze1QWCQd5cw4XYUegIqIxGcez7wYsQbaJtVDJNjaKEBDZJNbIo3aRAENA WdTWf2lPkiEg1HvRBTUQTwSokXTtCRs9sWcAkgCWX8cMQkar6YyN3p6WxUVCdDgWxK/N iLcxqETNJJFBfIdZ6FrnzWENKEFKrYjb/N44n7L7aZy/opmqatzeq67DdHRX7WJZ8Fba 7t5n5tHMK+A8aF3EmDptWYS2FKznv6CLFjgDruAOIU6PZ2TTjzO0m9FnQg7Kubw3NX33 +1+cfhr00JwMczerZ0xkEYdD//AdbMGnfoeVDLdJ9US+epUOy4hWR2YR2TQi3ywnYk2e 2xEyXpxnJskYT5ZBECz64x0nQLYRal5qd60NdYu+DbB36PSlCjPnHkEeLUD5p+qTXkhg kfPoBKW9WaQwG+WPTAmAOxakLQc1y7VbGtVzUxjIvQayjNV2SJYto68Kk23TQJXzlISw OsmwDdAaiIp2OxaibnzR3J5tl+XYXwvql9E1JnxRgYkt7x4pA19mQtgWmbhIarifvk1H aD2IQ+76HP1wT5gK/MhgUOtCicG1ZF8cxSPUPaN1X3XZKAU07vv542KY3su2kXcZhhsp hmPyzJjHwTGHr4A8f24B9lQEA2SvWdvfVzdbpGG8tY1mouqY4LoCtp3Nqpil2hC4TTTb M02fLbQbrdXE2TDy6lBORGM1nXgYz0ZE3lLMFxOaAH306OYcaKP5D7Hl6iSF4YwzJCQH FEJA7VjDG0KXmXQqWQCjfkEUNlXJcLLu1rhuILzAIvLdf2yLOBBnZsm4U7OVpr4PQFLA v9XTZjho22dEyRPpQ3lyHkvc205IMLAzmD3eIEOMiCtZVXiIqQcCUSUdJ3e7OTUFVd0m Y4IcwqUhJxd9MApEiFZHFauN4QiejJl0KZAOR6jDY5wCrExELp94D9K65FVGTmndoCOA yhFVNyglYfaM0RThG9k6UIZbWO5FTLS6zJGSXtvE5TCezH+XXhSQDUxzO5HwH6w+XlCH s8x0CVFWrl7LXMNhWtz3IZLz/AzzD8ZaWL+JvEg++5hkWw8T3CWceT9RhQM1WVaSZfgh BY7aZeGaktq3CuFlVZoEr0ifoOodrzVDaVXw/ZmoKOvHzCgzecP2lfHBQDl0hxcRfhoD 91Dd09VUtnMgC8KMxpDXY0VvgtIWZna6ZN4dqhhyS82iFfVmr03Qxxxd6apv7Qahy7ZC l+O1+jInx3nIOVjjKX8FqNh7e2vwBO9nvVQXnrJh6xDmGQUb1/iYc7hoo0YUKjzBY4jI ctUP763ykLA0575KoHfLITyZfwvCmSBLmSRSfecJ0o8N8RHBRyEzRoESnr0MvHlinYXB Q7fw0TS2lZ65nFIPyWC0bgVorJwxcnTnl7rD4ah9ksfDxQpFOlmpB9JBmA7h3FS/YlGD Vo4I5SbGqOXSvpRjescbE+qo1U8yosW2vHzHShbSx2inx0YVhLp/LGjWh8bj5ZCZfat5 fcvwsvluPoSFj+LiWdBMmUZN6kYY+4sNKituw3Diy/qOVC9u0aayxrhaf3WxSapbtGpP WxmyCNPTHWc1HGIVpFSxieHIvXCfrjTqlDEqKr4pqMEHa/E+tHmobjFANFmcxKJ9BGfr QWM6tp5umBfTjtRIkxGR/ldPyNo4JQYr0BA/8xQ/QltNqEbjksExAgJkpyV0CZcYMkf7 MSL6QgrYxLYO+ZhkeHHkRo3Y/ZiP0S3hK/f55o11oiDMpsCKUyaek7YG4Qb6qxIWnVsr CLJNmWrLNAbWyeaGv5QyRtHM/8lEx6SFjQ1CKm1gf4sh0aROvHcbMhTSRVk9EKlDyI1G 6kSfi4hhCrWtjMroRJcIot3P+iQmzUkMctuhHiwKO4mxIDrGxDmOSxE9TOxFNX91w0Eb WxpzD5cvLT6Y1uxavOOJBXaYj6AqvCt6naIADWV5b7iTXMgQoiGF7bGqvQMPaVgkBFmJ ZTqMJaPn0IcTXech2LKpOMFEgE+gBIbJwCXfF0EXK9QfpVQCWYBK1gheXkZ6PQhijkYv WctQl0KCRN/kfbHJKTneyzb9kVWSSUJN2gQwwoJRwEwyi0slITtqUr0pY9V0MJtYkR2v gIh054fIAnBfpbVpPqnOsOpheq+Cuc2azBPmUkG2yQiY4bQ6llrMAhsGU5oFV7RRt40e hGxCDTsWpeButxt/zgsiViTnYGujOsh3zr8meNDV2wWoQnAUJLKpV1L3y/GonSTawcwA BBYxmQ6jvbiUzLbzfEEcnWeoTdct0kk23c0n5H5tQb/QPU8u8b9fo5c0hELdNj4CV/eL JEswxBtroU2qxIzRVZMILdZ+2d72hI+ug+kQpLH+wbPXzjJRKHJOUgom4zQWA9HueyFQ oQ47nQuH9nOMflEUYs5iHzrapR2TQNDYeAjThQDfQtJY/l8/wSyinuh043al5JqYCrjF cdNiJMAKNJglZ/9AGTv2BPIO3JAGmwfsCE1hyn58TU3hESiKuSFQZ+CmEn2zxn9yQVUp SrzeRF06kMIMVTXPrBuUUi0ZBehkZQvCImzTKNv3s4Mha5rDYZKh0vPLnuz8tzEBoNKQ pnMIRUwUAisqiwCciDRy9jS5T7ERYlIcO8tGcCGa0QWDIZQdW4cRdO8TstyWHdtUakJR o5WRDT5tVULnNapN67YtxfoQMhkBZSMpD9sSWUrXY6DxmO2f1kG/VFgRRD2T8r3denkj VXUEC2z/Urcjn46iQTkBmpgw3Fzkijbkr05UBIpVrexEU4FyGYnwGI2hcITb1bOY2qLT WL5rc7p67UZqfI8xhXC3mDZWoi/Mx30nD2T+KzTPNJ//fYEjoDm4qJV8wTMHdCKdLqn2 QrLA03yFUMX8n/Qd2CjoH8KIcSIlAYPqRRf4AmvD/XEBxA4n8PPoc7Luxb9EQ1nYn4Q0 bC7i+xI/Y2gi6qDUlj7Ni89Jgf4+Ot+DObvtHRM0+L7kJ6mSfIWDM5YQlijhFrNjxWxy 9yiSLuVE5zsZMGuwl0cCEKKK/gQZ5/GP0iXhouLKGScGW8bUUw5wV7OBhyMK4CVZbkdc ooM4l402buFRlGHIqHTHwf9Gb090ckEhBNH0G5GkmsMWGaYzBQ0ELm7QgIYI3onJ4LxD Jb+bX6SYRlhdxUuhhKND7tMe1QnXpLjaOXoobY6jJQTrifQxEPfVOUVmlFlMJEKv0Q2a wPzKNWjyVBwIS6oXgY8MoQ+uMUO97tgxmDorfhtOG8tQ9rUEzxwRsmiGAYhhfhETHChx 2JpHngH3aEDEUSxoYvZQjfwaVevWOAbHAKyGLmxUiNU2QVW6828a+sZIeg4lgCdUt1li LAFOR9v1+1RnPwdYmoJk16zUQih3mhSyQhPNbKiuv4JNdeTiYoVYT6oPJ/AiIlxWNbsc pQSmJ7SnAkscoYvmAUyrW/UtTfiGz80q3erxKpnpZJHbL5so5SiSKXqtU3UOgI54xhze gOavRpJ4Dm9ipLiZgdTKQd72uap9gSY5VNFwLZv/ztlLDmOijzbVkEhMO8ePRAsO1Cxx 4L1tl+74HpZAgd/V0nDeE2Z5MrhLKWRwRIpSXbThep0YXu2DuwrVJ0tDOgQsXmw3Ry3P 0I4QgzmuFo2FD7XY5bXqaaTdkfNSZEm6vs//FC6WIAgux9rHfrVE+FytRgHDA59K9mrb tk89ZiuA1JyzjwZ0uR7/SteeN1rKpCkFAxfz05rPMoctL+i5AfLWqz8XtWKrx181rGCv gq04EnXuXLAUCFaHQ4qPa28BI2SBxKDUmeN7xRNJDNF1MDpH1EoW1DGSbfYcrwK9Nihh JZ2TSEZy3p6M2gLMJK8en1Ub3mGm6YyuZpZPdm7nFoNsU4JRZbiBFc+xkn2F7gre3Usr /GkyUKcpAhiJyWmJ0Wud7Ri9OQfaUZfKFe3YIFg8k80z7RslMOPw3j1d7a/ANHDUpKSj B5V+QnA2Ttri+Y4w2pctsZW0pBWVCR+NVxVrbcbvlIUDXy+5UHNM9ySujs1UP9NyCkgC P3yMKaLxJeFqSBtw52xQ/5oihhyjZoro4iUq1bnSBfGSKDRR7rYekkztSGkFKL0KnTCS 9CjWsHp1a0BwKM6umTZ/cn9WHSBx8wpjl+s2gr5+eEPi5Fb+6DhdaYQVIEbM4qGlYteJ 4D6uwU7D04rgZ74hXaBPq+sW0eUOP0C1IAbEqEN5eM6rnnAzfFWQOvudovSGUCkaj3B2 e3ufv34lbtEqAqvJEzFDRMmAIV8hQCE84yQm+XEHFgYqQIvFpl8p2WfbOOoSjAqQkLCT bEdMhO3qI1FyqxUBFkCs+SvnWllDEmRRqUBk2CX6Yf0BjIWPZ+jbVx3LIHavMdvXB4C7 cwuP0MQIE1/lNSALJvNAyGmqTjYjTwfRLQOAEbyxFc1A8XLmvog4297qCDje2+o8JSOY rODJs0Ga3xCQO+Ep5wiya2ZstpRaOfyPtpgDJBnRpuc1BsNoos5aLVAjynJk4lWO2/8E TDeIqWbnYm15Rz6VDh531Q0BoWsVq+yWybhKgtsInRe1irHAlRf1hLT1QeujJOUWq0s2 bVRjTvRFaGQnoA8lQOJdHKYv8jSmqmSlZMbh92mOpphMGkrtMmfDU6brIzbrQMIAv4YF ttA4QHAxsVHhGyc4/Pvl/7L2LbttZMm2v8IfOOdKJNVVNbmALLtcMqxHS7RhadJISVlS yiRTh2QKEmf9CecTPPTAg0bNCnfGH7trRSYfckTKcq5Edxca6NYO5n7Ejh2x1gpkgpof UB4l/5Ithum10IjIqLY+6VYIkT81VQI8ZYFSr+EfXgNjwbt9dyIRz6zZht9zxUNxl91p wZeP6RZ/M2kliHTgovQV8UNkrG6VBi/dUFARwwphIuMx57UOF18Yfqqt3Qmmd1EIfy6I w5ld61CckdRbaMFtikOcZjA1FaAg1y8YlzDdeSq0Ouahdu/OQwS8lHQVAjMWfVyUcGgy hKvmesumS7uMqoQHACKHaG6ooYT0NJfV0U0ttyw1ZEGU3PWtRw6THMheYftb8O38Yanx IKTabVh3JVTSEWCXtdGy1D/uDpGBA0BW0FKxhEUwHUDy3Eu0eXpvX+o8TOAN2SG7lTQI od8udoAJsY96AEjGoEqUY7vDXToYdI7niCa9GeA/D4G7bZ4/piMMNsR9fiu0qib2xb/Q 8UORBlBTHoEXxG2Tgs/xRppbvlKDEz1XuPQsyLkQ7zAFpQCRo9TKZNtXVg8NHM2TJnLk zEn47YvKp6hEbSgLH4ukc8uVXi7+egQLq3lATf/gd0d2mQMNNBV5/pBP2/Z838Pl4CLC yDK8fvMtRz/JibCUJsbXm1e//aRYfBMiYeLU/KwzG1tSxWxDprdKFMjSnGfCH+aXxd3i K2RBRMqBv1PyawiANX+Wm//XyKBeqe0wR2M903Z9nSkUYPokH6GCDyddI4xP/clG3+Sy mmBQvGtoCgmhNasg3ivRhIj4gd/w+clDDozoRfTSwQ8GGYRnYvHv8XUq7TKeCn+7FOk9 dGASaApV4otaesmDwg7Nwv4VrrHmLgm7MHiV2sgQn1JIMoZt8Efahj4Qk7U2tnd2NvYx CFCQ7wUZswBtQ3RJNTY+TFJgLbWUkz+l9vPPCUpcfLlLRs0rR5Bv2vIbHsUo7eBT+8xl GY5Y62mlvGrhjtswR6hS3Yn81+bJYuaa/XPqp/LsHsXw8lQ107/NE+UmVueSKy+3zhsq WI98KrWEtNSzWxES/1U9zAAU/VPy9cHmVuUIrEbuAsqlyoGFZKor5HvJuSlYeES5VKjC 8o3gq/scV7+MXdiDYeeow9trv6wU3GXgfwrPaUTDPpY4uiSBTwh9OCfBagIuWqhtBf2c 3ALpJcD/SIHz5Zij25xg4hTlWK3oHfxeAPRK6VbokIC0KtyPRJa4C+zItAUEAIght12g xmHlZJB3k0OlS5I9XPwMjxDqCZUuG9X/0pGK1CdcJ/ixJQqoNeCVXzioFChwCObG/Ca7 g4gH6CZaocv/1rv8Ctdb85COP9aPSqC6mh70KwfY8VjBv1uOxl9Jk2yeXDR36bZ7/ajT GXTelfcs45HgopsiXEbzMKF+YwP72wJkRkHdz0QffPQ0awUT7LUTj2apRHjnovn67NHs hlKvx2iChetYKapSpc+f4VkxEjaaRT7+rM3mRKApNQ4b2B83G7iF1In37A+XN0VzOojt Xz+5D5+L2fwyudA8pJ+GeTEsIMZT5s2BTZyYUldzK9x57vFzBEimujWcDzpOLsjoLMWL dyc4MkrYRnUbNzvHkFlA3M3JOUXr0OaZBybvgg+4LFQcqNt9x8mV1t+OXbxduuG4BQUv lhCcCz1ObqG80UKGxL3XObLYI37bZwGO2RoDui3NK46895ybw7C4pgWQ1hZidy+ihGGR feL21WSeGVp4KDtH1+RlmFD0wNJj4DouVMR5cDDG6M64+Cb2Xmc2zkUX+MVaz1fCB5zP x6iQZMKdrW22wKthXIUkbNuheYbLbji/Pogmlee8xTzNsblWZKv7UTxBe9DGH0sCakgZ +aDsGE5KFMpmeiRwrNW4/O2fUEq9meF9RUpp89cQ1endsvMDpJe8LVyw+Se4fLVkf+Rn kYtvwQOEP3fxbSpkzIl9jIZF8b553MEVCy7zidTUicn54JdOyWQAgU9aNtsMwfVog3eO 7gHy0ArTnsR3vPiCyBoxiLjZvJ9NrygMNb1Mx5emH2kKssrUWyrNOymzI8vrddlYyYdR fA/wmlf41hzZX5opeDUcWZz3wGl/5cia1KUvP1HDmK8N8fHMVIJ/IR2nkwwxjwa99QUJ DIsCj/aa8++WdIoIGC2dBfR/fJVAEUXsKs6kaPCDCd3SetJbzBOcDqW7A5kF/sdmCZFm zW9pxur+sCG/SjCqkPWxsC34ufA+AFscptfypeL9PlnbykFmRSMY9Ta7zaTHoc2Fj7ky 1AkEDUlz78Go0IxmFLc7Aq+p+e1H/+5hk8es+Gk1qWBP4DmUlsp6r/Nxhw0hFFjFlm9/ d5xNkz81XTNDHQazPSNZQYHpsmjgL6VSAalzCid/eSOkoi1C8j97iI1XtjtDAVdiVm9x n/hDQwNodIZgRrxQguzSEFn/VlS2fvHPk5ztv5tH0LytvdtnbyOVbo8wOvq5iBXFO5BO zwejICV1ToC7pif5AyyK4XXzAIl7MMjbTJKH9Aq9X97+d+ctAgT0jm1uwuro/hqb5Ncg Pgm/nHeuCEzyc1v9Kk7tEVCq12qLVo86fLkAAa9//zor0oth3jHsonYWmmdYrBHds78M SXYgGGbMNcu1xV/8oS3n4GOW3oo732/Lgl6Ry78vxW7bTAL4q6McHcTCDBmo5vkbO7XR AkwgQqB3aOG150MB+AGM/jGB4gXaYDffe3RqwcwQcorytlKbwXXnz9txMVl8vZNoB5iP IG7BuN+mmRXchvDHY9A+hEcfkYr+qi4mBaKMKxWGG9xO5IUhCGA7gjZUK6z9rjtN/ywI 8x1qWiZBpwMbtwBcfkwxluZbkRvGxRkYHDsGEuBiGsn7rZe7fqZZ3Pn+Z5GNKGskyc7x UnHX3suVJ7BNPcoTP4xKe0LKlB7H3eUcFgSW5svLcxvsSYANJRQCHZj7sSfJnwlypq/T 4bVSWjDP7vxANTgIBQm5ELcSqcfyH84BL00UuJqkLJNXTGRXRlCJAV8SAFwGJA9+9aPk dRm5CxJRVJhqHkYx9eD3508JVPnr7iR51Ftgum9S1QjtU51Dq0blBYTkBfrKa6kFf2zS R2g+y2xa35nlJH2U0NVWLXf7roohOB0gSiq9VwmB8WcFLY3UlLe5JxcaUi9BxSUQP+C3 HQeGwxtfCZlvssu8u+bI74EzQkwrJM14HboA4iTL79HjWgCr0q/405LdJx0gNfh4aI4j IKjdDw1wrRBGMbMSjIkCn5Xbi6RgyXokaIZbeOn3HQR7lJcIY24XC50g66YkZy3d4V0R RoXCmgIM2mZzblcC5s9F38fmnpNCL80RIF0K7bm1/zl+l18Cicht8+S+6BRvy7GEp7M7 zP1WjAuaSXMXYnGN29nVqHJ6j90kPEb/FMQmJGqbh3l0e+76wqiTZIT0ieCdCEhwvvqU aaSJojpEGQ9P5bFxH7Wa9S/BhsjGlMIWomiWPt1BP4XnHwHsLbyH6O9cWIBxsYE7e5Oi uXaCuedg3TiyUC/iNeg8afl7pyxgzKD8JVauo+FncBXA1ShTbXFSNCEzCSVBZ+GLLpiR Unt0Fz10m0cGfI1Eu+OeEmXY0fd4fQo9H+2miKa7HJ9quuAyCBUpsnV/ieYc3TzREGAi HpzAR4+SG6UpGL2oC3lPoTGFdZyyLaPJb6VKhosH89fAlWzaULNoZiO4bzds7N0kYL0K QQo/I7hwNkzg0TREvPmuAONIK1H/+vyayM/JX1249GTN3+foK3OjPYV/Dc7ZxlwdpLOy 1YlYnqREf3D/bVga4LWi8tK59j+08sAmK80zhWyW8Pz+OkPrbIhzZVKK4tfAv46TG2B5 tVgs3lHjK+Sx2Q/4Ir1MkTlkzVDcV4ETxGovDSHVr9BgLDEZOPC1hdfZGKokaIykrcLz NopJMleKcybg/exE/VEkD7LaD93ub7Frr9YDZh5lIZSt32LXXtmwKimrvNrG+i0+fJUR 5Gmg+6t59d9ir15ZOCweMrXj62/PnsJjYgGlyg3XO/br1UecItrWAIc0EbvapQkU84SK jO3ZyAeufMiyNbrAHweiJXo9rb3IIAXkB2sBPU9JIyhosmA3eTVXAzBzUGQVxHJtup51 VoNCWnA+UzwPZPMjzhKBvoXfH2iSbg5/jqcWMHSKOw+ERJ9akBRQ7RNqnBNa+wBySYky e9V1PqaIQLUoN5BmLD+msmWNxxREI1ekxk9VJg6s08RHLYEdNlhdf4nwEmBOoMZF8QPA 0oBsmQK65k9/1sAeeoMreVyGOZ49tjE5TJoDlrEnAIRs29Y42nKa/kAYpVEHOVE1YU5p At+wP1Vo0azO1lzbpQXqhlPpfPFNdOUBn3lzQXCzAm8JS5Kj8sn7TRutXBdBfx7aeIUM UQJxYZPJv8kAyVPny9OLnthp4REbUB+emMCDbI67I+vAJ75KBCAgz4ovYZS2UB0E2HIP WmD6YfECyhs2Rouvnd1HTa3bPiR0Xa9Y5hzmNNLKyoSeZcMIkDtM5onHJXQuG1bOCnD9 Fv/Rogcv2fLdqpzn+TVEgKXkVY2/r74FYNlHVfuVa++5aJubeFDMxE1sLSVDf7z8kDNs YPlS8SB9+4x0Mk4mQv7Z2Hrh++lVNXSHHf30nx/PEELD5ukpVn7DIBQMRiCrZulIe2Vs +/K9zTngysk9KnpIiTSvK7BmEeYQ9pKJ0nDMQDRhLFsO3GlnN4ZbZg/IRCNyXeZShxJG s6Ez3WPrk8VfF+CLyT04zDeE98ITK7koP21mfvQxZWgLf6HV1ygL6kHN3LMbn1SVBExC WiuLhTfRhqX3DESAwkiupQCx+yM7pwXs8MUvZ9y2ozL7+BJbblKMuLNdZ5zmX0ZJlDBR +RqkcaTEOoP0YfHXUIEHEeYQJkpeE5dsJ3UIwQFmZhSuM3dd6IdXZvDm+TDOZCbAM98C CwfpNOkM2JkApPsZOtkp0Gu+RkP3/BrcBuHOIigsdDpQ/R9nU7zUS42JiXRkomr4uLMy oasih/w4OponNtTM7rZv50gbb6azFLAl3PBg0+PQa1n2bQ+wpJHf0UhTAGazq55nZv+U RHe8iOXv4tl9l04Xfwvpf6J/wqhsZWLYOVb5iBQn/CUMRyorEPVFMpjf8xpOSALbbPsm IuuV7BxRKFQv7XpJ2g0bA3hTbHo1jeDbPjyxQSmuFtQe4hdFtSzIu4iTZQm95/bXhylU szU3F3rS3/lwGSuYHKKuXYD7U5rvEeIGPoXhHSWskcVkrAIWm/b9YVy5aeUWjV+kCuG2 b15se3H9JTfJHcrb4kvLQ9G/t0Jtu7+17RLXv9bTBR/0Kp/cCo86wsh/sCYwsoc+3jcK kYFmwqB481uoVKVFEXEN7KmNI5UCH8Z0T9aE6u9kfjR/rOAu9h3an24wRl1tsFXjN/36 e/4o0psCBVCx5r3t2+89/Z79B6sACIJLfLj6NlVPreDyZmoIZQcl1qahOERYeRl7Sl6j 09tfksP0WudPv+d9fk1urpY7rYkQVt8CVAXys1rm1OuvPP2QI6pK61k7z3d/agZ6BqJL /sHxHyAKb+dl7zmBTz8F8Aep0Sg2sSeMfG8Cgds4B7BN6DqGN/0PP4XXMQIN9VDG2L+3 yQVozUJvsH6k38WZqkZmOU4lx8eZ26WBVjLa8dvpLdRRgL9HwR3661L+mRmIMMu6fz2W yG4GOQ8j52rkzh5w4WAY5lJhAcv87O/vGD/ywPQzmjt1otvD3NP+8Cr9Mx9DV7OVTLFn B3LHro3InnAnXuvVV5SiFGDQaA7Xdy/nd7yznhScqgzwL+3BEAfASwvtQJ+34/D3XXIP SoO0meJ1fgfti7/G2YhFb/VZzIsivPXWRk7p/8BYT+40qXuY8rIUtt6r7znNp+od7qm+ T00MsCpqTBXx6rBtV58xSKEzI2k/c67CbMUTIwXYkmo/8jj/u2GG7ABwHRDAC1qLCN93 4kBhbekTDFAxW5VOiYt1azvnbIHAPvFStSQOr97lyf+AGCsMTVWZ0Pm+yyfXKfgBqCiI Xtd3HbMjkk8N31JAj1GMo32qeW0A4ZSUnmEgEmYb3tnvZ7SmvzS8oN/6A6jEBLF0gdS4 RemHZ76Br39dIIwuJMz+lBNlRtR8unFKw4BnbUTOY+xgxcMHeWkD9Rc+L0x0R9GgYIbB Szqv130fg9+l+AeNSe9+L0y0YQU4jotM0KWg7l9cqCqnq8xdUAxK+gavtbb+hoOsnf41 Yfm7U37GICU/XgFy8+n6zNYFyUHSLeN2itEP73BtAwF9k8kY6PitUY4PxqgyO3CzccVv ObrU0YRzE4c3NjctPFbjzKf9+FcAwFH3sq2K7S/xdc0vWZnay1tKHEVaBgg9nxorAITW k7oR0fx7UxCeRXwopih/ie/CJ9/0ro3gkNsufuw8sfXewChSCzKe/pjT/XSpDCykxyu/ huCQp6b41gWsHPGRSH+JudfeGN6mgL208HGxl36yZORYyajQmPT99MMorYooXBWHtfdQ /Vbcw+XGion+SfW+aQ9Rk9Y4cTvGu9qEIQ6/zEfpfPE3d5wUasTk1qUVCL2nIuQmJraW BtAlNr3Gg0h8EcXk+NIEz8nir6kK0wh56+XNsIfyi6YLQndW76X38lEb2PhfnzkQOWIC SbyXHjmmYtsqmL4uGGPDQoBZGXw9fnPRW/HJxdeKAgbhV9RHTkTToj69V0BTQDlz3Zhd t5wp2gDfWwANGDb4ue9A/Rvqf5rfaC55Zs2Zmivw2j6oPy5YpTYUyWpeedxprzNw5bXJ q7843tzjYYRKqAKqN1Jz/b2+YQKsc+2dxxMT1pdsN1sAe68Ajs2x1B/6twjGeRfei+tR v50gIXHJSEt9DNcfx33EIi1k1X6r9e9oAEPMpdxUjW7Fi6paZoLH4l2Z2ySHSOnss/Wv 7laIlbcdtTTyMQOWXYO7dbfq43rmcRLJQXZ9e6LVTJVZIrYR0K6R+j31HgrZEzGT1o1p 8rYM72VyY9e35VnNzwGYuvILu/vMVl2CAjr/9XqW/3dn69fOf2krUe8/vjPV/Ydqqj6M W/xvMVp8kz4kJmjbkrcDM+rG4DyzcKyLhXSfeTSRknuT3UqAr67vRrfatRhfh2F1Yx62 zc8pJOT0i6JbUwCjCx9AjETDKXd9a4XVBA2g3gmsmub0fEuZ9fipWLvrbtef4wEGRzn4 Ujte9YeX4gcIK8XZiVlmtntgIAccXdMnw+UcU6XMxFmSLr5KExTzFKrB8UjVCPVd36pg tXlIpVe3T00hrRiS49d4Xuw1F5bo3ufQ45trYUqM26pGhuapCcFeaTihbgyDWBl5yJHN AtpCUq1hxem5WQIP4zJpwUHHAIjlt+xB6n2cYisN2VNPc3VxJX5pCZTRUTpEBlCBWvA8 hz5paUXWGMYDrhvXut6DzCewK4kGdA/DnyHubMfBjv0sbJYRqFcicr8b18lKC0e3Ym9E m9nwlV8aYLxzn43FiDBmTJYWgMTKAVtTn8ZhMqS0cJ4DLyOT7LoxWZCtXFEqbqFNc1zq LscftfCUiUmCNn4pJ3AssCkN0xA+JSsDQyAh0cxDaQZGKrTzMy/v80ORiDA0s19o4GI9 C0+ObLgVwa3CU3rYaekFFAsG04ia8m3OY2S35hjkXv4u9K6apaLuZbcX5vFgwJS+oZA9 ZC4PF6h0cXKvhFfa0pBR/4ak5Qi3D3UQwrznhhUq0xxnk8WXESBHgi3Squs2pk3dsjCR jKfwyFptIuaALr9KbbZrseyz2wD5VgtrVGnSbkwzXX7I/qwYPwIPLb1WYpLp0oRl+RBC aCbCHOXSxDFErbXljrmFy/HLGBNxmgC5JdYpjFJWRthp/jYV+h4wEorpiysbOdTfxII/ PyS8JtdGqGkthuMxO3JpAuhqHbfQjamRBxiZXCYJ2mYaEDWOkcPvQadQzdvHpMvy57eg qNKNmZDl+Ox9IFNguzFYv7RwmN7qAW+Mny8NtAF+7sYRb2UAQuKiW6qLRbiFLNz7I5dU H+Aw4mRB+QVQO73KbgqpqNitCyb5DYCL4eEkI5C6McWr/Igz4FKQWQGhQX7HxspSlRkk zmZUbPhLueh2YlIATKB6POV8wbECkyyhkejBwxTRQYrQEy1+XqUUiZUu7JgSd5CBbA4h uxZwyd2YD7e0AMUBig60sOgxc21pZ5jrXiomrC0t4OHcwlfEjLUNG/LhiPlqlQUi9VTZ 5G5MKVpbAD5MFGXpxqSipYkWiJDdmHFXWcALZhfQT4VhwjTGVhyflYcPNv7IJ8g5Is0v BM1ME8QBztIM+EUi0xnXU40/XNtQEVzdmL9ULcibW5U/0Y3pPtX4qoy/PSTDlNDagNg2 l6+KmExUmcBTVZ6kmOlTGdh/UB0gb7w4dVBupDbUEboxEaf6hmPUdVpR9ejGfJylGfkl HFNmlsNn6ZX61I6l8SoD/8SdPW8BBtatyRSVy41qJ5g5vwOvLMU4NZmvykYrUt7dmLZS zValAqsC+LsxX6UywupGG8n7mD6yMiIT4bpxX8CVAVRQdPpGN+alLI1kw1bqNDFHZGmE Qgkj/Evau3FjwA0TLZSIYz7C0gZTURTtaQ4IYLI+fseUR3AAkT5dE6gbcx6qz/iUa422 eDM9F0ad5TMRgBlTKg6BFkbIr2VNPZfi5bUsCk6GH778ZZ1XEJ0HB2A3myg4Wk5wmGlf 2anKBm+TifDmtf7az39PZecEe1KRQqTIaFydWH2RWp5gyBfTWFYmBjmeKch3aA2cYkTE cXKBXiu77LSjjM95Citg5fhtyNp0Y9pYZQDcOmhKfQTH+0qsRsXksdKMpXrZqqv5fUBd 9jA8Li2ojW67MZmoHJztp0TsVtxvcTV8C7d+3G6xtHAApRfCnMBXAZBCupRjCklpZgCk fwuZ0t9CX1iaKPW24KYOZMzWb+GbtDRzhgL6GMLU2lTFJxvPE0E0lQ1KwtTJMceFVFgx V/hocKu9mNNRjX8HhiaiImViejGbozIww6NEgu72YjpHOXwLRa1enLqqxm+hrXBcq67G z0fIiSFiHA6lgngv5nQsjTwgf28lj84egHVoJq1dDr2Yn1JaK2FRe1q/Z6b6Yrdhx4IX 0FuweJrPGamMNaGAWWih2WUvJpuWs2ShH75hcik1BcE1GjcRK62UkA6pLzYdyDMrgbu0 BQncXiwbVX7EPnavXEjrbdV77047jaR7Maq1/Ii2NJx7MYunMoLwFV23BcgIVjvm8VQG ABeXuRi9mMlTWYAOHNAQoqhuL+bylCasozeVDwRgGJuiPXNtHyy+TGaZlOrrxWSh8hOq 8TsAGkNIW6xA9WLi0FNLJGk8QDFRChRiBlFlqEqVVcTAbldj6/ViQlFsS2QG9p5zwQf5 EE9WKUjvxdyi8lsOIaitsR16Ma+oHB5NjKA8j3qwGqDE/KKVERmQ0YsZRqWBY4Ax1IJR L+YYlQaI+GdbYOl41DyILR45JZxErvv3YjpQ+Q0DpkZ1jFsvpuksbcgqtb0Yj16Nn+Zo zJurygq9GMe8tAHUjXjkngs9B9mVSAXtxeyX6ucPIeWKvkP4h0SMq3lv224dkJyiH+kY vVp9BpP5+oF47vF9loxTTU6yF5eAyy84S4etqOch6Rj3kKnMsL3hg+SY4qx5OfwjNF/G nSp/+ig72Thx7k21xKnt1aRrbRdvftogbaWY13suGcAYayxW2XrxVjhJ/kyEbhKQtamR DzhJHkcFAKEQt9ekp/HyiBHxp8nwHtns5sG0tY4Oi3bLodnG/RQ15+aHhGcwhNpvmviY gsul2QjfHCsbeIw/oMbGznWamXi20A5yOrOmqbv4b7AjOZWYNnC6NtJGtaQXg/o3rDCV dJSi16V0GcaamBtmmMTQurf1Yu7Ahg1UyhDAja8KTUe9F6P8Nwy1gwPvxe2VNuyUOJBW MEy9mFrwxJguM9GL4dqbVth2QKfD/HAvDOSbOGZKnGYj9OgAZHSE8z++1sgGvZgsUdkw 6UL0yJHor2TwhenLysh5C5LeuLpCUgalmDXZjJ5nY7wc7sAcelQTK38W6UbtwAN7ISKm skJVhpvZ4utI6bDNCY6KxZUNunDTr5XuoxBaXFk4UHqEbFMv4ZmFsAyOxvSjAkeEBKl+ PnrDQM5am53oEC2HJ6jqEnU+LfH83GY9S6C3omVXQlJF9QXn6bWq9t0LKRUc/46eEn0c 2pH2r1mHV8g4QzBG66pa9wl7ySxBFjOxfDO62Es7KaSFYJ5oZAIjzeMwnAJ/y/+U1IHP m/xcL/Eobt74tM7uI7SjZa2dGl+ynEDI5Jpj11Ypes1sfgpqZgAB32pnMmSmbFqpRCe1 T/nRqpjkpIh57IU0ns1PeZ8/QDFV88IhNWXTyAHKQXlyqdYAQ4LKEzs4qFpNI+SobJpg Sn2siZr1QhLJd0aocwMIhrSRt0KGwaahASII8VkWElae2ICEhyZ60AsJJU9sgA46S9Fy U9MlCJ+Ym3bOoBAxzmeLv6WjHxJXNs2cJ3dcfzE4CgksNDNUbmSDqEQiFBx5Usybzwxf BhEcohrYlJlUhkev9kjgp7fRArMX8m2Wn0CpmUlyr6WoQrbNhoV3xX2JSEbn9KkCJ2Bv q5oHDle6Q82Uq+JW68/VCx/Cy89pg4/Wq3vm2Ecc4htUBEFIG1p+wjGeIUM57xGm8pYm cCkN0xs5gnvu8A3AtUHnIeqGHyjhMKGfIQFq+S00BAF0ycGGBKi1AfnOC7lPq/GHCYGN whcQhV7zbrYt+0lFJfdCXtXyA8DkIaBK5cH3QmbV0sg5hUr1dkW9kFoFI2/Aymi+BD24 vrqo9m06mU2KKw3h3gu5VPjd+wguQfWxdkR6PFPzLC+NtMCX4GGuefctbXTOEW1cA/+g nOidupC5tHKGnj54YkhK3r2wHw5XZJpcCEXKLYDyQozOamj0vBdVmFnnq1sG+/WdT8DD PogMPbilulQMxDkBGLaWOxBKlchQ2FIh4wrTVVlppeElzdREsUszdE/3WnGUVmpSFpUV INl0TxvSijBhB8k1eizBEXbegeUo29kKS2NmB+k35BTbwFyHHKYNG3fJXMR7hhymDQtq P0wuek0oBdk2TlQrYsL9kEGz/g7oZyLrImOR+iGrYtMM5PputOL+1r/6ISvhiRVd1KYf UgY2jBCkoL4w+yHvaNMIMNi30guwH3KPNk08tvEdEapjbUTXGe6Rtl5zbVUHxWAQis4w EfHNG5NRVKaugrX6hdYDbvFvNulSRF1hqu5dtDEZmsgPbITgxc1VRSs4ZA0mmbhDf7yu ECWQArZ+yJ1Zf8qbFpQx+yF5Zm2jbMirpYP7IXdm0wa6YoIpOpNywf2QQLO2Ak7WrBB7 1fZD8skTG2j3AqqOHIn0QybN2tI+2QcasKkfMl02TLTB/+qHJJe1kXdtyLv2Q4LLphHO lQXv8DT/o3az7Icclyfm2uCI90N6y9rMEPHotACHFcAgKZkUctHXdkzV+UHsntkPuTRr I5YGZUVAKwn0Q07N2swhnMy9poaHUC7k1GwYuSrYXVy7X0JazdpGO8r8/bp3e3UhHzO4 1vCm/ZBds/4QavNCYEQqavbrkonLzwCTSvSVIblm/RUkBF5D5EgrZ/ZDis3ayqnYSqwf 0mvW4w+IN9HfByHJZsOKqYzdw/ErXqsfcm02rYzKLLW48D8IJwdpaaaFWXv+NTJI87sc KHNtzmogGdU5AbkDcnmoNGuBWF1JbWWFgUULIVJIj9nYAUOUWdAJto0dXZNmXn4Rp+xh pult9EOlp43PQSu4kdiavh/SbjZtmFKbfAuHbJu1mU9ojC56ypBus7ZwZrg56ayEvJJN C/fpVOzz3A+5GBs2WknXhFSMTSPT/HHxt+aMQ1z8hg0wrKDKrrmVOuxKdQhbaRTR/0EC +FyWM+rX1TGWn2G4KLU02Q8JEXiVXAvSLcR5hmlfDgtoSRueNmQ/2O8moFdk3PdD3sNy dF2RqR/TEcrpQXt7DYjWD1tEVL++jfs05hOUv/7RWp3LF0NMJzATbFaJEp4eSMX5zMpG Cz0O+6FCUrkOKEnMi9GF5kxjjFj5AW3UO+IaZzk+9H9biJfipLdZoO79WKJ19Gq61pUr wIS6KhTfj7Hy9vsx/DHgQc1psVu//Gs7zuzY+EhT3raUQgzbNJSzRCH3y6F8nGMcuX3H PmNvXmOd42Ex0kDL/bAdRPklIHgWmQ6z6cc48vJTShNCZmqbVZoQaFgZmKHRudg8tx/D eczAO0AWWjjWMTy9tEBAlVxZjMHppYGiFT5qP8bZmAlLdELZU9Oe6Md48crCELJB0rMk RopXo+dIn16L44dojmr8B/nXh0mOcnRkz/KO3sGiHwOgzQZi7OSeDZaEKJiY4RC7WFlA mCdH7zHEujSQtcCcJZyqPpI/aMNXxBju6hNEEks/RlTb4IcMI3VPFCOqSwvpLVuZiYWK GFFdGmhh/mvAneX4AISDEqXVpmO4djX+Y671RuvHQAEbnWjzKSpFEFNtTlmkCmm9o0OA x8ss6WAzZUi7STK9/Rirbd9i6mJSZwRTiKn/Emsbwk4VcgfHfgwJt88YQDwHdW/t4okR 29X4d6nWewFFuxisXY4P+IGofNmP4c7V8JDyk6v1MQy5MqA7vBgcXA1PuP9lpk5RjHpd mmgjgxEDXksLIJuN9VMQg12XFsRSaYxyLQcf4oQ9tnGzxfDT0gi7qJR61Ximvy+Q1QP+ R1QC4XO9Pl4aWFjf2JHD/W3HSXT7oE9I14plxhhLW46eoR+Axsrvx9gLG/4syfRjHTYB KF/OZ1Cn0MqJoRRhNThyGKPFVypIS8+dGGdczg+pqldi5WInxhiXBlC1AI7jRipb7MRo WTPQSsliJ8bKlgZyypdqF/NOqNM/yzuvoaEvXQkEa4bvwdXYANxDXGOCcqGED9mJsdcb ZiYjEEo1Ak8MvV7bQF9UpsREiYCdULF9vRpGX8wnkLgUZyx8Hq6/Zh9o4LEGod0Jeyds fEorAvQ7McB1/SWH0NfW2Ps7Mb51baIdsNZODHBdmzmWYU47Mb51beIkR+peyzDtxMjW tY0B2jlXYYjEqIsTrpt28tt8pEKCd2KA66aZO8Q4amp0J4a4bpgZoryIJgR3yUibtRDX vmGnlQrRTlwB2TSDZ7d4LGPI6Xc29JWJIadrM59wYKRuI2CU78SQ07URaCYvCy7S8sew 0w07+VV+I9Ifd2LU6doIUBa6HvpODDxFm8GT9DGddnQB/50Ydrqy0AJ6difGna5MALEH LSixR8BODDtdGTF9ZPUs1sQTA7wShNaU29SZrPFY5dCdP4oUZLFhpkrnxNiRvFOZgQ5z looc8Bg4uzJxkLTRL3knBs6urJCvK99WcXJ1ZcMShkg2SGsCrxiryH/MLhHNp502hIx3 eqEm89JEK9yInVitfmnjsFj8R9Nj2omF5JcGBmiERsbCMLlofnfwMeenCuqImdCFDoJJ EVgFrHWhvkC9ggjgUWjd4GzYIBP/qLQBIz8zqh9wUD71docp/Gdz+o/lz/yyoQ9UITzu qLwa1IfSR4FHaIIlHoadIT0JGYD8FjmCxpt3i90g/SwgcYK+XjrBfCdoroCxxRp0MBdi 3RPIpGjZshHeSRCybT69HNdJUbxcIBSrE7x+AMJCd2V1R/nYATkt0NAkXWDrfBCsD9g1 Qhhly+MdDGDVOV2BaSbd8e0sPQACFgJziAp/ypyMLwEAMYQNq1XebE58DhFDj4upQJax n+wBWyCqXSVXkPCe55Au0qoWfn9Uo2MtX+cXQ/Te0Az4rb02AJjNJWQ+884pbg9AAQRR Q178tTOl9pPeCQgraOx2Bfo+FqL5RkdRKkikomYxRR9EabPbjvR3iYyNB2QnQJfnowvo 9KdCFw1qVARUF7wBVFxCBDFC86gOIhfgsCSJPURwwZ2az5QOHBZg+Fcqi65KsMm7Lzge EG3PSHfGC4jO+x0EZCfCKbR3cPTjJcAew28vIVWghVkmA/U4tr/MWjl9/qqxYYVDYofa O+zF36yuaSgkf3nxHSKECdzHAQS1uELyoPmFwkGDrSBGnNy2wUMBeHHtlwYba1woIYxt AH+hFujLBNVQ6QVG/xtsgmlxB8ES4Y3AN1jzoNuuBXeNQbp08QX0FgV6x9/l1gcD54iO FWw0HK2v+AySm6t5JmRP7DS55cGwo/SztkeDyVUYBkwUBL8TU1rmCSCSJzRBszxE8IvB Flp809IPnvHH7OAUbHctGeVugWXSUfPX4STMq3TM23xyxbC6uQkuowsXql9uxT1TsXkz vVt8m2Szgk0gBSeBytKWTweX5vAsgLKitgbuysTQhl+XXjY+E49h0QlHglbwGeMcvI0L Xitbb+3lE0CBtflwERoNQLiy+aiMhMOfjVGRHRT2Bp/A/sWBHwzIm6A3hHn26gDMQJcF TO0h6hESHHnxDR1uxJs0cK3jS6QZtI0cjZpC6ZcuuxVVYS+TgAm5hn+FJPydmuENXCHG 5nyjnKBOeOAEUeGWI6LgVgBEVONC7Pj3M2Z5mNwqlc0uD4qL3zAuHl9kVWKHvEGG6yIV 0kRmI4jFxrNMicDpOKK9McsfkVbVTkywLeD5b5Qai8X2gWcWFfY4rEe8s9m7EuZaIBZs YhCS1Dnw4PkB6HLsHVGotYrghkLSSuhlYxWmILqA+HALz5Po56IKorg0sgaDPUYik4Le sEpD8HNnlD5i59tWskskGXkt0rVaGJ0RGkFeQdi/eSSDcr5/B9PGTAEwWxQTnBcoaZXv omRyqegnblPi1zulNLkQQgMmW6Ix1eexnwfoSQ0zTsQfRvMQwlvmp304Y+NrfFjzeP6o p8xECIpblnry9yt+MEbFy0fsSh5cgBhaSUFio3kkPjo147ci7V3ivoF6GafXip/i+9P7 KSj2AZInbD87JtH2y2+0LEo4JjuxK49B23Leq2IWtDZH5ozCcSUQxxZSaoF7NplFkYvO Ux14okt0O5H0Kuze8vsMhKHqynqL3AO2XPNECv1y5DXuQP8XADMW1fmQOUWMpOqDBFsZ Dx4tq8H1C8clHFLQArOdHPgJYpDnGiuIPzlYuNsCIa7glM3fBwv3ORla+ELHKbCMLE8c /OzPyM8J5UMbNvAYn5MHzW8Ga/c5m0lj+kLOIP2cN2cj8Nt9BWOQohlHctk5LtILgW5r gwfbYTX4REmd8ZcHwdAQAAOpqm7XaLAdRghaFPkgOxzBD0Yeno3elIufFT6fDIBqLkfW OOX2q4PbqRxbAzHb2IHnhNqvdkiiucgUXd9tFr6iPYF+xM2vTwzqwdUQOyb/q/mo3AyB kxxBepE82+a/18C30QbO58rrzrxEtMMoRSklsjyuYgAonPBo3ELk7iFNHBRbVg+Hg0wW hxZBcB4BYj/4TiPlMYIIDgTxolJoYj7BDfxyHCu7Xga73xCQjEFe5xOh0yxDag+W53wi 0LOq4W42aV7Ps48Poob18MgACfVCjh9uMqotCdBuZmEDxzAGqFVVHGEQ7BUQMeP5FNgu oXRKjx5slJzKVlKxgg/bIM2b5pcgjGv+LLjXUB6DNiOCdktOINEGRtnx4quCcyMV0utZ QxsfhirhNRoTa7U2TUFwiPANjeCk1BB9QOCbMDJrI83rqnZ8gnQW8H9Q9Jcq43SnwcHP 7zKEcI03jT2ko00zg0yC9uq1uYiWrzrw3CG/DyGSMGX/SLF7zo6XPsd2XFsaMjOu9QHb 8crnNIGmA2KSMrougNAVdZ52vIY6G0tIRVaiRQMvfpd8lrB3fKcFQT5KdGprNStQBaeG Q2tBCC+HcGDgEbiz3y/+ulPw/DjuUXBq+SKOf5Jfocp2Xag2ggOK3FylGQw7B6KKiTnx cM/g5CgPLrv2g0cBfr0NbOUU0BOGQn6ty1WIfnwqtc3hqIHPvQPWXwq5LfYMbp87lCfE Ri8GRI1mmzWJdXgxmBS3EvCO+eLoWJFQxRwsV7UVMbTozWO0rbHSXJNAvnCWblneKyXR +QlHqG8JyEpb6HBfDkfpCFVg6qKWtShdg8h3yqDcAZ6z+sUXTlV+qwDP7chGl0lKp2aT 8j4BPHS++HKhKIoiggz9v5mRql58QIbeQQsgzV/GEwMS7MMsF9JUfDSG2xGCDw9i2tIL JXL7aeGRebN4LlA2kRTg6dvdo/HFyQlbpODNCeFVNcgMnjsY1VAHbcUSoeN+pFC2GiJ7 Jg03wXJoe2uilcLNbPF1JOxj+g5PryktIaxrDqrhczOcHJCBFCoyAueo4gwsc/PkMHsk RDswB9tWTGDSTUQuP5+LAyMY9ypTg5SoLg3o6DshvPgoW+Ab+HH8KNPNlkRXECZFi4Sx H6jJLbrywDNCfZZiUNIR8Lo6A1BmWdmSCiRe+IvD2lWPVz/yRNJtzK0VvJEqA2ogZx4n Hh5pESqL3GMLd/YSMNwkeSl6tuCGpry6kmewQDQ40jMAG4RNiO0dJUVmWXNegtWQAr9W xYSYZLR11Rnt8PQBk4e64/j3jYK77nLoYKuQVNtCYSlYxMXfhsl4m48RLA/TeedoMgM6 o3mCmhzLYAkoa64WASzZWDM2xINVjxgET+yeKgl0MdaL4hpEeiLAxqs1D9IHNZ1rPzdI Ljxk0xbmIdjYQoXbDnuwZvMMcDk1C+8b2wzSeV62m6HLPk2vC4ghPUK5XSGqscQSxIxz sN/Ecm90EWDYleL87vAK1ermdzIfsMFRhHC+4v9wwre9SvgAPE8IBU1BpdIfGd4HVqMD z6sdyW0vP7785Rhb6QbKyfY7PbssNJWBAH1cany9Qm8Cod60jSeLJx7+1Ps4OH/lTzss 0nuNGRowH1gG0xMvAY8gu4W8slC4IxDdPy+UB4/VAn3sjyEVxgMjz2BQdMJTXkDmDfyl kY3YLECChgXoB1SKEvCZRBmIeODF/8vQPUGg8rLEFYAJsnGhYT6jMfG2RP3Q6luHYDbj KoWMbz5KRZap7+YyABaPHcQuIb+hObJw7M/55/xC2yX+MZU9jKxKoY0bHOmHu8VX5tC0 gYPLjc2c2imo8MHmY8NsntyxZoPCh8SBt1RK4EPmaNep3EW8O32Ilc2zkaSmgSvO95MZ QMUS0EoIFYls9QDfXQ0tvS7ppv1cYGSU924Q4vP1qhQ9iZkOam5mQGQ0BRVaDntLhq8m ihJcXByZHN8STDVLyEedNk+LIcoPdDSWRsRf74NwDmwCP+LIPuK0kfke5sS8QlMSSMyp cmqWHav5iKWpg/R28U1L8tbs+/I9pLdN3gnkOzBbyE2rCt88s8FKLL7wqDaHhLG06Z25 OQD0qhbbPXo3bgOrsvChV7wpUvxgKczEFRHkaPiTrTuo9koOak2QqyibofAYnS/+Xvwn EzJudnFGB4j8GtXr+kgFUDhyKCCqKIFYA7aRjTwD34io0oRim8JDjz7Xh2+VCVMCqLz7 8ArJFkHYw+48H3fBkpqusOdP+A3jdIjT/wiQsrgI/nGF3z1mvUCiOLGeUvPDy6Ht/kia J/ptasK9qTiCLTrFcErugHhS1J7t/RbOiKrKzOszPkvVyJatrJSH+Y6TBRSjsADalCyW KR5hy3eqQTiNmkH1vqCrhDsTOseRvRUaQVZRcpS8P6JtA1k3tO8RREs5cLRr5BNquyb6 yVJnYW7F6OeiTIj7onn8zHGjw16OK7rA+AfbHZSP8vGf+aQ5VdfuhigYgpfSWm5xSqJL x9CNSq2dL7gomCgFlLUrP1pDjqv6QDvY0WzgEivYkFvrscO5jhYRo2sEzW3flfGnGG4B a1SDW1v52a3Sy38TZyraPIgXNS42HWG0e1j1lUJ/XgnR2s7Z/0lJOzFhG/xiy7OLHsvv dASCYsmTuINo3JsMOXwRlei7qQ/ICNQPpU9lgZs2Eoi9FqYF04CdICchg+oQsChSOGYv PzcJLz+uBJj5aA6ZL2Xjs4LrTxQ6WeoFNu+FfwaoFxWW8fRT28T4rt8/96N8EgY/Cpk1 5RLHGviOjAOMC0qrkNrh0nr3jmGVa7CPQX0kykGllwpwN8FVlI+V2inO23agCwZ2ppAi IpskmFRgMRW2pLXZCjwZJf4UdqBNgb/XwGREtlMDjgZOg6OqhPTAwZXDCgRgRg3BmmHc Fb5G5i/xiRZUk8kZLY20yv8JNPRgSYYcBhHugK1jRMR2EFFAPRWcd4FYH4uYkbhspOLm 5R9T9PS7BV15cBAngg5Wl0xdfxYxMBs2dd5SbvObZTkNXXwFcLcE6wzqBUtb5wkLiMKq UmwgUL8rLqC3KMDUbIq8G1Tke7uUgfeR56pJpNj8gS8d7wkxeimoYonTSXIv3OK04Lcj OKmyllyAJin0rjXbgdQOhlXx0AxmomUUEDVdtjoLxgSsSIwyo9gVLx2qQswW3zS9/QDG UIzB9Rc8HsERwRZDf1oZXxUMSxRRkSotCC2qCU7dA8ZV3kKMF6MfrEIWPHDz5W8OUr+a CyvZC1n4c86Ij8iKBzJftAJ/ECthWN58QOQ0PyHAS0bvk3Lot8Usg8iOorJj4/s3YDHH tdeSPqtFkv6JBRPQy9T0WaPnkI2rvF6ZOvNedE7nQQCKUnm2qfAZf4DBhDKNLaGPw0gy nhf4j6a9H7n+OZVfJa8fYdWt0Wr5uNBecv6Az5FSuhRanpPr8Zsb9kPyKHav8/vsw6XW wSxYrg9azRXvQE8s+DDO2CiJTBT0HdhFY6qxsiHolt2RW9sYiH3Vt7e3vt9R1eB/qOIt fDe4K7YaXIWm2cF2r4cPeBM2Px98s7lI4wPECAE/V7DnpFy4awTjKuJ4pvQZfP+0GOZ4 Xg7v1QydfzB8mADVdpM1x7UhvInmlx0phYTPP6Ig4ANUL1SeVtefDKQb0gn6jKsyO/ak dj6TyQzAncCCVZDmQUhkWRK0U1Wwg6hC+RaFNnAL7148+MLJHloLsD3rQ9EKP5jgJE8n X33G2yKBYFVx15xnz+eKT8asDMgNjjm8ixdXw7MNYpYodDb6qvrx5WZs5rbcnVD+fvRe GSlpQmZ/PLUNY9+hf9Pim5iA9FzQj4mmlW9tx1xs+hEMbxMeAGM9x/NFgnV48s1HZBrV Vmnu2sGgbAEM4TGAQydI986Fogv9uXsG/BTOwRf3X/znBjN0+/Plf84XqQshfopd6XWc PqJF2DU7kAl7gRl0F+d9zC5TvCl0PTd7urld8fK8B+ts/jbMLnEAlPIdfZmwk+hOXNj2 MUM2S2CNQoKn5zZIWS4Sad/UB/A7vxx6DzV+OS1LeqpHzC8NSF1h7db0rtBU9CBiPBdz RP7CWerz7UKTVmoIzcgl2CSV/N/i38P7REpB4U0SREarnz8BM0xAb0IH2/fFWRUvdyc4 fgL7wS64ms1OHgGrUmVf7tcohgktb7f+1fdwvdVn7An8MArVeX7Yaug3klTd1r96kdur 9o4ei9r81+995F+PlVlnZ9bAa5c/f8hI4EJqKcij5UPR5dY/AfNPeOvzx7usympdT9JH JZHAYxXcttXCujbmx5P8GokLQd+OWiXPGIQ8ipg7NJ2p+qM8KAAcWDMCwW7KJ7I0F49H zZ1ghIMWytr/8KGs7S/zR5BbutK80o4X0bIt9qeprjdPpDDKrDl5FbJAAhN4vmR5MFoV ovIMMDNyPZHU4hjyCSBphnw1LkcXPebTXQiS6Q5dNFsujJyppcNyUczLny28JIVZZ961 +ZsLubTg9fBTQM/tGs8m86c5r/F+EiWemI2Lw85RMml8+FFB3vaaNrbHxpK2j4VRNb72 OIUcZ5ophFJuoBp/eFxMsj9RnrxkTab5xGAh6yxAttASNkzcNK89oLW0R/6Up3vAHqAl 8XY6E5RecFC6nqZd2QCL/++7ZEQz+JyySKN8Td8DwktL4tAGnq2JaZHPEDMG9LFByIE3 FjtDI+AU81ruCHzS6I148wed5DioleOb73ekKXzqBOMC1STUtnG9+rgFo0J/WFGNJkHG xfIYlp0oRC0GYwlGY+MHC0Urkrl8wP4JYP2KLaTXVCwn5+61T0CYC0V0U4/zm1gB8XAL +zQ1fmd+wxa6ouq3j+Y4MmTKoaE3a87+tVKDC8ZsaJk65dF5Nq4sm+kxGp+yocRlYX7B x32foPFJxrnITPPwj0/5JVDZkgpXUFnAqDeZ2PcFZ63rpTHLkanELAQeRAS70MZGBm9T 5ABwbO/bOB8QbsG/xeHxKvDSLfbTReCxTbeLfm1kjRFp1R9/rDkj7Qhw+fS5/WqxRy8p L/EesRXkXbIs9ZwWiy9S40HudPeiKT+CHqozyK/Q3pB1aCU7RyvBOoyX16MS2ASP8E/5 AySfVeaLb61wZq038Ppo/ntxRn3MvhrXxANX8uCA/SgID+Yn3DY6SyDjJrHdmKxyXuaM mCqttO1im7MkH4vhnnkW9wA4Q2cTPFGhLinHfG5TY+wWTn8wv0DeXwitTYDqDFIBZ8lD 8yI0QU9epBJDfi4+ayKjAZXtDOSAu4wg8+Znj82/XVb9bPH1MleTFX690kvKHItHwr2L zyiI2sZt62L+s/wCmBpBLYH7yx/h/FrRZLYd5o9YMcGaFYkmkhv9WuSWZICCnwPQ6sZX 7Cph3r1IAQLSsj47nol4buIcCimQV7T77TZszkbrQiqMI7udbCMXWmazeY7Z8pfh14oP HeYB3H3Db9UvBd8GxcZV35Fdn8HhuGVbBKlx87ZPw2PknG0FeBIGRMM1r/gaxMT5XRiA g1SF0H0rqJeXH3jJuID65xBjLmgrvwovz6ph5+Lf4+t0qEwew1D34jqn+K6YEQ1++x2b dSup+m3fiwzydGhGzbbx2sDBHHBgualJ14fI5U9eveAOkLO60poNB4D274x8TK40lDje EB5evWnkfXKNriwCcINBZHA7rFYBmBaoe4oGwl25bMo8SC6GggGmlL0koc2RvaDh6mSU OI+rcyqbJtAJN33UjoKLs8rxAYq+FUoE3EDBhYjltcmBkv1bDQpLYSYvgKoD2wnsbE6+ tVRqc3CAYT8FtSmEXB7FeI6nqRjHefzWeYq+y1LHQe5tv/cAZNZeT0EC99x6z9iGNkT+ HClR4brDufc7pLSR6jPtpwTXHUVaF18rUfjBUhHkdCk5q6bpWHjzvjgDO1ptwOw1Rc8x 7OoylHG1fCn65PR5xgyjzrwOzlI1slQdInnJZ+jKHy1L9nV94RsjL76APCOymX3QjclA SxX9Se6R0efAkXBcdAEXf3a0hsSmXUnzwbs/OKng+rcwG/7GZ3lPVJz12p7nORqmDZWs tsku+VCa47LHsZY78Bg7/GC0uV3KHNKVv1/8dYd+mo+d3wsyYJpHi/Ylft5zNgEWWyp0 g+cwx9XfGv65eo55R1uV8qGtogltTvwmL0Z31sJGuhroAb0/4dBSEz+yQl2md/f1wf7h /ungZPf10Unn5M3e7ofX/K/fh83v3vz+ptM5On5zsru3f3T45vT7/8PpB/xvH/dP/Z/u Dt4c8m86u+87xx9evd/fO/r+jz++Odn/fX8vMvxq991uZ2/3/f7vRyeH+7vrv/w/0+ns //5/AQAAAP//AwBQSwMEFAAGAAgAAAAhADyHHDy7tgAAnO4EABgAAAB4bC93b3Jrc2hl ZXRzL3NoZWV0Ny54bWyMfVvPHbmR5PsC+x8EvY916l5ldHsw0sDYARaLxV6fZbXaLVhq 9UqyPbO/fqKo830nIyODNS+6MFnJPCQrKklmMH/4x3/99PHF395/+frh868/vhx+d3v5 4v2v7z7/9OHXP//48n//rz/+w/7yxddvb3/96e3Hz7++//Hlv73/+vIf//Cf/9MPf//8 5S9ff3n//tsLaPj1648vf/n27bffv3r19d0v7z+9/fq7z7+9/xWSnz9/+fT2G/775c+v vv725f3bn9pDnz6+Gm+39dWntx9+ffldw++//Ed0fP755w/v3v/z53d//fT+12/flXx5 //HtN9j/9ZcPv3190vbp3X9E3ae3X/7y19/+4d3nT79BxZ8+fPzw7d+a0pcvPr37/b/8 +dfPX97+6SN+978O89t3T7rbf0T9pw/vvnz++vnnb7+DulffDdXffLw6XkHTH3746QN+ wdntL768//nHl/80/P7NOC/7y1d/+KF10f/58P7vX8O/X3z7/Nt/ff/ztzfvP35E9fHl i///+fOn//nu7WneMGDgnv//385OR6VWeg7Unz5//sup719++vHlDW1/ff/x/buzy168 xV9/e/9d55vhHOz/18w5/w1LXj2bEv/9ZNYf2+D+9y8v/vT26/s3nz/+3w8/ffsFzcKW n97//PavH789Co/fDbdj2pZn0f/4/Pf/8v7Dn3/5hgfm381na+8+f4Rq/Pni04dzNmIQ 3v5r+/vv3zXP47OWP73/+u2PH86HX75499ev3z5/emr9rum7DnRT04G/n3Rsv5vnYb6t I2zpa3n13aDWB//89tvbP/zw5fPfX2Ceos2vv709Z/3w+wn9+e4s/CeUwp6v+P/f/jDt 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 8qkD0yU8R90Cn7bfW+LALbCSrpMTo6jSVECqEFoOkk/bwYmNNn5SKZETI8Y0CY9KUjZO 2APMF7xmUUZ0csLveprusMdCL/VI/bT9bAnVi+SWIMb06j0NWXltHs3AspRnBMYTVL1H bxkHs8MAquhV44mMoI2fXkVSd4wY02vz6M1SbQl7caSUUhRPkMhntdI73drhtXmUgqA6 YS+OYu71RFYk8tEV7qg77LVQc9fjJlRUhQcmxZhevacbmPYAU28la0skBMaYJPKRpG3Q EgZQdeE6MDMCByaJfHSZPXLCHmBqm1Nawkxov0inVJLPwexIIp9KVg6oSUdO0+9cpeiC JgdpfPTaeNQQRpiaTLUhEgIXUdL46Mpw5EQEKDd/naFmQgh6Iq1yAdQbI8J0Bc+tOZXI CJ4cRJhJ49MMCaPDW031qFIEoTGVZp0nBxxc6vH3qDuMDpvKpW5CCZZ5clCImTQ+TUsY YXaHRK7x2WbuDiLMpPFpnDA6bM6RVYkgdsfOp2Wk8dFd9qA7XMHTZAZyE8ryhy1BGh8V bRg54YCaqiqbCAf/aREljc+aND61OwygbWfliYxAniCNj2pLjFrCH2CGUPrXWxY3oe0Y 0jYV71HliJETBqi6ZbcgH5AmSOKzJolP0xt2N67NVlk6zIS6l95LqEgFsHaS+DRO2N24 nK5OJAT3BhFmkvg0Ttjd+NocYnrtnhVrhq4k8Tk/XB4MeO2ee00t4CaU0pxpgggzSXya lrC78S1oFJ6TIyGwO0jio3Ijg8nhlXm2WonCTayx+nDiKqrdoyIbIyfsbnyvb/fdhLIE Y3eQxGdNEp/aHQbQcW7dk2cE7jqodo9KaIxawgiz0XO4iZX1HCvV7jk/XM4Or8xzvNRd R0YgY5LGR09eRi1hjHnU5LhuQkffPCaIMZPGpxkTxodHc+nj1X1iEr48O4gxk8anccIY synrqyctoTHXg8nqIeXp9Iiq9DHqDgcUnaxb0KYjb32+++VvHz9+/cOHrx++/80vn798 /dPXD18/fvPl419+++3v5v/ye1W32799/fL7zz/9+dPXT59/en793fn1u+9/893zL7// zc8f/vrxf3z48tdPP/3yzd8//kUj+uWftn1bVTz2+R85/eXTX/9G375+/vm3307/JGW+ knn++h/9yb9+/vr184/dl799/PDnj1/gl/7y+fNX+ijfH/7+6ePXf/z8zc8ffv745U+f /uOjDKk//u3D31//218+ffnl6x8F++d//Pivp6Vvv/n85dPHn9RUao7ffvuz2u3Lh09f v/3mH798/OOXTz/p9/7w8S8f/vH3r7+ctv4m+H98Fv7vf/j50/n/+d8fv3z9pF94+7// 7fPPnz6eYLn0+s/5b6ff3//m85///N/Pf9/3/+nDjz//19+f//Pbf/n048dfvvnnj//+ zf/8/OOHn/7zP3/+8uOHv397fpzm83/97jffvf/tw8yvFv//zfzx//4f9eOHb86/+ONp 7s2r79zJ7/7985f/dQ6l7/+fAAAAAP//AwBQSwMEFAAGAAgAAAAhAPUoIf4QAwAAogcA ABgAAAB4bC93b3Jrc2hlZXRzL3NoZWV0Ni54bWyMlc1u2zAMgO8D9g6CDjut8U/S5me2 izZBsR5WBG23nRVbjoValiYpSdu32bPsxUbJiWOnLtAcYosUP5IiRUeXz7xEW6o0E1WM g4GPEa1SkbFqHeOfjzdnE4y0IVVGSlHRGL9QjS+Tz5+inVBPuqDUICBUOsaFMXLmeTot KCd6ICStQJMLxYmBpVp7WipKMmfESy/0/QuPE1bhmjBTH2GIPGcpXYh0w2llaoiiJTEQ vy6Y1AcaTz+C40Q9beRZKrgExIqVzLw4KEY8nd2uK6HIqoS8n4MRSQ9st3iD5yxVQovc DADn1YG+zXnqTT0gJVHGIAN77EjRPMZXwew6CLGXRO6AfjG606139CoEf0iJjSUIoErN +s6ecLmX2qqshHiy5rdZjH1wpGlJU3s+iMBjS+e0hO3zwFb2j/Nt38Gx13huvx+iuHGV XCq0IprORfmbZaYAtxBLRnOyKc1ROB0E/nQ4Pm9U92L3nbJ1YcBgNBhZb6koAQ3/iDPb enDi5Nk9d3vyaDAchv4wCM9ddLWBi3FBDEkiJXYImgYstSS2BYNZCPmmVngFUnCmYb1N huNh5G0hqXSvve5qR43WA2YDDnvBIG3A55MTblsJ+fdzh71ckLYCvjgBd7XjfvCoFwzS Fvg04q522g+GQvYcMUiP4Il/EnFXG/SDL3rBIG2BwxNwV3usbKd2wTtdYcUx7tTwmLPr nGtr2nL/TnPAXe1tOyuOcTfGYx/sPXTaZHKsdZ1CfQ/rHpdkTX8QtWaVRiXNIS5/MJ6M R9PWDy6yqu9Wr84I6Sb7eThufmCyEsYI3qcpYEpTuEO9tFwI854SbrWN94GajUSSSKoe 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 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvNNNb4IwGAfw+5J9B9I7tqCoGMAo aHbYYYkv964UaQZt01Y3suy7r8jQ67IZb33L//f0SRvNP+rKOVGlmeAx8AYIOJQTkTN+ iMFuu3anwNEG8xxXgtMYNFSDefL4EL0oIakyjGrHRnAdg9IYOYNQk5LWWA/sNrc7hVA1 NnaqDlAUBSM0E+RYU26gj9AYkqM2onblJQ50ebOT+WtkLkhbnd5vG2nLTaKf8MYpasPy GHxmQZplAQpcfxWmroe8pRsOw4mLpgj5Sz9dh4vVF3Bke9gHDse1vfpCyn3XKBt5MrNK vmujEm88QEOEInhdimAv/tMe9rbt2YaSo2Km6XA2SjrSDm7GjXruyTZOVYy/6bTE/EDz Dn0VokoKXGl6vu15ejM86PHn1t3JrciwoXeAxz28IbiiqX05d0AnF7TEqv0SvzPh9dsl 3wAAAP//AwBQSwECLQAUAAYACAAAACEAEXw4saMBAABSCQAAEwAAAAAAAAAAAAAAAAAA AAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQATXr5lAgEAAN8CAAAL AAAAAAAAAAAAAAAAANwDAABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQDZ9W0MSAEA ACoHAAAaAAAAAAAAAAAAAAAAAA8HAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc1BL AQItABQABgAIAAAAIQBmtABXiAQAANMSAAAPAAAAAAAAAAAAAAAAAJcJAAB4bC93b3Jr Ym9vay54bWxQSwECLQAUAAYACAAAACEASY3ZlhIHAADlJAAAGAAAAAAAAAAAAAAAAABM DgAAeGwvd29ya3NoZWV0cy9zaGVldDQueG1sUEsBAi0AFAAGAAgAAAAhAM0ZapVbAgAA kAQAABgAAAAAAAAAAAAAAAAAlBUAAHhsL3dvcmtzaGVldHMvc2hlZXQyLnhtbFBLAQIt ABQABgAIAAAAIQAcT4R9kgIAAGsFAAAYAAAAAAAAAAAAAAAAACUYAAB4bC93b3Jrc2hl ZXRzL3NoZWV0My54bWxQSwECLQAUAAYACAAAACEA8ALxB40RAABZWgAAGAAAAAAAAAAA AAAAAADtGgAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sUEsBAi0AFAAGAAgAAAAhAMD0 tNtaAwAAvgoAAA0AAAAAAAAAAAAAAAAAsCwAAHhsL3N0eWxlcy54bWxQSwECLQAUAAYA CAAAACEAmTdQYvp4AAA9mgMAFAAAAAAAAAAAAAAAAAA1MAAAeGwvc2hhcmVkU3RyaW5n cy54bWxQSwECLQAUAAYACAAAACEAPIccPLu2AACc7gQAGAAAAAAAAAAAAAAAAABhqQAA eGwvd29ya3NoZWV0cy9zaGVldDcueG1sUEsBAi0AFAAGAAgAAAAhAPUoIf4QAwAAogcA ABgAAAAAAAAAAAAAAAAAUmABAHhsL3dvcmtzaGVldHMvc2hlZXQ2LnhtbFBLAQItABQA BgAIAAAAIQDomIuQMAQAAKkPAAAYAAAAAAAAAAAAAAAAAJhjAQB4bC93b3Jrc2hlZXRz L3NoZWV0NS54bWxQSwECLQAUAAYACAAAACEAg01syFYHAADIIAAAEwAAAAAAAAAAAAAA AAD+ZwEAeGwvdGhlbWUvdGhlbWUxLnhtbFBLAQItABQABgAIAAAAIQCbDnVwMwIAABoG AAAiAAAAAAAAAAAAAAAAAIVvAQB4bC9leHRlcm5hbExpbmtzL2V4dGVybmFsTGluazEu eG1sUEsBAi0AFAAGAAgAAAAhAOtVZAkoAQAAuQEAAC0AAAAAAAAAAAAAAAAA+HEBAHhs L2V4dGVybmFsTGlua3MvX3JlbHMvZXh0ZXJuYWxMaW5rMS54bWwucmVsc1BLAQItABQA BgAIAAAAIQCkUOtsnQIAABEMAAAQAAAAAAAAAAAAAAAAAGtzAQBkb2NQcm9wcy9hcHAu eG1sUEsBAi0AFAAGAAgAAAAhAIfrYBuIAQAA7AIAABEAAAAAAAAAAAAAAAAAPncBAGRv Y1Byb3BzL2NvcmUueG1sUEsBAi0AFAAGAAgAAAAhAAjb/vxvAQAAtwYAABAAAAAAAAAA AAAAAAAA/XkBAHhsL2NhbGNDaGFpbi54bWxQSwECLQAUAAYACAAAACEANTSeh08BAAC8 AwAAEwAAAAAAAAAAAAAAAACaewEAZG9jUHJvcHMvY3VzdG9tLnhtbFBLBQYAAAAAFAAU AE4FAAAifgEAAAA='
    }
    // Create a server object with options
    var client = new rpc.Client(options);
    client.call(
      { "method": "call", "params": params_auth },
      function (err, res) {
          // Did it all work ?
          if (err) { console.log(err); }
          else { console.log(res); }
      }
    );

}

console.log("Running at Port 9099 Ok");
