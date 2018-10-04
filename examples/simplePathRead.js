let PathRead = require('../PathRead')
let http = require('http')

http.createServer({
    IncomingMessage: require('parsedmessage'),
    ServerResponse: require('serverfailsoft'),
}, (req, res) => {
    req.pipe(new PathRead).pipe(res)
}).listen(3000)
