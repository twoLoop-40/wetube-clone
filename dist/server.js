import express from 'express';
import path from 'path';
const PORT = 4000;
const app = express();
const handleHome = (req, res) => {
    const filename = path.join(__dirname, 'htmlFiles/home.html');
    res.sendFile(filename, () => {
        console.log('home.html sent');
    });
};
const handleAbout = (req, res) => {
    const filename = path.join(__dirname, 'htmlFiles/about.html');
    res.sendFile(filename, () => {
        console.log('about.html sent');
    });
};
const handleLogin = (req, res) => {
    const filename = path.join(__dirname, 'htmlFiles/login.html');
    res.sendFile(filename, () => {
        console.log('login.html sent');
    });
};
const handleContact = (req, res) => {
    const filename = path.join(__dirname, 'htmlFiles/contact.html');
    res.sendFile(filename, () => {
        console.log('contact.html sent');
    });
};
app.get('/about', handleAbout);
app.get('/contact', handleContact);
app.get('/login', handleLogin);
app.get('/', handleHome);
const logger = () => console.log(`Server is listening on port ${PORT}`);
app.listen(PORT, logger);
