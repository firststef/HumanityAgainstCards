const config = require("../../config"),
	database = require("../../utils/database"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	engine = require("../../../client/gameclient/library");
    f_header = "[routes/game/game_handler.js]";

    var game_manager = new engine.GameManager();

    module.exports = function (app) {
        app.post("/game_manager/response", async (req, res) => {
            try {
                if (!req.body) throw "No provided header data !";
                let response = await game_manager.response(req.body);
                if (response === "error") throw `Ackward client error thrown "${response}"`;
                res.status(200).send({  msg: `Sucess !`, data: req.body, response: response });
            } catch (e) {
                res.status(417).send({ err: e });
            }
        });
    };
    