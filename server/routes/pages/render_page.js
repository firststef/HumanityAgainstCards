const fs = require('fs').promises;
const array = require("../../config.js");
path = require("path");

module.exports = function (app) { // add the secured middleware on the propper requests
    for (var key in array.pages) {
        let route = JSON.parse(JSON.stringify(key));

        app.get(route, (req, res) => {

            //console.log(array.pages[key].path+" si "+array.pages[key].type+" -" + key+"-");

            fs.readFile(path.join(__dirname, array.pages[route].path))
                .then(contents => {
                    // console.log("home.html");
                    res.setHeader("Content-Type", array.pages[route].type);
                    res.writeHead(200);
                    res.end(contents);
                })
                .catch(err => {
                    console.log("error " + err);
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
        })
    }
};