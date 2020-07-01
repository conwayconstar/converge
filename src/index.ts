import 'module-alias/register';
import express from 'express';
import bodyParser from 'body-parser';
import sequelize from '@Database';
import { create, fetch } from '@Controllers/SensorEventController';
import { validateSensorEvent } from '@Middleware/sensorEvent';

const app = express();

/**
 * Plugins
 * */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Routes
 * */
app.put('/data', validateSensorEvent, create);
app.get('/data', fetch);

/**
 * Init
 * */

sequelize.sync({ force: true }).then(() => {
  app.listen(3000, () => {
    console.warn('Server is running in http://localhost:3000');
  });
});
