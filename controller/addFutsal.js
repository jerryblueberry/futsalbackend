const express = require('express');
const Futsal = require('../models/futsalModel');

const addFutsal = async(req,res) => {
    try {
        const {name,price,address,description}= req.body;
        const newFutsal =new Futsal({
            name,
            price,description,address
        });
        const savedFutsal = await newFutsal.save();
        res.status(200).json({savedFutsal});
    } catch (error) {
        console.error("Error While Adding Futsal",error);
        res.status(500).json({error:error.message});
    }
}

module.exports = {addFutsal};