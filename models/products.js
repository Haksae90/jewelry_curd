'use strict'
import Sequelize from 'sequelize';

export default class Products extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        productId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        productName: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        brand: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        base: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        gemstone: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        shape: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        discount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        isTodayDelivery: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Products',
        timestamps: true,
      }
    );
  }
  static associate(db) {
    db.Products.hasMany(db.ProductImages, {
      foreignKey: 'productId',
      sourceKey: 'productId',
    });
    db.Products.belongsToMany(db.Categories, {
      through: 'Product_Category',
      foreignKey: 'productId',
      onDelete: 'CASCADE',
      timestamps: false,
    });
  }
};