const user     = require("../../database/user"),
      generate = require("../../utils/generate");

module.exports = function (app) {
    /**
     * Authenticate user with username
     */
    app.post("/auth/with_name",
             async (req, res) => {
                 try {
                     if ( !req.body.name || typeof req.body.name !== "string" ) throw `No username provided !`;

                     //generate cookie session
                     let cookie_session = "";

                     while ( cookie_session.length < 10 ) {
                         // The chances that the same cookie to be generated twice is around ~ 1 to 1.531.653.719
                         cookie_session = generate.unique(req.body.user,
                                                          32);
                         //Check presence of the cookie in the database
                         if ( !await user.session_is_unique(cookie_session) ) {
                             cookie_session = "";
                         }
                     }

                     let user_ob = {
                         username: req.body.name,
                         nickname: req.body.name
                     };

                     user_ob.session = {
                         value: cookie_session,
                         expire: Date.now() + 1000 * 60 * 60 * 24 // 1 day
                     };

                     //try to launch the data in the db
                     let ok = await user.register(user_ob);
                     if ( !ok ) throw `An internal error occured while attempting to access the database !`;

                     let response = {
                         success: true,
                         session: cookie_session
                     };

                     res.status(200).send(response);

                 } catch (e) {
                     res.status(401).send({ success: false, reason: e.message });
                 }
             });
};