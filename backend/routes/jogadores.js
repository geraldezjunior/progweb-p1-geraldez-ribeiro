// Route: só mapeia método + caminho para a função do controller.
import { Router } from 'express';
import * as jogadorController from '../controllers/jogadorController.js';

const router = Router();

router.get('/', jogadorController.listar);
router.get('/:id', jogadorController.buscarPorId);
router.post('/', jogadorController.criar);
router.put('/:id', jogadorController.atualizar);
router.delete('/:id', jogadorController.remover);

export default router;
