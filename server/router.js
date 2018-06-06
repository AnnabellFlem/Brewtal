"use strict";

const router = require("express").Router();
const dynamo = require("./dynamoDB");

/**
 * Get ingredients list
 * 
 * @async
 * 
 * @returns {Object<[Object<string, string, string, string>]> | Object<string, string>} 
 *          Response with ingredients list OR error
 */
router.get("/ingredients", async (req, res) => {
    const getImageLink = ({ name, bucket }) => 
        `https://s3.${ process.env.REGION }.amazonaws.com/${ bucket }/${ name.toLowerCase() }.svg`;

    try {
        const data = await dynamo.scan({ TableName: "Ingredients" }).promise();
        
        const ingredients = data.Items.map( ({ Name: name, Description }) => ({
            name: name.toLowerCase(),
            description: Description || "",
            table: getImageLink({ name, bucket: process.env.BUCKET_TABLE }),
            glass: getImageLink({ name, bucket: process.env.BUCKET_GLASS })
        }));
        
        res.status(200).json({ ingredients });
    } catch (err) {
        console.error(err);
        const error = { cause: "ingredients", message: "Couldn't get ingredients" };

        res.status(500).json({ error });
    }
});

/**
 * Get cocktail image
 * 
 * @param {Object} req.query Query params
 * @param {String} req.query.layer1 Bottom cocktail layer
 * @param {String} req.query.layer2 Second cocktail layer
 * @param {String} req.query.layer3 Third cocktail layer
 * @param {String} req.query.layer4 Top cocktail layer
 * 
 * @returns {Object | Object<string, string>>} Response with cocktail image OR error
 */
router.get("/cocktail", (req, res) => {
    res.status(501).json(req.query);
});

module.exports = exports = router;