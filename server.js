require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

//  method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
app.use(express.json());

// object which we pass in response
const userData = [{
    username: 'harsh',
    title: 'software developer'
}, {
    username: 'Deep',
    title: 'software developer'
}]

app.get('/getuser', authenticateToken, (req, res) => {
    res.json(userData.filter(data => data.username === req.user.name));
    //res.send({ data: 'get route called.' });
});

function authenticateToken(req, res, next) {
    const autHeader = req.headers['authorization'];
    const token = autHeader && autHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}
app.listen(5000);
console.log('server start on 5000 port.')