'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    uid: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      field: 'is_admin',
    },
    profilePicture: { type: DataTypes.TEXT, field: 'profile_picture' },
    tokenNotif: { type: DataTypes.STRING, field: 'token_notif' }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};