//Require module
const express = require('express');
// Express Initialize
const app = express();
const port = 8000;
var probability;//not needed anymore
var ai_players=Array();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority";
class AI {
    constructor(room_id) {
        this.probability=50;
        this.category = {};
        this.category["science"] = 0;
        this.category["clothes"] = 0;
        this.category["animals"] = 0;
        this.category["actors"] = 0;
        this.category["terrorism"] = 0;
        this.category["nations"] = 0;
        this.category["superheroes"] = 0;
        this.category["family"] = 0;
        this.category["singers"] = 0;
        this.category["food"] = 0;
        this.category["money"] = 0;
        this.category["humanBodyParts"] = 0;
        this.category["alcoholAndDrugs"] = 0;
        this.category["gamesAndActivities"] = 0;
        this.category["memes"] = 0;
        this.category["racism"] = 0;
        this.category["sexual"] = 0;
        this.category["politics"] = 0;
        this.category["religion"] = 0;
        this.category["diseases"] = 0;
        this.category["stateOfMind"] = 0;
        this.category["disgusting"] = 0;

        this.room_id = room_id;
    }

    async setProbability(p){
    try{
        if(0 <= p <= 100)
           this.probability = p;
        return "Success";
    }
    catch (e) {
            console.error(e);
            return "Error";
        }
    }

    async getProbability(){
        return this.probability;
    }

    async getAiAnswer(black_card, white_cards) {
        var pick = black_card.pick;
        var client;
        var flag = true;

        try {
            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            var white_ids = Array();
            if (white_cards[0].length === 1) {
                flag = false;
            }
            console.log(white_cards);
            white_cards.forEach(i => i.forEach(j => white_ids.push(j._id)));

            /* white_cards.forEach(i => i.forEach(j => console.log("i ", i, "j ", j))); */

            var blackCardId = parseInt(black_card._id);
            var whiteCardIds = white_ids.map(Number);

            var relations = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: blackCardId, whiteCardId: { $in: whiteCardIds } }).toArray();

            var fitness_aux;
            var fitness = Array();
            fitness_aux = this.calculateFitness(relations);

            if (flag) {
                for (var i = 0; i < white_cards.length; i++) {
                    fitness.push(fitness_aux[i * pick]);
                    for (var j = 1; j < pick; j++) {
                        console.log(fitness_aux[i * pick + j], i * pick + j);
                        fitness[i] += fitness_aux[i * pick + j];
                    }
                }
            }
            else fitness = fitness_aux;

            var result = Array();
            var pickedWhiteCard;
            
            while(result.length<pick){
                pickedWhiteCard = this.selectBest(fitness);
                if (flag){
                    return white_cards[pickedWhiteCard];
                }
                if (!result.includes(white_cards[pickedWhiteCard][0]))
                    result.push(white_cards[pickedWhiteCard][0]);

            }
            return result;
        }
        catch (e) {
            console.error(e);
            return Array(white_cards[0]);
        }
        finally {
            await client.close();
        }
    }

    selectBest(fitness) {

        var wheel = Array();
        wheel.push(fitness[0]);

        for (var i = 1; i < fitness.length; i++) {
            wheel.push(wheel[i - 1] + fitness[i]);
        }

        return this.select(wheel);
    }

    select(wheel) {
        var pos = Math.floor(Math.random() * (wheel[wheel.length - 1]));
        for (var i = 0; i < wheel.length; i++) {
            if (pos < wheel[i])
                return i;
        }
        return wheel.length - 1;
    }

    calculateFitness(relations) {
        var tmp = Array();
        relations.forEach(i => {
            tmp.push(i.value);
        });
        return tmp;
    }
    async trainAi(black_card, white_card) {
        var client;
        try {
            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            var rel1 = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: black_card, whiteCardId: white_card }).toArray();

            console.log(rel1);

            var myQuery = { "blackCardId": black_card, "whiteCardId": white_card };
            var newValues = { $set: { "value": rel1[0].value + 1 } };
            await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").updateOne(myQuery, newValues);
            var rel2 = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: black_card, whiteCardId: white_card }).toArray();
            console.log(rel2);
            return "Success";
        }
        catch (e) {
            console.error(e);
            return "Error";
        }
        finally {
            await client.close();
        }
    }
}

app.listen(port, () => {
    console.log('listen port 8000');
});

//create api
app.get('/ai', (req, res) => {
    console.log(req.query.room_id);
    console.log(req.query.request);
    console.log(req.query.param);

    var parsedQuery = JSON.parse(req.query.param);
    var ai;
    let position=search_room(req.query.room_id);
    if (position===-1){
        ai = new AI(req.query.room_id);
        ai_players.push(ai);
    }else{
        ai=ai_players[position];
    }

    if (req.query.request === "getAiAnswer") {
        (async () => {
            var result = await ai.getAiAnswer(parsedQuery.black_card[0], parsedQuery.white_cards);
            return ["Success",result];
        })().then((result) => {
            res.send(JSON.stringify({answer:result[0],result:result[1]}));
        });
    } else if (req.query.request === "trainAi") {
        (async () => {
            //white_cards.forEach(i => i.forEach(j => white_ids.push(j._id)));
            parsedQuery.white_cards.forEach(i =>  {
                (async () => {
                    var result = await ai.trainAi(parseInt(parsedQuery.black_card[0]._id), parseInt(i[0]._id));
                    if (result==="Error")
                        return [result,"Couldn\'t update the db."];
                })();
            });
            return ["Success","Updated the db successfully."];

        })().then((result) => {
            res.send(JSON.stringify({answer:result[0],result:result[1]}));
        });
    } else if (req.query.request === "setProbability") {
        (async () => {
            var result = await ai.setProbability(parseInt(parsedQuery.p));
            if (result === "Error")
                return [result, "Couldn\'t update the probability."]
            return ["Success", "Updated the probability successfully."];
        })().then((result) => {
            res.send(JSON.stringify({answer:result[0],result:result[1]}));
        });
    } else if (req.query.request === "getProbability") {
        (async () => {
            var result = await ai.getProbability();
            console.log(result, "result");
            return ["Success", result];
        })().then((result) => {
            res.send(JSON.stringify({answer:result[0],result:result[1]}));
        });
    } else {
        res.send(JSON.stringify({answer:"Error",result:"Invalid command."}));
    }
});
function search_room(room_id){
    for (let i=0; i<ai_players.length; i++)
        if (ai_players[i].room_id===room_id)
            return i;
    return -1;
}
