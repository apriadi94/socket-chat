'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: { tableName: 'users' },
          key: 'id',
        }
      },
      roomId: {
        type: Sequelize.INTEGER,
        field: 'room_id',
        references: {
          model: { tableName: 'rooms' },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nowUpdate: {
        type: Sequelize.STRING,
        field: 'now_update',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_rooms');
  }
};