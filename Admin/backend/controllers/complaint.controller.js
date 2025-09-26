import { ComplaintModel } from "../models/complaint.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getComplaints = asyncHandler(async (req, res) => {
  const { page, limit, thana_id, status } = req.query;
  const rows = await ComplaintModel.findAll({ page, limit, thana_id, status });
  res.json(rows);
});

export const getComplaint = asyncHandler(async (req, res) => {
  const item = await ComplaintModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Complaint not found");
  res.json(item);
});

export const createComplaint = asyncHandler(async (req, res) => {
  const created = await ComplaintModel.create(req.body);
  res.status(201).json(created);
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const updated = await ComplaintModel.update(req.params.id, req.body);
  res.json(updated);
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const ok = await ComplaintModel.remove(req.params.id);
  if (!ok) throw new HttpError(404, "Complaint not found");
  res.status(204).send();
});
