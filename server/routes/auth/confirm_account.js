const config = require("../../config"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	user = require("../../database/user"),
	generate = require("../../utils/generate"),
	f_header = "[routes/auth/confirm_account.js]";

module.exports = function (app) {
	app.post("/confirm_account/:username/:code", async (req, res) => {
		/**Search credentials in db
		 * If that suceeds delete the entry and store it in the user db
		 * return cookie session
		 */
		try {
            let user_obj = await user.confirm_account(req.params.username, req.params.code);
            if(!user_obj) throw "Invalid signup code !"
            delete user_obj.code;

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
				expire: Date.now() + 1000 * 60 * 60 * 24 * 1, // 1 day
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

		} catch(e){
            res.status(401).send({ sucess: false, reason: e });
        }
	});
};
