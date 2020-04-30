
const fs = require('fs').promises;
path = require("path");

module.exports = function (app) {
   // app.use(express.static(path.join(__dirname, 'public')));
    app.get("/home",  (req, res) => {

        fs.readFile(path.join(__dirname ,"/../../../client/HomePage.html"), "utf8")
        .then(contents => {
           // console.log("home.html");
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });


    }),
    app.get("/assets/css/home.css",  (req, res) => {

        fs.readFile(path.join(__dirname ,"/../../../client/assets/css/home.css"), "utf8")
        .then(contents => {
            //console.log("home.css");
            res.setHeader("Content-Type", "text/css");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });


    }),
    app.post("/lobbies.html",  (req, res) => {

        fs.readFile(__dirname +"\\..\\..\\..\\client\\lobbies.html")
        .then(contents => {
           // console.log("file read lobbies.html");
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });


    }),
    app.get("/assets/css/lobby.css",  (req, res) => {
        //console.log(" lobby.css");
        fs.readFile(path.join(__dirname ,"/../../../client/assets/css/lobby.css"), "utf8")
        .then(contents => {
            console.log("file read  lobby.css");
            res.setHeader("Content-Type", "text/css");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });


    }),
    app.get("/assets/css/room.css",  (req, res) => {

        fs.readFile(path.join(__dirname ,"/../../../client/assets/css/room.css"), "utf8")
        .then(contents => {
           // console.log("file read ");
            res.setHeader("Content-Type", "text/css");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });


    }),
    app.get("/login-register.html",  (req, res) => {

        fs.readFile(__dirname +"\\..\\..\\..\\client\\login-register.html")
        .then(contents => {
           // console.log("file read ");
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });
    }),

    app.get("/assets/css/login-register.css",  (req, res) => {

            fs.readFile(path.join(__dirname ,"/../../../client/assets/css/login-register.css"), "utf8")
            .then(contents => {
               // console.log("file read ");
                res.setHeader("Content-Type", "text/css");
                res.writeHead(200);
                res.end(contents);
            })
            .catch(err => {
                console.log("error "+err);
                res.writeHead(500);
                res.end(err);
                return;
            });
    
    }),
    app.get("/assets/img/icon-facebook.png",  (req, res) => {

        fs.readFile(path.join(__dirname ,"/../../../client/assets/img/icon-facebook.png"))
        .then(contents => {
            //console.log("file read ");
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });

    }),
    app.get("/assets/img/icon-google.png",  (req, res) => {

        fs.readFile(path.join(__dirname ,"/../../../client/assets/img/icon-google.png"))
        .then(contents => {
            //console.log("file read ");
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });

    }),
    app.get("/gameroom.html",  (req, res) => {

        fs.readFile(__dirname +"\\..\\..\\..\\client\\gameroom.html")
        .then(contents => {
            //console.log("file read ");
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });
    }),
    app.get("/gameroom/src/styles/game.css",  (req, res) => {

        fs.readFile(__dirname +"/../../../client/gameroom/src/styles/game.css")
        .then(contents => {
           // console.log("file read ");
            res.setHeader("Content-Type", "text/css");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            console.log("error "+err);
            res.writeHead(500);
            res.end(err);
            return;
        });


    })
};