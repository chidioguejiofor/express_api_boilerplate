/* eslint-disable */
const {
  Model, DataTypes,
} = require('sequelize');
const bcrypt = require('bcrypt');

export class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

   static generateHash(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }

    static isPasswordValid(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

  static associate(models) {
    this.tableName = 'Users';
    // define association here
  }
}

module.exports = (sequelize) => {
  User.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue:require("sequelize").UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
   

  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
