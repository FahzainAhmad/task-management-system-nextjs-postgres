import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from '../routes/authRoutes';
import protectedRoutes from '../routes/protectedRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/', protectedRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
