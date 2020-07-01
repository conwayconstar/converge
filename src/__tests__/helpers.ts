import sequelize, { models } from '@Database';

export const send = jest.fn((data) => data);
export const status = jest.fn((code) => ({
  code,
  send,
}));

export const sendStatus = jest.fn((code) => code);

export const res = {
  status,
  sendStatus,
  send,
};

export const next = jest.fn(() => 'next');

export const sensorsFixture = [
  { sensorId: 'sensor1', time: (new Date('2020-07-01T10:33')).getTime(), value: 3 },
  { sensorId: 'sensor1', time: (new Date('2020-07-01T09:35')).getTime(), value: 4 },
  { sensorId: 'sensor1', time: (new Date('2020-07-01T08:36')).getTime(), value: 5 },
  { sensorId: 'sensor2', time: (new Date('2020-07-01T10:33')).getTime(), value: 3 },
  { sensorId: 'sensor2', time: (new Date('2020-07-01T09:35')).getTime(), value: 4 },
  { sensorId: 'sensor2', time: (new Date('2020-07-01T08:36')).getTime(), value: 5 },
];

export const seed = async () => {
  await sequelize.drop();
  await sequelize.sync({ force: true }).then(() => models.SensorEvent.bulkCreate(sensorsFixture));
};
