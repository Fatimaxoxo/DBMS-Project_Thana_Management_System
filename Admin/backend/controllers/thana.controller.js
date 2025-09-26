import { ThanaModel } from "../models/thana.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getThanas = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const rows = await ThanaModel.findAll({ page, limit });
  res.json(rows);
});

export const getThana = asyncHandler(async (req, res) => {
  const item = await ThanaModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Thana not found");
  res.json(item);
});

export const createThana = asyncHandler(async (req, res) => {
  const { thana_id, name, address, contact } = req.body;
  const created = await ThanaModel.create({ thana_id, name, address, contact });
  res.status(201).json(created);
});

export const updateThana = asyncHandler(async (req, res) => {
  const { name, address, contact } = req.body;
  const updated = await ThanaModel.update(req.params.id, {
    name,
    address,
    contact,
  });
  res.json(updated);
});

export const deleteThana = asyncHandler(async (req, res) => {
  const ok = await ThanaModel.remove(req.params.id);
  if (!ok) throw new HttpError(404, "Thana not found");
  res.status(204).send();
});
