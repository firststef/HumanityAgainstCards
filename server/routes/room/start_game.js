const room     = require("../../database/room"),
    engine = require('../../../client/gamecore/gamemanager')
    map      = require("./../../map");

module.exports = function (app) {
    app.post("/start_game",
             async (req, res) => {
                 try {
                     if ( !req.body.roomID ) throw "No roomId provided !";

                     if ( !await room.room_exist(parseInt(req.body.roomID)) ) throw "Room does not exist!";

                     if ( await room.is_host_to_room(parseInt(req.body.roomID),
                         req.headers.session) === false ) throw "You are not host to this room!";

                     let playerList = await room.get_players_from_room(parseInt(req.body.roomID));
                     if (playerList.length === 0)
                        throw "Room cannot have 0 players";

                     let playerIDList = Array();
                     for (let i = 0; i < playerList.length; i++) {
                         playerIDList.push(playerList[i].user_id);
                     }

                     let game_manager = new engine.GameManager(playerIDList.length,0,playerIDList);
                     
                     map.RoomMap.set(parseInt(req.body.roomID),game_manager);

                     await room.game_start(parseInt(req.body.roomID));

                     res.status(200).send({ success: true });
                 } catch (e) {
                     res.status(401).send({ success: false, reason: e });
                 }
             });
};
