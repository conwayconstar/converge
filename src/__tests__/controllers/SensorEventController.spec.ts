import sequelize from '@Database';
import * as SensorEventController from '@Controllers/SensorEventController';
import { AlertEnum, SensorEventAttributes } from '@Types';
import {
  res, seed, send, sendStatus, sensorsFixture, status,
} from '../helpers';

describe('Sensor Events Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Alert functions', () => {
    it('Should log alert', () => {
      console.info = jest.fn((value) => value);
      SensorEventController.sendAlert(AlertEnum.ALMOST_HIGH);
      expect(console.info).toBeCalledWith(AlertEnum.ALMOST_HIGH);
    });
  });

  describe('Sensor fetching', () => {
    beforeAll(async () => {
      await sequelize.drop();
      await sequelize.sync({ force: true });
      // @ts-ignore
      SensorEventController.sendAlert = jest.fn((message) => message);
    });

    it('Should create a sensor event with a status of 204', async () => {
      const body = {
        sensorId: 'sensor1',
        value: 6,
        time: (new Date('2020-06-30T13:00')),
      };

      // @ts-ignore
      await SensorEventController.create({ body }, res);

      expect(sendStatus).toHaveBeenLastCalledWith(204);
      expect(SensorEventController.sendAlert).toBeCalledTimes(0);
    });

    it('Should send an alert because the value is too low', async () => {
      const body = {
        sensorId: 'sensor1',
        value: 2,
        time: (new Date('2020-06-30T13:01')),
      };

      // @ts-ignore
      await SensorEventController.create({ body }, res);

      expect(SensorEventController.sendAlert).toHaveBeenLastCalledWith(AlertEnum.TOO_LOW);
    });

    it('Should send an alert because the value is too high', async () => {
      const body = {
        sensorId: 'sensor1',
        value: 10,
        time: (new Date('2020-06-30T13:01')),
      };

      // @ts-ignore
      await SensorEventController.create({ body }, res);

      expect(SensorEventController.sendAlert).toHaveBeenLastCalledWith(AlertEnum.TOO_HIGH);
    });

    it('Should send an alert because the value is almost too low', async () => {
      const body = {
        sensorId: 'sensor1',
        value: 3,
        time: (new Date('2020-06-30T13:01')),
      };

      // @ts-ignore
      await SensorEventController.create({ body }, res);

      expect(SensorEventController.sendAlert).toHaveBeenLastCalledWith(AlertEnum.ALMOST_LOW);
    });

    it('Should send an alert because the value is almost too high', async () => {
      const body = {
        sensorId: 'sensor1',
        value: 7,
        time: (new Date('2020-06-30T13:01')),
      };

      // @ts-ignore
      await SensorEventController.create({ body }, res);

      expect(SensorEventController.sendAlert).toHaveBeenLastCalledWith(AlertEnum.ALMOST_HIGH);
    });
  });

  describe('Sensor fetching', () => {
    beforeAll(async () => {
      await seed();
    });

    it('Should find all sensors', async () => {
      // @ts-ignore
      await SensorEventController.fetch({ params: {} }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture);
    });

    it('Should find all sensors with the id sensor1', async () => {
      // @ts-ignore
      await SensorEventController.fetch({ params: { sensorId: 'sensor1' } }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture.filter(({ sensorId }) => sensorId === 'sensor1'));
    });

    it('Should find all sensors since 2020-07-01T09:00', async () => {
      const since = (new Date('2020-07-01T09:00')).getTime();
      // @ts-ignore
      await SensorEventController.fetch({ params: { since } }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture.filter(({ time }) => time >= since));
    });

    it('Should find all sensors until 2020-07-01T09:00', async () => {
      const until = (new Date('2020-07-01T09:00')).getTime();
      // @ts-ignore
      await SensorEventController.fetch({ params: { until } }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture.filter(({ time }) => time <= until));
    });

    it('Should find all sensors since 2020-07-01T09:00 until 2020-07-01T10:00', async () => {
      const until = (new Date('2020-07-01T10:00')).getTime();
      const since = (new Date('2020-07-01T09:00')).getTime();
      // @ts-ignore
      await SensorEventController.fetch({ params: { until, since } }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture.filter(({ time }) => time <= until && time >= since));
    });

    it('Should find all sensors with id sensor1 since 2020-07-01T09:00', async () => {
      const since = (new Date('2020-07-01T09:00')).getTime();
      // @ts-ignore
      await SensorEventController.fetch({ params: { since, sensorId: 'sensor1' } }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture.filter(({ time, sensorId }) => time >= since && sensorId === 'sensor1'));
    });

    it('Should find all sensors with id sensor1 until 2020-07-01T09:00', async () => {
      const until = (new Date('2020-07-01T09:00')).getTime();
      // @ts-ignore
      await SensorEventController.fetch({ params: { until, sensorId: 'sensor1' } }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture.filter(({ time, sensorId }) => time <= until && sensorId === 'sensor1'));
    });

    it('Should find all sensors with id sensor1 since 2020-07-01T09:00 until 2020-07-01T10:00', async () => {
      const until = (new Date('2020-07-01T10:00')).getTime();
      const since = (new Date('2020-07-01T09:00')).getTime();
      // @ts-ignore
      await SensorEventController.fetch({ params: { until, since, sensorId: 'sensor1' } }, res);
      expect(send.mock.results[0].value
        .map(({ sensorId, time, value }: SensorEventAttributes) => ({ sensorId, time, value })))
        .toEqual(sensorsFixture.filter(({ time, sensorId }) => time <= until && time >= since && sensorId === 'sensor1'));
    });

    it('Should 404 as there are no sensors with the id of sensor3', async () => {
      // @ts-ignore
      await SensorEventController.fetch({ params: { sensorId: 'sensor3' } }, res);

      expect(status).toHaveBeenLastCalledWith(404);
    });
  });
});
