const { Base } = require('../models/allBase');

const base = async (req, res) => {
    try {
        const baseData = await Base.findAll();
        res.status(200).json(baseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const find = async (req, res) => {
    const id = req.params.id;

    try {
        const goods = await Base.findOne({ where: { login: id } });
        
        if (!goods) {
            return res.status(404).json({ message: 'Goods not found' });
        }

        res.status(200).json(goods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { base, find };
