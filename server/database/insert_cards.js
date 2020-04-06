const config = require("../config"),
	database = require("../utils/database"),
	color = require("../colors"),
	log = require("../utils/log"),
	filter = require("../utils/filter"),
	f_header = "[database/upload_cards.js]";

module.exports = {
	post_black_cards: (cards) =>
		new Promise((resolve, reject) => {
			let db = database.get_db();
			if (!cards[0]._id) {
				reject({ err: `Please provide an id for the given cards !` });
				return;
			}
			//filter the naughty cards out
			cards = filter.filter_bad_words(cards);
			db.db("HumansAgainstCards")
				.collection("black_cards")
				.insertMany(cards, (err) => {
					console.log(4);
					if (err) {
						console.log(log.date_now() + f_header, color.red, "Error while inserting data !\n", color.white, err);
						reject({ err: err });
					} else {
						console.log(log.date_now() + f_header, color.green, "Black cards inserted ! !\n");
						resolve({ msg: "Inserted" });
					}
				});
		}),
	post_white_cards: (cards) =>
		new Promise((resolve, reject) => {
			let db = database.get_db();

			if (!cards[0]._id) {
				reject({ err: `Please provide an id for the given cards !` });
				return;
			}

			//filter the naughty cards out
			cards = filter.filter_bad_words(cards);

			db.db("HumansAgainstCards")
				.collection("white_cards")
				.insertMany(cards, (err) => {
					if (err) {
						console.log(log.date_now() + f_header, color.red, "Error while inserting data !\n", color.white, err);
						reject({ err: err });
					} else {
						console.log(log.date_now() + f_header, color.green, "Black cards inserted ! !\n");
						resolve({ msg: "Inserted" });
					}
				});
		}),
};
