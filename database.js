const sqlite3 = require("sqlite3").verbose()

let sql;

const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if(err) {
        return console.error(err.message)
    }
})

function initDb() {
    sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name UNIQUE, has_drawn, has_checked)`;
    db.run(sql);
}

function addUser(name, hasDrawn) {
    sql = `INSERT INTO users (name, has_drawn, has_checked) VALUES(?, ?, ?)`;
     db.run(
        sql,
        [name, hasDrawn, false],
        (err) => {
            if(err) {
                return console.error(err.message);
            }
        }
     );
}

function getUser(name, callback) {
    sql = `SELECT * FROM users WHERE name = ?`;

    db.get(sql, [name], (err, row) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            if (row) {
                callback(null, row);
            } else {
                callback(null, null);
            }
        }
    });
}

function getName(id, callback) {
    sql = `SELECT name FROM users WHERE id = ?`;

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            if (row) {
                callback(null, row);
            } else {
                callback(null, null);
            }
        }
    });
}

function setHasChecked(name) {
    sql = `UPDATE users SET has_checked = ? WHERE name = ?`;

     db.run(
        sql,
        [true, name],
        (err) => {
            if(err) {
                return console.error(err.message);
            }
        }
     );
}

function clearDatabase(callback) {
    sql = `DELETE FROM users`;
    db.run(
        sql,
        (err) => {
            if (err) {
                console.error("Error deleting table:", err.message);
                callback(err)
            } else {
                console.log("Table 'users' was cleared");
            }
        }
    );
    sql = `UPDATE sqlite_sequence SET seq = 0 WHERE name = 'users'`;
        db.run(
            sql,
            (err) => {
                if (err) {
                    console.error("Error resetting table:", err.message);
                    callback(err)
                } else {
                    console.log("Table 'users' was reset");
                    callback(null);
                }
            }
        );
}

module.exports = {
    db,
    initDb,
    clearDatabase,
    addUser,
    getUser,
    getName,
    setHasChecked
};
