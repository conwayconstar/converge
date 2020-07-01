import { NextFunction, Request, Response } from 'express';
import { models } from '@Database';

const { SensorEvent } = models;

enum SensorEventRequired {
  sensorId = 'sensorId',
  time = 'time'
}

export const validateSensorEvent = async ({ body }: Request, res: Response, next: NextFunction) => {
  const errors: Array<string> = [];
  let status = 400;
  Object.keys(SensorEventRequired).forEach((prop) => {
    if (!body[prop]) errors.push(`'${prop}' is required`);
  });

  if (!errors.length) {
    const { sensorId, time } = body;
    const sensorEvent = await SensorEvent.findOne({ where: { sensorId, time } });

    if (sensorEvent) {
      status = 409;
      errors.push('\'sensorId\' & \'time\' pairings should be unique');
    }
  }

  if (errors.length) {
    res.status(status).send({ errors });
  } else {
    next();
  }
};

export default {};
