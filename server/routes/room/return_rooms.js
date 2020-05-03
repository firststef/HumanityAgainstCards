const config = require("../../config"),
	room = require("../../database/room"),
f_header = "[routes/room/return_room.js]";

module.exports = function (app) {
	app.get("/get_rooms",  async (req, res) => {
		try {
             
            var rooms = await room.get_all_rooms();
            if(false==rooms) throw "internal error";

			res.status(200).send({succes:true, rooms:rooms});
		} catch (e) {
			
			res.status(401).send({ sucess: false, reason: e });
		}
	});
};
