
const mongoCollections = require("../config/mongoCollections");
const apartments = mongoCollections.apartments;
const users = require("./users");
const locations = require("./locations");
const uuid = require('node-uuid');

let exportedMethods = {
    getAllApartments() {
        return apartments().then((apartmentCollection) => {
            return apartmentCollection.find({}).toArray();
        }).catch((error) => {
            return Promise.reject("Apartment Collection: Get All Apartments Error");
        });
    },

    getApartmentByLocationId(locationid){
        return apartments().then((apartmentCollection) => {
            return apartmentCollection.find({locationid: locationid}).toArray();
        }).catch((error) => {
            return Promise.reject("Apartment Collection: Get Apartments By LocationId Error");
        });
    },

    
    getApartmentById(id) {
        if (id === undefined) return Promise.reject("Apartment Collection: No Apartment Id provided");

        return apartments().then((apartmentCollection) => {
            return apartmentCollection.findOne({ _id: id }).then((apartment) => {
                if (!apartment) throw "Apartment not found";
                return apartment;
            });
        }).catch((error) => {
            return Promise.reject("Apartment Collection: Get Apartment By Id Error");
        });
    },
    addApartment(createrid, locationid, name, addressDetail, price, description, comments) {
        if (typeof addressDetail !== "string") return Promise.reject("No apartment address detail provided");
        if (typeof price !== "string") return Promise.reject("No apartment price provided");
        if (typeof description !== "string") return Promise.reject("No apartment description provided");
        if (!Array.isArray(comments)) { comments = []; }

        return apartments().then((apartmentCollection) => {
            let newApartment = {
                _id: uuid.v4(),
                createrid: createrid,
                locationid: locationid,
                name: name,
                addressDetail: addressDetail,
                price: price,
                description: description,
                comments: comments
            };

            return apartmentCollection.insertOne(newApartment).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getApartmentById(newId);
            });
        }).catch((error) => {
            return Promise.reject("Apartment Collection: Add Apartment Error");
        });
    },
    removeApartment(id) {
        if (id === undefined) return Promise.reject("Apartment Collection: No Apartment Id provided");

        return apartments().then((apartmentCollection) => {
            return apartmentCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete Apartment with id of ${id}`)
                }
            });
        }).catch((error) => {
            return Promise.reject("Apartment Collection: Remove Apartment By Id Error");
        });
    },
    updateApartment(id, updatedApartment) {
        if (id === undefined) return Promise.reject("Apartment Collection: No Apartment Id provided");

        return apartments().then((apartmentCollection) => {
            let updatedApartmentData = {};
            if (updatedApartment.createrid) {
                updatedApartmentData.createrid = updatedApartment.createrid;
            }
            if (updatedApartment.locationid) {
                updatedApartmentData.locationid = updatedApartment.locationid;
            }
            if (updatedApartment.name) {
                updatedApartmentData.name = updatedApartment.name;
            }
            if (updatedApartment.price) {
                updatedApartmentData.price = updatedApartment.price;
            }
            if (updatedApartment.description) {
                updatedApartmentData.description = updatedApartment.description;
            }

            let updateCommand = {
                $set: updatedApartmentData
            };

            return apartmentCollection.updateOne({ _id: id }, updateCommand).then(() => {
                return this.getApartmentById(id);
            });
        }).catch((error) => {
            return Promise.reject("Apartment Collection: Update Apartment Error");
        });
    },

    addCommentToApartment(posterId, posterUser, comment, commentId, apartmentId) {
        return this.getApartmentById(apartmentId).then((currentApartment) => {
            return apartments().then((apartmentCollection) => {
                return apartmentCollection.updateOne({
                    _id: apartmentId
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
            return Promise.reject("Apartment Collection: Add Comment To Apartment Error");
        });
    },
    updateCommentToApartment(apartmentId, commentId, updatedComment) {
        return apartments().then((apartmentCollection) => {
            return apartmentCollection.find({
                _id: apartmentId,
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

                    return apartments().then((apartmentCollection) => {
                        return apartmentCollection.update({
                            _id: apartmentId,
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
            return Promise.reject("Apartment Collection: Update Comment To Apartment Error");
        });
    },
    removeCommentFromItem(apartmentId, commentId) {
        return apartments().then((apartmentCollection) => {
            return this.getApartmentById(apartmentId).then((currentApartment) => {
                return apartmentCollection.updateOne({
                    _id: apartmentId
                }, {
                        $pull: {
                            comments: {
                                _id: commentId
                            }
                        }
                    });
            });
        }).catch((error) => {
            return Promise.reject("Apartment Collection: Remove Comment From Apartment Error");
        });
    }
}

module.exports = exportedMethods;