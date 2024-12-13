// const mongoose = require('mongoose');

// const connectDB = async () => {
// 	try {
// 		const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
// 			useNewUrlParser: true,
// 			useUnifiedTopology: true
// 		});

// 		console.log(`MongoDB Connected: ${conn.connection.host}`);
// 	} catch (error) {
// 		console.log(`Error: ${error.message}`);
// 		process.exit();
// 	}
// };

// module.exports = {
// 	connectDB
// };


const duckdb = require('duckdb');

let db;

const connectDB = () => {
	try {
		db = new duckdb.Database('my_database.duckdb');
	console.log('Connected to DuckDB');
	} catch (error) {
		console.log(`Error: ${error.message}`);
		process.exit();
	}
	
};

const getDB = () => db;

module.exports = { connectDB, getDB };
