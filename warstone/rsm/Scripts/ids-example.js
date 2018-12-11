
//TODO Replace with your app id.
let appId = "12027"; 

//TODO Replace with your app secret.
let appSecret = "bd330c11-ec4e-4aec-9dd1-619885354af7"; 

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
