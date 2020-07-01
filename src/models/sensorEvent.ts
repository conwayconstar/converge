import { DataTypes, Sequelize } from 'sequelize';
import { SensorEvent } from '@Types';

export default (sequelize: Sequelize) => {
  SensorEvent.init(
    {
      sensorId: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'sensor-event',
      sequelize,
    },
  );

  return SensorEvent;
};
