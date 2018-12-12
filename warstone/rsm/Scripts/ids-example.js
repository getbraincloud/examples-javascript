
//TODO Add your app id.
let appId = "..."; 

//TODO Add your app secret.
let appSecret = "..."; 

let ports = { 
    tcp: 9306,
    http: 9308,
    ws: 9310
}

module.exports = {
    appId:appId, 
    appSecret:appSecret, 
    ports: ports
}
