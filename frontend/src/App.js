import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

// const API_URL = 'http://localhost:3001';
const API_URL = 'https://data-management-backend.onrender.com/api';

const App = () => {
	const [ data, setData ] = useState([]);
	const [ selectedRows, setSelectedRows ] = useState([]);
	const [ isRowSelected, setisRowSelected ] = useState(false);
	const [ modalIsOpen, setModalIsOpen ] = useState(false);
	const [ formData, setFormData ] = useState({
		name: '',
		phoneNumber: '',
		email: '',
		hobbies: ''
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await axios.get(`${API_URL}/data`);
			// setData(response.data);
			setData(Array.isArray(response.data) ? response.data : []);
			console.log(response.data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${API_URL}/data`, formData);
			setModalIsOpen(false);
			fetchData();
			setFormData({ name: '', phoneNumber: '', email: '', hobbies: '' });
		} catch (error) {
			console.error('Error adding data:', error);
		}
	};

	const handleRowSelection = (row) => {
		const { _id, isSelected } = row;
		const selected = [ ...selectedRows ];

		console.log(_id);
		console.log(row.isSelected);
		if (isSelected) {
			selected.push(_id);
		} else {
			const index = selected.indexOf(_id);
			if (index > -1) {
				selected.splice(index, 1);
			}
		}
		setSelectedRows(selected);
		setisRowSelected(selected.length > 0);
	};

	// const handleSendEmail = async () => {
	// 	try {
	// 		await axios.post(`${API_URL}/email`, { rows: selectedRows });
	// 		alert('Email sent successfully!');
	// 	} catch (error) {
	// 		alert('Make your google account less secure so that you can send the mail');
	// 		console.error('Error sending email:', error);
	// 	}
	// };

	// const handleDeleteRows = async () => {
	// 	try {
	// 		await axios.post(`${API_URL}/data/delete`, { rows: selectedRows });
	// 		fetchData();
	// 		setSelectedRows([]);
	// 	} catch (error) {
	// 		console.error('Error deleting rows:', error);
	// 	}
	// };

	const handleEdit = (row) => {
		setFormData({
			name: row.name,
			phoneNumber: row.phoneNumber,
			email: row.email,
			hobbies: row.hobbies
		});
		setModalIsOpen(true);
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`${API_URL}/data/${id}`);
			fetchData();
		} catch (error) {
			console.error('Error deleting data:', error);
		}
	};

	return (
		<div className="App">
			<h1>Data Management</h1>
			<div className="op addData">
				<button onClick={() => setModalIsOpen(true)}>Add New Data</button>
			</div>

			{/* <div className="op mail">
				{isRowSelected && <button onClick={handleSendEmail}>Send Mail</button>}
				{isRowSelected && <button onClick={handleDeleteRows}>Delete Data</button>}
			</div> */}
			<div class="table-container">
				<table border={1}>
					<thead>
						<tr>
							{/* <th>Select</th> */}
							{/* <th>ID</th> */}
							<th>Name</th>
							<th>Phone Number</th>
							<th>Email</th>
							<th>Hobbies</th>
							<th>Update/Delete</th>
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr key={row._id}>
								{/* <td className="checkbox">
									<input
										type="checkbox"
										checked={selectedRows.includes(row._id)}
										// onChange={() => handleRowSelection(row)}
										onChange={() =>
											handleRowSelection({ ...row, isSelected: !selectedRows.includes(row._id) })}
									/>
								</td> */}
								{/* <td>{row._id}</td> */}
								<td>{row.name}</td>
								<td>{row.phoneNumber}</td>
								<td>{row.email}</td>
								<td>{row.hobbies}</td>
								<td>
									<div className="op2">
										<button onClick={() => handleEdit(row)}>Duplicate</button>
										<button onClick={() => handleDelete(row._id)}>Delete</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Modal
				className="modal"
				isOpen={modalIsOpen}
				onRequestClose={() => setModalIsOpen(false)}
				contentLabel="Add New Data"
			>
				<div class="whole-cont">
					<h1>Add New Data</h1>
					<form onSubmit={handleFormSubmit}>
						<div class="whole">
							<label>
								<h2>Name:</h2>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</label>
							<label>
								<h2>Phone Number:</h2>
								<input
									type="text"
									name="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleInputChange}
									required
								/>
							</label>
							<label>
								<h2>Email: </h2>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
							</label>
							<label>
								<h2>Hobbies:</h2>
								<input
									type="text"
									name="hobbies"
									value={formData.hobbies}
									onChange={handleInputChange}
									required
								/>
							</label>
						</div>
						<div class="form">
							<button type="submit">Save</button>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
};

export default App;
