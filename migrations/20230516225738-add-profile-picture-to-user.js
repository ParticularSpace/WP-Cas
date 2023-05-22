//Created to test the migration of the profile picture column (wanted to try this out so i wouldnt have to delete the database and start over)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'profile_picture' column to the 'user' table
    await queryInterface.addColumn('user', 'profile_picture', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'profile_picture' column from the 'user' table
    await queryInterface.removeColumn('user', 'profile_picture');
  },
};
