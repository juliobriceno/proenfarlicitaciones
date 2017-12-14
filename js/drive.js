var googleapis = require('googleapis');
var drive = googleapis.drive('v3');
var fs = require('fs');

module.exports = {
    findFolder: function(nombre, parent, auth, pageToken, pageFn, callback){
        var query = "mimeType='application/vnd.google-apps.folder' and name='" + nombre + "'";
        query = query + " and '" + parent + "' in parents";
        console.log(query);
        drive.files.list({
            auth: auth,
            q: query,
            fields: 'nextPageToken, files(id, name, parents)',
            spaces: 'drive',
            pageToken: pageToken
        }, function(err, res) {
            if(err) {
                callback(err);
            } else {
                res.files.forEach(function(file) {
                    console.log('Found file: ', file.name, file.id);
                });
                if (res.nextPageToken) {
                    console.log("Page token", res.nextPageToken);
                    pageFn(res.nextPageToken, pageFn, callback);
                } else {
                    callback(null, res.files);
                }
            }
        });
    },
    createFolder: function(auth, nombre, parent, callback){
        findFolder(nombre,parent,auth,null,findFolder,function(err, files){
            if(err){
                callback(err);
            } else {
                if(files.length === 0){
                    var fileMetadata = {
                        'name' : nombre,
                        'mimeType' : 'application/vnd.google-apps.folder',
                        parents: [ parent ]
                    };
                    console.log("console.log(parent)");
                    console.log(parent);
                    drive.files.create({
                        auth: auth,
                        resource: fileMetadata,
                        fields: 'id, parents'
                    }, function(err, file) {
                        if(err) {
                            // Handle error
                            console.log(err);
                            callback(err);
                        } else {
                            console.log('Folder Id: ', file.id);
                            console.log('Folder Parents: ', file.parents);
                            callback(null, file.id);
                        }
                    });
                }
                else {
                    console.log("Encontrada la carpeta");
                    callback(null, files[0].id);
                }
            }
        })
    },
    insertFile: function(auth, path, file, callback, parent){
        var fileMetadata = {
            'name': file.originalname,
            parents: [parent]
        };
        var media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(path)
        };
        drive.files.create({
            auth: auth,
            resource: fileMetadata,
            media: media,
            fields: 'id, webContentLink'
        }, function(err, file) {
            if(err) {
                console.log(err);
            } else {
                console.log('File Id: ', file.id);
                console.log('weblink: ', file.webContentLink);
                callback(file.id);
            }
        });
    },
    downloadFile: function(auth, idFile, dest){
        drive.files.get({
            auth: auth,
            fileId: idFile,
            alt: 'media',
        })
        .on('end', function() {
            console.log('Done');
        })
        .on('error', function(err) {
            console.log('Error during download', err);
        })
        .pipe(dest);
    }
}

var findFolder = function(nombre, parent, auth, pageToken, pageFn, callback){
        var query = "mimeType='application/vnd.google-apps.folder' and name='" + nombre + "'";
        query = query + " and '" + parent + "' in parents";
        console.log(query);
        drive.files.list({
            auth: auth,
            q: query,
            fields: 'nextPageToken, files(id, name, parents)',
            spaces: 'drive',
            pageToken: pageToken
        }, function(err, res) {
            if(err) {
                callback(err);
            } else {
                res.files.forEach(function(file) {
                    console.log('Found file: ', file.name, file.id);
                });
                if (res.nextPageToken) {
                    console.log("Page token", res.nextPageToken);
                    pageFn(res.nextPageToken, pageFn, callback);
                } else {
                    callback(null, res.files);
                }
            }
        });
    }