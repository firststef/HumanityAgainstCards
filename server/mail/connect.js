const nodemailer = require("nodemailer"),
	log = require("../utils/log"),
	config = require("../config"),
	color = require("../colors"),
	f_header = "[mail/connect.js]";

var transporter = nodemailer.createTransport(
	{
		host: "smtp.gmail.com",
		service: "gmail",
		auth: {
			user: config.email.user,
			pass: config.email.pass,
		},
	},
	// (err) => { // The callback is not beeing called for this request
	// 	if (err) console.log(`Could not connect to the mailing service!, ${err}`);
	// 	else console.log(log.date_now() + f_header, color.green, `Connected as ${config.email.user} ! `);
	// },
);



module.exports = {
	get_transporter: () => transporter,
};
