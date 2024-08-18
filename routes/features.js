const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configura o DynamoDB
AWS.config.update({
    region: "us-east-1",
    // Você pode precisar configurar suas credenciais aqui se estiver desenvolvendo localmente
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Features';  // Certifique-se de que esta tabela exista no DynamoDB

// Criar um item
router.post('/', async (req, res) => {
    const item = {
        id: uuidv4(),
        ...req.body
    };

    const params = {
        TableName: tableName,
        Item: item
    };

    try {
        await dynamoDb.put(params).promise();
        res.status(201).send(item);
    } catch (err) {
        res.status(500).send({ message: 'Erro ao criar o item', error: err });
    }
});

// Ler todos os itens
router.get('/', async (req, res) => {
    const params = {
        TableName: tableName
    };

    try {
        const data = await dynamoDb.scan(params).promise();
        res.status(200).send(data.Items);
    } catch (err) {
        res.status(500).send({ message: 'Erro ao ler os itens', error: err });
    }
});

// Ler um item específico
router.get('/:id', async (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            id: req.params.id
        }
    };

    try {
        const data = await dynamoDb.get(params).promise();
        if (data.Item) {
            res.status(200).send(data.Item);
        } else {
            res.status(404).send({ message: 'Item não encontrado' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Erro ao ler o item', error: err });
    }
});

// Atualizar um item
router.put('/:id', async (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            id: req.params.id
        },
        UpdateExpression: "set #name = :name, frontEnd = :frontEnd, backEnd = :backEnd, data = :data",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": req.body.name,
            ":frontEnd": req.body.frontEnd,
            ":backEnd": req.body.backEnd,
            ":data": req.body.data
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const data = await dynamoDb.update(params).promise();
        res.status(200).send(data.Attributes);
    } catch (err) {
        res.status(500).send({ message: 'Erro ao atualizar o item', error: err });
    }
});

// Deletar um item
router.delete('/:id', async (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            id: req.params.id
        }
    };

    try {
        await dynamoDb.delete(params).promise();
        res.status(200).send({ message: 'Item deletado' });
    } catch (err) {
        res.status(500).send({ message: 'Erro ao deletar o item', error: err });
    }
});

module.exports = router;
