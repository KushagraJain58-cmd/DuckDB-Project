const express = require('express');
const { getData, addData, deleteData, deleteRows, sendEmail } = require('../controllers/dataControllers');

const router = express.Router();

router.route('/data').post(addData).get(getData);
router.route('/data/:id').delete(deleteData);
router.route('/data/delete').post(deleteRows);
router.route('/email').post(sendEmail);

module.exports = router;
