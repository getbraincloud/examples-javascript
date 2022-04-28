const express = require('express');
const app = express();
const port = parseInt(process.env.PORT, 10) || 3500;
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "577823594134-gvna8lt32vupoo36kmbii48408dams5r.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.json());
app.get('/', (req, res)=>{
    res.render('index')
})
app.post('/', (req, res)=>{
    let email = req.body.email;
    let user_id = req.body.user_id;
    let id_token = req.body.id_token;
    let access_token = req.body.access_token;
    console.log('email:\n'+ email +'\nid_toke:\n'+ id_token);

    res.send('success verify user id_token');                   

    _bc.authenticateGoogleOpenId(user_id, id_token, true, result =>
    {
        var status = result.status;
        console.log(status + " : " + JSON.stringify(result, null, 2));
        if (status == 200){
            _bc.playerState.readUserState(result =>
            {
                var status = result.status;
                console.log(status + " : " + JSON.stringify(result, null, 2));
            });
        }
    });
})
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

const lib = require('./ids.js');

// Set up XMLHttpRequest.
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
window = {
    XMLHttpRequest: XMLHttpRequest
};
XMLHttpRequest.UNSENT = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;
// Set up WebSocket.
WebSocket = require('ws');
// Set up LocalStorage.
LocalStorage = require('node-localstorage').LocalStorage;
os = require('os');
var configDir = os.homedir() + "/.bciot";
localStorage = new LocalStorage(configDir);
const BC = require('braincloud');

var _bc = new BC.BrainCloudWrapper("newrapp");
_bc.initialize(lib.appId, lib.appSecret, "1.0.0");
if (lib.url) _bc.brainCloudClient.setServerUrl(lib.url);
_bc.brainCloudClient.enableLogging(true);