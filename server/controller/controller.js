const pool = require('../db');
const bcrypt = require('bcrypt');

const base = (req, res) => {
    pool.query("SELECT * FROM base;", (error, results) => {
        try {
            res.status(200).json(results.rows);
        } catch {
            res.json(error)
        }
    })
};

const find = (req, res) => {
    const id = req.params.id;

    pool.query("SELECT * FROM base WHERE login=$1;", [id], (error, results) => {
        if (error) throw error;     
        
        res.status(200).json(results.rows);
    })
};

module.exports = {base, find};