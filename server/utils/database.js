const mongo_client = require(`mongodb`).MongoClient,
  config = require("../config"),
  mongo_db = mongo_client.connect(config.database.endpoint, {
    useUnifiedTopology: true
  }),
  log = require("./log"),
  color = require("../colors"),
  f_header = color.white + " [database.js] ";

var database;
mongo_db.then(db => {
    database = db;
    console.log(log.date_now() + f_header,color.green,"Connected to MongoDb ! ");
  })
  .catch(err => {
    console.log(log.date_now() + f_header,color.red,"Error while connecting to mongoDb !\n",color.white,err);
  });

module.exports = {
  get_db: () => database
};
