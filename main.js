const { spawn   } = require('child_process')
const crypto = require('crypto')


let buf
let token 
let prog
let stdout

function start() {
  if (prog != null) prog.kill(9)
  buf = crypto.randomBytes(16);
  token = buf.toString('hex');
  prog = spawn(process.argv[2], process.argv.slice(3))
  stdout = []
  prog.stdout.on('data', (data) => {
     stdout.push(data.toString())
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

function sendFile(res, file) {
   const fs = require('fs')
   res.write(`<!doctype html>
<html lang="zh-cn">
  <head>
     <meta charset='utf-8'>
     <title>CFlow</title>
     <script>
        let token = '${token}'
`, function() {
   fs.createReadStream(file).pipe(res)
  })

}

function sendString(res, str) {
   res.end(str)
}

let server = createServer((req, res) => {
    if (req.url == "/") {
        start()
        sendFile(res, "index.html");
    } else if (req.url == `/nodes/${token}`) {
        if (prog == null) { res.end(); return }
        let n = stdout
        stdout = []
        sendString(res, JSON.stringify({code: 0, list: n}))
    } else if (req.url == `/action/${token}`) {
        if (prog == null) { res.end(); return }
        let dd = ""
        req.on('data', d => dd += d.toString())
        req.on('end', _ => {
           prog.stdin.write(JSON.parse(dd))
           res.end()
        })
    } else {
        res.statusCode = 500
        res.end()
    }
})

server.listen(8080)
