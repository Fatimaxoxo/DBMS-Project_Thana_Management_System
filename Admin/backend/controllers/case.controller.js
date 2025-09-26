import { CaseModel } from "../models/case.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getCases = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const rows = await CaseModel.findAll({ page, limit, status });
  res.json(rows);
});

export const getCase = asyncHandler(async (req, res) => {
  const item = await CaseModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Case not found");
  res.json(item);
});

export const createCase = asyncHandler(async (req, res) => {
  const created = await CaseModel.create(req.body);
  res.status(201).json(created);
});

export const updateCase = asyncHandler(async (req, res) => {
  const updated = await CaseModel.update(req.params.id, req.body);
  res.json(updated);
});

export const deleteCase = asyncHandler(async (req, res) => {
  const ok = await CaseModel.remove(req.params.id);
  if (!ok) throw new HttpError(404, "Case not found");
  res.status(204).send();
});
