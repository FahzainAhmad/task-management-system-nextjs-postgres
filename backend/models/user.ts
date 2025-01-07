import { Model, Sequelize, DataTypes as SequelizeDataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


User.init(
  {
    id: {
      type: SequelizeDataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: SequelizeDataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'username_empty',
        },
        len: {
          args: [3, 30],
          msg: 'tooshort_long',
        },
      },
    },
    email: {
      type: SequelizeDataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'email_empty',
        },
        isEmail: {
          msg: 'notamail',
        },
      },
    },
    password: {
      type: SequelizeDataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'pass_empty',
        },
        len: {
          args: [6, 100],
          msg: 'tooshort_long',
        },
      },
    },
  },
  {
    modelName: 'User',
    sequelize,
    timestamps: true,
  }
);

export default User;
