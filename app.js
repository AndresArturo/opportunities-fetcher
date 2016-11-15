const Processor = require("./Processor");
const http = require("http");



http.createServer((req, res) =>
    Processor((success) => {
        if (success)
            res.statusCode = 200;
        else
            res.statusCode = 500;
        res.end();
    })
).listen(8000, "localhost");