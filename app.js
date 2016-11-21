const Processor = require("./Processor");
const http = require("http");


http.createServer((req, res) => {
    if (req.method == "POST" && req.url == "/trigger")
        Processor((success) => {
            console.log(`${new Date()}  ${req.method} --- ${success}  ****************************************************`);
            res.writeHead(success ? 200 : 500);
            res.end();
        });
    else {
        res.writeHead(400);
        res.end();
    }
}).listen(process.env.PORT || 3000);