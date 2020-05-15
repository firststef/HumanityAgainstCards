const users = require("../../database/user"),
      room= require("../../database/room");

module.exports= function(app, secured){
    app.post("/logout",secured,async (req, res) =>{
        try{

            if (!req.headers.session) throw "No session";
            let rooms_of_host=await room.get_rooms_for_host(req.headers.session)

            //sterge toate  din currernt_user_rooms toti player-i din camerele hostului care se delogheaza
            for(let room_of_host of rooms_of_host) {
                await room.delete_current_user_rooms(room_of_host.id);
            }

            await room.delete_rooms_for_user(req.headers.session);

            res.status(200).send({success: true});
        }catch (e) {
            res.status(401).send({success:false, reason:e.message });
        }


    })

}