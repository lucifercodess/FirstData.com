import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { connectDb } from './src/configs/db.config.js';
import userRoute from './src/routes/user.route.js'
import matchRoute from './src/routes/match.route.js'
import messageRoute from './src/routes/message.route.js'

const app = express();
dotenv.config();



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(cookieParser({
  credentials: true
}));


app.use('/api/user',userRoute)
app.use('/api/message',messageRoute)
app.use('/api/match',matchRoute)

app.listen(process.env.PORT,()=>{
  connectDb();
  console.log(`Server is running on port ${process.env.PORT}`);
})
