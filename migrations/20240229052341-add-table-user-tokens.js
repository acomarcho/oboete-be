var dbm;
var type;
var seed;
var fs = require("fs");
var path = require("path");
var Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = (options, seedLink) => {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
	Promise = options.Promise;
};

exports.up = (db) => {
	var filePath = path.join(
		__dirname,
		"sqls",
		"20240229052341-add-table-user-tokens-up.sql",
	);
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
			if (err) return reject(err);
			console.log("received data: " + data);

			resolve(data);
		});
	}).then((data) => db.runSql(data));
};

exports.down = (db) => {
	var filePath = path.join(
		__dirname,
		"sqls",
		"20240229052341-add-table-user-tokens-down.sql",
	);
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
			if (err) return reject(err);
			console.log("received data: " + data);

			resolve(data);
		});
	}).then((data) => db.runSql(data));
};

exports._meta = {
	version: 1,
};
