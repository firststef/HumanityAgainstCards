const config = require("../../config"),
	room = require("../../database/room"),
	user=require("../../database/user"),
f_header = "[routes/room/return_room.js]";

module.exports = function (app) {
	app.get("/get_rooms", async (req, res) => {
		try {
             
            var rooms = await room.get_all_rooms();
			if(false===rooms) throw "internal error";

			var player_object=[];
			for (var key in rooms) {
				 player_object=await room.get_players_from_room(rooms[key].id);
				 console.log(player_object);
				 rooms[key].players=[];
				 for(var key2 in player_object){
					if (player_object.hasOwnProperty(key2)) {
						let username=await user.get_user_id(player_object[key2].user_id);

						rooms[key].players.push(username[0].username);
				   }
				 }
			}

			res.status(200).send({success:true, rooms:rooms});
		} catch (e) {
			
			res.status(401).send({ success: false, reason: e });
		}
	});
};
