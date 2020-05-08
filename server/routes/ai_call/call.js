const engine = require("../../../client/gamecore/library"),
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
            if(!req.body.room_id)
                req.body.room_id = 0;

            let s1 = 'http://localhost:8000/ai?room_id='+req.body.room_id+'&request=getAiAnswer&param={"black_card":';
            let s2 = ',"white_cards":';
            let myUrl = s1.concat(JSON.stringify(req.body.black_card), s2, JSON.stringify(req.body.white_cards), '}');
            request({
                url: myUrl, 
                method: 'GET'
            }, function(error, response){
                if(error) {
                    throw error;
                } else {
                    let obj = JSON.parse(response.body);
                    if (obj.answer !== "Success")
                        throw obj.result;
                    res.status(200).send(JSON.stringify({ answer: "Success", response: obj.result}));
                }
            });
        } catch (e) {
            console.log("An error occured "+ e);
            res.status(500).send(JSON.stringify({ success: "Error", result: e }));
        }
    });
    app.post("/ai/sendAnswer", async (req, res) => {
        try {
            if(!req.body.black_card) throw "No black card provided!";
            if(!req.body.white_cards) throw "No white cards provided!";
            if(!req.body.room_id)
                req.body.room_id = 0;

            let s1 = 'http://localhost:8000/ai?room_id='+req.body.room_id+'&request=trainAi&param={"black_card":';
            let s2 = ',"white_cards":';
            let myUrl = s1.concat(JSON.stringify(req.body.black_card), s2, JSON.stringify(req.body.white_cards), '}');
            request({
                url: myUrl,
                method: 'GET'
            }, function(error, response){
                if(error) {
                    throw error;
                } else {
                    let obj = JSON.parse(response.body);
                    if (obj.answer !== "Success")
                        throw obj.result;
                    res.status(200).send(JSON.stringify({ answer: "Success", response: obj.result}));
                }
            });
        } catch (e) {
            console.log("An error occured "+ e);
            res.status(500).send(JSON.stringify({ success: "Error", result: e }));
        }
    });
};