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

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


Task.init(
  {
    id: {
      type: SequelizeDataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: SequelizeDataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty',
        },
        len: {
          args: [3, 255],
          msg: 'Title must be between 3 and 255 characters',
        },
      },
    },
    description: {
      type: SequelizeDataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Description should be less than 1000 characters',
        },
      },
    },
    status: {
      type: SequelizeDataTypes.ENUM('pending', 'in_progress', 'completed'),
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'in_progress', 'completed']],
          msg: 'Status must be one of the following: pending, in_progress, completed',
        },
      },
    },
    userId: {
      type: SequelizeDataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  },
  {
    modelName: 'Task',
    sequelize,
    timestamps: true,
  }
);

export default Task;
