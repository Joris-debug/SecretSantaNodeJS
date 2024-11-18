const express = require('express')
const path = require('path');
const { db, initDb, addUser, getUser, getName, setHasChecked } = require('./database');
const { assignUsers } = require('./util')


const PORT = 80
const app = express()
initDb()

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, function(error) {
    if(error) {
        console.log("Something went wrong", error)
    } else {
        console.log("Server is listening on port " + PORT)
    }
})

app.get('/users', (req, res) => {
  db.all("SELECT name FROM users", (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err.message)
      return res.status(500).send('Database error')
    }
    res.json(rows)
  });
});

//TODO: Add Administrator auth.
app.get('/add-users', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-users.html'));
});

//TODO: Convert names to lowercase
app.post('/add-users', (req, res) => {
    const nameString = req.body.names.toLowerCase();
    if(req.body.passwd != process.env.ADMIN_PASSWD) {
	res.status(401).send("Wrong password");
	return;
    }
    const namesArray = nameString.split(',').map(name => name.trim());
    assignUsers(namesArray)
    res.send(`
        <h1>Namensliste erhalten</h1>
        <p>Die folgenden Namen wurden empfangen:</p>
        <ul>
            ${namesArray.map(name => `<li>${name}</li>`).join('')}
        </ul>
    `);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//TODO: Convert name to lowercase
app.post('/', (req, res) => {
    const name = req.body.fname.toLowerCase();

    getUser(name, (err, user) => {
        if (err) {
            console.error("Fehler beim Abrufen des Benutzers:", err.message);
            return res.status(500).send(`
                <html>
                    <head>
                        <link rel="stylesheet" type="text/css" href="/index.css">
                    </head>
                    <body>
                        <div class="notification error">
                            <h1>Datenbankfehler</h1>
                            <p>Es gab einen Fehler beim Abrufen des Benutzers. Bitte versuche es später erneut.</p>
                            <pre>${err.message}</pre>
                        </div>
                    </body>
                </html>
            `);
        }

        if (user) {
            if (user.has_checked) {
                return res.status(401).send(`
                    <html>
                        <head>
                            <link rel="stylesheet" type="text/css" href="/index.css">
                        </head>
                        <body>
                            <div class="notification warning">
                                <h1>Benutzer hat bereits Wichtelpartner angefragt</h1>
                                <p>Du hast bereits einen Wichtelpartner zugewiesen bekommen. Du kannst es später noch einmal versuchen.</p>
                            </div>
                        </body>
                    </html>
                `);
            } else {
                getName(user.has_drawn, (err, drawnUser) => {
                    if (err) {
                        console.error("Fehler beim Abrufen des gezogenen Benutzers:", err.message);
                        return res.status(500).send(`
                            <html>
                                <head>
                                    <link rel="stylesheet" type="text/css" href="/index.css">
                                </head>
                                <body>
                                    <div class="notification error">
                                        <h1>Datenbankfehler</h1>
                                        <p>Es gab einen Fehler beim Abrufen des gezogenen Wichtelpartners. Bitte wende dich an einen Administrator.</p>
                                        <pre>${err.message}</pre>
                                    </div>
                                </body>
                            </html>
                        `);
                    }

                    if (drawnUser) {
                        setHasChecked(name);
                        return res.status(200).send(`
                            <html>
                                <head>
                                    <link rel="stylesheet" type="text/css" href="/index.css">
                                </head>
                                <body>
                                    <div class="notification success">
                                        <h1>Wichtelpartner zugewiesen!</h1>
                                        <p>Du hast erfolgreich einen Wichtelpartner zugewiesen bekommen: <strong>${drawnUser.name}</strong>.</p>
                                        <p>Viel Spaß beim Wichteln!</p>
                                    </div>
                                </body>
                            </html>
                        `);
                    } else {
                        return res.status(404).send(`
                            <html>
                                <head>
                                    <link rel="stylesheet" type="text/css" href="/index.css">
                                </head>
                                <body>
                                    <div class="notification error">
                                        <h1>Fehler</h1>
                                        <p>Der gezogene Wichtelpartner wurde nicht gefunden. Bitte versuche es später erneut.</p>
                                    </div>
                                </body>
                            </html>
                        `);
                    }
                });
            }
        } else {
            return res.status(404).send(`
                <html>
                    <head>
                        <link rel="stylesheet" type="text/css" href="/index.css">
                    </head>
                    <body>
                        <div class="notification error">
                            <h1>Benutzer nicht gefunden</h1>
                            <p>Es wurde kein Benutzer mit dem Namen <strong>${name}</strong> gefunden. Bitte überprüfe deinen Namen und versuche es erneut.</p>
                        </div>
                    </body>
                </html>
            `);
        }
    });
});
