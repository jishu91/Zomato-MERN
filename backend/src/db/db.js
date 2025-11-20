const mongossee = require('mongoose');

function connectDB() {
    mongossee.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Database connected successfully');
        })
        .catch((err) => {
            console.error('Database connection error:', err);
        });
} 

module.exports = connectDB;