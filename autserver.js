require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

//  method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
app.use(express.json());

let refreshtoken = [];

app.get('/', (req, res) => {
    res.json({ mes: '2nd server is on now...' });
})


// logout to remove token
app.delete('/logout', (req,res) => {
    refreshtoken = refreshtoken.filter(token => token !== req.body.token);
    res.sendStatus(204);
})
// post api to get token again from refres token

app.post('/token', (req, res) => {
    const rftoken = req.body.token;

    // check wether token is null or not.
    if (rftoken == null) return res.sendStatus(401);
    if (!refreshtoken.includes(rftoken)) return res.sendStatus(403);

    // if refresh toke is verify then generate new authtoken again
    jwt.verify(rftoken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);
        const authToken = genrateAeccessToken(user);
        res.json({ authToken: authToken });
    });
});
app.post('/login', (req, res) => {
    //Athenticate first
    const username = req.body.username;
    const user = {
        name: username
    }
    const authToken = genrateAeccessToken(user);

    // generate refreshtoken
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
    refreshtoken.push(refreshToken);
    res.json({ authToken: authToken, refreshToken: refreshToken });
});

function genrateAeccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' })
}

app.listen(3000);
console.log('server start on 3000 port.')