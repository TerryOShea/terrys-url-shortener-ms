var express = require('express');
var app = express();
var path = require('path');
var validUrl = require('valid-url');

app.get('/', function(req, res) {
    var fileName = path.join(__dirname, 'index.html');
    res.sendFile(fileName, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});

var shortened;
var longurl;

app.get('/:item', function(req, res) {
    var item = req.params.item;
    if (item == shortened) {
        res.redirect(longurl);
    }
    else if (validUrl.isWebUri(item) != undefined) {
        res.json({
            original_url: item
        });
        longurl = item;
        shortened = (Math.floor(Math.random()*1000) + 1).toString();
        /*res.json({
            original_url: item,
            //short_url: 'https://terrys-url-shortener.herokuapp.com/' + shortened
        });*/
    }
    else {
        res.json({
            error: 'Wrong URL format!'
        });
    }
});

app.listen(process.env.PORT || 3500);