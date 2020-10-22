'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('Users', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'location', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'callCode', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'bvn', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'dob');
    await queryInterface.removeColumn('Users', 'location');
    await queryInterface.removeColumn('Users', 'callCode');
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'bvn');
    await queryInterface.removeColumn('Users', 'password');
  }
};
