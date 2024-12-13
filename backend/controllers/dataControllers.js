const { findAll, insertOne, deleteOne, deleteMany, findManyByIds } = require('../models/dataModel');
const nodemailer = require('nodemailer');

const getData = async (req, res) => {
	try {
		const data = await findAll();
		console.log("data:", data);
		res.json(data);
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const addData = async (req, res) => {
	try {
		await insertOne(req.body);
		console.log("Data added successfully")
		res.status(201).json({ message: 'Data added successfully' });
	} catch (error) {
		console.error('Error adding data:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const deleteData = async (req, res) => {
	try {
		await deleteOne(parseInt(req.params.id, 10));
		res.status(204).send();
	} catch (error) {
		console.error('Error deleting data:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const deleteRows = async (req, res) => {
	try {
		const { rows } = req.body;
		await deleteMany(rows);
		res.status(204).send();
	} catch (error) {
		console.error('Error deleting rows:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const sendEmail = async (req, res) => {
	try {
		const { rows } = req.body;
		const data = await findManyByIds(rows);
		const emailContent = data
			.map((item) => {
				return `
        Name: ${item.name}
        Phone Number: ${item.phoneNumber}
        Email: ${item.email}
        Hobbies: ${item.hobbies}
        ------------------------------
      `;
			})
			.join('');

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: 'info@redpositive.in',
			subject: 'Selected Data',
			text: emailContent
		};

		await transporter.sendMail(mailOptions);
		res.status(200).send();
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

module.exports = {
	getData,
	addData,
	deleteData,
	deleteRows,
	sendEmail
};
