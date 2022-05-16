import Products from '../models/products.js';
import ProductImages from '../models/productImages.js';
import Categories from '../models/categories.js';
import { sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';
import fs from 'fs';

export default class ProductController {

  // 상품 등록 API
  static async registerProduct(req, res) {
    try {
      const {
        productName,
        brand,
        base,
        gemstone,
        shape,
        price,
        discount,
        isTodayDelivery,
        categoryId,
      } = req.body;
      const { mainImage, detailImage } = req.files;

      const product = await Products.create({
        productName,
        brand,
        base,
        gemstone,
        shape,
        price,
        discount,
        isTodayDelivery,
      }).then(async function (product) {
        await sequelize.query(
          'INSERT INTO Product_Category (categoryId, productId) VALUES(?,?);',
          {
            replacements: [categoryId, product.dataValues.productId],
            type: QueryTypes.INSERT,
          }
        );
        return product.dataValues.productId;
      });

      registerImages(mainImage, product);
      registerImages(detailImage, product);

      res.status(201).json({ success: true, message: 'successfully registed' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, errorMessage: 'registration failed' });
    }
  }

  // 필터링하여 상품 리스트 불러오기 API
  static async getProductList(req, res) {
    try {
      const filters = [];
      const replacements = [];
      for (let obj in req.query) {
        if (obj === 'categoryId') {
          filters.push(`c.${obj}=?`);
        } else {
          filters.push(`${obj}=?`);
        }
        replacements.push(req.query[obj]);
      }
      const baseQuery = [
        `SELECT p.*,
              (SELECT pi.productImageUrl FROM ProductImages pi WHERE pi.productId=p.productId LIMIT 1) AS mainImageUrl
              FROM Products p 
              LEFT JOIN Product_Category pc ON p.productId = pc.productId 
              LEFT JOIN Categories c ON pc.categoryId = c.categoryId `,
      ];
      baseQuery.push('WHERE', filters.join(' AND '), 'GROUP BY p.productId');
      const sqlQuery = baseQuery.join(' ');

      const productList = await sequelize.query(sqlQuery, {
        replacements,
        type: QueryTypes.SELECT,
      });

      if (!productList.length) {
        return res.status(400).json({ success: false,  errorMessage: 'There is no matching product' });
      }

      res.status(200).json({ productList, success: true, message: 'successfully loaded' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, errorMessage: 'Invalid request' });
    }
  }

  // 상품 상세 정보 불러오기 API
  static async getProductDetail(req, res) {
    try {
      const { productId } = req.params;
      const productDetail = await sequelize.query(
        `SELECT p.*, 
              (SELECT JSON_ARRAYAGG(pi.productImageUrl) FROM ProductImages pi WHERE pi.productId=p.productId AND pi.imageType='mainImage') AS mainImageUrl,
              (SELECT JSON_ARRAYAGG(pi.productImageUrl) FROM ProductImages pi WHERE pi.productId=p.productId AND pi.imageType='detailImage') AS detailImageUrl
              FROM Products p
              WHERE p.productId=?
              GROUP BY p.productId`,
        {
          replacements: [productId],
          type: QueryTypes.SELECT,
        }
      );

      if (!productDetail) {
        return res.status(400).json({ success: false, errorMessage: 'There is no matching product' });
      }

      res.status(200).json({ productDetail, success: true, message: 'successfully loaded' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, errorMessage: 'Invalid request' });
    }
  }

  // 상품 편집 API
  static async modifyProduct(req, res) {
    try {
      const { productId } = req.params;
      const {
        productName,
        brand,
        base,
        gemstone,
        shape,
        price,
        discount,
        isTodayDelivery,
        categoryId,
      } = req.body;

      await Products.update(
        {
          productName,
          brand,
          base,
          gemstone,
          shape,
          price,
          discount,
          isTodayDelivery,
          categoryId,
        },
        {
          where: { productId },
        }
      );

      const existCategoryId = await sequelize.query(
        'SELECT categoryId FROM Product_Category WHERE productId=?;',
        {
          replacements: [productId],
          type: QueryTypes.SELECT,
        }
      );
      if (existCategoryId !== categoryId) {
        await sequelize.query(
          'UPDATE Product_Category SET categoryId=? WHERE productId=?;',
          {
            replacements: [categoryId, productId],
            type: QueryTypes.UPDATE,
          }
        );
      }

      if (req.files) {
        const { mainImage, detailImage } = req.files;
        const previousImages = await ProductImages.findAll({
          where: { productId },
          attributes: ['path'],
        });
        await ProductImages.destroy({
          where: { productId },
        });
        registerImages(mainImage, productId);
        registerImages(detailImage, productId);
        previousImages.forEach((data) => {
          fs.unlinkSync(`./${data.path}`);
        });
      }

      res.status(200).json({ success: true, message: 'successfully modified' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, errorMessage: 'Invalid request' });
    }
  }

  // 상품 삭제 API
  static async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const productImages = await ProductImages.findAll({
        where: { productId },
        attributes: ['path'],
      });
      await Products.destroy({
        where: { productId },
      });
      productImages.forEach((data) => {
        fs.unlinkSync(`./${data.path}`);
      });
      res.status(200).json({ success: true, message: 'successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, errorMessage: 'Invalid request' });
    }
  }

  // 카테고리 등록 API
  static async registerCategory(req, res) {
    try {
      const { categoryName } = req.body;
      await Categories.create({
        categoryName,
      });
      res.status(201).json({ success: true, message: 'successfully registed' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, errorMessage: 'registration failed' });
    }
  }
}

// 상품 이미지 등록 lib
const registerImages = (mainImage, productId) => {
  mainImage.forEach(async (data) => {
    await ProductImages.create({
      productId,
      productImageUrl: process.env.URL + data.filename,
      imageType: data.fieldname,
      path: data.path,
    });
  });
};
