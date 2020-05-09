const
	user = require("../../database/user"),
	generate = require("../../utils/generate"),
	encode = require("../../utils/encode");


module.exports = function (app) {
	app.post("/auth/login", async (req, res) => {
		try {
			if (!req.body.username || typeof req.body.username !== "string"|| req.body.username ==="" ) throw `No username provided !`;
			if (!req.body.password || typeof req.body.password !== "string"||req.body.password==="") throw `No password provided !`;
			

            //md5 encode the password
			let password = encode.md5(req.body.password);
			
			/** check if the user with that password exists in the database */
			if (await user.check_login_info(req.body.username,password)===false) throw `You got the username or password wrong !`;
		   
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
            

			//let old_session=await user.get_old_session(req.body.username,password);
			
			if(false===await user.session_update_login(req.body.username,password,cookie_session)) throw "Error at updateing the session !";

			let response = {
				success: true,
				session: cookie_session,
			};
            
			res.status(200).send(response);
		} catch (e) {
			
			res.status(401).send({ success: false, reason: e });
		}
	});
};
