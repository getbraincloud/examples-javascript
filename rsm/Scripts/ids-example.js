
//TODO Add your app id.
let appId = "..."; 

//TODO Add your app secret.
let appSecret = "..."; 

//TODO Add your chosen ports.
let tcp = 0;
let http = 0;
let ws = 0;

let ports = { 
    tcp: tcp,
    http: http,
    ws: ws
}

module.exports = {
    appId: appId, 
    appSecret: appSecret, 
    ports: ports
}
