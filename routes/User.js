const express = require('express');
const { fetchLoggedInUser, updateUser } = require('../controller/User');

const router = express.Router();

router.get('/:id', fetchLoggedInUser).put('/:id', updateUser);

exports.router = router;