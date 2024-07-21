const { MongoClient } = require("mongodb");

let dbConnection;
// Your MongoDB connection string
const connectUrl = "mongodb+srv://santhoshr785:euStwaqLUsRQuGry@testdata.doeja6c.mongodb.net/?retryWrites=true&w=majority&appName=TestData";
const options = {
    tls: true,
    tlsAllowInvalidCertificates: true, // Set to false in production if not using self-signed certificates
    // useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};;

module.exports = {
    /* Function to connect database */
    connectToDb: (callback) => {
        console.log("Waiting for connection..")
        MongoClient.connect(connectUrl, options)
        .then((client) => {
            dbConnection = client.db("sample_mflix");
            console.log("Connected to the database ):")
            return callback();
        })
        .catch(err => {
            console.log("Db connection error: ", err.message);
            return callback(err);
        })
    },
    /* Function to get database connection */
    getDb: () => {
        if (!dbConnection) throw new Error("Database not connected");
        return dbConnection;
    }
}