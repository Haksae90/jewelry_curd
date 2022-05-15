import { validationResult, body } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

export default [
  body('productName').notEmpty().withMessage('please check up productName'),
  body('brand').notEmpty().withMessage('please check up brand'),
  body('base').notEmpty().withMessage('please check up base'),
  body('gemstone').notEmpty().withMessage('please check up gemstone'),
  body('shape').notEmpty().withMessage('please check up shape'),
  body('price').notEmpty().withMessage('please check up price'),
  body('discount').notEmpty().withMessage('please check up discount'),
  body('isTodayDelivery').notEmpty().isBoolean().withMessage('please check up isTodayDelivery'),
  validate,
];