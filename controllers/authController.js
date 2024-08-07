const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Organisation = require('../models/organisation');

require('dotenv').config();

// Controller actions
const UserController = {
    // Register user
    registerUser: async (req, res) => {
        const { firstName, lastName, email, password, phone } = req.body;
        console.log('Received registration request with data:', req.body);

        if (!firstName || !lastName || !email || !password) {
            return res.status(422).json({
                errors: [
                    { field: 'firstName', message: 'First name is required' },
                    { field: 'lastName', message: 'Last name is required' },
                    { field: 'email', message: 'Email is required' },
                    { field: 'password', message: 'Password is required' },
                ],
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = `user-${Date.now()}`;
            const newUser = await User.create({
                userId, firstName, lastName, email, password: hashedPassword, phone,
            });

            console.log('User created successfully:', newUser);

            const orgId = `org-${Date.now()}`;
            const orgName = `${firstName}'s Organization`;
            await Organisation.create({ orgId, name: orgName, description: '', Users: [newUser] }, {
                include: [User]
            });
            console.log('Organisation created successfully for user:', newUser.userId);
            const token = jwt.sign({ userId: newUser.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

            console.log('JWT token generated successfully:', token);

            res.status(201).json({
                status: 'success',
                message: 'Registration successful',
                data: {
                    accessToken: token,
                    user: {
                        userId: newUser.userId,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        phone: newUser.phone,
                    }
                }
            });
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(400).json({
                status: 'Bad request',
                message: 'Registration unsuccessful',
                statusCode: 400,
            });
        }
    },

    // Login user
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(422).json({
                errors: [{
                    field: 'email',
                    message: 'Email is required',
                },
                {
                    field: 'password',
                    message: 'Password is required',
                }],
            });
        }

        try {
            const user = await User.findOne({ where: { email } });
            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).json({
                    status: 'Bad request',
                    message: 'Authentication failed',
                    statusCode: 401,
                });
            }
            const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: {
                    accessToken: token,
                    user: {
                        userId: user.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                    }
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(400).json({
                status: 'Bad request',
                message: 'Authentication failed',
                statusCode: 401,
            });
        }
    }
};

// Export controller methods
module.exports = UserController;
