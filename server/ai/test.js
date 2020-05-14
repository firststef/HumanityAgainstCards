const http = require('http');
const assert = require('assert').strict;

http.get('http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={'+
    '"black_card": [{ "_id": "1", "text": "I got 99 problems but ain\'t one.", "pick": "1" }],'+
    '"white_cards": [[{ "_id": "1", "text":  "Man meat."}], [{ "_id": "2", "text": "Autocannibalism."}],'+
    '[{ "_id": "4", "text":  "Man meat."}], [{ "_id": "3", "text": "Autocannibalism."}]] }', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    assert(JSON.parse(data).answer==='Success','Failed');
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});



http.get('http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={'+
'"black_card": [{ "_id": "1", "text": "I got 99 problems but  ain\'t one.", "pick": "1" }],'+
'"white_cards": [[{ "_id": "1", "text":  "Man meat."}, { "_id": "2", "text": "Autocannibalism."}],'+
' [{ "_id": "3", "text": "Autocannibalism."}, { "_id": "4", "text":  "Man meat."}]] }', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    assert.deepEqual(JSON.parse(data).answer,'Success');
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});


http.get('http://localhost:8000/ai?room_id=1&request=setProbability&param={"p": "30"}', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    assert.deepEqual(JSON.parse(data).answer,'Success');
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});



http.get('http://localhost:8000/ai?room_id=1&request=getProbability&param={}', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    assert.deepEqual(JSON.parse(data).answer,'Success');
    assert.deepEqual(JSON.parse(data).result,30);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});



http.get('http://localhost:8000/ai?room_id=1&request=setProbability&param={"p": "-1"}', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    assert.deepEqual(JSON.parse(data).answer,'Error');
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
