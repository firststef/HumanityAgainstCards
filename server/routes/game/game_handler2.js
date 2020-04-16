const config = require("../../config"),
	database = require("../../utils/database"),
	color = require("../../colors"),
	log = require("../../utils/log"),
    engine = require("../../../client/gameclient/library");
    user = require("../../database/user");
    generate = require("../../utils/generate");
    f_header = "[routes/game/game_handler.js]";

    var game_manager = new engine.GameManager(2, 0, [0, 1]);

    module.exports = function (app) {
        app.post("/game_manager/response", async (req, res) => {
            try {
                if(!req.body.session) throw "No session provided!";
                let cookie_session = "";
                while (cookie_session.length < 10) {
                    cookie_session = generate.unique(req.body.username, 32);
                    if (!await user.session_is_unique(cookie_session)) {
                        cookie_session = "";
                    }
                }
                if(await user.session_verify(req.body.session) == false) throw "No session found!";
                else {
                    let new_value = cookie_session;
                    if(await user.session_update(req.body.session, new_value) == false) throw "No session updated";
                }

                if (!req.body) throw "No provided header data !";
                let response;
                if (req.body.header === 'get_id'){
                    if (this.SID === undefined){ //TEMPORARY SID, this will be available on the client side
                        this.SID = 0;
                    }
                    response = {header: 'sent_id', id: this.SID++};
                }
                else {
                    response = await game_manager.response(req.body);
                }
                if (response === "error") throw `Ackward client error thrown "${response}"`;
                res.status(200).send(JSON.stringify({  success: true, session: cookie_session, data: response }));
            } catch (e) {
                res.status(417).send(JSON.stringify({ success: false, session: cookie_session, err: e }));
            }
        });
    };
    