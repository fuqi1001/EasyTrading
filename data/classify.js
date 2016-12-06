let classifyList = [
    {
        _id: 1,
        name: "Electronics"
    },
    {
        _id: 2,
        name: "Clothing, Shoes, &Jewelry",
    },
    {
        _id: 3,
        name: "Computers",
    },
    {
        _id: 4,
        name: "Books"
    },
    {
        _id: 5,
        name: "Pet Supplies"
    },
    {
        _id: 6,
        name: "Home Supplies"
    }
];

let exportedMethods = {
    getAllClassify: () => { return Promise.resolve(classifyList.slice(0)); },
    getClassify: (id) => {
        if (id === undefined) return Promise.reject("No classify id provided");

        let classify = classifyList.filter(x => x._id == id).shift();
        if (!classify) return Promise.reject("No classify found")

        return Promise.resolve(classify);
    }
}

module.exports = exportedMethods;

