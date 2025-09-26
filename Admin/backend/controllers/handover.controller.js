import { HandoverModel } from "../models/handover.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getHandovers = asyncHandler(async (req, res) => {
  const { page, limit, case_id } = req.query;
  const rows = await HandoverModel.findAll({ page, limit, case_id });
  res.json(rows);
});

export const getHandover = asyncHandler(async (req, res) => {
  const item = await HandoverModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Handover log not found");
  res.json(item);
});

export const createHandover = asyncHandler(async (req, res) => {
  const created = await HandoverModel.create(req.body);
  res.status(201).json(created);
});

export const updateHandover = asyncHandler(async (req, res) => {
  const updated = await HandoverModel.update(req.params.id, req.body);
  res.json(updated);
});

export const deleteHandover = asyncHandler(async (req, res) => {
  const ok = await HandoverModel.remove(req.params.id);
  if (!ok) throw new HttpError(404, "Handover log not found");
  res.status(204).send();
});
