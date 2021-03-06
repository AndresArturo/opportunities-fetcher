var http = require("https");
var EventEmitter = require("events");
var util = require("util");


function getPage(page, callback) {
    const options = {
        protocol: "https:",
        hostname: "gis-api.aiesec.org",
        path: `/v2/opportunities?access_token=e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493&per_page=12&page=${page}&filters[earliest_start_date]="2016-10-10"&filters[programmes][]=2&filters[home_mcs][]=1596&filters[home_mcs][]=1594&filters[home_mcs][]=1613`,
        headers: {
            "Referer": "https://opportunities.aiesec.org/programmes/GT?earliest_start_date=%222016-10-10%22&home_mcs%5B%5D=1596,1594,1613",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:49.0) Gecko/20100101 Firefox/49.0"
        }
    };

    http.get(options, (res) => {
        if (res.statusCode !== 200) {
            res.resume();
            callback(new Error(`Page ${page}: AIESEC's server responded with an erroneous status`));
        } else {
            var rawData = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => rawData += chunk);
            res.on("end", () => {
                var jsonData;
                var error;

                try {
                    jsonData = JSON.parse(rawData);
                } catch (e) {
                    error = new Error(`Page ${page}: AIESEC's server answer is non-JSON formatted`);
                }

                callback(error, jsonData);
            });
        }
    }).on("error", () => {
        callback(new Error(`Page ${page}: Can't reach AIESEC's server`));
    });
}


function OppsFetcher(callback) {
    this.callback = callback;
    this.totalPages = 1;
    this.pagesCount = 0;
}

util.inherits(OppsFetcher, EventEmitter);

OppsFetcher.prototype.processPage = function(err, page) {
    this.callback(err, page);

    if ((++this.pagesCount) == this.totalPages)
        this.emit("end");
}

OppsFetcher.prototype.getPages = function() {
    getPage(1, (err, page) => {
        if (err)
            this.processPage(err);
        else if (page.paging.total_items == 1 || page.paging.total_items != page.paging.total_pages) {
            this.totalPages = page.paging.total_pages;
            this.processPage(null, page);

            for (var pageI = 2; pageI <= this.totalPages; pageI++)
                getPage(pageI, (err, page) => this.processPage(err, page));

        } else
            this.processPage(new Error("Page 1: JSON illogical answer (total_items = total_pages)"));
    });
}


module.exports = OppsFetcher;