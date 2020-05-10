const engine   = require("../../../client/gamecore/library"),
      room     = require("../../database/room"),
      user     = require("../../database/user"),
      generate = require("../../utils/generate"),
      f_header = "[routes/room/rooms.js]";

module.exports = function (app) {
    app.post("/end_game",
             async (req, res) => {
                 try {
                     if ( !req.body.roomID ) throw "No roomId provided !";

                     let username = await user.get_user_id(req.headers.session);

                     if ( username.length === 0 ) throw "Session not registered";

                     let players = await room.get_players_from_room(req.body.roomID);

                     if ( !await room.delete_current_user_rooms(parseInt(req.body.roomID)) )
                         throw `A problem occurred when deleting room ${req.body.roomID} from current user rooms!`;

                     if( !await room.delete_room(parseInt(req.body.roomID)))
                         throw `A problem occurred when deleting room ${req.body.roomID} from rooms!`;

                     for (let i = 0; i < players.length; i++) {
                         if ( await user.increase_games_played(players[i].user_id) )
                             throw "Internal error!";
                         if( players[i].user_id === username[0].session.value )
                             if ( await user.increase_games_won(players[i].user_id) )
                                 throw "Internal error!";
                     }

                     res.status(200).send({ success: true });
                 } catch (e) {
                     console.log(e.message + " in " + f_header);
                     console.log(e + " in " + f_header);
                     res.status(401).send({ success: false, reason: e });
                 }
             });
};