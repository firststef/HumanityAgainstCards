const config   = require("../../../config"),
      color    = require("../../../colors"),
      log      = require("../../../utils/log"),
      database = require("../../../utils/database"),
      f_header = "[routes/auth/worker/clean_outdated_accounts.js]";

setTimeout(() => clean(config.account.temp_lifetime),
           1000 * 10);
setInterval(() => clean(config.account.temp_lifetime),
            config.account.cleaner_interval);

/**
 * Clean the database of users who were no longer active
 * @param {double} lifetime
 */
function clean(lifetime) {
    let timestamp = Date.now() - lifetime;

    let db = database.get_db();
    try {
        db.db("HumansAgainstCards")
            .collection("temp_user")
            .deleteMany({ timestamp: { $lt: timestamp } },
                        (err) => {
                            if ( err ) throw err;
                            console.log(log.date_now(),
                                        f_header,
                                        color.green,
                                        "Sucess !\n",
                                        color.white);
                        });
    } catch (e) {
        console.log(log.date_now(),
                    f_header,
                    color.red,
                    "Cleaner function failed !\n",
                    color.white,
                    e);
    }
}
