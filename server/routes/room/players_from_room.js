const
	room = require("../../database/room"),
	user=require("../../database/user");

module.exports = function (app) {
	app.get("/players_from_room/:roomID", async (req, res) => {
		try {
               if(!req.params.roomID) throw "No roomID provided.";

				let player_object=await room.get_players_from_room(parseInt(req.params.roomID));
				console.log(player_object);

				let players=Array();
				for(var key2 in player_object){
					if (player_object.hasOwnProperty(key2)) {
						let username= await user.get_user_id(player_object[key2].user_id);
						players.push(username[0].username);
					}
				}

			res.status(200).send({success:true, players:players});
		} catch (e) {
			
			res.status(401).send({ success: false, reason: e });
		}
	});
};
