const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "fluffypandaa5@gmail.com",
		pass: "",
	},
});

module.exports = {
    /**
     * Retruns an object that allows the .sendMail operation
     */
	get_transporter: () => transporter,
};
