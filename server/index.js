const express = require("express"),
	body_parser = require("body-parser"),
	config = require("./config.js"),
	app = express(),
	log = require("./utils/log"),
	color = require("./colors"),
	cors = require("cors"),
	database = require("./utils/database"),
	mail = require("./mail/connect");
	header = log.date_now() + " [index.js] ";

app.use(cors());
app.use(body_parser.urlencoded({ extended: true, limit: "10mb" }));
app.use(body_parser.json());
app.listen(config.server.port, function(err) {
	if (err) {
		console.log(color.white + header, color.red, `Server could not start : `, err);
	} else {
		console.log(color.white + header, color.green, `Server running on port ${config.server.port} !`);
		console.log(color.white + header, color.green, `The interface can be accesed at ${config.server.protocol}://${config.server.endpoint}:${config.server.port} !`);
		console.log("\n");
		console.log(color.yellow, `     )         *              ) (                            (       ) (                          (   (     (     `);
		console.log(color.yellow, `     ( /(       (  \`    (     ( /( )\\ )     (     (       (     )\\ ) ( /( )\\ )  *   )     (    (     )\\ ))\\ )  )\\ )  `);
		console.log(color.yellow, `     )\\())   (  )\\))(   )\\    )\\()|()/(     )\\    )\\ )    )\\   (()/( )\\()|()/(\` )  /(     )\\   )\\   (()/(()/( (()/(  `);
		console.log(color.yellow, `    ((_)\\    )\\((_)()((((_)( ((_)\\ /(_)) ((((( (()/( ((((_)(  /(_)|(_)\\ /(_))( )(_))  (((_|(((_)(  /(_))(_)) /(_)) `);
		console.log(color.yellow, `     _((_)_ ((_|_()((_)\\ _ )\\ _((_|_))    )\\ _\\ /(_))_)\\ _ )\\(_))  _((_|_)) (_(_())   )\\___)\\ _ )\\(_))(_))_ (_))   `);
		console.log(color.yellow, `    | || | | | |  \\/  (_)_\\(_) \\| / __|   (_)_\\(_)) __(_)_\\(_)_ _|| \\| / __||_   _|  ((/ __(_)_\\(_) _ \\|   \\/ __|  `);
		console.log(color.yellow, `    | __ | |_| | |\\/| |/ _ \\ | .\` \\__ \\    / _ \\ | (_ |/ _ \\  | | | .\` \\__ \\  | |     | (__ / _ \\ |   /| |) \\__ \\  `);
		console.log(color.yellow, `    |_||_|\\___/|_|  |_/_/ \\_\\|_|\\_|___/   /_/ \\_\\ \\___/_/ \\_\\|___||_|\\_|___/  |_|      \\___/_/ \\_\\|_|_\\|___/|___/  `);
		console.log("\n");

	}
});

require("./routes/test/hello")(app);
require("./routes/cards/add_cards")(app);
require("./routes/cards/get_cards")(app);
require("./routes/game/game_handler2")(app);
require("./routes/auth/register")(app);
require("./routes/auth/login")(app);
require("./routes/auth/reset_password")(app);




