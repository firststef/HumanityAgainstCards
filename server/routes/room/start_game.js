const room   = require("../../database/room"),
    user=require("../../database/user"),
    engine = require('../../gamecore/gamemanager'),
    map = require("./../../map");

module.exports = function (app, secured) {
    /**
     * Start a game in room with id = roomID send in body.roomID
     */
    app.post("/start_game",
             async (req, res) => {
                 try {
                     if ( !req.body.roomID ) throw "No roomId provided !";

                     if ( !await room.room_exist(parseInt(req.body.roomID)) ) throw "Room does not exist!";

                     if ( await room.is_host_to_room(parseInt(req.body.roomID), req.headers.session) === false ) throw "You are not host to this room!";

                     let playerList = await room.get_players_from_room(parseInt(req.body.roomID));
                     // console.log(playerList);

                     if ( playerList.length === 0 )
                         throw "Room cannot have 0 players";

                     let players = Array();

                     for (let i = 0; i < playerList.length; i++) {
                         let playerObject={
                             sid:playerList[i].user_id
                         };

                         let user_name = await user.get_user_id(playerList[i].user_id);
                         if(user_name!==false){
                             playerObject.username=user_name[0].username;
                             players.push(playerObject);
                         }
                         else throw "Internl error";
                     }

                     let game_manager = new engine.GameManager(players, 0);

                     map.RoomMap.set(parseInt(req.body.roomID), game_manager);

                     await room.game_start(parseInt(req.body.roomID));

                     res.status(200).send({ success: true });
                 } catch (e) {
                     res.status(401).send({ success: false, reason: e });
                 }
             });
};
