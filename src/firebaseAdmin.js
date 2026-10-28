
require('dotenv').config();

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
    throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_PATH is missing from .env'
    );
}

const serviceAccount = require(
    path.resolve(__dirname, '..', serviceAccountPath)
);

const existingApps = getApps();

const firebaseApp = existingApps.length
    ? existingApps[0]
    : initializeApp({
        credential: cert(serviceAccount),
    });

const db = getFirestore(firebaseApp);

module.exports = {
    admin: require('firebase-admin'),
    db,
};
