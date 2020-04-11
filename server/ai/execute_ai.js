const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority";

function calculateFitness(relations){
  var poz = 0;
  var tmp = Array();
  relations.forEach(i => {
      tmp.push(i.value);
  });
  return tmp;
}

function select(wheel){
    var pos = Math.floor(Math.random()*(wheel[wheel.length-1]));
    for(let i =0 ; i<wheel.length ; i++){
      if(pos<wheel[i])
        return i;
    }
    return wheel.length-1;
}

function selectBest(fitness) {

  var wheel = Array();
  wheel.push(fitness[0]);

  for(let i=1 ; i<fitness.length ; i++){
    wheel.push(wheel[i-1]+fitness[i]);
  }

  return select(wheel);
}

async function getAiAnswer(black_card, white_cards){
    var client;
  try{
    client = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

    var relations = await client.db("HumansAgainstCards").collection("blackcard_whitecard_relation").find({ blackCardId:black_card, whiteCardId : { $in : white_cards } }).toArray();
  
    var fitness = Array();
  
    fitness = calculateFitness(relations);
  
    var result = selectBest(fitness);
    
    console.log(white_cards[result]);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}
exports.getAiAnswer = getAiAnswer;