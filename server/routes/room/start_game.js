const config = require("../../config"),
    room = require("../../database/room"),
    user=require("./../../database/user"),
    map=require("./../../map"),
    engine = require("../../../client/gamecore/library"),
f_header = "[routes/room/start_game.js]";



module.exports = function (app) {
	app.post("/start_game", async (req, res) => {
		try {
             if(!req.body.roomID)throw "No roomId provided !";
             if(! await room.room_exist(req.body.roomID))throw "Room does not exist!";

             var username= await user.get_user_id(req.headers.session);
             console.log(username);
             if(username.length==0)throw" session not registered";
             if(await room.is_host_to_room(username[0].username)==false) throw "You are not host to this room!";

             let playerList = await room.get_players(req.body.roomID);
             let playerIDList=Array();
             let ok=false;
             for (var i = 0; i <playerList.length; i++) 
                {
                    ok=await user.get_user_session(playerList[i].user_id);
                    if(!ok)throw "Internal error!";
                    playerIDList.push(ok[0].session.value);
                }

             var game_manager = new engine.GameManager(playerIDList.length, 1, playerIDList);
             map.RoomMap.set(req.body.roomID,game_manager);
             //map.print();
            
			res.status(200).send({success:true});
		} catch (e) {
			console.log(e.message+" in "+f_header);
			console.log(e+" in "+f_header);
			res.status(401).send({ success: false, reason: e });
		}
	});
};
