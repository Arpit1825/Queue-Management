const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
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
    console.log("MongoDB error detected:", err);
});

module.exports = mongoose.connection;