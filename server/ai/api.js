"use strict"
// Express Initialize
const app = require('express')();
const port = 8000;

let aiPlayers = Array();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority";
class AI {
    constructor(room_id) {
        this.probability = 50;
        this.categories = {
            science: 0, clothes: 0,
            animals: 0, actors: 0, terrorism: 0, nations: 0,
            music_and_singers: 0, superheroes: 0, family: 0,
            food: 0, money: 0, human_body_parts: 0,
            alcohol_and_drugs: 0, games_and_activities: 0, memes: 0,
            racism: 0, sexual: 0, politics: 0, religion: 0, diseases: 0,
            state_of_mind: 0, disgusting: 0
        };
        this.room_id = room_id;
    }

    setProbability(p) {
        if (0 <= p && p <= 100) {
            this.probability = p;
            return "Success";
        }
        return "Error";
    }

    getProbability() {
        return this.probability;
    }

    async getAiAnswer(blackCard, whiteCards) {
        let pick = blackCard.pick;
        let client;
        let flag = true;

        try {
            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            let whiteIds = Array();
            if (whiteCards[0].length === 1) {
                flag = false;
            }
            console.log(whiteCards);
            whiteCards.forEach(whiteCardSet => whiteCardSet.forEach(whiteCard => whiteIds.push(whiteCard._id)));

            let blackCardId = parseInt(blackCard._id);
            let whiteCardIds = whiteIds.map(Number);

            let relations = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: blackCardId, whiteCardId: { $in: whiteCardIds } }).toArray();

            let fitnessAux;
            let fitness = Array();
            fitnessAux = this.calculateFitness(relations);

            if (flag) {
                for (let i = 0; i < whiteCards.length; i++) {
                    fitness.push(fitnessAux[i * pick]);
                    for (let j = 1; j < pick; j++) {
                        fitness[i] += fitnessAux[i * pick + j];
                    }
                }
            }
            else fitness = fitnessAux;
            console.log(fitness);
            let result = Array();
            let pickedWhiteCard;

            while (result.length < pick) {
                pickedWhiteCard = this.selectBest(fitness);
                if (flag) {
                    return whiteCards[pickedWhiteCard];
                }
                if (!result.includes(whiteCards[pickedWhiteCard][0]))
                    result.push(whiteCards[pickedWhiteCard][0]);
            }
            return result;
        }
        catch (e) {
            console.error(e);
            return Array(whiteCards[0]);
        }
        finally {
            await client.close();
        }
    }

    selectBest(fitness) {
        switch (this.probability) {
            case 0: //random complet
                return Math.floor(Math.random() * fitness.length);

            case 100: //roata-norocului
                let wheel = Array();

                wheel.push(fitness[0]);

                for (let i = 1; i < fitness.length; i++) {
                    wheel.push(wheel[i - 1] + fitness[i]);
                }

                return this.select(wheel);

            default: //proportional, cu cat e probability mai mare, cu atat e mai probabil sa fie alese cartile cu fitness mare
                let sum = 0; //suma totala a fitnesilor
                let partialSums = [];
                let fitnessCopy = fitness.slice(); //copie ca sa nu modificam vectorul fitness (si mai apoi sa il comparam cu acesta)

                fitnessCopy.sort(function (a, b) { return a - b }); //sortare crescatoare

                for (let i = 0; i < fitness.length; i++) { //toate
                    sum += fitnessCopy[i]; //suma totala
                    partialSums.push(sum); // sume partiale
                }
                let random = Math.random() * sum * (1 + this.probability / 50);//alegem un numar random intre 0 si suma... la p=0. Daca p=100, atunci random va fi de 3 ori mai mare decat de obicei, conducand la alegeri de fitness mai mare

                //vom alege cartea cu cel mai mic fitness care este deasupra lui random
                for (let i = 0; i < partialSums.length; i++)
                    if (partialSums[i] > random) //am gasit indexul in sirul sortat
                    {
                        for (let j = 0; j < fitness.length; j++) // cautam elementul in vectorul initial;
                            if (fitnessCopy[i] === fitness[j]) // este posibil sa existe duplicate de valori, dar nu conteaza, sunt la fel de bune
                                return j;
                    }
                //daca nu am dat return pana acum, atunci a ramas elementul cu fitness-ul maxim
                for (let j = 0; j < fitness.length; j++) // cautam elementul in vectorul initial;
                    if (fitnessCopy[fitness.length - 1] === fitness[j]) // este posibil sa existe duplicate de valori, dar nu conteaza, sunt la fel de bune
                        return j;
        }
    }

    select(wheel) {
        let pos = Math.floor(Math.random() * (wheel[wheel.length - 1]));
        for (let i = 0; i < wheel.length; i++) {
            if (pos < wheel[i])
                return i;
        }
        return wheel.length - 1;
    }

    calculateFitness(relations) {
        let tmp = Array();
        relations.forEach(relation => {
            let cardCategory = relation.category; //categoria cartii careia i se calculeaza fitness-ul acum
            tmp.push(relation.value * this.fibo(this.categories[cardCategory]));
        });
        return tmp;
    }
    /*
        fibonacci iterativ pornind de la numere usor mai mici; Am ales 1 si 1.5 pentru ca ies niste numere "rotunde"
        (adica cu parte fractionala = 1/2^n);
    */
    fibo(n) {
        if (n === 0 || typeof n === 'undefined')
            return 1;
        else if (n === 1)
            return 1.5;

        let a=1, b=1.5, c;

        while(n >= 2){
            c = (b+a) / (1.5 - this.probability / 100);
            b = c;
            a = b;
            n--;
        }

        return c;
    }
    /*
        Am ales in fibo sa implementez probabilitatea in felul urmator:
        La p=0, este facut fibonacci redus(impartindu-se la 1.5, numerele cresc foarte putin la fiecare iteratie)
        La p=50, este fibonacci normal (valorile * ~1.6 la fiecare alegere in plus)
        La p=100, este fibonacci accelerat (dublat) (valorile *3.2 la fiecare alegere)
        Pentru p mare, ar putea eventual exista riscul ca jucatorii sa aleaga intentionat alegeri "proaste" pentru a deruta AI-ul..
        desi e greu de crezut ca ar fi critic pentru ca e important si fitness-ul de baza
    */
    async trainAi(blackCard, whiteCard) {
        let client;
        try {
            client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

            let beforeRelation = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: blackCard, whiteCardId: whiteCard }).toArray();

            //aici vom incrementa categoria ultimei carti albe jucate:
            this.categories[beforeRelation[0].category]++;
            console.log(beforeRelation);

            let myQuery = { "blackCardId": blackCard, "whiteCardId": whiteCard };
            let newValues = { $set: { "value": beforeRelation[0].value + 1 } };

            await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").updateOne(myQuery, newValues);
            let afterRelation = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId: blackCard, whiteCardId: whiteCard }).toArray();
            console.log(afterRelation);

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

function search_room(room_id) {
    for (let i = 0; i < aiPlayers.length; i++)
        if (aiPlayers[i].room_id === room_id)
            return i;
    return -1;
}


app.listen(port, () => {
    console.log('listening at port ' + port);
});

app.get('/ai', (req, res) => {
    console.log(req.query.room_id);
    console.log(req.query.request);
    console.log(req.query.param);

    let parsedQuery = JSON.parse(req.query.param);
    let ai;

    let position = search_room(req.query.room_id);

    if (position === -1) {
        ai = new AI(req.query.room_id);
        aiPlayers.push(ai);
    } else {
        ai = aiPlayers[position];
    }

    switch (req.query.request) {
        case "getAiAnswer":
            ai.getAiAnswer(parsedQuery.black_card[0], parsedQuery.white_cards)
                .then(result => res.send(JSON.stringify({ answer: "Success", result: result })));
            break;

        case "trainAi":
            (async () => {
                for (let white_card of parsedQuery.white_cards) {
                    let result = await ai.trainAi(parseInt(parsedQuery.black_card[0]._id), parseInt(white_card[0]._id));
                    if (result === "Error")
                        return [result, "Couldn't update the db."];
                }
                return ["Success", "Updated the db successfully."];
            })().then((result) => {
                res.send(JSON.stringify({ answer: result[0], result: result[1] }));
            });
            break;

        case "setProbability":
            let result = ai.setProbability(parseInt(parsedQuery.p));
            if (result === "Error")
                res.send(JSON.stringify({ answer: "Error", result: "Invalid probability. Set 0-100" }));
            res.send(JSON.stringify({ answer: "Success", result: "Probability set to " + parsedQuery.p }));
            break;

        case "getProbability":
            let probability = ai.getProbability();
            res.send(JSON.stringify({ answer: "Success", result: probability }));
            break;

        default:
            res.send(JSON.stringify({ answer: "Error", result: "Invalid command." }));
    }
}
);
