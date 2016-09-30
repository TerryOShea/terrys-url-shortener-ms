const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const MongoClient = require('mongodb').MongoClient;

var currNum = 999;

function numGen() {
    currNum++;
    return String(currNum);
};

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

MongoClient.connect('mongodb://terryoshea:pojkentalarinte@ds047146.mlab.com:47146/url-shortener', (err, db) => {
	if (err) return console.log(err)
	
	app.get('/', function(req, res) {
        var fileName = path.join(__dirname, 'index.html');
        res.sendFile(fileName, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
        });
    });
    
    app.get('/:short', function(req, res) {
        var shortUrl = req.params.short

        db.collection('urls').findOne({
            short_url: process.env.APP_URL + shortUrl
        }, function(err, entry) {
            if (err) throw err;
            if (entry) {
                res.redirect(entry.long_url)
            }
            else {
                res.send('That shortened URL is not in our database!');
            }
        })
    });
	
	app.post('/new_short', function(req, res) {
        var longUrl = req.body.url;
        
        db.collection('urls').findOne({
            long_url: longUrl
        }, function(err, entry) {
            if (err) throw err;
            if (entry) {
                res.send({
                    long_url: entry.long_url, 
                    short_url: entry.short_url
                })
            }
            else {
                if (validUrl.isWebUri(longUrl) != undefined) {
                    var urlInfo = {
                        long_url: longUrl, 
                        short_url: process.env.APP_URL + numGen()
                    };
                    res.json(urlInfo);
                    db.collection('urls').save(urlInfo, (err, result) => {
    		            if (err) return console.log(err);
                    })
                }
                else {
                    res.json({
                        error: 'Wrong URL format!'
                    });
                }
            }
        });
	});
	
	app.listen(process.env.PORT || 3500, () => {
		console.log('listening on 3500');
	});
});