const config   = require("../config"),
      database = require("../utils/database"),
      color    = require("../colors"),
      log      = require("../utils/log"),
      f_header = "[database/user.js]";

module.exports = {
    /**
     * returns the id of the user with the session.value = @session
     * @param {string} value - Parameter through which the user is found in the database
     * @returns {Promise<unknown>} - The result after searching in database
     */
    get_user_id: (value) =>
        new Promise((resolve, reject) => {
            let db = database.get_db();

            db.db("HumansAgainstCards")
                .collection("user")
                .find(
                    { "session.value": value },
                    {
                        _id: 1,
                        username: 1,
                        password: 0,
                        email: 0,
                        name: 0,
                        surname: 0,
                        nickname: 0,
                        game_played: 0,
                        game_won: 0,
                        "session.value": 1,
                        "session.expire": 0
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
                        if ( result === null )
                            resolve(false);
                        resolve(result);
                    }
                });
        }),
    /**
     * Returns session for a given user
     * @param {string} user - Parameter through which the session is found in the database
     * @returns {Promise<unknown>} - The result after searching in database
     */
    get_user_session: (user) =>
        new Promise((resolve, reject) => {
            let db = database.get_db();

            db.db("HumansAgainstCards")
                .collection("user")
                .find(
                    { username: user },
                    {
                        _id: 0,
                        username: 0,
                        password: 0,
                        email: 0,
                        name: 0,
                        surname: 0,
                        nickname: 0,
                        games_played: 0,
                        games_won: 0,
                        "session.value": 1,
                        "session.expire": 0
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
                        resolve(result);
                    }
                });
        }),
    /**
     * Checks the presence of a given user in the database
     * @param {string} username - The username of the required user
     * @param {string} email - The email of the required user
     */
    check_presence: (username, email) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .findOne(
                        { $or: [{ username: username }, { email: email }] },
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
                    `Error while searching user ${ username } !\n`,
                    color.white,
                    e
                );
                reject(true);
            }
        });
    },
    /**
     * Checks the presence of a given user in the temporary user database
     * @param {string} username - The username of the required user
     * @param {string} email - The email of the required user
     */
    check_presence_temp: (username, email) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("temp_user")
                    .findOne(
                        { $or: [{ username: username }, { email: email }] },
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
                    `Error while searching user ${ username } !\n`,
                    color.white,
                    e
                );
                reject(true);
            }
        });
    },
    /**
     * Check the combination of user/code and returns the data present
     *  @param {string} username - The username of the required user
     *    @param {string} code - The code of the required user
     */
    confirm_account: (username, code) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("temp_user")
                    .findOne({ username: username, code: code },
                             (err, doc) => {
                                 if ( err ) throw err;
                                 else resolve(doc);
                             });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching user ${ username } !\n`,
                    color.white,
                    e
                );
                reject(true);
            }
        });
    },
    /**
     * Delete an user from temporary user database searching for an username and a code
     * @param {string} username - The username of the required user
     * @param {string} code - The code of the required user
     * @returns {Promise<unknown>} - Result after deleting from the temporary database
     */
    delete_user_temp: (username, code) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("temp_user")
                    .deleteOne({ username: username, code: code },
                               (err, doc) => {
                                   if ( err ) throw `Could not delete entry ${ err }`;
                                   else resolve(doc);
                               });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching user ${ username } !\n`,
                    color.white,
                    e
                );
                reject(true);
            }
        });
    },
    /**
     * Checks the presence of document in the database with this username and password
     *  @param {string} username_ - The username of the required user
     *    @param {string} password_ - The password of the required user
     */
    check_login_info: (username_, password_) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .findOne({ username: username_, password: password_ },
                             (err, doc) => {
                                 if ( doc !== null ) resolve(true);
                                 if ( err ) {
                                     throw err;
                                 }
                                 resolve(false);
                             });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching user ${ username_ } !\n`,
                    color.white,
                    e
                );
                reject(true);
            }
        });
    },
    /**
     * Checks if the given session key is indeed unique
     * @param {string} session - The cookie session you which to search
     */
    session_is_unique: (session) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .findOne({ "session.value": session },
                             (err, doc) => {
                                 if ( doc !== null ) resolve(false);
                                 if ( err ) throw err;
                                 resolve(true);
                             });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching session ${ session } !\n`,
                    color.white,
                    e
                );
                reject(false);
            }
        });
    },
    /**
     * Verify if a session is expired
     * @param {string} value - Parameter through which the session is found in database
     * @returns {Promise<unknown>} - Result after searching the session in database
     */
    session_verify: (value) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .findOne(
                        { "session.value": value, "session.expire": { $gt: Date.now() } },
                        (err, doc) => {
                            console.log(doc);
                            if ( doc !== null ) resolve(true);
                            if ( err ) throw err;
                            resolve(false);
                        }
                    );
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching session ${ value } !\n`,
                    color.white,
                    e
                );
                reject(false);
            }
        });
    },
    /**
     * Update timestamp for a session
     * @param {string} value - The session which needs to be updated
     * @returns {Promise<unknown>} result after updating session in the database
     */
    session_update_timestamp: (value) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();
            let now = Date.now() + 1000 * 60 * 60 * 24;
            let updated = {
                expire: now,
                value: value
            };

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .updateOne(
                        { "session.value": value },
                        { $set: { session: updated } },
                        (err, doc) => {
                            if ( err ) throw err;
                            if ( doc !== null ) resolve(true);
                            resolve(false);
                        }
                    );
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while updating timestamp !\n`,
                    color.white,
                    e
                );
                reject(false);
            }
        });
    },
    /**
     * Update a session for a given user
     * @param {string} username_ - The username of the required user session
     * @param {string} password_ - The password of the required user session
     * @param {string} new_value - The new session values for the required user
     * @returns {Promise<unknown>} - The result after searching and updating the session
     */
    session_update_login: (username_, password_, new_value) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .updateOne(
                        { username: username_, password: password_ },
                        {
                            $set: {
                                "session.value": new_value,
                                "session.expire": Date.now() + 1000 * 60 * 60 * 24
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
                reject(false);
            }
        });
    },
    /**
     * Update a session searching for its value
     * @param {string} old_value - Session value to be replaced
     * @param {string} new_value - New session value to be updated
     * @returns {Promise<unknown>} - Result after searching and updating in the database
     */
    session_update: (old_value, new_value) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .updateOne(
                        { "session.value": old_value },
                        {
                            $set: {
                                "session.value": new_value,
                                "session.expire": Date.now() + 1000 * 60 * 60 * 24
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
                    `Error while searching session ${ old_value } !\n`,
                    color.white,
                    e
                );
                reject(false);
            }
        });
    },
    /**
     * Get the old session for a required user
     * @param {string} username_ - The username of the required user session
     * @param {string} password_ - The password of the required user session
     * @returns {Promise<unknown>} - Result after searching in the database
     */
    get_old_session: (username_, password_) => {
        new Promise((resolve, reject) => {
            let db = database.get_db();

            db.db("HumansAgainstCards")
                .collection("user")
                .find(
                    { username: username_, password: password_ },
                    {
                        username: 0,
                        password: 0,
                        email: 0,
                        name: 0,
                        surname: 0,
                        nickname: 0,
                        games_played: 0,
                        games_won: 0,
                        "session.value": 1,
                        "session.expire": 0
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
                        console.log(
                            log.date_now() + f_header,
                            color.green,
                            "Black cards loaded ! !\n",
                            result
                        );
                        resolve(result);
                    }
                });
        });
    },
    /**
     * Get the session for a given username
     * @param {string} username_ - The username of the required user session
     * @returns {Promise<unknown>} - Result after searching in the database
     */
    get_session: (username_) => {
        new Promise((resolve, reject) => {
            let db = database.get_db();

            db.db("HumansAgainstCards")
                .collection("user")
                .find(
                    { username: username_ },
                    {
                        username: 1,
                        password: 0,
                        email: 0,
                        name: 0,
                        surname: 0,
                        nickname: 0,
                        games_played: 0,
                        games_won: 0,
                        "session.value": 1,
                        "session.expire": 0
                    }
                ).toArray((err, result) => {
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
                    console.log(
                        log.date_now() + f_header,
                        color.green,
                        "Session extracted !\n",
                        result
                    );
                    resolve(result);
                }
            });
        });
    },
    /**
     * Adds an user to the temporary user database
     * @param {object} user - The user object you wish to add
     * @returns {Promise<unknown>} - Result after inserting in the temporary user collection
     */
    temp_register: (user) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("temp_user")
                    .insertOne(user,
                               (err) => {
                                   if ( err ) throw err;
                                   resolve(true);
                               });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while inserting user ${ JSON.stringify(user) } !\n`,
                    color.white,
                    e
                );
                reject(false);
            }
        });
    },
    /**
     * Register an user in the database
     * @param {object} user - The user to be inserted in the database
     * @returns {Promise<unknown>} - Result after inserting the user in the database
     */
    register: (user) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .insertOne(user,
                               (err) => {
                                   if ( err ) throw err;
                                   resolve(true);
                               });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while inserting user ${ JSON.stringify(user) } !\n`,
                    color.white,
                    e
                );
                reject(false);
            }
        });
    },
    /**
     * Find an user with the given email
     * @param email - The email of the required user
     * @returns {Promise<unknown>} - Result after searching in the database
     */
    check_email: (email) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .findOne({ $or: [{ email: email }] },
                             (err, doc) => {
                                 if ( doc !== null ) resolve(true);
                                 if ( err ) throw err;
                                 resolve(false);
                             });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while searching user with email ${ email } !\n`,
                    color.white,
                    e
                );
                reject(true);
            }
        });
    },
    /**
     * Reset the password for a given user
     * @param username_ - The username of the required user
     * @param password_ - The password of the required user
     * @returns {Promise<unknown>} - Result after searching in the database
     */
    reset_password: (username_, password_) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();
            let my_user_name = { username: username_ };
            let new_password = { $set: { password: password_ } };
            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .updateOne(my_user_name,
                               new_password,
                               (err) => {
                                   if ( err ) throw err;
                                   resolve(true);
                               });
            } catch (e) {
                console.log(
                    log.date_now() + f_header,
                    color.red,
                    `Error while resetting password !\n`,
                    color.white,
                    e
                );
                reject(false);
            }
        });
    },
    increase_games_played: (value_) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .updateOne({ "session.value": value_ },
                               { $inc: { games_played: 1 } },
                               (err) => {
                                   if ( err ) throw err;
                                   resolve();
                               });
            } catch (e) {
                reject(e);
            }
        });
    },
    increase_games_won: (value_) => {
        return new Promise((resolve, reject) => {
            let db = database.get_db();

            try {
                db.db("HumansAgainstCards")
                    .collection("user")
                    .updateOne({ "session.value": value_ },
                               { $inc: { games_won: 1 } },
                               (err) => {
                                   if ( err ) throw err;
                                   resolve();
                               });
            } catch (e) {
                reject(e);
            }
        });
    }
};
