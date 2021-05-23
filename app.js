let request = require('native-request');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
const fs = require('fs');
const fileName = 'dictionary.csv';
const delayTime = 500;

function processFile(inputFile) {
    var delay = 0;  
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);
    
    rl.on('line', function (key) {
        delay += delayTime;    
        setTimeout(() => {
            let url = 'https://tureng.com/tr/turkce-ingilizce/' + key;
            request.get(url, function(err, data) {
            if (err) {
                 throw err;
            }
            let startIndex = data.indexOf('<table', 0);
            let endIndex = data.indexOf('</table>', startIndex)
            let content = data.substring(startIndex, endIndex+8);

            var doc = new dom().parseFromString(content,'text/xml');
            let enWord = xpath.select("string(//table/tr[4]/td[3]/a)", doc);
            let type = xpath.select("string(//table/tr[4]/td[3]/i)", doc);
            let trWord = xpath.select("string(//table/tr[4]/td[4])", doc);


            fs.appendFileSync(fileName, type + ';' + enWord + ';'+ trWord + ";\r\n");
            console.log(type,':',enWord,':',trWord);
            });

        }, 100+delay);    

        return;
        
    });
}

processFile('keys.txt');
