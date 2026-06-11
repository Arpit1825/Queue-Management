const mongoose = require('mongoose');
const config = require('./development.json');

mongoose.connect(config.MONGODB_URI)
.then(() => {

    console.log("Connected");
    console.log(
        "DB:",
        mongoose.connection.db.databaseName
    );

    console.log(
        "Host:",
        mongoose.connection.host
    );

})
.catch((err) => {
    console.log("❌ MongoDB error detected:", err);
});

module.exports = mongoose.connection;