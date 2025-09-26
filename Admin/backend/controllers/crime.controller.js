import { CrimeModel } from "../models/crime.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getCrimes = asyncHandler(async (req, res) => {
  const { page, limit, thana_id } = req.query;
  const rows = await CrimeModel.findAll({ page, limit, thana_id });
  res.json(rows);
});

export const getCrime = asyncHandler(async (req, res) => {
  const item = await CrimeModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Crime not found");
  res.json(item);
});

export const createCrime = asyncHandler(async (req, res) => {
  const created = await CrimeModel.create(req.body);
  res.status(201).json(created);
});

export const updateCrime = asyncHandler(async (req, res) => {
  const updated = await CrimeModel.update(req.params.id, req.body);
  res.json(updated);
});

export const deleteCrime = asyncHandler(async (req, res) => {
  const ok = await CrimeModel.remove(req.params.id);
  if (!ok) throw new HttpError(404, "Crime not found");
  res.status(204).send();
});
