const config = require("../../config"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	user = require("../../database/user"),
	generate = require("../../utils/generate"),
	encode = require("../../utils/encode");
f_header = "[routes/auth/register.js]";

module.exports = function (app) {
	app.post("/auth/login", async (req, res) => {
		try {
			if (!req.body.username || typeof req.body.username !== "string") throw `No username provided !`;
			if (!req.body.password || typeof req.body.password !== "string") throw `No password provided !`;
            
            //md5 encode the password
			let password = encode.md5(req.body.password);
			
			/** check if the user with that password exists in the database */
			if (await user.check_login_info(req.body.username,password)==false) throw `You got the username or password wrong !`;
		   
			//generate cookie session
			let cookie_session = "";
			while (cookie_session.length < 10) {
				// The chances that the same cookie to be generated twice is around ~ 1 to 1.531.653.719
				cookie_session = generate.unique(req.body.username, 32);
				//Check presence of the cookie in the database
				if (!await user.session_is_unique(cookie_session)) {
					cookie_session = "";
				}
			}
            
			let session = {
				value: cookie_session,
				expire: Date.now() + 1000 * 60 * 60 * 24 * 1, // 1 days
			};

			user.session = session;

			let response = {
				sucess: true,
				session: cookie_session,
			};
            
			res.status(200).send(response);
		} catch (e) {
			
			res.status(401).send({ sucess: false, reason: e });
		}
	});
};
