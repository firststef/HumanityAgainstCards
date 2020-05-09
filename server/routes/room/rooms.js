const engine = require("../../../client/gamecore/library"),
    room = require("../../database/room"),
    user = require("../../database/user");
generate = require("../../utils/generate");


module.exports = function (app, secured) {
    app.post("/rooms", secured, async (req, res) => {
        let v_id;
        try {
            if (!req.body.type) throw "No type provided!";

            if (req.body.type === "create_room") {
                if (!req.body.room_name) throw "No room_name provided!";
                if (!req.body.score_limit) throw "No score_limite provided!";
                if (!req.body.max_players) throw "No max_players provided!";
                if (req.body.password === undefined) throw "No max_players provided!";


                v_id = await room.room_max_id();
                console.log(v_id);
                v_id = v_id + 1;
                let room_obj = {
                    id: v_id,
                    host: req.headers.session,
                    room_name: req.body.room_name,
                    score_limit: req.body.score_limit,
                    max_players: req.body.max_players,
                    players_in_game: 1,
                    password: req.body.password,
                    game_started: 0
                };


                let status = await room.insert_room(room_obj).catch((e) => {
                    console.error(e.message);
                    status = false;
                });
                if (false === status) throw "Error at inserting in db.";

                await room.add_player(v_id, req.headers.session);


            } else if (req.body.type === "delete_room") {

                if (!req.body.roomID) throw " No roomID provided!";

                if (!(await room.room_exist(req.body.roomID)))
                    throw " Room with this id dose not exist.";
                else if (!(await room.delete_room(req.body.roomID)))
                    throw "Internal problem.";
                if (!(await room.delete_current_user_rooms(req.body.roomID)))
                    throw "Internal problem."


            } else throw "Type of command not detected.";

            if (req.body.type !== "create_room")
                res.status(200).send(JSON.stringify({success: true}));
            else
                res.status(200).send(JSON.stringify({success: true,roomID: v_id }));
        } catch (e) {
            console.log("prinde eroarea " + e);
            res.status(417).send(JSON.stringify({success: false, err: e.message}) );
        }
    });

    app.post("/join_room", secured, async (req, res) => {
        try {
            if (!req.body.roomID) throw "No roomID provided!";
            if (req.body.password === undefined) throw "No password provided!";
            if(req.headers.session===undefined) throw "No session provided."

            //first check the db to see if there are any slots avaiable for our user
            await room.check(req.body.roomID, req.body.password);

            //verifica daca este deja in camera ca sa il integreze
            var ok = await room.is_player_in_room(req.body.roomID,req.headers.session );
            if (ok === true) {
                await room.add_player(req.body.roomID, req.headers.session );
                await room.increase_counter(req.body.roomID);
            }

            res.send(JSON.stringify({success: true})); // since the timestamp got updated the session parameter is not as required anymore
        } catch (e) {
            console.log(e);
            res.status(417).send(
                JSON.stringify({
                    success: false,
                    reason: e,
                })
            );
        }
    });
};
