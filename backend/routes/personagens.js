// Route: só mapeia método + caminho para a função do controller.
import { Router } from 'express';
import * as personagemController from '../controllers/personagemController.js';

const router = Router();

router.get('/', personagemController.listar);
router.get('/:id', personagemController.buscarPorId);
router.post('/', personagemController.criar);
router.put('/:id', personagemController.atualizar);
router.delete('/:id', personagemController.remover);

export default router;
