const config = require("../../config"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	upload_cards = require("../../database/insert_cards"),
	load_cards = require("../../database/load_cards"),
	f_header = "[routes/cards/add_cards.js]";

module.exports = function (app) {
	app.get("/get_black_card/:id", async (req, res) => {
		try {
			const card = await load_cards.load_black_cards(req.params.id);
			res.json(card);
		} catch (err) {
			res.json({ message: err.message });
		}
	});
	app.get("/get_white_card/:id", async (req, res) => {
		try {
			const card = await load_cards.load_white_cards(req.params.id);
			res.json(card);
		} catch (err) {
			res.json({ message: err.message });
		}
	});
};
