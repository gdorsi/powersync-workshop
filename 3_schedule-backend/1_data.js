import express from 'express';
import pg from 'pg';
import config from './src/config.js';

const { Pool } = pg;

const router = express.Router();

const pool = new Pool({
  host: config.database.host,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port
});

pool.on('error', (err, client) => {
  console.error('Pool connection failure to postgres:', err, client);
});

/**
 * Handle all PUT events sent to the server by the client PowerSunc application
 */
router.put('/', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Invalid body provided'
    });
    return;
  }

  await upsert(req.body, res);
});

/**
 * Handle all PATCH events sent to the server by the client PowerSunc application
 */
router.patch('/', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Invalid body provided'
    });
    return;
  }

  await upsert(req.body, res);
});

/**
 * Handle all DELETE events sent to the server by the client PowerSunc application
 */
router.delete('/', async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Invalid body provided'
    });
    return;
  }

  const table = req.body.table;
  const data = req.body.data;

  if (!table || !data?.id) {
    res.status(400).send({
      message: 'Invalid body provided, expected table and data'
    });
    return;
  }

  let text = null;
  const values = [data.id];

  switch (table) {
    case 'people':
      text = 'DELETE FROM people WHERE id = $1';
      break;
    case 'tasks':
      text = 'DELETE FROM tasks WHERE id = $1';
      break;
    default:
      break;
  }

  const client = await pool.connect();
  await client.query(text, values);
  await client.release();
  res.status(200).send({
    message: `PUT completed for ${table} ${data.id}`
  });
});

const upsert = async (body, res) => {
  const table = body.table;
  const data = body.data;

  let text = null;
  let values = [];

  switch (table) {
    case 'people':
      text =
        'INSERT INTO people(id, created_at, name, owner_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET created_at = EXCLUDED.created_at, name = EXCLUDED.name, owner_id = EXCLUDED.owner_id';
      values = [data.id, data.created_at, data.name, data.owner_id];
      break;
    case 'tasks':
      text =
        'INSERT INTO tasks(id, created_at, name, date, owner_id, person_id)' +
        ' VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id)' +
        ' DO UPDATE SET created_at = EXCLUDED.created_at, name = EXCLUDED.name, date = EXCLUDED.date, owner_id = EXCLUDED.owner_id, person_id = EXCLUDED.person_id';
      values = [
        data.id,
        data.created_at,
        data.name,
        data.date,
        data.owner_id,
        data.person_id,
      ];
      break;
    case 'timeoffs':
      text =
        'INSERT INTO timeoffs(id, created_at, name, date, owner_id, person_id)' +
        ' VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id)' +
        ' DO UPDATE SET created_at = EXCLUDED.created_at, name = EXCLUDED.name, date = EXCLUDED.date, owner_id = EXCLUDED.owner_id, person_id = EXCLUDED.person_id';
      values = [
        data.id,
        data.created_at,
        data.name,
        data.date,
        data.owner_id,
        data.person_id,
      ];
      break;
    default:
      break;
  }
  if (text && values.length > 0) {
    const client = await pool.connect();
    await client.query(text, values);
    await client.release();
    res.status(200).send({
      message: `PUT completed for ${table} ${data.id}`
    });
  } else {
    res.status(400).send({
      message: 'Invalid body provided, expected table and data'
    });
  }
};

export { router as dataRouter };
