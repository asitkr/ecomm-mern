import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js';

// configure env
dotenv.config();

// database connection
connectDB();

// rest object
const app = express();

// port
const PORT = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);

app.get('/', (req, res) => {
    res.send({
        message: 'Rest API'
    })
})

app.listen(PORT);