const nodemailer = require("nodemailer"),
	log = require("../utils/log"),
	config = require("../config"),
	color = require("../colors"),
	fs = require("fs"),
	path = require("path"),
	mail = require("./connect"),
	f_header = "[mail/send_confirm.js]";

module.exports = {
	/**
	 * Gets a specific card from the database
	 * @param {string}[user] username
	 * @param {string}[code] unique user registration code
	 */
	send: (email, user, code) => {
		return new Promise((resolve, reject) => {
			try {
				transporter = mail.get_transporter();
				fs.readFile(path.join(__dirname, "./confirm_account/index.html"), "utf8", (err, html) => {
					if (err) throw err;
					else {
						html = html.replace("{{USER}}", user);
						html = html.replace("{{DOMAIN}}", `${config.server.protocol}://${config.server.endpoint}:${config.server.port}`);
						html = html.replace("{{CODE}}", code);

						//would have to handle a redirect
						//html = html.replace("{{URL}}",`${config.server.protocol}://${config.server.endpoint}:${config.server.port}/confirm_account/${user}/${code}`);
						//html = html.replace("{{URL}}",`${config.server.protocol}://${config.server.endpoint}:${config.server.port}/confirm_account/${user}/${code}`);

						let mail = {
							to: email,
							from: "Cards agasint humanity" + config.email.user,
							subject: "Confirm Cards against humanity registration",
							html: html,
						};
						transporter.sendMail(mail, function (err, info) {
							if (err) throw `Could not connect to the mailing service!, ${err}`
							resolve(true);
						});
					}
				});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red + e);
				reject(false);
			}
		});
	},
};
