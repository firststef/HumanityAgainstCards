const http = require('http');
const assert = require('assert').strict;


async function testAIGetCard(unitTester, test){
    http.get('http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={'+
        '"black_card": [{ "_id": "1", "text": "I got 99 problems but ain\'t one.", "pick": "1" }],'+
        '"white_cards": [[{ "_id": "1", "text":  "Man meat."}], [{ "_id": "2", "text": "Autocannibalism."}],'+
        '[{ "_id": "4", "text":  "Man meat."}], [{ "_id": "3", "text": "Autocannibalism."}]] }', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                assert(JSON.parse(data).answer==='Success','Failed');
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
}

async function testGetHostedRooms(unitTester, test){
    const options = {
        hostname: 'localhost',
        port: '8081',
        path: '/get_hosted_rooms',
        headers: {
            session: 'dnk2dm5rOGMxNTg5NTQ5ODQzNDIwZmdlNG56ZWs='
        }
    };

    http.get(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                assert(JSON.parse(data).success === true, false);
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });
}

async function testCreateRoom(unitTester, test){
    const data = JSON.stringify({ type: "create_room",
                                    room_name: "Stefans room",
                                    score_limit: "5",
                                    max_players: "5",
                                    password: "" });
    const options = {
        hostname: 'localhost',
        port: '8081',
        path: '/rooms',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'session': 'bHAweTdsaTlkcmFnb3MxNTg5NTQyODk0NTI5ejlrM20='
        },
        body: {
            type: "create_room",
            room_name: "Stefans room",
            score_limit: "5",
            max_players: "5",
            password: ""
        }
    };

    const req = http.request(options, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            try{
                assert(JSON.parse(data).success === true, false);
            }
            catch (e) {
                unitTester.notify(test, {status: 'failed', message: e.message});
                return;
            }
            unitTester.notify(test, {status: 'success'});
        });
    }).on("error", (err) => {
        unitTester.notify(test, {status: 'fatal', message: err});
    });

    req.write(data);
    req.end();
}

module.exports.testAIGetCard = testAIGetCard;
module.exports.testGetHostedRooms = testGetHostedRooms;
module.exports.testCreateRoom = testCreateRoom;