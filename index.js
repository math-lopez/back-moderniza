const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

const itemsRoutes = require('./routes/features');
app.use('/features', itemsRoutes);

app.get('/', (req, res) => {
    res.send('API funcionando!');
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
