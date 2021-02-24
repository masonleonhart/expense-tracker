const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// POST

router.post('/expense', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `INSERT INTO "transaction-history" ("user_id", "category_id", "name", "amount", "date")
                        VALUES (${req.user.id}, $1, $2, $3, $4);`;

    if (!req.body.name, !req.body.amount, !req.body.date) {
        console.log('Try again with valid fields');
        res.sendStatus(400);
        return;
    };

    let category_id = req.body.category_id === 0 ? null : req.body.category_id;

    pool.query(sqlQuery, [category_id, `${req.body.name}`, Number(req.body.amount), `${req.body.date}`]).then(() => {
        console.log('Added new expense successfully');
        res.sendStatus(201);
    }).catch(err => {
        console.log('Error in adding expense', err);
        res.sendStatus(500);
    });
});

router.post('/income', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `INSERT INTO "transaction-history" ("user_id", "income", "name", "amount", "date")
                        VALUES (${req.user.id}, ${req.body.income}, $1, $2, $3);`;

    if (!req.body.name, !req.body.amount, !req.body.date) {
        console.log('Try again with valid fields');
        res.sendStatus(400);
        return;
    };

    console.log(req.body);

    pool.query(sqlQuery, [`${req.body.name}`, Number(-req.body.amount), `${req.body.date}`]).then(() => {
        console.log('Added new income successfully');
        res.sendStatus(201);
    }).catch(err => {
        console.log('Error in adding income', err);
        res.sendStatus(500);
    });
});

// GET

router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `SELECT th.id, th.user_id, th.name, th.amount, th.date, th.transaction_id, th.income, 
                                c.id as category_id, c.name as category_name
                        FROM "transaction-history" as th
                        FULL JOIN "category" as c on th.category_id = c.id
                        WHERE th.id IS NOT NULL AND th.user_id = ${req.user.id} ORDER BY th.date DESC;`;

    pool.query(sqlQuery).then(response => {
        console.log('Retrieved expenses successfully ');
        res.send(response.rows).status(200);
    }).catch(err => {
        console.log('Error in getting expenses', err);
        res.sendStatus(500);
    });
});

// PUT

router.put('/unassigned/:id', rejectUnauthenticated, (req, res) => {
    const sqlQuery = `UPDATE "transaction-history" SET "category_id" = ${req.body.category_id}
                        WHERE id = ${req.params.id};`;

    pool.query(sqlQuery).then(() => {
        console.log('Updated unassigned category successfully');
        res.sendStatus(200);
    }).catch(err => {
        console.log('Error in updating unassigned category', err);
        res.sendStatus(500);
    });
});

// DELETE 

router.delete(`/:id`, rejectUnauthenticated, (req, res) => {
    const sqlQuery = `DELETE FROM "transaction-history" WHERE "id" = ${req.params.id};`;

    pool.query(sqlQuery).then(() => {
        console.log('Deleted expense successfully');
        res.sendStatus(204);
    }).catch(err => {
        console.log('Error in deleting expense', err);
        res.sendStatus(500);
    });
});

module.exports = router;