import { validateSensorEvent } from '@Middleware/sensorEvent';
import {
  status, send, next, res, seed,
} from '../helpers';

describe('Sensor events middleware', () => {
  const sensorError = '\'sensorId\' is required';
  const timeError = '\'time\' is required';

  beforeAll(async () => {
    await seed();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should send 400 error if `sensorId` is not being passed in', () => {
    const body = {
      time: (new Date('2020-06-30T13:00')),
      value: 3,
    };

    // @ts-ignore
    validateSensorEvent({ body }, res, next);

    expect(status).toHaveBeenLastCalledWith(400);
    expect(send).toHaveBeenLastCalledWith({ errors: [sensorError] });
  });

  it('Should send 400 error if `time` is not being passed in', () => {
    const body = {
      sensorId: 'sensor1',
      value: 3,
    };

    // @ts-ignore
    validateSensorEvent({ body }, res, next);

    expect(status).toHaveBeenLastCalledWith(400);
    expect(send).toHaveBeenLastCalledWith({ errors: [timeError] });
  });

  it('Should send 400 error if `sensorId` and `time` is not being passed in', () => {
    const body = {
      value: 3,
    };

    // @ts-ignore
    validateSensorEvent({ body }, res, next);

    expect(status).toHaveBeenLastCalledWith(400);
    expect(send).toHaveBeenLastCalledWith({ errors: [sensorError, timeError] });
  });

  it('Should send 409 error if there is a record that matches both `sensorId` and `time`', async () => {
    const body = { sensorId: 'sensor1', time: (new Date('2020-07-01T10:33')).getTime(), value: 3 };

    // @ts-ignore
    await validateSensorEvent({ body }, res, next);

    expect(status).toHaveBeenLastCalledWith(409);
    expect(send).toHaveBeenLastCalledWith({ errors: ['\'sensorId\' & \'time\' pairings should be unique'] });
  });

  it('Should go to the next function if all is fine', async () => {
    const body = {
      sensorId: 'sensor1',
      value: 3,
      time: (new Date('2020-06-30T13:00')),
    };

    // @ts-ignore
    await validateSensorEvent({ body }, res, next);

    expect(next).toHaveBeenCalled();
  });
});
