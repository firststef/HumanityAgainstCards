const config       = require("../../config"),
      color        = require("../../colors"),
      log          = require("../../utils/log"),
      user         = require("../../database/user"),
      generate     = require("../../utils/generate"),
      send_confirm = require("../../mail/send_confirm"),
      encode       = require("../../utils/encode"),
      f_header     = "[routes/auth/register.js]";

module.exports = function (app) {
    /**
     * Register an user with username and password
     */
    app.post("/auth/register",
             async (req, res) => {
                 try {
                     if ( !req.body.username || typeof req.body.username !== "string" ) throw `No username provided !`;
                     if ( !req.body.password || typeof req.body.password !== "string" ) throw `No password provided !`;

                     if (
                         !(req.body.password.match(/[A-Z]/) && req.body.password.match(/[0-9]/) && req.body.password.length > 5)
                     )
                         throw `The password must be at least 5 characters long, and it must contain an uppercase character, and a number !`;

                     if ( !req.body.email || typeof req.body.email !== "string" ) throw `No email provided !`;

                     if ( !req.body.email.match(/\w{1,}@\w{1,}(\.\w{1,}){1,}/) ) throw `Invalid email !`;

                     if ( !req.body.nickname || typeof req.body.nickname !== "string" ) throw `No nickname provided !`;

                     /**First check if the user exists in the database */
                     if ( await user.check_presence(req.body.username,
                                                    req.body.email) ) throw `User already registered !`;

                     if ( await user.check_presence_temp(req.body.username,
                                                         req.body.email) ) throw `User already registered !`;

                     //md5 encode the password
                     let password = encode.md5(req.body.password);

                     //build the request object to ensure that no other data can be inserted to the database
                     let user_obj = {
                         username: req.body.username,
                         password: password,
                         email: req.body.email,
                         nickname: req.body.nickname,
                         timestamp: Date.now()
                     };

                     //generate an unique code to confirm the registration
                     let code = Math.random()
                         .toString(36)
                         .substr(2,
                                 9);
                     user_obj.code = code;

                     let ok = await user.temp_register(user_obj);

                     if ( !ok ) throw `An internal error occurred while attempting to access the database !`;

                     ok = await send_confirm.send(req.body.email,
                                                  req.body.username,
                                                  code);

                     if ( !ok ) throw `The mailing server did not respond properly !`;

                     let response = {
                         success: true,
                         username: req.body.username
                     };

                     res.status(200).send(response);
                 } catch (e) {
                     res.status(401).send({ success: false, reason: e });
                 }
             });
};
