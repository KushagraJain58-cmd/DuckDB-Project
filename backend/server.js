// const express = require('express');
const cors = require('cors');
// app.use('/api', dataRoutes);

const express = require('express');
const bodyParser = require('body-parser');
// const duckdb = require('duckdb');
const  {DuckDBInstance} = require('@duckdb/node-api');

const port = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Initialize DuckDB instance
let instance;
let connection;

async function initDatabase() {
  instance = await DuckDBInstance.create(':memory:'); // Create an in-memory database
  connection = await instance.connect();

  // Create a table for users
  await connection.run(`
    CREATE TABLE IF NOT EXISTS users (
      name TEXT,
      phoneNumber TEXT,
      email TEXT,
      hobbies TEXT
    );
  `);
  console.log('Table created successfully');
}

initDatabase().catch(err => console.error('Error initializing database:', err));

// CRUD Operations

// Create a new user
app.post('/data', async (req, res) => {
  const { name, phoneNumber, email, hobbies } = req.body;
  if (!name || !email || !phoneNumber || !hobbies) {
    return res.status(400).json({ error: 'Name, email, phone number, and hobbies are required' });
  }
  try {
    console.log('Inserting user with data:', { name, phoneNumber, email, hobbies });
    const query = `INSERT INTO users VALUES ('${name}','${phoneNumber}','${email}','${hobbies}')`;
    const result = await connection.run(query);
    console.log(result); 
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Read all users
app.get('/data', async (req, res) => {
  try {
    const result = await connection.prepare('SELECT * FROM users');
    console.log("Results", result);
    
    const users = await result.run();
    
    const chunks = [];
    while (true) {
      const chunk = await users.fetchChunk();
      // Last chunk will have zero rows.
      if (chunk.rowCount === 0) {
        break;
      }
      chunks.push(chunk);
    }

    // Retrieve column names from the result (assumed to be the same for all rows)
    const columnNames = users.columnNames(); // Get the column names

    // Assuming the chunk holds the data, let's convert it into rows with column names
    const rows = [];
    for (let chunk of chunks) {
      const chunkRows = chunk.getRows(); // Get rows from the chunk
      for (let row of chunkRows) {
        const cleanedRow = {};
        columnNames.forEach((colName, index) => {
          const value = row[index]; // Use index to map the column values correctly
          cleanedRow[colName] = value; // Map value to column name
        });
        rows.push(cleanedRow);
      }
    }

    console.log("Get Users:", rows);
    res.json(rows);  // Send back the rows with column names

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
// Delete a user by ID
app.delete('/data/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await connection.run(`DELETE FROM users WHERE id = ${id}`,);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
