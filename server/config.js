module.exports = {
	database: {
		endpoint: "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority", //db endpoint
		db: "HumanityAgainstCards", // clusters storage
	},
	email : {
		user : "pfluffy955@gmail.com",
		pass : "thefluffa5"
	},
	server: {
		port: 8081,
		endpoint: "localhost",
		protocol: "http",
	},
	console: {
		timestamp: true,
		colors: true,
    },
    routes: {
        //Stores external routes
	},
	account: {
		temp_lifetime : 1000*60*30, // 30m
		cleaner_interval : 1000*60*15 // 15m
	}
	,
	pages: {
		"/lobbies.html": {
			path: "\\..\\..\\..\\client\\lobbies.html",
			type: "text/html"
		},
		"/assets/css/lobby.css": {
			path: "/../../../client/assets/css/lobby.css",
			type: "text/css"
		},
		"/assets/css/room.css": {
			path: "/../../../client/assets/css/room.css",
			type: "text/css"
		},
		"/login-register.html": {
			path:"\\..\\..\\..\\client\\login-register.html",
			type: "text/html"
		},
		"/assets/css/login-register.css": {
			path: "/../../../client/assets/css/login-register.css",
			type: "text/css"
		},
		"/assets/img/icon-facebook.png": {
			path: "/../../../client/assets/img/icon-facebook.png",
			type: "text/png"
		},
		"/assets/img/icon-google.png": {
			path: "/../../../client/assets/img/icon-google.png",
			type: "text/png"
		},
		"/home": {
			path: "\\..\\..\\..\\client/HomePage.html",
			type: "text/html"
		},
		"/assets/css/home.css": {
			path: "/../../../client/assets/css/home.css",
			type: "text/css"
		},
		"/home.js": {
			path: "\\..\\..\\..\\client/home.js",
			type: "text/javascript"
		}
	},
	require_auth : false, // false doar pt testare
};