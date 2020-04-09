const config = require("../config"),
	database = require("../utils/database"),
	color = require("../colors"),
	log = require("../utils/log"),
	filter = require("../utils/filter"),
	f_header = "[database/upload_cards.js]";

module.exports = {
	/**
	 * Inserts an array of cards into the database
	 * @param {Array}[cards] An array of cards
	 */
	post_black_cards: (cards) =>
		new Promise((resolve, reject) => {
			let db = database.get_db();
			if (cards[0]._id === undefined) {
				reject({ err: `Please provide an id for the given cards !` });
				return;
			}
			//filter the naughty cards out
			cards = filter.filter_bad_words(cards);
			db.db("HumansAgainstCards")
				.collection("black_cards")
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
	/**
	 * Inserts an array of cards into the database
	 * @param {Array}[cards] An array of cards
	 */
	post_white_cards: (cards) =>
		new Promise((resolve, reject) => {
			let db = database.get_db();
			if (cards[0]._id === undefined) {
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
