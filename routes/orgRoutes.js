const express = require('express');
const { getUserOrganisations, createOrganisation, addUserToOrganisation } = require('../controllers/orgController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/organisations', authMiddleware, getUserOrganisations);
router.post('/organisations', authMiddleware, createOrganisation);
router.post('/organisations/:orgId/users', authMiddleware, addUserToOrganisation);

module.exports = router;
