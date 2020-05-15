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
                        if( await user.session_verify(room_obj.host) === false) {
                            await room.delete_room(room_obj.id);
                            await room.delete_current_user_rooms(room_obj.id);
                            const index = rooms.indexOf(room_obj);
                            rooms.splice(index, 1);
                            continue;
                        }

                        player_array = await room.get_players_from_room(room_obj.id);

                        room_obj.players = [];

                        for (let player of player_array) {
                            let users = await user.get_user_id(player.user_id);

                            if ( users.length === 0 || users === false)
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
