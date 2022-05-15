import express from 'express';
import dotenv from "dotenv";
import { sequelize } from './models/index.js';
import productRouter from './router/product.js'

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB Connected Success');
  })
  .catch((err) => {
    console.error(err);
  });
  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/productImage', express.static('assets/productImages'));
app.use('/product', productRouter);

app.listen(port, () => {
  console.log(`Start listen Server on ${port} port`);
});