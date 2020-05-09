const config = require("../../config"),
	room = require("../../database/room"),
f_header = "[routes/room/return_room.js]";

module.exports = function (app) {
	app.get("/get_rooms", async (req, res) => {
		try {
             
            var rooms = await room.get_all_rooms();
			if(false==rooms) throw "internal error";

			var player_object=[];
			for (var key in rooms) {
				 player_object=await room.get_players(rooms[key].id);
				 rooms[key].players=[];
				 for(var key2 in player_object){
					if (player_object.hasOwnProperty(key2)) {
						rooms[key].players.push(player_object[key2].user_id);
				   }
				 }
			}

			res.status(200).send({success:true, rooms:rooms});
		} catch (e) {
			
			res.status(401).send({ success: false, reason: e });
		}
	});
};
