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

module.exports.testAIGetCard = testAIGetCard;