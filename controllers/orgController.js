const User = require('../models/user');
const organisation = require('../models/organisation');

exports.getUserOrganisations = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: Organisation
    });
    res.status(200).json({
      status: 'success',
      message: 'organisations retrieved successfully',
      data: {
        organisations: user.organisations,
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Error retrieving organisations',
      statusCode: 400,
    });
  }
};

exports.createOrganisation = async (req, res) => {
  const { name, description } = req.body;
  try {
    const orgId = `org-${Date.now()}`;
    const newOrganisation = await organisation.create({ orgId, name, description });
    await newOrganisation.addUser(req.user.userId);
    res.status(201).json({
      status: 'success',
      message: 'organisation created successfully',
      data: {
        orgId: newOrganisation.orgId,
        name: newOrganisation.name,
        description: newOrganisation.description,
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};

exports.addUserToOrganisation = async (req, res) => {
  const { userId } = req.body;
  const { orgId } = req.params;
  try {
    const organisation = await organisation.findByPk(orgId);
    await organisation.addUser(userId);
    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};
