module.exports = {
	nr_cards:{
		white:221,
		black:122
	},
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
		"/": {
			path: "\\..\\..\\..\\client/HomePage.html",
			type: "text/html"
		},
		"/lobbies.html": {
			path: "\\..\\..\\..\\client\\lobbies.html",
			type: "text/html"
		},
		"/assets/css/lobby.css": {
			path: "/../../../client/assets/css/lobby.css",
			type: "text/css"
		},
		"/assets/css/account.css": {
			path: "/../../../client/assets/css/account.css",
			type: "text/css"
		},
		"/assets/css/forms.css": {
			path: "/../../../client/assets/css/forms.css",
			type: "text/css"
		},
		"/auth/google/assets/css/forms.css": {
			path: "/../../../client/auth/google/assets/css/forms.css",
			type: "text/css"
		},
		"/auth/google/forms.html": {
			path: "/../../../client/auth/google/forms.html",
			type: "text/html"
		},
		"/auth/google/script.js": {
			path: "\\..\\..\\..\\client/auth/google/script.js",
			type: "text/javascript"
		},
		"/assets/css/room.css": {
			path: "/../../../client/assets/css/room.css",
			type: "text/css"
		},
		"/assets/css/purecookie.css": {
			path: "/../../../client/assets/css/purecookie.css",
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
		"/account": {
			path: "\\..\\..\\..\\client/account.html",
			type: "text/html"
		},
		"/confirm_account": {
			path: "\\..\\..\\..\\client/confirm_account.html",
			type: "text/html"
		},
		"/assets/css/home.css": {
			path: "/../../../client/assets/css/home.css",
			type: "text/css"
		},
		"/assets/js/purecookie.js": {
			path: "\\..\\..\\..\\client/assets/js/purecookie.js",
			type: "text/javascript"
		},
		"/home.js": {
			path: "\\..\\..\\..\\client/home.js",
			type: "text/javascript"
		},
		"/loginRequest.js": {
			path: "\\..\\..\\..\\client/loginRequest.js",
			type: "text/javascript"
		},
		"/registerRequest.js": {
			path: "\\..\\..\\..\\client/registerRequest.js",
			type: "text/javascript"
		},
		"/sendActivationCode.js": {
			path: "\\..\\..\\..\\client/sendActivationCode.js",
			type: "text/javascript"
		},
		"/sendResetRequest.js": {
			path: "\\..\\..\\..\\client/sendResetRequest.js",
			type: "text/javascript"
		},
		"/validate_register_input.js": {
			path: "\\..\\..\\..\\client/validate_register_input.js",
			type: "text/javascript"
		},
		"/waitingRoom": {
			path: "\\..\\..\\..\\client/waitingRoom.html",
			type: "text/html"
		},
		"/waitingRoom.css": {
			path: "\\..\\..\\..\\client/waitingRoom.css",
			type: "text/css"
		}
	},
	require_auth : false, // false doar pt testare
};