const config = require("../config"),
  database = require("../utils/database"),
  color = require("../colors"),
  log = require("../utils/log"),
  filter = require("../utils/filter"),
  f_header = "[database/upload_cards.js]";
  var mongo = require('mongodb');
module.exports = {
  load_black_cards: id =>
    new Promise((resolve, reject) => {
      //defined a new nameless function that returns a prommise
      
      let db = database.get_db();
      var o_id = new mongo.ObjectID(id);
      var query={"_id": o_id};
      console.log(id);
      console.log("urmeaza executa queryului");
      db.db("HumansAgainstCards").collection("Black_Cards").find(query)
      .toArray(function(err, result) {
          if (err) {
            console.log(
              log.date_now() + f_header,
              color.red,
              "Error while extracting data !\n",
              color.white,
              err
            );
            reject({ err: err });
          } else {
            console.log(
              log.date_now() + f_header,
              color.green,
              "Black cards loaded ! !\n", result
            );
            resolve(result);
          }
        });
    }),
    load_white_cards: id =>
    new Promise((resolve, reject) => {
      //defined a new nameless function that returns a prommise
      
      let db = database.get_db();
      var o_id = new mongo.ObjectID(id);
      var query={"_id": o_id};
      console.log(id);
      console.log("urmeaza executa queryului");
      db.db("HumansAgainstCards").collection("White_Cards").find(query)
      .toArray(function(err, result) {
          if (err) {
            console.log(
              log.date_now() + f_header,
              color.red,
              "Error while extracting data !\n",
              color.white,
              err
            );
            reject({ err: err });
          } else {
            console.log(
              log.date_now() + f_header,
              color.green,
              "Black cards loaded ! !\n", result
            );
            resolve(result);
          }
        });
    })

};
