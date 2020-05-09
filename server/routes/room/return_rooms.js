const config   = require("../../config"),
      room     = require("../../database/room"),
      f_header = "[routes/room/return_room.js]";

module.exports = function (app) {
    app.get("/get_rooms",
            async (req, res) => {
                try {
                    let rooms = await room.get_all_rooms();
                    let player_object = [];

                    if ( rooms === false ) throw "internal error";

                    for (let key in rooms) {
                        player_object = await room.get_players(rooms[key].id);
                        rooms[key].players = [];

                        for (let key2 in player_object) {
                            if ( player_object.hasOwnProperty(key2) ) {
                                rooms[key].players.push(player_object[key2].user_id);
                            }
                        }
                    }

                    res.status(200).send({ success: true, rooms: rooms });
                } catch (e) {
                    res.status(401).send({ success: false, reason: e });
                }
            });
};
