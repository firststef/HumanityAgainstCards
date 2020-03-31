module.exports = {
	database: {
		endpoint: "mongodb+srv://fluffypanda:thefluffa5@humansagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority", //db endpoint
		db: "HumansAgainstCards", // clusters storage
	},
	server: {
		port: 8080,
		endpoint: "localhost",
		protocol: "http",
	},
	console: {
		timestamp: true,
		colors: true,
    },
    routes          : {
        //Stores external routes
    },
};