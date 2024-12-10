const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Funkcja do odczytu plików JSON
const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Endpointy do obsługi danych
app.get('/api/pojazdy', (req, res) => {
    const pojazdy = readJSONFile(path.join(__dirname, 'data', 'pojazdy.json'));
    res.json(pojazdy);
});

app.get('/api/ubezpieczenia', (req, res) => {
    const ubezpieczenia = readJSONFile(path.join(__dirname, 'data', 'ubezpieczenia.json'));
    res.json(ubezpieczenia);
});

app.get('/api/users', (req, res) => {
    const users = readJSONFile(path.join(__dirname, 'data', 'users.json'));
    res.json(users);
});

app.get('/api/warsztaty', (req, res) => {
    const warsztaty = readJSONFile(path.join(__dirname, 'data', 'warsztaty.json'));
    res.json(warsztaty);
});

// Endpoint do logowania
app.post('/api/login', (req, res) => {
    const { login, password } = req.body; // Zmiana z username na login

    const usersPath = path.join(__dirname, 'data', 'users.json');
    const users = readJSONFile(usersPath);

    // Sprawdzenie, czy użytkownik istnieje
    const user = users.find(u => u.login === login && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Endpoint do rejestracji
app.post('/api/register', (req, res) => {
    const { name, login, password } = req.body;

    // Wczytaj istniejących użytkowników
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading users file' });
        }

        const users = JSON.parse(data);
        const newUser  = {
            _id: users.length + 1, // Prosta logika do generowania ID
            login,
            password,
            rola: 'user', // Ustawiamy rolę na 'user'
            name // Dodajemy imię
        };

        // Dodaj nowego użytkownika do listy
        users.push(newUser );

        // Zapisz zaktualizowaną listę użytkowników
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user' });
            }
            res.status(201).json({ message: 'User  registered successfully' });
        });
    });
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});
