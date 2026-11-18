import express from 'express';
import clientesRouter from './routes/clientes.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ErroHttp } from './utils/erro.js';

const app = express();

app.use(express.json());
app.use(logger);

app.use('/clientes', clientesRouter);

// Rota inexistente também sai pelo errorHandler.
app.use((req, res, next) => {
  next(new ErroHttp(404, `Rota ${req.method} ${req.originalUrl} não encontrada`));
});

app.use(errorHandler);

export default app;
