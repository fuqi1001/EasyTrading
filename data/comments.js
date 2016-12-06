
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const apartments = require("./apartments");
const items = require("./items");
const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {
    getAllComments() {
        return comments().then((commentCollection) => {
            return commentCollection.find({}).toArray();
        }).catch((error) => {
            return Promise.reject("Comment Collection: Get All Comments Error");
        });
    },
    getCommentsByTypeId(typeId) {
        if (!typeId) return Promise.reject("No typeId provided");

        return comments().then((commentCollection) => {
            return commentCollection.find({
                typeId: typeId
            }).toArray();
        }).catch((error) => {
            return Promise.reject("Comment Collection: Get Comments By RecipeId Error");
        });
    },
    getCommentsByCommentId(commentId) {
        if (!commentId) return Promise.reject("No commentId provided");

        return comments().then((commentCollection) => {
            return commentCollection.findOne({
                _id: commentId
            }).then((comment) => {
                if (!comment) throw "Comment not found";
                return comment;
            });
        }).catch((error) => {
            return Promise.reject("Comment Collection: Get Comments By CommentId Error");
        });
    },
    addCommentToType(posterId, comment, typeId, type) {
        if (typeof comment !== "string") return Promise.reject("No comment content provided");
        if (typeof type !== "string") return Promise.reject("No comment type provided");

        console.log(posterId + " " + comment + " " + typeId + " " + type);

        return comments().then((commentCollection) => {
            return users.getUserById(posterId).then((userCreated) => {
                console.log(userCreated.userName);
                if (type == "item") {
                    let newComment = {
                        _id: uuid.v4(),
                        posterId: posterId,
                        posterUser: `${userCreated.userName}`,
                        typeId: typeId,
                        type: type,
                        comment: comment
                    };
                
                    return items.addCommentToItem(posterId,newComment.posterUser, comment, newComment.id, typeId).then(() => {
                        return commentCollection.insertOne(newComment).then((newInsertInformation) => {
                            return newInsertInformation.insertedId;
                        }).then((newId) => {
                            return this.getCommentsByCommentId(newId);
                        }).catch((error) => {
                            console.log("add Comment error");
                            console.log(error);
                        });
                    });
                } else if (type == "apartment") {
                    let newComment = {
                        _id: uuid.v4(),
                        posterId: posterId,
                        posterUser: `${userCreated.userName}`,
                        typeId: typeId,
                        type: type,
                        comment: comment
                    };

                    return apartments.addCommentToApartment(posterId,newComment.posterUser,comment, newComment._id, typeId).then(() => {
                        return commentCollection.insertOne(newComment).then((newInsertInformation) => {
                            return newInsertInformation.insertedId;
                        }).then((newId) => {
                            return this.getCommentsByCommentId(newId);
                        }).catch((error) => {
                            console.log("add Comment error");
                            console.log(error);
                        });
                    });
                }
            });
        }).catch((error) => {
            return Promise.reject("Comment Collection: Add Comment To Type Error" + error);
        });
    },
    updateCommentByTypeId(typeId, type, commentId, updateComment) {
        return comments().then((commentCollection) => {
            let updatedCommentData = {};

            if (updateComment.comment) {
                updatedCommentData.comment = updateComment.comment;
            }

            if (updateComment.posterId) {
                updatedCommentData.posterId = updateComment.posterId;
            }

            if (updateComment.posterUser) {
                updatedCommentData.posterUser = updateComment.posterUser;
            }

            let updateCommand = {
                $set: updatedCommentData
            };

            if (type == "item") {
                return items.updateCommentToItem(typeId, commentId, updatedCommentData).then(() => {
                    return commentCollection.updateOne({ _id: commentId }, updateCommand).then((result) => {
                        return this.getCommentsByCommentId(commentId);
                    });
                });
            } else if(type == "apartment"){
                return apartments.updateCommentToApartment(typeId, commentId, updatedCommentData).then(() => {
                    return commentCollection.updateOne({ _id: commentId }, updateCommand).then((result) => {
                        return this.getCommentsByCommentId(commentId);
                    });
                });
            }
        }).catch((error) => {
            return Promise.reject("Comment Collection: Update Comment By RecipeId Error");
        });
    },
    removeComment(commentId) {
        return comments().then((commentCollection) => {
            return commentCollection.findOne({
                _id: commentId
            }).then((commentInfo) => {
                if(commentInfo.type == "item"){
                    return items.removeCommentFromItem(commentInfo.typeId, commentId);
                } else if(commentInfo.type == "apartment"){
                    return apartments.removeCommentFromApartment(commentInfo.typeId, commentId);
                }
            }).then(() => {
                return commentCollection.removeOne({
                    _id: commentId
                }).then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        throw (`Could not delete comment with id of ${commentId}`)
                    }
                });
            })
        }).catch((error) => {
            return Promise.reject("Comment Collection: Remove Comment Error");
        });
    }
}

module.exports = exportedMethods;