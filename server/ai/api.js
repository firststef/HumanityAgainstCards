"use strict"
// Express Initialize
const app = require('express')();
const port = 8000;

let aiPlayers = Array();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority";

class AI {
    /**
     * pentru fiecare camera de joc se instantiaza cate un obiect de tip AI si se initializeaza variabilele de sesiune
     * vor afecta alegerea in turele viitoare
     * @param room_id => reprezinta id-ul camerei de joc pentru care este apelat serviciul de AI
     */
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

    /**
     * metoda a obiectului pentru a scade/creste dificultatea AI-ului
     * o probabilitate de 0 va rezulta in raspunsuri random
     * o probabilitate  p in (0, 100) va rezulta intr-o alegere a celei mai bune carti cu probabilitatea p
     * o probabilitate de 100 va rezulta in roata norocului
     * @param probability => noua probabilitate care este setata pentru aceasta instanta de AI
     * @returns {string} => raspunsul "Error" daca probabilitatea nu se afla in intervalul [0, 100] sau "Success" altfel
     */
    setProbability(probability) {
        if (0 <= probability && probability <= 100) {
            this.probability = probability;
            return "Success";
        }
        return "Error";
    }

    /**
     * @returns {number} => intoarce probabilitatea acestei instante
     */
    getProbability() {
        return this.probability;
    }

    /**
     *
     * @param blackCard => o singura carte neagra
     * @param whiteCards => un vector de vectori de carti albe
     * @returns {Promise<any[]|*>} => exact pick carti(sau perechi de carti) albe
     */
    async getAiAnswer(blackCard, whiteCards) {
        let pick = blackCard.pick;
        // numarul de carti albe care trebuie alese in aceasta runda
        let client;
        // clientul de conectare cu baza de date
        let flag = true;
        // aceasta variabila este true daca si numai daca (pick>1 && AI-ul este CZAR)
        try {
            client = await MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            let whiteIds = Array();
            if (whiteCards[0].length === 1) {
                // Stim sigur ca AI-ul este CZAR doar daca se primeste intr-un vector de carti albe mai mult de o carte
                // alba. Acest caz este cel in care AI-ul trebuie sa aleaga care pereche de 2 sau 3 carti (date de
                // un jucator) este mai buna pentru o carte neagra cu pick>1
                flag = false;
                // ne mai putem da seama ca AI-ul nu este czar atunci cand pick>1 si vectorul de carti albe contine
                // doar vectori de cate o carte alba
                // in toate celelalte cazuri nu ne putem da seama daca AI-ul este czar sau nu
            }

            // console.log(whiteCards);
            whiteCards.forEach(whiteCardSet => whiteCardSet.forEach(whiteCard => whiteIds.push(whiteCard._id)));
            // ne procuram toate id-urile din vectoruld e carti albe
            let blackCardId = parseInt(blackCard._id);
            let whiteCardIds = whiteIds.map(Number);
            // ne asiguram ca id-urile este INT

            let relations = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({
                blackCardId: blackCardId,
                whiteCardId: {$in: whiteCardIds}
            }).toArray();
            // obtinem in relations un vector de relatii intre toate id-urile albe si negre pe care le avem la dispozitie


            let fitnessAux;
            // un vector auxiliar de fitness al cartilor albe, care ne ajuta in calcularea probabilitatii de selectie
            let fitness = Array();
            // vectorul 'oficial' de fitness
            fitnessAux = this.calculateFitness(relations);
            // obtinem fitness-ul tuturor relatiilor in vectorul auxiliar
            if (flag) {
                // acesta este cazul in care: (pick>1 && AI-ul este CZAR)
                // inseamna ca fitnessul pe care l-am obtinut pentru fiecare relatie nu mai este valabil in contextul unei
                // singure carti albe, deci trebuie luata in considerare exact perechile de carti albe primite
                for (let i = 0; i < whiteCards.length; i++) {
                    fitness.push(fitnessAux[i * pick]);
                    for (let j = 1; j < pick; j++) {
                        fitness[i] += fitnessAux[i * pick + j];
                    }
                    // adaugam fitnessul cartilor, aflat in fitnessAux, la vectorul de fitness, care in acest caz este
                    // vector de fitness al perechilor
                }
            } else fitness = fitnessAux;
            // in toate celelalte cazuri, fitness-ul este exact fitnessAux, adica fitnessul fiecarei carti albe in parte
            // console.log(fitness);

            let result = Array();
            // vectorul in care intoarcem cartea sau cartile albe care reprezinta optiunea AI-ului
            let pickedWhiteCardPoz;
            // pozitia din vectorul de carti albe a alegerii facute de AI

            while (result.length < pick) {
                // trebuie sa returnam exact pick carti albe, deci in fiecare iteratie alegem cate una si o introducem
                // in rezultat
                pickedWhiteCardPoz = this.selectBest(fitness);
                if (flag) {
                    // daca flag este setat atunci sunte 100% siguri ca AI-ul este CZAR deci trebuie sa intoarca un
                    // singur rezultat, chiar daca pick > 1
                    return whiteCards[pickedWhiteCardPoz];
                }
                if (!result.includes(whiteCards[pickedWhiteCardPoz][0])){
                    // verificam daca nu am mai facut odata aceasi alegere, si daca nu adaugam alegerea din iteratia
                    // curenta in rezultat
                    result.push(whiteCards[pickedWhiteCardPoz][0]);
                }

            }
            // intoarcem rezultatul
            return result;
        } catch (e) {
            console.error(e);
            return Array(whiteCards[0]);
            // in caz de eroare intoarcem prima carte alba care ne-a fost trimisa
        } finally {
            await client.close();
            // inchidem conexiunea cu Mongo
        }
    }

    /**
     * @param fitness => un vector de fitness dupa care se realizeaza alegerile
     * @returns {number|*} => o pozitie din vectorul de fitness care reprezinta alegerea noastra
     */
    selectBest(fitness) {
        switch (this.probability) {
            case 0: // acest caz intoarce tot timpul un raspuns random din partea AI-ului
                return Math.floor(Math.random() * fitness.length);

            case 100: //in acest caz se realizeaza o selectia bazata pe roata norocului (ruleta) cu probabilitati
                let wheel = Array();
                // se instantiaza roata norocului (ruleta)
                wheel.push(fitness[0]);
                for (let i = 1; i < fitness.length; i++) {
                    // se aloca probabilitatile in roata norocului (ruleta) in functie de fitness-ul fiecarei pozitii
                    wheel.push(wheel[i - 1] + fitness[i]);
                }

                // la final se invarte roata norocului si se obtine o pozitie
                return this.select(wheel);

            default: //proportional, cu cat e probability mai mare, cu atat e mai probabil sa fie alese cartile cu fitness mare
                let sum = 0; //suma totala a vectorului de fitness
                let partialSums = []; // suma partiala a vectorului de fitness
                let fitnessCopy = fitness.slice(); //copie ca sa nu modificam vectorul fitness (si mai apoi sa il comparam cu acesta)

                fitnessCopy.sort(function (a, b) {
                    return a - b
                }); //sortare crescatoare

                for (let i = 0; i < fitness.length; i++) {
                    sum += fitnessCopy[i]; //suma totala
                    partialSums.push(sum); // sume partiale
                }

                let random = Math.random() * sum * (1 + this.probability / 50);//alegem un numar random intre 0 si suma

                //vom alege cartea cu cel mai mic fitness care este deasupra lui random
                for (let i = 0; i < partialSums.length; i++)
                    if (partialSums[i] > random) //am gasit indexul in sirul sortat
                    {
                        for (let j = 0; j < fitness.length; j++) // cautam elementul in vectorul initial;
                            if (fitnessCopy[i] === fitness[j]) // este posibil sa existe duplicate de valori, dar nu
                                // conteaza, sunt la fel de bune
                                return j;
                    }
                //daca nu am dat return pana acum, atunci a ramas elementul cu fitness-ul maxim
                for (let j = 0; j < fitness.length; j++) // cautam elementul in vectorul initial;
                    if (fitnessCopy[fitness.length - 1] === fitness[j]) // este posibil sa existe duplicate de valori,
                        // dar nu conteaza, sunt la fel de bune
                        return j;
        }
    }

    /**
     * @param wheel => roata norocului cu probabilitati
     * @returns {number} => rezultatul invartirii rotii
     */
    select(wheel) {
        let pos = Math.floor(Math.random() * (wheel[wheel.length - 1]));
        // aceasta reprezinta impulsul impingerii
        for (let i = 0; i < wheel.length; i++) {
            // invartim roata pana se consuma impulsul
            if (pos < wheel[i])
                return i;
        }
        // intoarcem rezultatul invartirii
        return wheel.length - 1;
    }

    /**
     * @param relations => vector de relatii intre exact o carte neagra si o carte alba
     * @returns {any[]} => vector de fitness bazat pe relatia (globala) si istoricul jocului (local)
     */
    calculateFitness(relations) {
        let tmp = Array();
        relations.forEach(relation => {
            let cardCategory = relation.category.replace(/ /g, "_"); //categoria cartii careia i se calculeaza fitness-ul acum
            tmp.push(relation.value * this.fibo(this.categories[cardCategory]));
            // fitness relatie = valoare relatie (relation.value)(globala, din baza de date) si valoarea categoriei
            // din care face parte relatia (this.fibo(this.categories[cardCategory]))) (locala, din vectorul de frecventa)
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

        let a = 1, b = 1.5, c;

        while (n >= 2) {
            c = (b + a) / (1.5 - this.probability / 100);
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
            client = await MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

            let beforeRelation = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({
                blackCardId: blackCard,
                whiteCardId: whiteCard
            }).toArray();

            // aici vom incrementa categoria ultimei carti albe jucate:
            this.categories[beforeRelation[0].category.replace(/ /g, "_")]++;
            // console.log(beforeRelation);

            let myQuery = {"blackCardId": blackCard, "whiteCardId": whiteCard};
            let newValues = {$set: {"value": beforeRelation[0].value + 1}};

            await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").updateOne(myQuery, newValues);
            let afterRelation = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({
                blackCardId: blackCard,
                whiteCardId: whiteCard
            }).toArray();
            //console.log(afterRelation);

            return "Success";
        } catch (e) {
            console.error(e);
            return "Error";
        } finally {
            await client.close();
        }
    }
}

/**
 * o functie care cauta in vectorul de instante AI obiectul cu id-ul din parametru
 * @param room_id => id al camerei de joc care apeleaza AI-ul
 * @returns {number} => o pozitie din vector-ul de AI-uri al instantei create pentru aceasta camera, sau -1, daca nu exista
 * un AI pentru aceasta camera de joc
 */
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
        // console.log(req.query.room_id);
        // console.log(req.query.request);
        // console.log(req.query.param);

        try {
            let parsedQuery = JSON.parse(req.query.param);
            let ai_instance;
            //instanta curenta de AI

            let position = search_room(req.query.room_id);
            // cautam sa vedem daca exista un AI pentru room_id-ul respectiv

            if (position === -1) {
                // daca nu exista, instantiem unul nou
                ai_instance = new AI(req.query.room_id);
                aiPlayers.push(ai_instance);
            } else {
                // altfel, il accesam pe cel deja creat
                ai_instance = aiPlayers[position];
            }

            switch (req.query.request) {
                // verificam requestul facut catre AI si intoarcem fiecare raspuns in formatul din README
                case "getAiAnswer":
                    ai_instance.getAiAnswer(parsedQuery.black_card[0], parsedQuery.white_cards)
                        .then(result => res.send(JSON.stringify({answer: "Success", result: result})));
                    break;

                case "trainAi":
                    (async () => {
                        for (let white_card of parsedQuery.white_cards) {
                            let result = await ai_instance.trainAi(parseInt(parsedQuery.black_card[0]._id), parseInt(white_card[0]._id));
                            if (result === "Error")
                                return [result, "Couldn't update the db."];
                        }
                        return ["Success", "Updated the db successfully."];
                    })().then((result) => {
                        res.send(JSON.stringify({answer: result[0], result: result[1]}));
                    });
                    break;

                case "setProbability":
                    let result = ai_instance.setProbability(parseInt(parsedQuery.p));
                    if (result === "Error")
                        res.send(JSON.stringify({answer: "Error", result: "Invalid probability. Set 0-100"}));
                    res.send(JSON.stringify({answer: "Success", result: "Probability set to " + parsedQuery.p}));
                    break;

                case "getProbability":
                    let probability = ai_instance.getProbability();
                    res.send(JSON.stringify({answer: "Success", result: probability}));
                    break;

                default:
                    res.send(JSON.stringify({answer: "Error", result: "Invalid command."}));
            }
        }
        catch (e) {
            res.send({answer: "Error", result: e})
        }
    }
);

