
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');

let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        }).catch((error)=>{
            return Promise.reject("User Collection: Get All Users Error");
        });
    },
    getUser(userName) {
        return users().then((usersCollection) => {
            return usersCollection.findOne({
                userName: userName
            }).then((user) => {
                if (!user) return Promise.reject("User not found");
                else return user;
            }).catch((err) =>{
                console.log(err);
            })
        })
    },
    getUserById(id) {
        if (id === undefined) return Promise.reject("User Collection: No User Id provided");

        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) throw "User not found";
                return user;
            });
        }).catch((error)=>{
            return Promise.reject("User Collection: Get User By Id Error");
        });
    },
    addUser(userName, passWord, email, fullName) {
        if (!userName || !passWord || !email || !fullName) {
            return Promise.reject("Please provide all needed information");
        }
        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),
                userName: userName,
                passWord: passWord,
                email: email,
                fullName: fullName
            };

            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        }).catch((error)=>{
            return Promise.reject("User Collection: Add User Error" + error);
        });
    },
    removeUser(id) {
        if (id === undefined) return Promise.reject("User Collection: No User Id provided");

        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        }).catch((error)=>{
            return Promise.reject("User Collection: Remove User By Id Error");
        });
    },
    checkPassword(userName, passWord) {
        return this.getUser(userName).then((user) => {
            if (user.passWord != passWord) throw "Wrong password";
            return Promise.resolve(user);
        }).catch((err) => {
            return Promise.reject(err);
        })
    },
    changePassword(userName, passWord, newPassword) {
        if (!userName || !passWord || !newPassword) {
            return Promise.reject("Please provide all needed information");
        }
        return users().then((usersCollection) => {
            return this.checkPassword(userName, passWord).then((user) => {
                user.passWord = newPassword;
                return usersCollection.updateOne({
                    _id: user._id
                }, user)
                    .then((result) => {
                        return this.getUserById(user._id);
                    })
            })
        }).catch((err) => {
            console.log(err);
            return Promise.reject("fail to change password");
        })
    }
    /*updateUser(id, updatedUser) {
        if (id === undefined) return Promise.reject("User Collection: No User Id provided");

        return users().then((userCollection) => {
            let updatedUserData = {};
            if (updatedUser.name){
                updatedUserData.name = updatedUser.name;
            }
            if (updatedUser.userAccount){
                updatedUserData.userAccount = updatedUser.userAccount;
            }
            if (updatedUser.password){
                updatedUserData.password = updatedUser.password;
            }
            if (updatedUser.email){
                updatedUserData.email = updatedUser.email;
            }
            if (updatedUser.bio){
                updatedUserData.bio = updatedUser.bio;
            }

            let updateCommand = {
                $set: updatedUserData
            };

            return userCollection.updateOne({ _id: id }, updateCommand).then(() => {
                return this.getUserById(id);
            });
        }).catch((error)=>{
            return Promise.reject("User Collection: Update User Error");
        });
    }*/
}

module.exports = exportedMethods;
