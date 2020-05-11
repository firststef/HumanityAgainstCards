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
		user : "cardsgainsthumanity@gmail.com",
		pass : "catplatesti"
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
	},
	require_auth : false, // false doar pt testare
};