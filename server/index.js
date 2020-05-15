const express = require('express');
const body_parser = require('body-parser');
const config = require('./config.js');

const app = express();
const color = require('./colors');
const cors = require('cors');
const session = require('./middleware/session_validation');
const authRoutes = require('./routes/auth/google_auth_route');
const ai_server = require('child_process').fork('./ai/api.js');

app.use(cors());
app.use(body_parser.urlencoded({ extended: true, limit: '10mb' }));
app.use(body_parser.json());
app.use('/auth', authRoutes);

// app.use(session);
const secured = config.require_auth ? [session] : []; // toggable from the cofig

app.listen(config.server.port, (err) => {
  if (err) {
    console.log(color.red, 'Server could not start : ', err);
  } else {
    console.log(color.green, `Server running on port ${config.server.port} !`);
    console.log(color.green, `The interface can be accesed at ${config.server.protocol}://${config.server.endpoint}:${config.server.port} !`);
  }
});

// app.use(express.static(`${__dirname}/test-client/build/`));
// app.get("/", function(req, res) {
// 	res.sendFile(`${__dirname}/test-client/build/index.html`);
// });
// app.get("*", function(req, res, next) {
// 	res.sendFile(`${__dirname}/test-client/build/index.html`);
// }); // DEVELOPMENT WITH COOKIE HANDLER ON BACKEND

require('./routes/cards/add_cards')(app);
require('./routes/cards/get_cards')(app, secured);
require('./routes/game/game_handler')(app, secured);
require('./routes/auth/register')(app);
require('./routes/auth/login')(app);
require('./routes/auth/auth_with_name')(app);
require('./routes/auth/reset_password')(app);
require('./routes/auth/confirm_account')(app);
require('./routes/room/rooms')(app, secured);
require('./routes/room/get_rooms')(app, secured);
require('./routes/room/players_from_room')(app, secured);
require('./routes/room/game_started')(app, secured);
require('./routes/pages/render_page')(app, secured);
require('./routes/ai_call/call')(app);
require('./routes/config/pasport-setup');

require('./routes/room/start_game')(app, secured);
require('./routes/room/end_game')(app, secured);
require('./routes/room/get_hosted_rooms')(app, secured);

// Workers & connectors
require('./routes/auth/worker/clean_outdated_accounts');
require('./utils/database');
require('./mail/connect');
require('./routes/auth/reset_password/connect');
// se va decomenta cand vom vrea sa fie sterse camerele la pornirea serverului
// require("./utils/delete_rooms");
require('./utils/delete_name_auth_users');
