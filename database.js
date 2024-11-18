const sqlite3 = require("sqlite3").verbose()

let sql;

const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
    if(err) {
        return console.error(err.message)
    }
})

function initDb() {
    sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name UNIQUE, has_drawn, has_checked)`;
    db.run(sql);
}

function addUser(id, name, hasDrawn) {
    const sql = `INSERT INTO users (id, name, has_drawn, has_checked) VALUES (?, ?, ?, ?)`;

    db.run(sql, [id, name, hasDrawn, false], function(err) {
        if (err) {
            console.error('Fehler beim Hinzufügen des Benutzers:', err.message);
        } else {
            console.log(`Benutzer ${name} mit ID ${id} erfolgreich hinzugefügt.`);
        }
    });
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
                callback(err);
            } else {
                console.log("Table 'users' was cleared");
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
