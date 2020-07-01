import { Model } from 'sequelize';
import { Request } from 'express';

export interface SensorEventAttributes {
  sensorId: string;
  time: number;
  value: number;
}

export class SensorEvent extends Model<SensorEventAttributes, SensorEventAttributes> {
  public sensorId: string;

  public time: number;

  public value: number;
}

export type SensorEventFetchParams = {
  sensorId: string;
  since: number;
  until: number;
};

export type SensorEventFetchRequest = Request & { params: SensorEventFetchParams};

export enum AlertEnum {
  TOO_HIGH = 'The sensor value is too high',
  TOO_LOW = 'The sensor value is too low',
  ALMOST_HIGH = 'The sensor value is getting too high',
  ALMOST_LOW = 'The sensor value is getting too low',
}
