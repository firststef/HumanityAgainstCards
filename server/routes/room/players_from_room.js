const config = require("../../config"),
	room = require("../../database/room"),
	user=require("../../database/user"),
	f_header = "[routes/room/payers_from_room.js]";

module.exports = function (app) {
	app.get("/players_from_room/:roomID", async (req, res) => {
		try {
             if(!req.params.roomID) throw "No roomID provided."

            let players=Array();
            let player_objects=await room.get_players_from_room(parseInt(req.params.roomID));
			 for(let player_obj of player_objects){
				let aux=await user.get_user_id(player_obj.user_id);
				//console.log(aux);
				players.push(aux[0].username);
			 }

			res.status(200).send({success:true, players:players});
		} catch (e) {
			res.status(401).send({ success: false, reason: e });
		}
	});
};
