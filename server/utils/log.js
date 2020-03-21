const color = require("../colors"),
	fs = require("fs");

module.exports = {
    date_now : ()=>{
        let date_now = Date().split(/\s/)[0];
        for (let i = 1; i <= 4; i++) {
            date_now += "_" + Date().split(/\s/)[i];
        }
        return color.white + date_now;
    },
};
