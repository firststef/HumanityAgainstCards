const
    room = require("../../database/room");

module.exports = function (app, secured) {
    /**
     * Get hosted rooms
     */
    app.get("/get_hosted_rooms",secured,
            async (req, res) => {
                try {

                    let rooms = await room.get_rooms_for_host(req.headers.session);

                    if ( rooms === false ) throw "internal error";

                    let room_ids = Array();

                    for (let key of rooms) {

                        room_ids.push(key.id);

                    }

                    res.status(200).send({ success: true, rooms: room_ids });
                } catch (e) {
                    res.status(401).send({ success: false, reason: e });
                }
            });
};
