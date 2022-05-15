'use strict'
import Sequelize from 'sequelize';
import Products from './products.js';
import ProductImages from './productImages.js';
import Categories from './categories.js'

import config from '../config/config.js'
const db = {};

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
db.sequelize = sequelize;

db.Products = Products;
db.ProductImages = ProductImages;
db.Categories = Categories;

Products.init(sequelize);
ProductImages.init(sequelize);
Categories.init(sequelize);

Products.associate(db);
ProductImages.associate(db);
Categories.associate(db);
