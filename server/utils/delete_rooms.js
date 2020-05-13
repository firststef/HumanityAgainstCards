const
    color    = require("./../colors"),
    database = require("./../utils/database"),
    f_header = "[delete_rooms.js]";

setTimeout(() => delete_rooms(),
           1000);

function delete_rooms() {

    let connection = database.get_db();
    try {
        connection.db("HumansAgainstCards")
            .collection("rooms")
            .deleteMany({},
                        (err) => {
                            if ( err ) throw err;
                        });
        connection.db("HumansAgainstCards")
            .collection("current_user_rooms")
            .deleteMany({},
                        (err) => {
                            if ( err ) throw err;
                        });
        console.log(
            f_header,
            color.green,
            "Success !\n",
            color.white);
    } catch (e) {
        console.log(
            f_header,
            color.red,
            "Deleting all rooms function failed !\n",
            color.white,
            e);
    }
}
