import { VictimModel } from "../models/victim.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getVictims = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const rows = await VictimModel.findAll({ page, limit });
  res.json(rows);
});

export const getVictim = asyncHandler(async (req, res) => {
  const item = await VictimModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Victim not found");
  res.json(item);
});

export const createVictim = asyncHandler(async (req, res) => {
  const { victim_id, name, nid, address, phone } = req.body;
  if (!victim_id || !name || !nid || !address || !phone) {
    throw new HttpError(400, "All fields are required including victim_id");
  }

  const created = await VictimModel.create({
    victim_id,
    name,
    nid,
    address,
    phone,
  });
  res.status(201).json(created);
});

export const updateVictim = asyncHandler(async (req, res) => {
  const { name, nid, address, phone } = req.body;
  const updated = await VictimModel.update(req.params.id, {
    name,
    nid,
    address,
    phone,
  });
  if (!updated) throw new HttpError(404, "Victim not found");
  res.json(updated);
});

export const deleteVictim = asyncHandler(async (req, res) => {
  const ok = await VictimModel.remove(req.params.id);
  if (!ok) throw new HttpError(404, "Victim not found");
  res.status(204).send();
});
