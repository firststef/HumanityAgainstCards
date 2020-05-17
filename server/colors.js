const { colors } = require("./config").console;

module.exports = colors
	? {
			black: "\x1b[30m",
			red: "\x1b[31m",
			green: "\x1b[32m",
			yellow: "\x1b[33m",
			blue: "\x1b[34m",
			magenta: "\x1b[35m",
			cyan: "\x1b[36m",
			white: "\x1b[37m",
	  }
	: {
			black: "",
			red: "",
			green: "",
			yellow: "",
			blue: "",
			magenta: "",
			cyan: "",
			white: "",
	  };
