import { OfficerModel } from "../models/officer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getOfficers = asyncHandler(async (req, res) => {
  const { page, limit, thana_id } = req.query;
  const rows = await OfficerModel.findAll({ page, limit, thana_id });
  res.json(rows);
});

export const getOfficer = asyncHandler(async (req, res) => {
  const item = await OfficerModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Officer not found");
  res.json(item);
});

export const createOfficer = asyncHandler(async (req, res) => {
  const created = await OfficerModel.create(req.body);
  res.status(201).json(created);
});

export const updateOfficer = asyncHandler(async (req, res) => {
  const updated = await OfficerModel.update(req.params.id, req.body);
  res.json(updated);
});

export const deleteOfficer = asyncHandler(async (req, res) => {
  const ok = await OfficerModel.remove(req.params.id);
  if (!ok) throw new HttpError(404, "Officer not found");
  res.status(204).send();
});
