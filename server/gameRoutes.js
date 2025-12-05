const express = require('express');
const GameState = require('./gameModel');

const router = express.Router();

// GET /api/game/:userId - obtener estado de juego
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const state = await GameState.findOne({ userId }).lean();
    if (!state) {
      return res.status(404).json({ message: 'No game state found for this user' });
    }
    res.json(state);
  } catch (err) {
    console.error('Error fetching game state:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/game/:userId - guardar/actualizar estado de juego
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const payload = req.body || {};

  try {
    const update = {
      userId,
      userName: String(payload.userName || '').trim(),
      points: Number(payload.points) || 0,
      autoClick: {
        speedLevel: Number(payload.autoClick?.speedLevel) || 0,
        powerLevel: Number(payload.autoClick?.powerLevel) || 0,
        intervalMs: Number(payload.autoClick?.intervalMs) || 0,
      },
      autoInvest: {
        level: Number(payload.autoInvest?.level) || 0,
        cost: Number(payload.autoInvest?.cost) || 0,
        intervalMs: Number(payload.autoInvest?.intervalMs) || 0,
      },
      objective: {
        level: Number(payload.objective?.level) || 1,
        progress: Number(payload.objective?.progress) || 0,
      },
    };

    const state = await GameState.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.json(state);
  } catch (err) {
    console.error('Error saving game state:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/game/:userId - eliminar estado de juego (para resets)
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await GameState.findOneAndDelete({ userId });
    
    if (!result) {
      return res.status(404).json({ message: 'No game state found for this user' });
    }
    
    console.log(`🗑️ Estado eliminado para usuario: ${userId}`);
    res.json({ message: 'Game state deleted successfully', userId });
  } catch (err) {
    console.error('Error deleting game state:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/game/admin/reset-all - ADMIN: resetear toda la base de datos
router.delete('/admin/reset-all', async (req, res) => {
  try {
    const result = await GameState.deleteMany({});
    
    console.log(`🗑️ BASE DE DATOS RESETEADA - ${result.deletedCount} documentos eliminados`);
    res.json({ 
      message: 'All game states deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error('Error resetting database:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
