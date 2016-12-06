const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const items = data.items;
const comments = data.comments;

dbConnection().then(db => {
    return db.dropDatabase().then(() => {
        return dbConnection;
    }).then((db) => {
        return users.addUser("admin", "123", "admin@stevens.edu", "admin", []).then((admin) => {
            return items.addItem(admin._id, 1, "printer", "$35", "Only use half of year, almost new one").then((firstItem) => {
                return comments.addCommentToType(admin._id, "Good Item, Got it", firstItem._id, "item");
            });
        });
    }).catch((error) => {
        console.error(error);
    })
});
