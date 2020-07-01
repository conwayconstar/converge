import { Sequelize } from 'sequelize';
import SensorEvent from './models/sensorEvent';

const sequelize = new Sequelize('sqlite::memory:', { logging: false });

export const models = {
  SensorEvent: SensorEvent(sequelize),
};

export default sequelize;
