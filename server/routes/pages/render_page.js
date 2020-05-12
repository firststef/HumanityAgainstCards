const fs    = require('fs').promises,
      array = require("../../config.js"),
      path  = require("path");

module.exports = function (app) { // add the secured middleware on the propper requests
    for (let key in array.pages) {
        let route = JSON.parse(JSON.stringify(key));

        app.get(route,
                (req, res) => {
                    fs.readFile(path.join(__dirname,
                                          array.pages[route].path))
                        .then(contents => {
                            res.setHeader("Content-Type",
                                          array.pages[route].type);

                            res.writeHead(200);

                            res.end(contents);
                        })
                        .catch(err => {
                            console.log("error " + err);

                            res.writeHead(500);

                            res.end(err);
                        });
                });
    }
};