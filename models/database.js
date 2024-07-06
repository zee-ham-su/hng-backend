const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.development);

const User = require('./user')(sequelize, Sequelize);
const Organisation = require('./organisation')(sequelize, Sequelize);

// Define your associations
User.belongsToMany(Organisation, { through: 'UserOrganisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisations' });

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  console.log(User === sequelize.models.User);
console.log(Organisation === sequelize.models.Organisation);

const db = {
  Sequelize,
  sequelize,
  User,
  Organisation,
};

module.exports = db;
