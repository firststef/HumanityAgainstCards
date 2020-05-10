const
    room = require("../../database/room");

module.exports = function (app) {
    app.get("/game_started/:roomID",
        async (req, res) => {
            try {
                  if(!req.params.roomID) throw" no roomID provided!";

                  let started=await room.is_game_started(parseInt(req.params.roomID));
                  console.log(started);


                res.status(200).send({success: true, status: started});
            } catch (e) {
                res.status(401).send({success: false, reason: e});
            }
        });
};