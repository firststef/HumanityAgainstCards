const log = require("../utils/log"),
	config = require("../config"),
    color = require("../colors"),
    user = require("../database/user"),
	f_header = "[mail/send_confirm.js]";


module.exports = async function(req,res,next){
    try{
        if(!req.headers.session) throw `No session parameter provided`
        if(!req.headers.session.user) throw `The session parameter requires an user parameter`
        if(!req.headers.session.cookie) throw `The session parameter requires a cookie parameter`
        let ok = await user.session_verify(req.headers.session.user, req.headers.session.cookie);
        if(!ok) res.redirect("/auth")
        next();
    } catch(e){
        res.status(401).send({err:e})
    }
}