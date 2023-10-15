const express = require('express');
const { fetchLoggedInUserDetails, updateUser } = require('../controller/User');

const router = express.Router();

router.get('/my-profile', fetchLoggedInUserDetails).put('/my-profile', updateUser);

exports.router = router;