const config = require("../../config"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	user = require("../../database/user"),
	generate = require("../../utils/generate"),
    encode = require("../../utils/encode");
	const {google} = require('googleapis');  
f_header = "[routes/auth/GoogleAuth.js]";

module.exports = function (app) {
	app.post("/auth/GoogleAuth", async (req, res) => {
		try {
			const googleConfig = {
				clientId: '736902182547-q1ddpnrg7ondiqrqotqrobdp131qupii.apps.googleusercontent.com',
				clientSecret: 'Ju9Rl7Nc1QDJPad5IX9gplkx',
				redirect: 'http://localhost:8081/home'
			  };
			  
			  const defaultScope = [
				'https://www.googleapis.com/auth/plus.me',
				'https://www.googleapis.com/auth/userinfo.email',
			  ];
			  
			  function createConnection() {
				return new google.auth.OAuth2(
				  googleConfig.clientId,
				  googleConfig.clientSecret,
				  googleConfig.redirect
				);
			  }
			  
			  function getConnectionUrl(auth) {
				return auth.generateAuthUrl({
				  access_type: 'offline',
				  prompt: 'consent',
				  scope: defaultScope
				});
			  }
			  
			  function getGooglePlusApi(auth) {
				return google.plus({ version: 'v1', auth });
			  }
			  
			 
			  function urlGoogle() {
				const auth = createConnection();
				const url = getConnectionUrl(auth);
				return url;
			  }
			 
			  function getGoogleAccountFromCode(code) {
				const data = await auth.getToken(code);
				const tokens = data.tokens;
				const auth = createConnection();
				auth.setCredentials(tokens);
				const plus = getGooglePlusApi(auth);
				const me = await plus.people.get({ userId: 'me' });
				const userGoogleId = me.data.id;
				const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
				return {
				  id: userGoogleId,
				  email: userGoogleEmail,
				  tokens: tokens,
				};
			  }
		} catch (e) {
			
			res.status(401).send({ sucess: false, reason: e });
		}
	});
};
