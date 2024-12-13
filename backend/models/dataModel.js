// const mongoose = require('mongoose');

// const dataSchema = new mongoose.Schema({
// 	name: String,
// 	phoneNumber: String,
// 	email: String,
// 	hobbies: String
// });

// const Data = mongoose.model('Data', dataSchema);

// module.exports = Data;

// const { getDB } = require('../config/db');


	const db = new duckdb.Database('my_database.duckdb');
	console.log('Connected to DuckDB');
	const conn = db.connect();
	conn.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT
);`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Table created successfully');
  }
});
	// conn.close();


// const findAll = async () => {
// 	const db = getDB();
// 	const conn = db.connect();
// 	const rows = await conn.all('SELECT * FROM data;');
// 	conn.close();
// 	console.log("Rows", rows);
// 	return rows;
// };
const findAll = async () => {
    const db = getDB();
    const conn = db.connect();
    try {
        // Properly execute and await the query
        const rows = await conn.all('SELECT * FROM data;');
        console.log("Rows:", rows); // Now rows should contain an array of objects
        return rows;
    } catch (error) {
        console.error("Error fetching rows:", error);
        throw error;
    } finally {
        conn.close(); // Ensure connection is closed
    }
};


const insertOne = async (data) => {
	const db = getDB();
	const conn = db.connect();
	const { name, phoneNumber, email, hobbies } = data;
	await conn.run(
		'INSERT INTO data (name, phoneNumber, email, hobbies) VALUES (?, ?, ?, ?);',
		[name, phoneNumber, email, hobbies]
	);
	conn.close();
};

const deleteOne = async (id) => {
	const db = getDB();
	const conn = db.connect();
	await conn.run('DELETE FROM data WHERE id = ?;', [id]);
	conn.close();
};

const deleteMany = async (ids) => {
	const db = getDB();
	const conn = db.connect();
	const idPlaceholders = ids.map(() => '?').join(',');
	await conn.run(`DELETE FROM data WHERE id IN (${idPlaceholders});`, ids);
	conn.close();
};

const findManyByIds = async (ids) => {
	const db = getDB();
	const conn = db.connect();
	const idPlaceholders = ids.map(() => '?').join(',');
	const rows = await conn.all(`SELECT * FROM data WHERE id IN (${idPlaceholders});`, ids);
	conn.close();
	return rows;
};

module.exports = { createTable, findAll, insertOne, deleteOne, deleteMany, findManyByIds };
