var mongoose = require( 'mongoose' );
var readLine = require ("readline");


var dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI);


mongoose.connection.on('connected', function () {
 console.log('Mongoose connected to ' + dbURI);
});


mongoose.connection.on('error',function (err) {
 console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
 console.log('Mongoose disconnected');
});




if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
    rl.on("SIGUSR2", function () {
        process.emit("SIGUSR2");
    })
}

var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});


// BRING IN YOUR SCHEMAS & MODELS
require('./locations');