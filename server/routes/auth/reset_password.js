const config = require("../../config"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	user = require("../../database/user"),
	generate = require("../../utils/generate"),
	encode = require("../../utils/encode");
	mongoose = require("mongoose");
f_header = "[routes/auth/register.js]";

module.exports = function (app) {
	app.post("/auth/reset_password/:id", async (req, res) => {
		try {
            if (!req.body.new_password || typeof req.body.new_password !== "string") throw `No new password provided !`;
            if (!(req.body.new_password.match(/[A-Z]/) && req.body.new_password.match(/[0-9]/) && req.body.new_password.length > 5))
                throw `The password must be at least 5 characters long, and it must contain an uppercase character, and a number !`;
			if (!req.body.confirm_new_password || typeof req.body.confirm_new_password !== "string") throw `No confirm new password provided !`;
			if (!req.params.id) throw `No id provided !`;
			
			
            if(req.body.new_password !== req.body.confirm_new_password) throw `Passwords do not match !`;

			//md5 encode the password
			let password = encode.md5(req.body.new_password);
			var id = mongoose.Types.ObjectId(req.params.id);
			//Change the password in database
			let ok = await user.reset_password(id, password);
			
			if (!ok) throw `An internal error occured while attempting to access the database !`;

			let response = {
				sucess: true
			};

			res.status(200).send(response);
		} catch (e) {
			res.status(401).send({ sucess: false, reason: e });
		}
	});
};
