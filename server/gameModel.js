const mongoose = require('mongoose');

const AutoClickSchema = new mongoose.Schema(
  {
    speedLevel: { type: Number, default: 0 },
    powerLevel: { type: Number, default: 0 },
    intervalMs: { type: Number, default: 0 },
  },
  { _id: false }
);

const AutoInvestSchema = new mongoose.Schema(
  {
    level: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    intervalMs: { type: Number, default: 0 },
  },
  { _id: false }
);

const ObjectiveSchema = new mongoose.Schema(
  {
    level: { type: Number, default: 1 },
    progress: { type: Number, default: 0 },
  },
  { _id: false }
);

const GameStateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true, unique: true },
    userName: { type: String, required: true, index: true, unique: true },
    points: { type: Number, default: 0 },
    autoClick: { type: AutoClickSchema, default: () => ({}) },
    autoInvest: { type: AutoInvestSchema, default: () => ({}) },
    objective: { type: ObjectiveSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const GameState = mongoose.model('GameState', GameStateSchema);

module.exports = GameState;
