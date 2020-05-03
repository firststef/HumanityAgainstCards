const config = require("../config"),
  database = require("../utils/database"),
  color = require("../colors"),
  log = require("../utils/log"),
  f_header = "[database/user.js]";

module.exports = {
  delete_room: (roomID) => {
    return new Promise((resolve, reject) => {
      let db = database.get_db();
      try {
        db.db("HumansAgainstCards")
          .collection("rooms")
          .deleteOne({ id: roomID }, (err) => {
            if (err) throw err;
            console.log(
              log.date_now() + f_header,
              color.red,
              ` deleteed room ${JSON.stringify(roomID)} !\n`
            );
            resolve(true);
          });
      } catch (err) {
        console.log(
          log.date_now() + f_header,
          color.red,
          `Error while deleteing  room ${JSON.stringify(roomID)} !\n`,
          color.white,
          err
        );
        reject(false);
      }
    });
  },
  get_next_id: () =>
    new Promise((resolve, reject) => {
      let db = database.get_db();
      db.db("HumansAgainstCards")
        .collection("rooms")
        .find(
          {},
          {
            _id: 0,
            id: 1,
            session: 0,
            room_name: 0,
            score_limit: 0,
            max_players: 0,
            players_in_game: 0,
          }
        )
        .toArray(function (err, result) {
          if (err) {
            console.log(
              log.date_now() + f_header,
              color.red,
              "Error while extracting data !\n",
              color.white,
              err
            );
            reject({ err: err });
          } else {
            console.log(result);
            let max = Math.max.apply(
              Math,
              result.map(function (o) {
                return o.id;
              })
            );
            console.log(
              log.date_now() + f_header,
              color.green,
              "am fcaut maximul " + max
            ); //, result);
            resolve(max);
          }
        });
    }),
  room_exist: (roomID) => {
    return new Promise((resolve, reject) => {
      let db = database.get_db();
      try {
        db.db("HumansAgainstCards")
          .collection("rooms")
          .findOne({ id: roomID }, (err, doc) => {
            if (doc !== null) {
              console.log("exista");
              resolve(true);
            }
            if (err) throw err;
            console.log(" NU exista");
            resolve(false);
          });
      } catch (err) {
        console.log(
          log.date_now() + f_header,
          color.red,
          `Error while searching session ${value} !\n`,
          color.white,
          err
        );
        reject(false);
      }
    });
  },
  get_all_rooms: () => {
    return new Promise((resolve, reject) => {
      let db = database.get_db();
      try {
        db.db("HumansAgainstCards")
          .collection("rooms")
          .find({  }).toArray((err, doc) => {
            if (doc !== null) {
              console.log("exista");
              resolve(doc);
            }
            if (err) throw err;
            console.log(" NU exista");
            resolve(false);
          });
      } catch (err) {
        console.log(
          log.date_now() + f_header,
          color.red,
          `Error while searching session ${value} !\n`,
          color.white,
          err
        );
        reject(false);
      }
    });
  },
  insert_room: (room) => {
    return new Promise((resolve, reject) => {
      let db = database.get_db();
      try {
        db.db("HumansAgainstCards")
          .collection("rooms")
          .insertOne(room, (err) => {
            if (err) throw err;
            resolve(true);
          });
      } catch (err) {
        console.log(
          log.date_now() + f_header,
          color.red,
          `Error while insering user ${JSON.stringify(room)} !\n`,
          color.white,
          err
        );
        reject(false);
      }
    });
  },
  check: (roomID) => {
    return new Promise((resolve, reject) => {
      let db = database.get_db();
      db.db("HumansAgainstCards")
        .collection("rooms")
        .find({ id: eval(roomID) })
        .toArray((err, docs) => {
          if (!docs || !docs[0]) {
            reject("Room does not exist");
          } else if (docs[0].players_in_game === docs[0].max_players) {
            reject("Room is full");
          } else {
            resolve(true);
          }
        });
    });
  },
  add_player: (roomID, u_id) => {
    return new Promise((resolve, reject) => {
      let db = database.get_db();
      try {
        db.db("HumansAgainstCards")
          .collection("current_user_rooms")
          .insertOne({ id_room: roomID, user_id: u_id }, (err) => {
            if (err) throw err;
            resolve(true);
          });
      } catch (err) {
        console.log(
          log.date_now() + f_header,
          color.red,
          `Error while inserting into room ${JSON.stringify(roomID)} !\n`,
          color.white,
          err
        );
        reject(err);
      }
    });
  },
  increase_counter: (roomID) => {
    return new Promise((resolve, reject) => {
      let db = database.get_db();
      try {
        db.db("HumansAgainstCards")
          .collection("current_user_rooms")
          .updateOne({ id: roomID }, { $inc: { players_in_game: 1 } }, (err)=>{
            if(err) throw err
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    });
  },
};
