const { spawn   } = require('child_process')
const crypto = require('crypto')
const WebSocketServer = require('websocket').server
let buf
let token 
let prog
let stdout
let wsServer
let connection

function start() {
  if (prog != null) prog.kill(9)
  buf = crypto.randomBytes(16);
  token = buf.toString('hex');
  prog = spawn(process.argv[2], process.argv.slice(3))
  stdout = []
  prog.stdout.on('data', (data) => {
     connection.sendUTF(data.toString())
  })

  prog.stderr.on('data', (data) => {
     console.log(data.toString());
  })

  prog.on('error', d => console.log(d))

  prog.on('close', (code) => {
      console.log(code)   
  })

  prog.on('exit', (code) => {
      console.log(code)   
  })
}

const {createServer} = require('http')

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}


function sendFile(res, file) {
   const fs = require('fs')
   fs.createReadStream(file).pipe(res)
}

function sendString(res, str) {
   res.end(str)
}


let server = createServer((req, res) => {
    if (req.url == "/") {
        sendFile(res, "indexws.html");
    }
})

server.listen(8080)

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
})

 
wsServer.on('request', function(request) {
    connection = request.accept('cflow', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            let dd = message.utf8Data;
            prog.stdin.write(JSON.parse(dd))
        }
    })
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    })
    start()
})

