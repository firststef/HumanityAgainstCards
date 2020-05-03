const engine = require("../../../client/gameclient/library"),
get_cards = require("../../database/get_cards"),
room = require("../../database/room"),
user = require("../../database/user");
var express = require('express');
var request = require('request');
var generate = require("../../utils/generate");
//f_header = "[routes/room/rooms.js]";

module.exports = function (app) {
      
    app.post("/ai/sendCards", async (req, res) => {
        try {

            if(!req.body.black_card) throw "No black card provided!";
            if(!req.body.white_cards) throw "No white cards provided!";

            let black_card = await get_cards.get_black_cards(req.body.black_card._id);
            var i;
            let white_cards = Array();
            for (i = 0; i < req.body.white_cards._id.length; i++) {
                white_cards[i] = await get_cards.get_white_cards(req.body.white_cards._id[i]);
            }
            var s1 = 'http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={"black_card": ';
            var s2 = ',  "white_cards": ';
            var myUrl = s1.concat(JSON.stringify(black_card), s2, JSON.stringify(white_cards), '}');
            //console.log(myUrl);
            request({
                url: myUrl, 
                method: 'GET'
            }, function(error, response, body){
                if(error) {
                    console.log(error);
                } else {
                    var obj = JSON.parse(response.body)
                    res.status(200).send(JSON.stringify({ success: true, ai_response: obj.result[0]._id }));
                    //console.log(obj.result[0]._id);
                }
            });

            
        } catch (e) {
            console.log("An error occured "+ e);
            res.status(417).send(JSON.stringify({ success: false }));
        }
    });
    app.post("/ai/sendAnswer", async (req, res) => {
        try {

            if(!req.body.black_card) throw "No black card provided!";
            if(!req.body.white_cards) throw "No white cards provided!";

            let black_card = await get_cards.get_black_cards(req.body.black_card._id);
            var i;
            let white_cards = Array();
            for (i = 0; i < req.body.white_cards._id.length; i++) {
                white_cards[i] = await get_cards.get_white_cards(req.body.white_cards._id[i]);
            }
            var s1 = 'http://localhost:8000/ai?room_id=1&request=trainAi&param={"black_card": ';
            var s2 = ',  "white_cards": ';
            var myUrl = s1.concat(JSON.stringify(black_card), s2, JSON.stringify(white_cards), '}');
            //console.log(myUrl);
            request({
                url: myUrl, 
                method: 'GET'
            }, function(error, response, body){
                if(error) {
                    console.log(error);
                } else {
                    var obj = JSON.parse(response.body)
                    res.status(200).send(JSON.stringify({ success: true, ai_response: obj.result}));
                    //console.log(obj.result[0]._id);
                }
            });

            
        } catch (e) {
            console.log("An error occured "+ e);
            res.status(417).send(JSON.stringify({ success: false }));
        }
    });

}