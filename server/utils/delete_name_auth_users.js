const
    color    = require("./../colors"),
    database = require("./../utils/database"),
    f_header = "[delete_some_users.js]";

setTimeout(() => delete_users(),2000);// are un timeout ce asteapta sa se conecteze serverul la baza de date
setInterval(() => delete_users(),1000*60*180);// la interval de 3 ore

/**
 * deletes users that entered the game with a name
 */
function delete_users() {

    let connection = database.get_db();
    try {
        connection.db("HumansAgainstCards")
            .collection("user")
            .deleteMany({temp:true},
                (err) => {
                    if ( err ) throw err;
                });
    } catch (e) {
        console.log(
            f_header,
            color.red,
            "Deleting all users auth with name function failed !\n",
            color.white,
            e);
    }
}
