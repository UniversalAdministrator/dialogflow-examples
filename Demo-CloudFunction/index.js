const fileName = 'DemoING-TableExample.xlsx';
const gcsBucket = 'leeboonstra-demo';
 
const excelToJson = require('convert-excel-to-json');
const Storage = require('@google-cloud/storage');

// Creates a client
const gcs = new Storage();

Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
}

exports.index = function main(req, res) {

    const os = require('os');
    const path = require('path');
    const bucket = gcs.bucket("leeboonstra-think");
    const file = bucket.file(fileName);
  
    // the name is shown correctly in the console
    console.log(file.name);
  
    const tempLocalFile = path.join(os.tmpdir(), fileName);
    const tempLocalDir = path.dirname(tempLocalFile);
  
    console.log(tempLocalFile);

    file.download({ destination: tempLocalFile })
    .then(() => {
        console.log("file downloaded succesfully");
        console.log(tempLocalFile);

        const result = excelToJson({
            sourceFile: tempLocalFile,
            omitEmtpyFields: false
        });

        var array = result.Sheet1;
        
        //get number
        console.log('!');
        console.log(req.query.color);
        console.log(req.query.category);
        

        var y = req.query[Object.keys(req.query)[0]];
        var x = req.query[Object.keys(req.query)[1]];
        
        console.log(y, x);
        //get answer
        var answer = array[y][x];


        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(answer);

    })
    .catch(err => {
        console.log(err);
        res.status(400).send(err)
    });

};

