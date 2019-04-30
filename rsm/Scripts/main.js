// Imports
let brainclouds2s = require('brainclouds2s')
let globals = require('./globals')
let httpServer = require('./httpServer')
let ids = require('./ids')
let log = require('./log').log
let publicIp = require('public-ip')

// Init braincloud S2S
globals.s2sContext = brainclouds2s.init(
    ids.appId, 
    ids.serverName, 
    ids.serverSecret, 
    ids.url)
brainclouds2s.setLogEnabled(globals.s2sContext, true)

// Get our public ip address
publicIp.v4().then(ip =>
{
    globals.publicIP = ip
    log("Public IP: " + ip)

    // We can now start the server
    httpServer.start()
}, reason =>
{
    log("Failed to get public IP: " + reason)
})
