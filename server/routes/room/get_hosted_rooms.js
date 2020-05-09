const config = require("../../config"),
    room = require("../../database/room"),
    user=require("../../database/user"),
f_header = "[routes/room/get_hosted_room.js]";

module.exports = function (app) {
	app.get("/get_hosted_rooms", async (req, res) => {
		try {
             
            let username= await user.get_user_id(req.headers.session);
            
            let rooms = await room.get_rooms_for_host(username[0].username);
			if(false===rooms) throw "internal error";

			var room_ids=Array();
			for (var key in rooms) {
                room_ids.push(rooms[key].id);
			}

			res.status(200).send({success:true, rooms:room_ids});
		} catch (e) {
			console.log(e);
			res.status(401).send({ success: false, reason: e });
		}
	});
};