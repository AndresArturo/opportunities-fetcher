const Processor = require("./Processor");
const http = require("http");


http.createServer((req, res) =>
    Processor((success) => {
        console.log(`${new Date()}  ${req.method} --- ${success}  ****************************************************`);
        res.writeHead(success ? 200 : 500);
        res.end();
    })
).listen(process.env.PORT || 3000);