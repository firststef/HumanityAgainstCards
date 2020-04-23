const config = require("../../config"),
	color = require("../../colors"),
	log = require("../../utils/log"),
	user = require("../../database/user"),
	fs = require("fs"),
	path = require("path"),
	mail = require("./connect"),
	generate = require("../../utils/generate"),
	encode = require("../../utils/encode"),
mongoose = require("mongoose"),
f_header = "[routes/auth/register.js]";

module.exports = function (app) {
	app.post("/auth/reset_password", async (req, res) => {
		try {
			if (!req.body.email || typeof req.body.email !== "string") throw `No email provided !`;
			if ((await user.check_email(req.body.email)) == false) throw `this email is not existing !`;
			if (!req.body.email.match(/\w{1,}@\w{1,}(\.\w{1,}){1,}/)) throw `Invalid email !`;
	
			transporter = mail.get_transporter();
			fs.readFile(path.join(__dirname, "./index.html"), "utf8", (err, html) => {
				if (err) throw err;
				else {
					let mail = {
						to: req.body.email,
						from: "Cards agasint humanity" + config.email.user,
						subject: "Send your password",
						html: html,
					};
					transporter.sendMail(mail, function (err, info) {
						if (err) throw `Could not connect to the mailing service!, ${err}`;
						//resolve(true);
						//e un request deci raspunde la el, nu cu resolve reject dintrun prommise
						res.status(200).send({"status":"sucess"})
					});
				}
			});
		} catch (e) {
			console.log(log.date_now() + f_header, color.red + e);
			res.status(500).send({status:"fail","err":e})
			//reject(false);
		}
	});
	
	app.post("/auth/reset_password/:username", async (req, res) => {
		try {
			if (!req.body.new_password || typeof req.body.new_password !== "string") throw `No new password provided !`;
			if (!(req.body.new_password.match(/[A-Z]/) && req.body.new_password.match(/[0-9]/) && req.body.new_password.length > 5))
				throw `The password must be at least 5 characters long, and it must contain an uppercase character, and a number !`;
			if (!req.body.confirm_new_password || typeof req.body.confirm_new_password !== "string") throw `No confirm new password provided !`;
			if (!req.params.username || typeof req.params.username !== "string") throw `No username provided !`;

			if (req.body.new_password !== req.body.confirm_new_password) throw `Passwords do not match !`;

			//md5 encode the password
			let password = encode.md5(req.body.new_password);
			//var id = mongoose.Types.ObjectId(req.params.id);
			//Change the password in database
			let ok = await user.reset_password(req.params.username, password);

			if (!ok) throw `An internal error occured while attempting to access the database !`;

			let response = {
				sucess: true,
			};

			res.status(200).send(response);
		} catch (e) {
			res.status(401).send({ sucess: false, reason: e });
		}
	});
};

