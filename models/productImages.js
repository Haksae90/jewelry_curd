'use strict'
import Sequelize from 'sequelize';

export default class ProductImages extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        productImageId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        productImageUrl: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        imageType: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        path: {
          type: Sequelize.STRING,
          allowNull: false,
        },  
      },
      {
        sequelize,
        modelName: 'ProductImages',
        timestamps: true,
        createdAt: true,
        updatedAt: false,
      }
    );
  }
  static associate(db) {
    db.ProductImages.belongsTo(db.Products, {
      foreignKey: 'productId',
      sourceKey: 'productId',
      onDelete: 'CASCADE',
    });
  }
};