const config = require("../../config"),
  get_cards = require("../../database/get_cards"),
  index=require("../../utils/random_indexes"),
  f_header = "[routes/cards/get_cards.js]";


module.exports = function (app, secured) {

  app.get("/get_black_card", secured, async (req, res) => {
    try {

        let id=index.black_index();
        let bcard= await get_cards.get_black_cards(id);

        while(bcard[0]===undefined)
        {
          id=index.black_index();
          bcard= await get_cards.get_black_cards(id);
        }
        
        res.status(200).send({succes:true, card:bcard[0]});
    } catch (e) {
      res.status(417).send({ succes:false, error: e.message });
    }
  });

  app.get("/get_white_cards", secured, async (req, res) => {
    try {

      if (!req.body.nr) throw `No number provided !`;
      let indexes= Array();
      var aux;
      var numar= parseInt(req.body.nr);
      
      while(indexes.length<numar){
      
        aux= await get_cards.get_white_cards(index.white_index(indexes)).catch((e) => {
          console.error(e.message);
        });

        if( aux[0]._id!=undefined)
          indexes.push(aux[0]);

      }

      res.status(200).send({succes:true, cards: indexes});
    } catch (e) {
      res.staus(417).send({ succes:false, error: e.message });
    }
  });
};
