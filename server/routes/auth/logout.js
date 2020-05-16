const user     = require("../../database/user"),
     room =require("../../database/room");



module.exports = function (app,secured) {
    /**
     * Authenticate an user with username and password
     */
    app.post("/auth/logout", secured, async (req, res) => {
            try {
                  let users_rooms= await room.get_rooms_for_host(req.headers.session);
                  for(let key of users_rooms){
                      await room.delete_current_user_rooms(key.id);
                  }
                  await room.delete_rooms_for_user(req.headers.session);

                res.status(200).send({ success: true});
            } catch (e) {
                res.status(401).send({ success: false, reason: e });
            }
        });
};
