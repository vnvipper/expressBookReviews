const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    let token = req.headers["authorization"];
    if (token) {
        token = token.split(" ")[1];
        jwt.verify(token, "access", (err, customer) => {
            if (!err) {
                req.customer = customer;
                next();
            }
            else {
                return res.status(403).json({ message: "Customer not authenticated!" })
            }
        });
    }
    else {
        return res.status(403).json({ message: "Invalid token!" })
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
