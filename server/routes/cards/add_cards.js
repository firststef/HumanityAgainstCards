const config = require("../../config"),
  color = require("../../colors"),
  log = require("../../utils/log"),
  upload_cards = require("../../database/upload_cards"),
  f_header = "[routes/cards/add_cards.js]";

module.exports = function(app) {
  app.post("/add_black_cards", async (req, res) => {
    if (req.body.cards && req.body.cards.length > 0 ) {
        let status = await upload_cards.post_black_cards(req.body.cards);
        res.status(200).send(status);
    } else {
      res.status(500).send({ err: "No black cards provided", sent_body: req.body });
    }
  });
  app.post("/add_white_cards", async (req, res) => {
    if (req.body.cards && req.body.cards.length > 0 ) {
        let status = await upload_cards.post_white_cards(req.body.cards);
        res.status(200).send(status);
    } else {
      res.status(500).send({ err: "No white cards provided", sent_body: req.body });
    }
  });
};
