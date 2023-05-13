const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');
const Wallet = require('./Wallet');

class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], // requires the password to be at least 8 characters long
      },
    },
  },
  {
    /*hooks: {
      async beforeCreate(newUser) {
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return newUser;
      },
      async beforeUpdate(updatedUser) {
        updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
        return updatedUser;
      },
      async afterCreate(createdUser) {
        await Wallet.create({ user_id: createdUser.id });

        // Query the user again to check the saved password
        const savedUser = await User.findOne({ where: { id: createdUser.id } });
        console.log('Saved User: ', savedUser.dataValues);
      },
    },*/
    sequelize,
    timestamps: false, // Updated this line
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
