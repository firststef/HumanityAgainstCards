var Buffer = require('safe-buffer').Buffer

module.exports = {
	/**
	 * @param {string} string - A random string to generate the key
	 * @param {number} size - The size of the returned array
	 */
	unique: (string, size) => Buffer.from((Math.random().toString(36).substr(5, 20) + string + Date.now() + Math.random().toString(36).substr(5, 20)).substr(0,size)).toString("base64"),
};