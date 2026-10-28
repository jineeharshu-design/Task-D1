
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const https = require('https');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, admin } = require('./firebaseAdmin');
const { FieldValue } = require('firebase-admin/firestore');

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://devdeak1n.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Check required settings
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from .env');
}

// Reusable email helpers
function getEmail(value) {
    return typeof value === 'string'
        ? value.trim().toLowerCase()
        : '';
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// BREVO REQUEST 
function brevoRequest(path, data) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data);

        const options = {
            hostname: 'api.brevo.com',
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'Content-Length': Buffer.byteLength(jsonData)
            }
        };

        const request = https.request(options, (response) => {
            let responseData = '';

            response.on('data', (chunk) => {
                responseData += chunk;
            });

            response.on('end', () => {
                resolve({
                    statusCode: response.statusCode,
                    body: responseData
                });
            });
        });

        request.on('error', reject);

        request.setTimeout(15000, () => {
            request.destroy(new Error('Brevo request timed out.'));
        });

        request.write(jsonData);
        request.end();
    });
}

// HOME 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// NEWSLETTER 
app.post('/subscribe', async (req, res) => {
    const email = getEmail(req.body.email);

    if (!email || !isValidEmail(email)) {
        return res.status(400).send(
            'Please enter a valid email address.'
        );
    }

    if (
        !process.env.BREVO_API_KEY ||
        !process.env.BREVO_LIST_ID ||
        !process.env.BREVO_WELCOME_TEMPLATE_ID
    ) {
        console.error('Brevo environment variables are missing.');

        return res.status(500).send(
            'Email service is not configured.'
        );
    }

    try {
        // Add user to the newsletter list
        const contactResult = await brevoRequest('/v3/contacts', {
            email,
            listIds: [Number(process.env.BREVO_LIST_ID)],
            updateEnabled: true
        });

        console.log(
            'Brevo Contact Status Code:',
            contactResult.statusCode
        );
        console.log('Brevo Contact Response:', contactResult.body);

        if (
            contactResult.statusCode < 200 ||
            contactResult.statusCode >= 300
        ) {
            return res.status(502).send(
                'Subscription failed. Please try again.'
            );
        }

        // Send the welcome email
        const welcomeResult = await brevoRequest('/v3/smtp/email', {
            to: [{ email }],
            templateId: Number(
                process.env.BREVO_WELCOME_TEMPLATE_ID
            )
        });

        console.log(
            'Brevo Welcome Email Status Code:',
            welcomeResult.statusCode
        );
        console.log(
            'Brevo Welcome Email Response:',
            welcomeResult.body
        );

        if (
            welcomeResult.statusCode < 200 ||
            welcomeResult.statusCode >= 300
        ) {
            return res.status(502).send(
                'Subscribed successfully, but the welcome email could not be sent.'
            );
        }

        return res.status(200).send(
            'Successfully subscribed! Please check your inbox for your welcome email.'
        );
    } catch (error) {
        console.error('Newsletter request failed:', error.message);

        return res.status(502).send(
            'Unable to contact the email service. Please try again.'
        );
    }
});

// REGISTRATION 
app.post('/api/register', async (req, res) => {
    try {
        const name =
            typeof req.body.name === 'string'
                ? req.body.name.trim()
                : '';

        const email = getEmail(req.body.email);

        const password =
            typeof req.body.password === 'string'
                ? req.body.password
                : '';

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required.'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters.'
            });
        }

        const existingUser = await db
            .collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!existingUser.empty) {
            return res.status(409).json({
                message: 'An account with this email already exists.'
            });
        }

        // Hash the password before storing it
        const passwordHash = await bcrypt.hash(password, 12);

        const userData = {
            name,
            email,
            passwordHash,
            plan: 'Free',
            createdAt: FieldValue.serverTimestamp()
        };

        const userRef = await db.collection('users').add(userData);

        return res.status(201).json({
            message: 'Registration successful.',
            user: {
                id: userRef.id,
                name,
                email,
                plan: 'Free'
            }
        });
    } catch (error) {
        console.error('Registration error:', error.message);

        return res.status(500).json({
            message: 'Registration failed. Please try again.'
        });
    }
});

// LOGIN 
app.post('/api/login', async (req, res) => {
    try {
        const email = getEmail(req.body.email);

        const password =
            typeof req.body.password === 'string'
                ? req.body.password
                : '';

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        const result = await db
            .collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (result.empty) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const userDoc = result.docs[0];
        const user = userDoc.data();

        if (!user.passwordHash) {
            return res.status(401).json({
                message: 'This account needs to be registered using the current registration system.'
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        // Create a signed JWT that expires in two hours
        const token = jwt.sign(
            {
                userId: userDoc.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: userDoc.id,
                name: user.name,
                email: user.email,
                plan: user.plan || 'Free'
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            message: 'Login failed. Please try again.'
        });
    }
});

// VERIFY JWT 
function authenticateToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Please log in to continue.'
        });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                message: 'Your session is invalid or expired. Please log in again.'
            });
        }

        req.user = decoded;
        next();
    });
}

// CURRENT USER 
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const userDoc = await db
            .collection('users')
            .doc(req.user.userId)
            .get();

        if (!userDoc.exists) {
            return res.status(404).json({
                message: 'User account not found.'
            });
        }

        const user = userDoc.data();

        return res.status(200).json({
            user: {
                id: userDoc.id,
                name: user.name,
                email: user.email,
                plan: user.plan || 'Free'
            }
        });
    } catch (error) {
        console.error('User lookup error:', error.message);

        return res.status(500).json({
            message: 'Could not retrieve user details.'
        });
    }
});

app.post('/api/upgrade', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'Invalid authentication token.'
      });
    }

    await db.collection('users').doc(userId).update({
      plan: 'Paid',
      upgradedAt: FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      message: 'Your demo upgrade was successful.',
      plan: 'Paid'
    });
  } catch (error) {
    console.error('Upgrade failed:', error);

    return res.status(500).json({
      message: 'Could not update your plan.'
    });
  }
});

// START SERVER 
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
