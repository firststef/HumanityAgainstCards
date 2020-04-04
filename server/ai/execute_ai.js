const exec = require("child_process").execFile,
	log = require("../utils/log"),
	color = require("../colors"),
	config = require("../config.js"),
	ai_path = "C:\\Users\\nassa\\OneDrive\\Desktop\\HumanityAgainstCards\\server\\ai\\Project1.exe";
f_header = "[routes/ai/execute_ai.js]";

module.exports = {
	start_ai: (params) => {
		return new Promise((resolve, reject) => {
			try {
				if (!params) throw `No params provided !`;
				exec(`${ai_path} ${params}`, function (err, data) {
					if (err) throw `${err}`;
					resolve(data);
				});
			} catch (e) {
				console.log(log.date_now() + f_header, color.red, "Exception thrown : ", color.white, e);
				reject(e);
			}
		});
	},
};
