const express = require('express'),
    jwt = require('jsonwebtoken'),
    config = require('./config'),
    cors = require('cors'),
    app = express();

app.set('llave', config.llave);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const bd_fake = require('./Bd_Fake');
app.listen(4000, () => {
    console.log('Puerto iniciado en el 4000')
});
app.get('/', (req, res) => {
    res.send('Inicio')
})
app.post('/login', (req, res) => {
    if (req.body.usuario === "kike" && req.body.pass === "kiris") {
        const payload = {
            check: true
        };
        const token = jwt.sign(payload, app.get('llave'), {
            expiresIn: 1440
        });
        res.json({
            mensaje: 'Autenticación correcta',
            token: token
        });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrectos" })
    }
})

const rutasProtegidas = express.Router();
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, app.get('llave'), (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
});

app.get('/datos', rutasProtegidas, (req, res) => {
    const datos = [
        { id: 1, nombre: "Asfo" },
        { id: 2, nombre: "Denisse" },
        { id: 3, nombre: "Carlos" }
    ];

    res.json(datos);
});
app.get('/Data', (req, res) => {
    res.json(bd_fake.bdFake)
})