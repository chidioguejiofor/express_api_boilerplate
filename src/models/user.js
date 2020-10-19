/* eslint-disable */
const {
  Model, DataTypes,
} = require('sequelize');

export class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    this.tableName = 'Users';
    // define association here
  }
}

module.exports = (sequelize) => {
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
