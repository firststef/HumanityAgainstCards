
# instantiere:
  - trebuie descarcat fisierul api.js intr-un folder separat
  - in acest folder in care se afla api.js se deschide si ruleaza comenzile npm init (se apasa apoi enter pana se termina, sau se seteaza api.js ca entry point)
  - se ruleaza npm install express --save
  - se ruleaza npm install mongodb
  - se deschide serverul prin node api.js
# resultatul apelarii
  - apelarea la serviciul **getAiAnswer** dupa protocolul expus mai jos va rezulta in toarcerea de catre AI a alegerii acestuia, un array de carti albe.
  - apelarea **getAiAnswer** trebuie facuta la fiecare runda a jocului
  - apelarea la **trainAi** trebuie facuta la finalul fiecarei runde, dupa ce o carte alba a fost declarata castigatoare de catre czar. Se trimit ca parametrii cartea neagra din runda respectiva si cartea (cartile) albe castigatoare
# mod de folosire
  - AI-ul poate fi accesat ca API dupa modelul urmator: 
  - localhost:8000/ai
  - parametru 1: obligatoriu : (**room_id**), id-ul camerei de joc care face requestul pentru raspunsul AI-ului
  - parametrul 2: requestul propriu-zis: (**request**) poate fi doar:
    - getAiAnswer
    - trainAi
    - getProbability
    - setProbability
  - parametrul 3: (**param**), contine parametrii fiecarui tip de request.
    - pentru *getAiAnswer*: {*"black_card"*: "JSON.stringify(blackCard)", *"white_cards"*: JSON.stringify(whiteCardsList) }
      - blackCard este un array : [card]
      - whiteCardsList este un array de array-uri : [[card1], [card2], [card3], ..]
      - numai atunci cand AI-ul este czar pot fi array-uri de forma : [[card1_1, card1_2], [card2_1, card2_1], ..]
      - intoarce un mesaj de succes si doar unul dintre arrayurile din whiteCardsList in format JSON
      - {"answer":"Success","result":[{"_id":"2","text":"Autocannibalism."}]}
      - {"answer":"Success","result":[{"_id":"1","text":"Man meat."},{"_id":"2","text":"Autocannibalism."}]}
      - Nu exista mesaj de eroare. Singurul caz probabil este sa nu fie timeout
    - pentru *trainAi*: {*"black_card"*: "JSON.stringify(blackCard)", *"white_cards"*: "JSON.stringify(whiteCards)" }
      - blackCard este un array : [card]
      - in acest caz, whiteCards este  un array de arrayuri: [[card]], sau [[card1], [card2], ..]
      - intoarce doar un mesaj de succes
      - {"answer":"Success", "result": "Updated the db successfully."}
      - {"answer":"Error", "result": "Couldn't update the db."}
    - pentru *getProbability*: {}
      - intoarce un mesaj de succes precum si o valoare intre 0 si 100
      - {"answer":"Success","result":"30"}
      - { "answer": "Error", "result": "Invalid command." }
    - pentru *setProbability*: {*"p"*: "probability"}, unde 0<=probability<=100
      - intoarce doar un mesaj de succes
      - {"answer":"Success", "result" : "Probability set to ***p***"}
      - { "answer": "Error", "result": "Invalid probability. Set 0-100" }
    - exemple de utilizare: 



Request: 
```javascript
http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={"black_card": [{ "_id": "1", "text": "I got 99 problems but  ain't one.", "pick": "1" }],  "white_cards": [[{ "_id": "1", "text":  "Man meat."}], [{ "_id": "2", "text": "Autocannibalism."}], [{ "_id": "4", "text":  "Man meat."}], [{ "_id": "3", "text": "Autocannibalism."}]] }
```
Un raspuns posibil:
```javascript
{"answer":"Success","result":[{"_id":"3","text":"Autocannibalism."}]}
```

Request: 
```javascript
http://localhost:8000/ai?room_id=1&request=getAiAnswer&param={"black_card": [{ "_id": "1", "text": "I got 99 problems but  ain't one.", "pick": "1" }],  "white_cards": [[{ "_id": "1", "text":  "Man meat."}, { "_id": "2", "text": "Autocannibalism."}], [{ "_id": "3", "text": "Autocannibalism."}, { "_id": "4", "text":  "Man meat."}]] }
```
Un raspuns posibil:
```javascript
{"answer":"Success","result":[{"_id":"1","text":"Man meat."},{"_id":"2","text":"Autocannibalism."}]}
```

Request: 
```javascript
http://localhost:8000/ai?room_id=1&request=trainAi&param={"black_card": [{ "_id": "1", "text": "I got 99 problems but  ain't one.", "pick": "1" }], "white_cards": [[{ "_id": "1", "text":  "Man meat."}]]}
```
Raspunsul primit:
```javascript
{"answer":"Success","result":"Updated the db successfully."}
```

Request: 
```javascript
http://localhost:8000/ai?room_id=1&request=trainAi&param={"black_card": [{ "_id": "2", "text": "I got 99 problems but  ain't one.", "pick": "1" }], "white_cards": [[{ "_id": "1", "text":  "Man meat."}], [{ "_id": "2", "text":  "Man meat."}]]}
```

Raspunsul primit:
```javascript
{"answer":"Success","result":"Updated the db successfully."}
```

Request: 
```javascript
http://localhost:8000/ai?room_id=1&request=getProbability&param={}
```

Raspunsul primit:
```javascript
{"answer":"Success","result":50}
```

Request: 
```javascript
http://localhost:8000/ai?room_id=1&request=setProbability&param={"p": "30"}
```

Raspunsul primit:
```javascript
{"answer":"Success","result":"Probability set to 30"}
```
    
# Posibile erori

  - nu este tratata exceptia pentru momentul in care nu se primeste raspuns, deci in aceste cazuri trebuie trimise requesturi noi



