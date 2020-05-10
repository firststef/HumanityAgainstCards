const
      database = require("../utils/database"),
      color    = require("../colors"),
      log      = require("../utils/log"),
      f_header = "[database/user.js]";

module.exports = {
    /**
     * Deletes the room with the given id
     * @param {int} roomID - The id of the required room
     * @returns {Promise<unknown>} - Result after deleting the room
     */
    game_start: (roomID) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .updateOne(
                        { id: roomID},
                        {
                            $set: {
                                game_started: 1
                            }
                        },
                        (err, doc) => {
                            if ( doc !== null ) resolve(true);
                            if ( err ) throw err;
                            resolve(false);
                        }
                    );
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching user ${ username_ } !\n`,
                    color.white,
                    e
                );
                reject({error:e});
            }
        });
    },
    delete_room: (roomID) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .deleteOne({ id: roomID },
                               (err) => {
                                   if ( err ) throw err;
                                   console.log(
                                       log.date_now() + f_header,
                                       color.red,
                                       ` deleted room ${ JSON.stringify(roomID) } !\n`
                                   );
                                   resolve(true);
                               });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while deleting room ${ JSON.stringify(roomID) } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Deletes all the rooms with a given id
     * @param {int} roomID - The id of the required rooms
     * @returns {Promise<unknown>} - Result after deleting rooms
     */
    delete_current_user_rooms: (roomID) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("current_user_rooms")
                    .deleteMany({ id_room: roomID },
                                (err) => {
                                    if ( err ) throw err;

                                    resolve(true);
                                });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while deleting room ${ JSON.stringify(roomID) } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Get the next id for a new room
     * @returns {Promise<unknown>} - Result after searching in the database
     */
    get_next_id: () => {
        new Promise((resolve, reject) => {
            let db = database.get_db();

            db.db("HumansAgainstCards")
                .collection("rooms")
                .find({},
                    {
                        _id: 0,
                        id: 1,
                        session: 0,
                        room_name: 0,
                        score_limit: 0,
                        max_players: 0,
                        players_in_game: 0
                    }
                )
                .toArray(function (err, result) {
                    if ( err ) {
                        console.log(
                            log.date_now() + f_header,
                            color.red,
                            "Error while extracting data !\n",
                            color.white,
                            err
                        );
                        reject({ err: err });
                    } else {
                        let max = Math.max.apply(
                            Math,
                            result.map(function (o) {
                                return o.id;
                            })
                        );
                        resolve(max);
                    }
                });
        });
    },
    /**
     * Checking if a room with a given id exists
     * @param {int} roomID - The id of the required room
     * @returns {Promise<unknown>} - Result after searching the room in the database
     */
    room_exist: (roomID) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .findOne({ id: roomID },
                             (err, doc) => {
                                 if ( doc !== null ) {
                                     resolve(true);
                                 } else {
                                     if ( err ) {
                                         throw err;
                                     }
                                     resolve(false);
                                 }
                             });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching room with id ${ roomID } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    room_max_id: () => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .find({ },
                        {
                            _id: 0,
                            id: 1,
                            session: 0,
                            room_name: 0,
                            score_limit: 0,
                            max_players: 0,
                            players_in_game: 0
                        }).toArray(
                    (err, doc) => {
                        if ( doc !== null && doc.length!==0 ) {
                            console.log("vrea sa faca max");
                            console.log(doc);
                            let max = Math.max.apply(
                                Math,
                                doc.map(function (o) {
                                    return o.id;
                                })
                            );

                            resolve(max);
                        } else {
                            console.log(doc);
                            if ( err ) {
                                throw err;
                            }
                            resolve(1000);
                        }
                    });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching room with id ${ roomID } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Check the host of a room
     * @param {int} roomID - The id of the room
     * @param {string} host - The host of the room
     * @returns {Promise<unknown>} - Result after searching the room in the database
     */
    is_host_to_room: (roomID, host) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .findOne({ id: roomID, host: host },
                             (err, doc) => {
                                 if ( err ) {
                                     throw err;
                                 }
                                 if ( doc !== null ) {
                                     resolve(true);
                                 } else
                                     resolve(false);
                             });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching room ${ roomID } with host ${ host } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Check if the given player is in the room
     * @param {int} roomID - The id of the required room
     * @param {string} user - The user to be checked if is in the room
     * @returns {Promise<unknown>} - Result after searching in the database
     */
    is_player_in_room: (roomID, user) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("current_user_rooms")
                    .findOne({ id_room: roomID, user_id: user },
                             (err, doc) => {
                                 if ( err ) {
                                     throw err;
                                 }
                                 if ( doc == null ) {
                                     resolve(true);
                                 } else
                                     resolve(false);
                             });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching room ${ roomID } having user ${ user } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Get all existing rooms from database
     * @returns {Promise<unknown>} - Result after searching all the rooms from the database
     */
    get_all_rooms: () => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .find({}).toArray((err, doc) => {
                    if ( doc !== null ) {
                        resolve(doc);
                    }
                    if ( err ) throw err;
                    resolve(false);
                });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching all current rooms !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Gets all the rooms for a given host
     * @param {string} username - The username of the user to be searched as a host
     * @returns {Promise<unknown>} - Result after seaching rooms in the databse
     */
    get_rooms_for_host: (username) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .find({ host: username }).toArray((err, doc) => {
                    if ( doc !== null ) {
                        resolve(doc);
                    }
                    if ( err ) {
                        throw err;
                    }
                });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching rooms having as host ${ username } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    get_players_from_room: (id) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("current_user_rooms")
                    .find({ id_room:  id }).toArray((err, doc) => {
                    if ( doc !== null ) {
                        resolve(doc);
                    }
                    if ( err ) {
                        throw err;
                    }
                });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching rooms having as host ${ username } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Insert a room in the database
     * @param {object} room - The room to be inserted in the database
     * @returns {Promise<unknown>} - Result after inserting the room in database
     */
    insert_room: (room) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .insertOne(room,
                               (err) => {
                                   if ( err ) throw err;
                                   else resolve(true);
                               });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while inserting room ${ JSON.stringify(room) } !\n`,
                    color.white,
                    err
                );
                reject(false);
            }
        });
    },
    /**
     * Check if a room is full or if exists
     * @param {int} roomID - The id of the room to be checked
     * @param {string} password - The password of the room to be checked
     * @returns {Promise<unknown>} - Result after checking the room
     */
    check: (roomID, password) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            db.db("HumansAgainstCards")
                .collection("rooms")
                .find({ id: eval(roomID), password: password })
                .toArray((err, docs) => {
                    if ( !docs || !docs[0] ) {
                        reject("Room does not exist");
                    } else if ( docs[0].players_in_game === parseInt(docs[0].max_players) ) {
                        reject("Room is full");
                    } else {
                        resolve(true);
                    }
                });
        });
    },
    /**
     * Add a player in a given room
     * @param {int} roomID - The id of the room to be added a player
     * @param {string} u_id - The id of the user to be added in the room
     * @returns {Promise<unknown>} - Result after inserting the user in the room
     */
    add_player: (roomID, u_id) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("current_user_rooms")
                    .insertOne({ id_room: roomID, user_id: u_id },
                               (err) => {
                                   if ( err ) throw err;
                                   resolve(true);
                               });
            } catch (err) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while inserting into room ${ JSON.stringify(roomID) } !\n`,
                    color.white,
                    err
                );
                reject(err);
            }
        });
    },
    /**
     * Get all the players from a given room
     * @param {int} roomID - The id of the required room
     * @returns {Promise<unknown>} - Result after searching the players from the room
     */
    get_players: (roomID) => {
        new Promise((resolve, reject) => {
            let db = database.get_db();

            db.db("HumansAgainstCards")
                .collection("current_user_rooms")
                .find(
                    { id_room: roomID }
                )
                .toArray(function (err, result) {
                    if ( err ) {
                        console.log(
                            log.date_now() + f_header,
                            color.red,
                            "Error while extracting data !\n",
                            color.white,
                            err
                        );
                        reject({ err: err });
                    } else {
                       // console.log(result);
                       // console.log("promis");
                        resolve(result);
                    }
                });
        });
    },
    /**
     * Increase the number of players in a room
     * @param {int} roomID - The id of the required room
     * @returns {Promise<unknown>} - Result after increasing number of players in the room
     */
    increase_counter: (roomID) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("rooms")
                    .updateOne({ id: roomID },
                               { $inc: { players_in_game: 1 } },
                               (err) => {
                                   if ( err ) throw err;
                                   resolve();
                               });
            } catch (e) {
                reject(e);
            }
        });
    },
    is_game_started :(roomID) => {
    return new Promise((resolve, reject) => {
        let db = database.get_db();

        try {
            db.db("HumansAgainstCards")
                .collection("rooms")
                .findOne({ id: roomID, game_started:1},
                    (err, doc) => {
                        if ( err ) {
                            throw err;
                        }
                        if ( doc === null ) {
                            console.log(doc);
                            resolve("not_started");
                        } else{
                            resolve("started");}
                    });
        } catch (err) {
            console.log(
                log.date_now() + f_header,
                color.red,
                `Error while searching room ${ roomID } with host ${ host } !\n`,
                color.white,
                err
            );
            reject(false);
        }
    });
},


};
