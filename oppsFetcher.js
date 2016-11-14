var http = require("http");


function getPage(page, callback) {
    const options = {
        protocol: "https:",
        hostname: "gis-api.aiesec.org",
        port: 80,
        path: `/v2/opportunities?access_token=e316ebe109dd84ed16734e5161a2d236d0a7e6daf499941f7c110078e3c75493&per_page=12&page=${page}&filters[earliest_start_date]="2016-10-10"&filters[programmes][]=2`,
        headers: {
            "Referer": "https://opportunities.aiesec.org/programmes/GT?earliest_start_date=%222016-10-10%22",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:49.0) Gecko/20100101 Firefox/49.0"
        }
    };

    http.get(options, (res) => {
        if (res.statusCode !== 200) {
            res.resume();
            callback(new Error(`Page ${page}: Server erroneous status`));
        } else {
            let rawData = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => rawData += chunk);
            res.on("end", () => {
                try {
                    callback(null, JSON.parse(rawData));
                } catch (e) {
                    callback(new Error(`Page ${page}: Server non-JSON answer`));
                }
            });
        }
    }).on("error", (e) => {
        callback(new Error(`Page ${page}: Can't reach server`));
    });
}


module.exports.getOpps = function(callback) {
    getPage(1, (err, json) => {
        if (!err && (json.paging.total_items == 1 || json.paging.total_items != json.paging.total_pages))
            for (let page = 2; page <= json.paging.total_pages; page++)
                getPage(page, (err, json) => callback(err || json));

        callback(err || json);
    });
}