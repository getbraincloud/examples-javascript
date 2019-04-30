exports.log = function(message)
{
    console.log(`${(new Date()).toLocaleTimeString()} | ${message}`);
}
