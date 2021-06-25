'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserRoom.belongsTo(models.Room, { as: 'room', foreignKey: 'roomId' })
      UserRoom.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    }
  };
  UserRoom.init({
    userId: { 
      type: DataTypes.INTEGER, 
      field: 'user_id',
      references: {
        model: { tableName: 'users'},
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    roomId: { 
      type: DataTypes.INTEGER, 
      field: 'room_id',
      references: {
        model: { tableName: 'rooms' },
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nowUpdate: {
      type: DataTypes.STRING, 
      field: 'now_update',
    },
  }, {
    sequelize,
    modelName: 'UserRoom',
    tableName: 'user_rooms'
  });
  return UserRoom;
};