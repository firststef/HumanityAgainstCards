const 
      engine    = require("../../../client/gamecore/library"),
      get_cards = require("../../database/get_cards"),
      room      = require("../../database/room"),
      user      = require("../../database/user"),
      express   = require('express'),
      request   = require('request'),
      generate  = require("../../utils/generate");

module.exports = function (app) {
    /**
     * Receive in body the black card and the white cards
     * Send those cards to AI, receive the response from AI and send it to game
     */
    app.post("/ai/sendCards",
             async (req, res) => {
                 try {
                     if ( !req.body.black_card ) throw "No black card provided!";
                     if ( !req.body.white_cards ) throw "No white cards provided!";
                     if ( !req.body.room_id )
                         req.body.room_id = 0;

                     let s1 = 'http://localhost:8000/ai?room_id=' + req.body.room_id + '&request=getAiAnswer&param={"black_card":';
                     let s2 = ',"white_cards":';
                     let myUrl = s1.concat(JSON.stringify(req.body.black_card),
                                           s2,
                                           JSON.stringify(req.body.white_cards),
                                           '}');
                     request({
                                 url: myUrl,
                                 method: 'GET'
                             },
                             function (error, response) {
                                 if ( error ) {
                                     throw error;
                                 } else {
                                     let obj = JSON.parse(response.body);
                                     if ( obj.answer !== "Success" )
                                         throw obj.result;
                                     res.status(200).send(JSON.stringify({ success: true, response: obj.result }));
                                 }
                             });
                 } catch (e) {
                     console.log("An error occured " + e);
                     res.status(500).send(JSON.stringify({ success: false, result: e }));
                 }
             });
    /**
     * Receive the winner white card/s for current round and send it to AI
     */
    app.post("/ai/sendAnswer",
             async (req, res) => {
                 try {
                     if ( !req.body.black_card ) throw "No black card provided!";
                     if ( !req.body.white_cards ) throw "No white cards provided!";
                     if ( !req.body.room_id )
                         req.body.room_id = 0;

                     let s1 = 'http://localhost:8000/ai?room_id=' + req.body.room_id + '&request=trainAi&param={"black_card":';
                     let s2 = ',"white_cards":';
                     let myUrl = s1.concat(JSON.stringify(req.body.black_card),
                                           s2,
                                           JSON.stringify(req.body.white_cards),
                                           '}');
                     request({
                                 url: myUrl,
                                 method: 'GET'
                             },
                             function (error, response) {
                                 if ( error ) {
                                     throw error;
                                 } else {
                                     let obj = JSON.parse(response.body);
                                     if ( obj.answer !== "Success" )
                                         throw obj.result;
                                     res.status(200).send(JSON.stringify({ success: true, response: obj.result }));
                                 }
                             });
                 } catch (e) {
                     console.log("An error occured " + e);
                     res.status(500).send(JSON.stringify({ success: false, result: e }));
                 }
             });
};