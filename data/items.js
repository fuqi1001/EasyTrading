
const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
const users = require("./users");
const classify = require("./classify");
const uuid = require('node-uuid');

let exportedMethods = {
    getAllItems() {
        return items().then((itemCollection) => {
            return itemCollection.find({}).toArray();
        }).catch((error) => {
            return Promise.reject("Item Collection: Get All Items Error");
        });
    },

   getItemByClassify(classifyid){
        if (classifyid === undefined) return Promise.reject("Item Collection: No Item Id provided");

        return items().then((itemCollection) => {
            return itemCollection.find({classifyid: classifyid}).toArray();
        }).catch((error) => {
            return Promise.reject("Item Collection: Get Item By Id Error");
        });
    },

    getItemById(id) {
        if (id === undefined) return Promise.reject("Item Collection: No Item Id provided");

        return items().then((itemCollection) => {
            return itemCollection.findOne({ _id: id }).then((item) => {
                if (!item) throw "Item not found";
                return item;
            });
        }).catch((error) => {
            return Promise.reject("Item Collection: Get Item By Id Error");
        });
    },
    addItem(createrid, classifyid, name, price, description, comments) {
        if (typeof name !== "string") return Promise.reject("No item name provided");
        if (typeof price !== "string") return Promise.reject("No item price provided");
        if (typeof description !== "string") return Promise.reject("No item description provided");
        if (!Array.isArray(comments)) { comments = []; }

        return items().then((itemCollection) => {
            let newItem = {
                _id: uuid.v4(),
                createrid: createrid,
                classifyid: classifyid,
                name: name,
                price: price,
                description: description,
                comments: comments
            };

            return itemCollection.insertOne(newItem).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getItemById(newId);
            });
        }).catch((error) => {
            return Promise.reject("Item Collection: Add Item Error");
        });
    },
    removeItem(id) {
        if (id === undefined) return Promise.reject("Item Collection: No Item Id provided");

        return items().then((itemCollection) => {
            return itemCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete item with id of ${id}`)
                }
            });
        }).catch((error) => {
            return Promise.reject("Item Collection: Remove Item By Id Error");
        });
    },
    updateItem(id, updatedItem) {
        if (id === undefined) return Promise.reject("Item Collection: No Item Id provided");

        return items().then((itemCollection) => {
            let updatedItemData = {};
            if (updatedItem.createrid) {
                updatedItemData.createrid = updatedItem.createrid;
            }
            if (updatedItem.classifyid) {
                updatedItemData.classifyid = updatedItem.classifyid;
            }
            if (updatedItem.name) {
                updatedItemData.name = updatedItem.name;
            }
            if (updatedItem.price) {
                updatedItemData.price = updatedItem.price;
            }
            if (updatedItem.description) {
                updatedItemData.description = updatedItem.description;
            }

            let updateCommand = {
                $set: updatedItemData
            };

            return itemCollection.updateOne({ _id: id }, updateCommand).then(() => {
                return this.getItemById(id);
            });
        }).catch((error) => {
            return Promise.reject("Item Collection: Update Item Error");
        });
    },

    addCommentToItem(posterId, posterUser, comment, commentId, itemId) {
        return this.getItemById(itemId).then((currentItem) => {
            return items().then((itemCollection) => {
                return itemCollection.updateOne({
                    _id: itemId
                }, {
                        $addToSet: {
                            comments: {
                                _id: commentId,
                                posterId: posterId,
                                posterUser: posterUser,
                                comment: comment
                            }
                        }
                    });
            });
        }).catch((error) => {
            return Promise.reject("Item Collection: Add Comment To Item Error" + error);
        });
    },
    updateCommentToItem(itemId, commentId, updatedComment) {
        return items().then((itemCollection) => {
            return itemCollection.find({
                _id: itemId,
                "comments._id": commentId
            }, {
                    "comments.$": 1
                })
                .toArray().then((currentComment) => {

                    let updateCommentData = currentComment[0].comments[0];
                    if (updatedComment.posterId) {
                        updateCommentData.posterId = updatedComment.posterId;
                    }
                    if (updatedComment.posterUser) {
                        updateCommentData.posterUser = updatedComment.posterUser;
                    }
                    if (updatedComment.comment) {
                        updateCommentData.comment = updatedComment.comment;
                    }

                    return items().then((itemCollection) => {
                        return itemCollection.update({
                            _id: itemId,
                            "comments._id": commentId
                        }, {
                                $set: {
                                    "comments.$": updateCommentData
                                }
                            });
                    }).catch((error) => {
                        console.log(error);
                    });
                });
        }).catch((error) => {
            return Promise.reject("Item Collection: Update Comment To Item Error");
        });
    },
    removeCommentFromItem(itemId, commentId) {
        return items().then((itemCollection) => {
            return this.getItemById(itemId).then((currentItem) => {
                return itemCollection.updateOne({
                    _id: itemId
                }, {
                        $pull: {
                            comments: {
                                _id: commentId
                            }
                        }
                    });
            });
        }).catch((error) => {
            return Promise.reject("Item Collection: Remove Comment From Item Error");
        });
    }
}

module.exports = exportedMethods;