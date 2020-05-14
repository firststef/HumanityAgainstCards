const config   = require("../../config"),
      room     = require("../../database/room"),
      user     = require("../../database/user"),
      f_header = "[routes/room/return_room.js]";

module.exports = function (app, secured) {
    /**
     * Gets all existing rooms
     */
    app.get("/get_rooms",secured,
            async (req, res) => {
                try {

                    let rooms = await room.get_all_rooms();

                    if ( rooms === false ) throw "internal error";

                    let player_array = [];

                    for (let room_obj of rooms) {
                        player_array = await room.get_players_from_room(room_obj.id);

                        room_obj.players = [];

                        for (let player of player_array) {
                            let users = await user.get_user_id(player.user_id);

                            if ( users.length === 0 )
                                continue;
                            room_obj.players.push(users[0].username);
                        }
                    }

                    res.status(200).send({ success: true, rooms: rooms });
                } catch (e) {

                    res.status(401).send({ success: false, reason: e });
                }
            });
};
