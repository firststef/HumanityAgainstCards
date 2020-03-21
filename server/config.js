module.exports = {
	database: {
		endpoint: "", //db endpoint
		db: "", // clusters storage
		user: "", // User preferences document
		c_rules: "", // cluster rules documnet
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
