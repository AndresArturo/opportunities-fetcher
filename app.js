var db = require("./DB");


db.saveOpps([{ a: 1, _id: 123 }, { a: 2, _id: 321 }], (err) => {
    if (err) {
        console.error(err);
        db.close();
    } else
        db.getOpps((err, opps) => {
            if (err)
                console.error(err);
            else
                opps.forEach((opp) => console.log(opp));
            db.close();
        });
});