const express = require("express"),
	body_parser = require("body-parser"),
	config = require("./config.js"),
	app = express(),
	color = require("./colors"),
	cors = require("cors"),
	session = require("./middleware/session_validation"),
	authRoutes = require("./routes/auth/google_auth_route");

app.use(cors());
app.use(body_parser.urlencoded({ extended: true, limit: "10mb" }));
app.use(body_parser.json());
app.use('/auth',authRoutes);

// app.use(session);
let secured = config.require_auth ? [session] : []; // toggable from the cofig

app.listen(config.server.port, function(err) {
	if (err) {
		console.log(color.red, `Server could not start : `, err);
	} else {
		console.log( color.green, `Server running on port ${config.server.port} !`);
		console.log( color.green, `The interface can be accesed at ${config.server.protocol}://${config.server.endpoint}:${config.server.port} !`);

	}
});

require("./routes/test/hello")(app);
require("./routes/cards/add_cards")(app);
require("./routes/cards/get_cards")(app,secured);
require("./routes/game/game_handler2")(app,secured);
require("./routes/auth/register")(app);
require("./routes/auth/login")(app);
require("./routes/auth/auth_with_name")(app);
require("./routes/auth/reset_password")(app);
require("./routes/auth/confirm_account")(app);
require("./routes/room/rooms")(app,secured);
require("./routes/room/return_rooms")(app);
require("./routes/room/players_from_room")(app);
require("./routes/pages/render_page")(app,secured);
require("./routes/ai_call/call")(app);
require("./routes/config/pasport-setup");

require("./routes/room/start_game")(app);
require("./routes/room/get_hosted_rooms")(app);

//Workers & connectors
require("./routes/auth/worker/clean_outdated_accounts");
require("./utils/database");
require("./mail/connect");
require("./routes/auth/reset_password/connect");

