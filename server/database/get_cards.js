const config   = require("../config"),
      database = require("../utils/database"),
      color    = require("../colors"),
      log      = require("../utils/log"),
      filter   = require("../utils/filter"),
      f_header = "[database/upload_cards.js]";

module.exports = {
    /**
     * Gets a specific card from the database
     * @param {string}[id] An array of cards
     */
    get_black_cards: (id) =>
        new Promise((resolve, reject) => {
            let connection = database.get_db();

            connection.db("HumansAgainstCards")
                .collection("black_cards")
                .find({ _id: id })
                .toArray(function (err, result) {
                    if ( err ) {
                        console.log(log.date_now() + f_header,
                                    color.red,
                                    "Error while extracting data !\n",
                                    color.white,
                                    err);
                        reject({ err: err });
                    } else {
                        if ( result !== null && result.length !== 0 )
                            resolve(result);
                        else
                            resolve(false);
                    }
                });
        }),
    /**
     * Gets a specific card from the database
     * @param {string}[id] An array of cards
     */
    get_white_cards: (id) =>
        new Promise((resolve, reject) => {
            let connection = database.get_db();

            connection.db("HumansAgainstCards")
                .collection("white_cards")
                .find({ _id: id })
                .toArray(function (err, result) {
                    if ( err ) {
                        console.log(log.date_now() + f_header,
                                    color.red,
                                    "Error while extracting data !\n",
                                    color.white,
                                    err);
                        reject({ err: err });
                    } else {
                        resolve(result);
                    }
                });
        })
};
