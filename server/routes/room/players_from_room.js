const config = require("../../config"),
	room = require("../../database/room"),
f_header = "[routes/room/payers_from_room.js]";

module.exports = function (app) {
	app.get("/players_from_room", async (req, res) => {
		try {
             if(!req.body.roomID) throw "No roomID provided."

            let players=Array();
            let player_object=await room.get_players(req.body.roomID);
				 for(var key2 in player_object){
					if (player_object.hasOwnProperty(key2)) {
						players.push(player_object[key2].user_id);
				   }
				 }
			

			res.status(200).send({success:true, players:players});
		} catch (e) {
			
			res.status(401).send({ success: false, reason: e });
		}
	});
};
