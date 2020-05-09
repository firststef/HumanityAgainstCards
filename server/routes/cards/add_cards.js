const config       = require("../../config"),
      color        = require("../../colors"),
      log          = require("../../utils/log"),
      insert_cards = require("../../database/insert_cards"),
      count_cards  = require("../../database/count_cards"),
      f_header     = "[routes/cards/add_cards.js]";

module.exports = function (app) {
	/**
	 * Add black cards to database
	 */
    app.post("/add_black_cards",
             async (req, res) => {
                 if ( req.body.cards && req.body.cards.length > 0 ) {
                     try {
                         //Count the black_cards currently in the database
                         let count = await count_cards.black_cards();
                         if ( !count ) {
                             count = 0;
                         }

                         //Add id's to each cards
                         let cards = req.body.cards;
                         cards.map((card, index) => {
                             cards[index]._id = count++;
                         });

                         let status = await insert_cards.post_black_cards(cards);
                         res.status(200).send(status);
                     } catch (e) {
                         res.status(500).send({ err: e, sent_body: req.body });
                     }
                 } else {
                     res.status(500).send({ err: "No black cards provided", sent_body: req.body });
                 }
             });
	/**
	 * Add white cards to database
	 */
	app.post("/add_white_cards",
             async (req, res) => {
                 if ( req.body.cards && req.body.cards.length > 0 ) {
                     try {
                         //Count the black_cards currently in the database
                         let count = await count_cards.white_cards();
                         if ( !count ) {
                             count = 0;
                         }

                         //Add id's to each cards
                         let cards = req.body.cards;
                         cards.map((card, index) => {
                             cards[index] = {
                                 _id: count++,
                                 text: card
                             };
                         });

                         let status = await insert_cards.post_white_cards(cards);
                         res.status(200).send(status);
                     } catch (e) {
                         res.status(500).send({ err: e, sent_body: req.body });
                     }
                 } else {
                     res.status(500).send({ err: "No white cards provided", sent_body: req.body });
                 }
             });
};
