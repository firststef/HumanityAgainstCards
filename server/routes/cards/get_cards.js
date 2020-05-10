const
      get_cards = require("../../database/get_cards"),
      index     = require("../../utils/random_indexes");

module.exports = function (app, secured) {

    app.get("/get_black_card",
            secured,
            async (req, res) => {
                try {
                    let id = index.black_index();
                    let black_card = await get_cards.get_black_cards(id);

                    while ( black_card[0] === undefined ) {
                        id = index.black_index();
                        black_card = await get_cards.get_black_cards(id);
                    }

                    res.status(200).send({ success: true, card: black_card[0] });
                } catch (e) {
                    res.status(417).send({ success: false, error: e.message });
                }
            });

    app.get("/get_white_cards/:nr",
            secured,
            async (req, res) => {
                try {

                    if ( !req.params.nr ) throw `No number provided !`;
                    let indexes = Array();
                    let aux;
                    let numar = parseInt(req.params.nr);

                    while ( indexes.length < numar ) {

                        aux = await get_cards.get_white_cards(index.white_index(indexes)).catch((e) => {
                            console.error(e.message);
                        });

                        if ( aux!== false && aux.length!==0)
                            indexes.push(aux[0]);
                    }

                    res.status(200).send({ success: true, cards: indexes });
                } catch (e) {
                    res.status(417).send({ success: false, error: e.message });
                }
            });
};
