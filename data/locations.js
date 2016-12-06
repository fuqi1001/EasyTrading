let locationList = [
    {
        _id: 1,
        name: "Hoboken"
    },
    {
        _id: 2,
        name: "Jersey City"
    },
    {
        _id: 3,
        name: "Union City"
    },
    {
        _id: 4,
        name: "New York"
    },
    {
        _id: 5,
        name: "Newport"
    },
];

let exportedMethods = {
    getAllLocations: () => { return Promise.resolve(locationList.slice(0)); },
    getLocation: (id) => {
        if (id === undefined) return Promise.reject("No location id provided");

        let location = locationList.filter(x => x._id == id).shift();
        if (!location) return Promise.reject("No location found")

        return Promise.resolve(location);
    }
}

module.exports = exportedMethods;
