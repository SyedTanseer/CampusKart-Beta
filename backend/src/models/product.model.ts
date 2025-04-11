import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface IProduct {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Product extends Model<IProduct> implements IProduct {
  public id!: number;
  public title!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public imageUrl?: string;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  }
);

export default Product; 