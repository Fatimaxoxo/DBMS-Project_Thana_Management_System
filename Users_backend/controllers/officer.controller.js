import { OfficerModel } from "../models/officer.model.js";
import { CaseModel } from "../models/case.model.js";
import { NotificationModel } from "../models/notification.model.js";
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

// Warrant Officer specific controllers
export const getWarrantOfficers = asyncHandler(async (req, res) => {
  const { thana_id } = req.query;
  let officers;

  if (thana_id) {
    officers = await OfficerModel.getWarrantOfficersByThana(thana_id);
  } else {
    officers = await OfficerModel.getAllWarrantOfficers();
  }

  res.json(officers);
});

export const getWarrantOfficerDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get officer's assigned cases
  const assignedCases = await CaseModel.findAll({
    assigned_to: userId,
    limit: 100,
  });

  // Get recent notifications
  const notifications = await NotificationModel.findByUserId(userId, {
    limit: 10,
  });

  // Calculate statistics
  const totalCases = assignedCases.length;
  const pendingCases = assignedCases.filter(
    (c) => c.status === "pending"
  ).length;
  const ongoingCases = assignedCases.filter(
    (c) => c.status === "in_progress"
  ).length;
  const completedCases = assignedCases.filter(
    (c) => c.status === "completed"
  ).length;

  res.json({
    statistics: {
      totalCases,
      pendingCases,
      ongoingCases,
      completedCases,
    },
    assignedCases: assignedCases.slice(0, 10), // Latest 10 cases
    notifications,
  });
});

export const getAvailableWarrantOfficers = asyncHandler(async (req, res) => {
  const { thana_id } = req.query;
  const officers = await OfficerModel.getAvailableWarrantOfficers(thana_id);
  res.json(officers);
});
