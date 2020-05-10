const
    color    = require("./../colors"),
    database = require("./../utils/database"),
    f_header = "[delete_rooms.js]";


setTimeout(() => delete_rooms(),
    1000);

function delete_rooms() {

    let db = database.get_db();
    try {
        db.db("HumansAgainstCards")
            .collection("rooms")
            .deleteMany({  },
                (err) => {
                    if ( err ) throw err;
                });
        db.db("HumansAgainstCards")
            .collection("current_user_rooms")
            .deleteMany({  },
                (err) => {
                    if ( err ) throw err;
                });
        console.log(
            f_header,
            color.green,
            "Sucess !\n",
            color.white);
    } catch (e) {
        console.log(
            f_header,
            color.red,
            "Deleteing all rooms function failed !\n",
            color.white,
            e);
    }
}
