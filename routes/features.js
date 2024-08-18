const express = require('express');
const router = express.Router();

let features = [{
    id: 1,
    name: 'Contratos',
    frontEnd: {
        dev: 90,
        test: 70,
        deploy: 60,
        usage: 100
    },
    backEnd: {
        dev: 56,
        test: 70,
        deploy: 66,
        usage: 0
    },
    data: {
        dev: 90,
        test: 70,
        deploy: 60,
        usage: 0
    }
},];

// Criar um item
router.post('/', (req, res) => {
    let item = { ...req.body };
    item.id = (features.length + 1);
    features.push(item);
    res.status(201).send(item);
});

// Ler todos os itens
router.get('/', (req, res) => {
    res.status(200).send(features);
});

// Ler um item específico
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const item = features.find(i => i.id.toString() === id);
    if (item) {
        res.status(200).send(item);
    } else {
        res.status(404).send({ message: 'Item não encontrado' });
    }
});

// Atualizar um item
router.put('/:id', (req, res) => {
    let id = req.params.id;
    const index = features.findIndex(i => i.id.toString() === id);
    if (index !== -1) {
        features[index] = req.body;
        res.status(200).send(features[index]);
    } else {
        res.status(404).send({ message: 'Item não encontrado' });
    }
});

// Deletar um item
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    features = features.filter(i => i.id.toString() !== id);
    res.status(200).send({ message: 'Item deletado' });
});

module.exports = router;