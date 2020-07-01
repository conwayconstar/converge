import { Request, Response } from 'express';
import { models } from '@Database';
import {
  AlertEnum, SensorEvent, SensorEventFetchParams, SensorEventFetchRequest,
} from '@Types';
import { Op } from 'sequelize';

export const sendAlert = (alert: AlertEnum) => console.info(alert);

export const checkAlert = (sensorEvent: SensorEvent) => {
  const { value } = sensorEvent;
  let alert;

  switch (true) {
    case value < 3:
      alert = AlertEnum.TOO_LOW;
      break;
    case value >= 3 && value < 5:
      alert = AlertEnum.ALMOST_LOW;
      break;
    case value >= 7 && value < 10:
      alert = AlertEnum.ALMOST_HIGH;
      break;
    case value >= 10:
      alert = AlertEnum.TOO_HIGH;
      break;
    default:
      break;
  }

  if (alert) sendAlert(alert);

  return sensorEvent;
};

export const create = (req: Request, res: Response) => models.SensorEvent.create(req.body)
  .then(checkAlert)
  .then(() => res.sendStatus(204));

export const fetch = (req: SensorEventFetchRequest, res: Response) => {
  const { sensorId, since, until }: SensorEventFetchParams = req.params;
  const where = {
    ...(sensorId ? { sensorId } : {}),
    ...(since || until ? {
      time: {
        ...(since ? { [Op.gte]: since } : {}),
        ...(until ? { [Op.lte]: until } : {}),
      },
    } : {}),
  };
  return models.SensorEvent.findAll({
    where,
  }).then((sensors) => {
    if (!sensors.length) {
      return res.status(404).send({ errors: ['No sensors matched your query'] });
    }

    return res.send(sensors);
  });
};
