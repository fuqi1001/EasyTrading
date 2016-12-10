const express = require('express');
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const userData = data.users;
const classifyData = data.classify;

// define a middleware function to be used for every secured routes
var isLogIn = function (req, res, next) {
    //console.log(req.session);
    if (req.isAuthenticated()) { //if user is authenticated in the session, carry on
        return next();
    }
    res.redirect('/login'); //if they aren't, redirect them to the login page
};

router.get("/:id", isLogIn, (req, res) => {
    return itemData.getItemById(req.params.id).then((item) => {
        return userData.getUserById(item.createrid).then((creater) => {
            return classifyData.getClassify(item.classifyid).then((classify) => {
                return res.render("itemInfo", { myitem: item, creater: creater.userName, classify: classify.name, partial: "itemInfo-scripts" });
            });
        });
    });
});

/*router.get("/", isLogIn, (req, res) => {
    return itemData.getAllItems().then((itemList)=>{
        return classifyData.getAllClassify().then((classifyList)=>{         
            return res.render("itemList", {myitems: itemList, myclassify: classifyList, partial: "itemList-scripts" });
        });
    });
});*/

router.get("/", isLogIn, (req, res) => {
    return itemData.getAllItems().then((itemList) => {
        return classifyData.getAllClassify().then((classifyList) => {
            return itemData.getItemByClassify('1').then((class1) => {
                return itemData.getItemByClassify('2').then((class2) => {
                    return itemData.getItemByClassify('3').then((class3) => {
                        return itemData.getItemByClassify('4').then((class4) => {
                            return itemData.getItemByClassify('5').then((class5) => {
                                return itemData.getItemByClassify('6').then((class6) => {
                                    //console.log(class1);
                                    // console.log(class1);
                                    // console.log(class2);
                                    // console.log(class3);
                                    // console.log(class4);
                                    // console.log(class5);
                                    // console.log(classifyList);
                                    return res.render("itemList", { classify1: class1, classify2: class2, classify3: class3, classify4: class4, classify5: class5, classify6: class6, myitems: itemList, myclassify: classifyList, partial: "itemList-scripts" });
                                })
                            })
                        })
                    })
                })
            })
        });
    });
});

module.exports = router;