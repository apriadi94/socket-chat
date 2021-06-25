'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    }
  };
  Room.init({
    type: DataTypes.STRING,
    ownerId: { 
      type: DataTypes.INTEGER, 
      field: 'owner_id',
      references: {
        model: { tableName: 'users' },
        key: 'id',
      },
      nowUpdate: {
        type: DataTypes.DATE, 
        field: 'now_update',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms'
  });
  return Room;
};