const config = require("../../config"),
  color = require("../../colors"),
  log = require("../../utils/log"),
  get_cards = require("../../database/get_cards"),
  f_header = "[routes/cards/get_cards.js]";

module.exports = function (app, secured) {
  app.get("/get_black_card/:id", secured, async (req, res) => {
    try {
      if (!req.params.id) throw `No id provided !`;
      let card = await get_cards.get_black_cards(req.params.id);
      res.status(200).send(card);
    } catch (e) {
      res.status(417).send({ err: e });
    }
  });
  app.get("/get_white_card/:id", secured, async (req, res) => {
    try {
      if (!req.params.id) throw `No id provided !`;
      let card = await get_cards.get_white_cards(req.params.id);
      res.status(200).send(card);
    } catch (e) {
      res.staus(417).send({ err: e });
    }
  });
};
