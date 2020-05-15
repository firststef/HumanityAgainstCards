const log      = require("../utils/log"),
      config   = require("../config"),
      color    = require("../colors"),
      user     = require("../database/user"),
      f_header = "[middleware/session_validation.js]";

module.exports = async function (req, res, next) {
    try {
        if ( !req.headers.session ) throw `No session parameter provided`;

        let ok = await user.session_verify(req.headers.session);
        if ( !ok ) {
            throw "User session invalid !";
        }

        //if the session is valid update it's timestamp
        //not exceptionally safe, but will do for now since I don't know how the frontend stores cookies

        ok = user.session_update_timestamp(req.headers.session);
        if ( !ok ) {
            throw "User session invalid  err!";
        } else {
            next();
        }
    } catch (e) {
        res.status(401).send({ success: false ,err: e });
    }
};
