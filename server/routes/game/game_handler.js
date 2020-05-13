const config   = require("../../config"),
      database = require("../../utils/database"),
      color    = require("../../colors"),
      log      = require("../../utils/log"),
      engine   = require("../../../client/gamecore/library");
f_header = "[routes/game/game_handler.js]";

/**<h2>Game_manager route</h2>
 * <h4>Suported method : "GET"</h4>
 * <h4>Requests :</h4>
 * <ol>
 *  <li><strong>/game_manager/new_id</strong> calls newId from the .gameManager class</li>
 *  <li><strong>/game_manager/response</strong> requires a field called <strong>data</strong> inside the headers and calls <strong>.response</strong> from the gameManager class
 * </ol>
 */
var game_manager = new engine.GameManager();

/**<h2>Game_client route</h2>
 * <h4>Suported method : "GET"</h4>
 * <h4>Requests :</h4>
 * <ol>
 *  <li><strong>/game_client/new</strong>
 *      <br> Requires a <strong>token</strong> field inside the headers and creates a new instance of the Game manager class
 *      <br> The same token cannot be provide twice !
 *      <br> To destroy a game instance call <strong>/game_client/destroy</strong>
 *  </li>
 *  <li><strong>/game_client/destroy</strong>
 *  <br> Requires a token fielkd inside the headers
 *  <br> Destroy's the GameManager Instance
 *  </li>
 *  <li><strong>/game_client/update</strong>
 *  <br> Requires a data field in the headers
 *  </li>
 *  <li><strong>/game_client/get_necesary_data</strong>
 *  <br>Requires a game_client token fiend in the headers
 *  </li>
 *  <li><strong>/game_client/put_data</strong>
 *  <br> Requires a game_client token and a data field in the headers
 *  </li>
 * </ol>  */
var game_client = {}; //initialized trough request

module.exports = function (app) {
    //**+++++++++++++++++++++++++++++++++++++++++++++++++Game manager */
    app.get("/game_manager/new_id",
            async (req, res) => {
                try {
                    let id = await game_manager.newId(); //asuming it might be asyncronous at some point
                    res.status(200).send({ id: id });
                } catch (e) {
                    res.status(417).send({ err: e });
                }
            });
    app.get("/game_manager/response",
            async (req, res) => {
                try {
                    if ( !req.headers.data ) throw "No provided header data !";

                    let response = await game_manager.response(req.headers.data);

                    if ( response === "error" ) throw `Ackward client error thrown "${ response }"`;

                    res.status(200).send({ success: true, data: req.headers.data, response: response });
                } catch (e) {
                    res.status(417).send({ success: true, err: e });
                }
            });
    //**-------------------------------------------------Game manager */

    //**+++++++++++++++++++++++++++++++++++++++++++++++++Game client */
    app.get("/game_client/new",
            async (req, res) => {
                try {
                    if ( !req.headers.token ) throw `No game token provided!`;
                    if ( Object.keys(game_client)
                        .indexOf(req.headers.token) !== -1 ) throw `Token "${ req.headers.token }" allready registered ! Use /game_client/destroy to destroy a given token!`;

                    game_client[token] = new engine.GameClient(req.headers.token);

                    res.status(200).send({ success: true, token: req.headers.token });
                } catch (e) {
                    res.status(417).send({ success: false, err: e });
                }
            });

    app.get("/game_client/destroy",
            async (req, res) => {
                try {
                    if ( !req.headers.token ) throw `No game token provided!`;
                    if ( Object.keys(game_client)
                        .indexOf(req.headers.token) == -1 ) throw `The provided token "${ req.headers.token }" was not previously registered !`;

                    delete game_client[token];
                    res.status(200).send({ success: true, token: req.headers.token });
                } catch (e) {
                    res.status(417).send({ success: false, err: e });
                }
            });
    app.get("/game_client/update",
            async (req, res) => {
                try {
                    if ( !req.headers.token ) throw `No game token provided!`;
                    if ( !req.headers.data ) throw `No data field provided!`;
                    if ( Object.keys(game_client)
                        .indexOf(req.headers.token) == -1 ) throw `The provided token "${ req.headers.token }" was not previously registered !`;
                    await game_client[req.headers.token].update(req.headers.data);
                    res.status(200).send({ success: true, token: req.headers.token, data: req.headers.data });
                } catch (e) {
                    res.status(417).send({ success: false, err: e });
                }
            });
    app.get("/game_client/get_necesary_data",
            async (req, res) => {
                try {
                    if ( !req.headers.token ) throw `No game token provided!`;
                    if ( Object.keys(game_client)
                        .indexOf(req.headers.token) == -1 ) throw `The provided token "${ req.headers.token }" was not previously registered !`;
                    let data = await game_client[req.headers.token].getNecessaryData();
                    if ( data === "error" ) throw `Ackward client error thrown "${ data }"`;
                    res.status(200).send({ success: true, token: req.headers.token, response: data });
                } catch (e) {
                    res.status(417).send({ success: false, err: e });
                }
            });
    app.get("/game_client/put_data",
            async (req, res) => {
                try {
                    if ( !req.headers.token ) throw `No game token provided!`;
                    if ( !req.headers.data ) throw `No data field provided!`;
                    if ( Object.keys(game_client)
                        .indexOf(req.headers.token) == -1 ) throw `The provided token "${ req.headers.token }" was not previously registered !`;

                    let data = await game_client[req.headers.token].putData(req.headers.data);
                    if ( data === "error" ) throw `Ackward client error thrown "${ data }"`;

                    res.status(200).send({ success: true, token: req.headers.token, response: data });
                } catch (e) {
                    res.status(417).send({ success: false, err: e });
                }
            });
    //**-------------------------------------------------Game client */
};
