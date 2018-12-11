
//TODO Replace with your app id.
let appId = "12037"; 

//TODO Replace with your app secret.
let appSecret = "8e5b27b4-9157-4bdd-b2bf-159fd29cf8a4"; 

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
