const config = require("../../config"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	user = require("../../database/user"),
	generate = require("../../utils/generate"),
	encode = require("../../utils/encode");
f_header = "[routes/auth/register.js]";

module.exports = function (app) {
	app.post("/auth/register", async (req, res) => {
		try {
			if (!req.body.username || typeof req.body.username !== "string") throw `No username provided !`;
			if (!req.body.password || typeof req.body.password !== "string") throw `No password provided !`;
			if (!(req.body.password.match(/[A-Z]/) && req.body.password.match(/[0-9]/) && req.body.password.length > 5))
				throw `The password must be at least 5 characters long, and it must contain an uppercase character, and a number !`;
			if (!req.body.email || typeof req.body.email !== "string") throw `No email provided !`;
			if (!req.body.email.match(/\w{1,}@\w{1,}(\.\w{1,}){1,}/)) throw `Invalid email !`;
			if (!req.body.nickname || typeof req.body.nickname !== "string") throw `No nickname provided !`;

			/**First check if the user exists in the database */
			if (await user.check_presence(req.body.username, req.body.email)) throw `User allready registered !`;
			//md5 encode the password
			let password = encode.md5(req.body.password);
			//build the request object to ensure that no other data can be inserted to the database

			let user_obj = {
				username: req.body.username,
				password: password,
				email: req.body.email,
				nickname: req.body.nickname,
			};

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
				expire: Date.now() + 1000 * 60 * 60 * 24 * 1, // 3 days
			};

			user_obj.session = session;

			//try to launch the data in the db
			let ok = await user.register(user_obj);
			
			if (!ok) throw `An internal error occured while attempting to access the database !`;

			let response = {
				sucess: true,
				username: req.body.username,
				session: cookie_session,
			};

			res.status(200).send(response);
		} catch (e) {
			res.status(401).send({ sucess: false, reason: e });
		}
	});
};
