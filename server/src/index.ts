import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import generateRoute from './routes/generate';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.use('/api/generate', generateRoute);

app.listen(process.env.PORT || 3000, () => console.log('Server running on', process.env.PORT || 3000));
