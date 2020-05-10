const config = require("../../config"),
	room = require("../../database/room"),
	user=require("../../database/user"),
f_header = "[routes/room/payers_from_room.js]";

module.exports = function (app) {
	app.get("/players_from_room", async (req, res) => {
		try {
             if(!req.headers.roomid) throw "No roomID provided."

            let players=Array();
            let player_object=await room.get_players_from_room(parseInt(req.headers.roomid));
            console.log(player_object);
				 for(var key2 in player_object){
				 	console.log(player_object[key2].user_id);
					if (player_object.hasOwnProperty(key2)) {
						let aux=await user.get_user_id(player_object[key2].user_id);
						console.log(aux);
						players.push(aux);
				   }
				 }
			

			res.status(200).send({success:true, players:players});
		} catch (e) {
			
			res.status(401).send({ success: false, reason: e });
		}
	});
};
