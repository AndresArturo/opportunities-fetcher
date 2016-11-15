var db = require("./DB");
var Fetcher = require("./OppsFetcher");
var emailer = require("./Emailer");



function OpportunitiesChecker(knownOpps) {
    this.newOpps = [];
    this.knownOpps = knownOpps || [];
}

OpportunitiesChecker.prototype.process = function(err, page) {
    var pageNewOpps;

    if (this.handleError(err)) {
        pageNewOpps = page.data.filter((opp) => this.knownOpps.filter((known) => known.id == opp.id).length == 0);
        Array.prototype.push.apply(this.newOpps, pageNewOpps);
    }
}

OpportunitiesChecker.prototype.updateOpps = function() {
    emailer.sendNewOpportunities(this.newOpps);

    if (this.newOpps.length > 0)
        db.saveOpps(this.newOpps, (err) => {
            this.handleError(err);
            db.close();
        });
    else
        db.close();
}

OpportunitiesChecker.prototype.handleError = function(err) {
    if (err)
        emailer.sendError(err);
    return !err;
}


db.getOpps((err, opps) => {
    var fetcher;
    var oppsChecker;

    if (err) {
        emailer.sendError(err);
        db.close();
    } else {
        oppsChecker = new OpportunitiesChecker(opps);
        fetcher = new Fetcher((err, page) => oppsChecker.process(err, page));
        fetcher.on("end", () => oppsChecker.updateOpps());
        fetcher.getPages();
    }
});