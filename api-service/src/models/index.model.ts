import { resolve } from 'path';
import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize('sqlite::memory:');

export const initDatabase = async () => {
  await sequelize.authenticate();
  console.log('DB Connected');

  await sequelize.addModels([resolve(__dirname, '!(index)*.model.{js,ts}')]);
  console.log('Sequelize models loaded');

  await sequelize.sync({ force: true });
  console.log('Schema created');
};
