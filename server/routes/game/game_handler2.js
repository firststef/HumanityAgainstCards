const config = require("../../config"),
	database = require("../../utils/database"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	engine = require("../../../client/gameclient/library");
    f_header = "[routes/game/game_handler.js]";

    var game_manager = new engine.GameManager(2, 0, [0, 1]);

    module.exports = function (app) {
        app.post("/game_manager/response", async (req, res) => {
            try {
                if (!req.body) throw "No provided header data !";
                let response;
                if (req.body.header === 'get_id'){
                    if (this.SID === undefined){ //TEMPORARY SID, this will be available on the client side
                        this.SID = 0;
                    }
                    response = {header: 'sent_id', id: this.SID++};
                }
                else{
                    response = await game_manager.response(req.body);
                }
                if (response === "error") throw `Ackward client error thrown "${response}"`;
                res.status(200).send({  success: true, data: response });
            } catch (e) {
                res.status(417).send({ success: false, err: e });
            }
        });
    };
    