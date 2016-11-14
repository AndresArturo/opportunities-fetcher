var http = require("https");


function getPage(page, callback) {
    const options = {
        protocol: "https:",
        hostname: "gis-api.aiesec.org",
        path: `/v2/opportunities?access_token=e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493&per_page=12&page=${page}&filters[earliest_start_date]="2016-10-10"&filters[home_mcs][]=1596&filters[programmes][]=2`,
        headers: {
            "Referer": "https://opportunities.aiesec.org/programmes/GT?earliest_start_date=%222016-10-10%22&home_mcs%5B%5D=1596",
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
    }).on("error", (e) => {
        callback(new Error(`Page ${page}: Can't reach AIESEC's server`));
    });
}


module.exports.getOpps = function(callback) {
    getPage(1, (err, page) => {
        if (err)
            callback(err);
        else if (page.paging.total_items == 1 || page.paging.total_items != page.paging.total_pages) {
            callback(null, page);
            for (var pageI = 2; pageI <= page.paging.total_pages; pageI++)
                getPage(pageI, callback);
        } else
            callback(new Error("Page 1: JSON illogical answer (total_items = total_pages)"));
    });
}