var sendmail = require("sendmail")();
var config = require("./config")


function send(subject, content) {
    sendmail({
        from: config.getSender(),
        to: config.getRecipient(),
        "subject": subject,
        html: content,
    }, function(err) {
        if (err)
            console.error(err);
    });
}


function sendNewOpportunities(opps) {
    var content = '<table cellpadding="5" cellspacing="5"><tr><th>Title</th><th>Location</th><th>Closing</th><th>Link</th></tr>';

    opps.forEach((opp) => {
        content += "<tr>";
        content += "<td>" + opp.title + "</td>";
        content += "<td>" + opp.location + "</td>";
        content += "<td>" + opp.applications_close_date + "</td>";
        content += `<td><a href="https://opportunities.aiesec.org/opportunity/${opp.id}">` + opp.id + "</a></td>";
        content += "</tr>";
    });
    content += `</table><br/>Total new opportunities: ${opps.length}<br/><br/><h3>${new Date()}</h3>`;

    send("New opportunities to Germany", content);
}

function sendError(error) {
    send("Error in AIESEC Opportunities Fetcher", error + `<br/><h3>${new Date()}</h3>`);
}


module.exports.sendNewOpportunities = sendNewOpportunities;
module.exports.sendError = sendError;