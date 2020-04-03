module.exports = {
	database: {
		endpoint: "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority", //db endpoint
		db: "HumanityAgainstCards", // clusters storage
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
};