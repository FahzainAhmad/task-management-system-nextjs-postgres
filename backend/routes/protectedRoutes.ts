import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/tasksController';

const router = express.Router();

router.get('/tasks', authenticateJWT, getAllTasks);
router.get('/tasks/:id', authenticateJWT, getTaskById);
router.post('/tasks', authenticateJWT, createTask);
router.put('/tasks/:id', authenticateJWT, updateTask);
router.delete('/tasks/:id', authenticateJWT, deleteTask);

export default router;
