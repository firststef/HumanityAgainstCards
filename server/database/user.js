const config = require("../config"),
	database = require("../utils/database"),
	color = require("../colors"),
	log = require("../utils/log"),
	f_header = "[database/user.js]";

module.exports = {
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
					.findOne({ $or: [{ username: username }, { email: email }] }, (err, doc) => {
						if (doc !== null) resolve(true);
						if (err) throw err;
						resolve(false);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while searching user ${username} !\n`, color.white, e);
				reject(true);
			}
		});
	},
	/**
	 * Checks the presence of document  in the database with this username and pasword
	 *  @param {string} username - The username of the required user
	 * 	@param {string} password - The password of the required user
	 */
	check_login_info: (username_, password_) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			try {
				console.log("vrea sa caute ");
				db.db("HumansAgainstCards")
					.collection("user")
					.findOne({username: username_ , password: password_}, (err, doc) => {
						if (doc !== null) resolve(true);
						if (err){ throw err;}
						resolve(false);
					});
					
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while searching user ${username} !\n`, color.white, e);
				reject(true);
			}
		});
	},
	/**
	 * Checks if the given session key is indeed unique
	 * @param {string} session - The cookie session you wich to search
	 */
	session_is_unique: (session) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			try {
				db.db("HumansAgainstCards")
					.collection("user")
					.findOne({ "session.value": session }, (err, doc) => {
						if (doc !== null) resolve(false);
						if (err) throw err;
						resolve(true);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while searching session ${session} !\n`, color.white, e);
				reject(false);
			}
		});
	},
	session_verify: (value) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			try {
				db.db("HumansAgainstCards")
					.collection("user")
					.findOne({ "session.value": value , "session.expire": {  $gt: Date.now() }}, (err, doc) => {
						if (doc !== null) resolve(true);
						if (err) throw err;
						resolve(false);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while searching session ${value} !\n`, color.white, e);
				reject(false);
			}
		});
	},
	session_update_login: (username_ ,  password_, new_value) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			try {
				db.db("HumansAgainstCards")
					.collection("user")
					.updateOne(
						{username: username_ , password: password_},
						{
						  $set: { "session.value": new_value, "session.expire": Date.now() + 1000 * 60 * 60 * 24 * 1 }
						}, 
						(err, doc) => {
						if (doc !== null) resolve(true);
						if (err) throw err;
						resolve(false);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while searching session ${value} !\n`, color.white, e);
				reject(false);
			}
		});
	},
	session_update: (old_value , new_value) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			try {
				db.db("HumansAgainstCards")
					.collection("user")
					.updateOne(
						{ "session.value" : old_value },
						{
						  $set: { "session.value": new_value, "session.expire": Date.now() + 1000 * 60 * 60 * 24 * 1 }
						}, 
						(err, doc) => {
						if (doc !== null) resolve(true);
						if (err) throw err;
						resolve(false);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while searching session ${value} !\n`, color.white, e);
				reject(false);
			}
		});
	},
<<<<<<< HEAD

=======
	get_old_session: (username_, password_) =>
		new Promise((resolve, reject) => {
			let db = database.get_db();
			var myid = parseInt(id);
			db.db("HumansAgainstCards")
				.collection("user")
				.find({username: username_, password: password_},
					{
					username: 0,
					password: 0,
					email: 0,
					name: 0,
					surname: 0,
					nickname: 0,
					"session.value": 1,
					"session.expire":0
				 })
				.toArray(function (err, result) {
					if (err) {
						console.log(log.date_now() + f_header, color.red, "Error while extracting data !\n", color.white, err);
						reject({ err: err });
					} else {
						console.log(log.date_now() + f_header, color.green, "Black cards loaded ! !\n", result);
						resolve(result);
					}
				});
		}),
>>>>>>> 88c945afa2061c8efc497518c3e1fc1c6025738e
	/**
	 * Adds an user to the database
	 * @param {object} user - The user object you wish to add
	 */
	temp_register: (user) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			try {
				db.db("HumansAgainstCards")
					.collection("temp_user")
					.insertOne(user, (err) => {
						if (err) throw err;
						resolve(true);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while insering user ${JSON.stringify(user)} !\n`, color.white, e);
				reject(false);
			}
		});
	},

	register: (user) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			try {
				db.db("HumansAgainstCards")
					.collection("user")
					.insertOne(user, (err) => {
						if (err) throw err;
						resolve(true);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while insering user ${JSON.stringify(user)} !\n`, color.white, e);
				reject(false);
			}
		});
	},



	reset_password: (username_, password_) => {
		return new Promise((resolve, reject) => {
			let db = database.get_db();
			var myusername = { username: username_ };
			var newpassword = { $set: {password: password_} };
			try {
				db.db("HumansAgainstCards")
					.collection("user")
					.updateOne(myusername, newpassword, (err) => {
						if (err) throw err;
						resolve(true);
					});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, `Error while resetting password !\n`, color.white, e);
				reject(false);
			}
		});
	},
};
