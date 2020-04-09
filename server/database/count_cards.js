const config = require("../config"),
	database = require("../utils/database"),
	color = require("../colors"),
	log = require("../utils/log"),
	f_header = "[database/upload_cards.js]";

module.exports = {
	black_cards: () => {
		new Promise((resolve, reject) => {
			let db = database.get_db();

			db.db("HumansAgainstCards")
				.collection("black_cards")
				.countDocuments((err, data) => {
					if (err) {
						console.log(log.date_now() + f_header, color.red, "Error while counting data !\n", color.white, err);
						reject(err);
					} else {
						resolve(data);
					}
				});
		});
	},
	white_cards: () => {
		new Promise((resolve, reject) => {
            let db = database.get_db();
            
			db.db("HumansAgainstCards")
            .collection("white_cards")
            .countDocuments((err, data) => {
                if (err) {
					console.log(log.date_now() + f_header, color.red, "Error while counting data !\n", color.white, err);
					reject(err);
                } else {
                    resolve(data);
                }
            });
		});
	},
};
