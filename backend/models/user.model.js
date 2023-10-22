export default (sequelize, Sequelize) => {
	const User = sequelize.define("user_account", {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_name: {
      type: Sequelize.STRING(40),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: Sequelize.STRING(128),
      allowNull: false,
  },
	});

	return User;
};