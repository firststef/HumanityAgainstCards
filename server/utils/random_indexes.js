config = require("../config");
 
function random_white(){
    return Math.floor(Math.random() * config.nr_cards.white);// returns a random integer from 0 to config.nr_cards.white
}
module.exports = {
    black_index: ()=>{
       return Math.floor(Math.random() * config.nr_cards.black);   // returns a random integer from 0 to config.nr_cards.black
    },

    white_index: (array)=>{
      let new_index=random_white();

      while(array.includes(new_index))   
      {
          new_index=random_white();
      }

      return new_index;
    },

    white_indexes: (nr)=>{
        let indexes=Array();
        let aux=random_white();

        while(indexes.length!=nr){
            if(!indexes.includes(aux))
               indexes.push(aux); 
            aux=random_white();
        }
        return indexes;
    }
};