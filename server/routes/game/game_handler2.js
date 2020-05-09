const config = require("../../config"),
    database = require("../../utils/database"),
    color = require("../../colors"),
    log = require("../../utils/log"),
    engine = require("../../../client/gamecore/library"),
    f_header = "[routes/game/game_handler.js]";

module.exports = function (app,secured) {
    app.post("/game_manager", secured, async (req, res) => {
        try {
            if (!req.body) throw "No provided header data !";

            //get game_manager by roomID

            let response = game_manager.response(req.body);
            if (response.error !== undefined)
                throw `Awkward client error thrown "${response}"`;
            res.status(200).send(JSON.stringify({  success: true, data: response }));
        } catch (e) {
            console.log(JSON.stringify({ success: false, err: e }));
            res.status(417).send(JSON.stringify({ success: false, err: e }));
        }
    });
};
    