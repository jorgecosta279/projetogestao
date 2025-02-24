const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');
const router = express.Router();

// 🟢 CREATE: Adicionar usuário
router.post('/usuarios', async (req, res) => {
    const { nome, email, senha, telefone } = req.body;
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const sql = 'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
        
        db.query(sql, [nome, email, senhaCriptografada, telefone], (err, result) => {
            if (err) return res.status(500).send('Erro ao adicionar usuário');
            res.send('Usuário cadastrado com sucesso!');
        });
    } catch (err) {
        res.status(500).send('Erro ao processar a senha');
    }
});

// 🔵 READ: Listar todos os usuários
router.get('/usuarios', (req, res) => {
    db.query('SELECT id, nome, email, telefone, data_criacao FROM usuarios', (err, results) => {
        if (err) return res.status(500).send('Erro ao buscar usuários');
        res.json(results);
    });
});

// 🟡 READ: Buscar um usuário pelo ID
router.get('/usuarios/:id', (req, res) => {
    db.query('SELECT id, nome, email, telefone, data_criacao FROM usuarios WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Erro ao buscar usuário');
        if (results.length === 0) return res.status(404).send('Usuário não encontrado');
        res.json(results[0]);
    });
});

// 🟠 UPDATE: Atualizar usuário
router.put('/usuarios/:id', (req, res) => {
    const { nome, email, telefone } = req.body;
    const sql = 'UPDATE usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?';
    
    db.query(sql, [nome, email, telefone, req.params.id], (err) => {
        if (err) return res.status(500).send('Erro ao atualizar usuário');
        res.send('Usuário atualizado com sucesso!');
    });
});

// 🔴 DELETE: Deletar usuário
router.delete('/usuarios/:id', (req, res) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send('Erro ao deletar usuário');
        res.send('Usuário deletado com sucesso!');
    });
});

module.exports = router;
