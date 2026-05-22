const { betterAuth } = require("better-auth");
const { MongoClient } = require("mongodb");

// Better Auth requires a direct link to your connection string
const client = new MongoClient(process.env.MONGO_URI);

const auth = betterAuth({
    database: {
        db: client.db("pet-adoption"), // Ensure this matches your database name
        type: "mongodb"
    },
    emailAndPassword: {
        enabled: true // Enables standard signup/login with email + password
    },
   trustedOrigins: [
        "http://localhost:3000", 
        "https://your-vercel-frontend-url.vercel.app"
    ],

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID ,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET 
        }
    },
    // Used to sign session cookies securely
    secret: process.env.BETTER_AUTH_SECRET
});

module.exports = { auth };