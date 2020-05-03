const log = require("../utils/log"),
  config = require("../config"),
  color = require("../colors"),
  user = require("../database/user"),
  f_header = "[mail/send_confirm.js]";

module.exports = async function (req, res, next) {
  try {
    if (!req.headers.session) throw `No session parameter provided`;
    // if (!req.body.session.user)
    //   throw `The session parameter requires an user parameter`;
    // if (!req.body.session.cookie)
    //   throw `The session parameter requires a cookie parameter`;
    // let ok = await user.session_verify(
    //   req.body.session.user,
    //   req.body.session.cookie
    // );

    let ok = await user.session_verify(req.headers.session);
    if (!ok) {
      throw "User session invalid !"
      //res.redirect("/auth");
    }

    //if the session is valid update it's timestamp
    //not exceptionally safe, but will do for now since I don't know how the frontedn stores cookies

    ok = user.session_update_timestamp(req.headers.session);
    if (!ok) {
      throw "User session invalid  err!";
    } else {
      next();
    }
  } catch (e) {
    res.status(401).send({ err: e });
  }
};
