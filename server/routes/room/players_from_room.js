const
    room = require("../../database/room"),
    user = require("../../database/user");

module.exports = function (app, secured) {
    /**
     * Gets all the players from a certain room
     */
    app.get("/players_from_room/:roomID",
            async (req, res) => {
                try {
                    if ( !req.params.roomID ) throw "No roomID provided.";

                    let players = Array();

                    let player_objects = await room.get_players_from_room(parseInt(req.params.roomID));
                    console.log(player_objects);
                    for (let player_obj of player_objects) {
                        let aux = await user.get_user_id(player_obj.user_id);
                        if(aux!==false)
                        players.push(aux[0].username);
                    }

                    res.status(200).send({ success: true, players: players });
                } catch (e) {
                    res.status(401).send({ success: false, reason: e });
                }
            });
};
