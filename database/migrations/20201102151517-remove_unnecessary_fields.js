'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Users', 'location');
    await queryInterface.removeColumn('Users', 'phoneNumber');
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'dob');
    await queryInterface.removeColumn('Users', 'bvn');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Users', 'dob', {
      type: DataTypes.DATEONLY,
      allowNull: false,
    });

    await queryInterface.addColumn('Users', 'location', {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Users', 'phoneNumber', {
        type: DataTypes.STRING,
        allowNull: false,
    });

    await queryInterface.addColumn('Users', 'gender', {
        type: DataTypes.STRING,
        allowNull: false,
    });
    await queryInterface.addColumn('Users', 'bvn', {
        type: DataTypes.STRING,
        allowNull: true,
    });
    
  }
};
