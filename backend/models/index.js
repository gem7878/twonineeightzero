import { Sequelize } from 'sequelize';
import userModel from './user.model.js';
import roleModel from './role.model.js';
import boardModel from './board.model.js';
import commentModel from './comment.model.js';

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
	host: process.env.INSTANCE_UNIX_SOCKET,
  	dialect: process.env.PG_DIALECT,
  	operatorsAliases: false,
	timezone: 'Etc/GMT-9',
    dialectOptions: {
        socketPath: process.env.INSTANCE_UNIX_SOCKET
    },
    logging: false,
});

const db = {
	Sequelize : Sequelize, 
	sequelize : sequelize,
	user : userModel(sequelize, Sequelize),
	role : roleModel(sequelize,Sequelize),
	board : boardModel(sequelize, Sequelize),
	comment : commentModel(sequelize,Sequelize),
	ROLES : ["user", "admin", "moderator"],
};

db.role.belongsToMany(db.user, {
	through: "user_roles"
});

db.user.belongsToMany(db.role, {
	through: "user_roles"
});

db.board.belongsTo(db.user);

db.comment.belongsTo(db.user);
db.comment.belongsTo(db.board);

export default db;