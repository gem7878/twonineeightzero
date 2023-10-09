export default (sequelize, Sequelize) => {
    const CustomerBoard = sequelize.define("customer_board", {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  
    return CustomerBoard;
};