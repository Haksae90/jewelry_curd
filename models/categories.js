'use strict'
import Sequelize from 'sequelize';

export default class Categories extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        categoryId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        categoryName: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Categories',
        timestamps: false,
      }
    );
  }
  static associate(db) {
    db.Categories.belongsToMany(db.Products, {
      through: 'Product_Category',
      foreignKey: 'categoryId',
      onDelete: 'CASCADE',
      timestamps: false,
    });
  }
};