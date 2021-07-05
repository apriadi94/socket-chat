'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.STRING
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        field: 'is_admin',
      },
      jabatan: Sequelize.STRING,
      name: {
        type: Sequelize.STRING
      },
      profilePicture: {
        type: Sequelize.TEXT,
        field: 'profile_picture'
      },
      tokenNotif: {
        type: Sequelize.STRING,
        field: 'token_notif'
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
    await queryInterface.dropTable('users');
  }
};