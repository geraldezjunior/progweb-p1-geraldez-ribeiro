import express from 'express';
import cors from 'cors';
import clientesRouter from './routes/clientes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ErroHttp } from './utils/erro.js';

const app = express();

// CORS antes das rotas: libera o front servido na porta 5500.
app.use(cors({ origin: ['http://localhost:5500', 'http://127.0.0.1:5500'] }));
app.use(express.json());
app.use(logger);

app.use('/clientes', clientesRouter);

// Rota inexistente também sai pelo errorHandler.
app.use((req, res, next) => {
  next(new ErroHttp(404, `Rota ${req.method} ${req.originalUrl} não encontrada`));
});

app.use(errorHandler);

export default app;
