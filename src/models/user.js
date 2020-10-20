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
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
