import { CaseModel } from "../models/case.model.js";
import { NotificationModel } from "../models/notification.model.js";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getCases = asyncHandler(async (req, res) => {
  const { page, limit, status, thana_id, assigned_to, user_id } = req.query;
  const rows = await CaseModel.findAll({
    page,
    limit,
    status,
    thana_id,
    assigned_to,
    user_id,
  });
  res.json(rows);
});

export const getCase = asyncHandler(async (req, res) => {
  const item = await CaseModel.findById(req.params.id);
  if (!item) throw new HttpError(404, "Case not found");
  res.json(item);
});

export const createCase = asyncHandler(async (req, res) => {
  const { summary, complaint_id, thana_id, priority } = req.body;
  const userId = req.user.userId; // From auth middleware

  // Generate case number
  const caseNumber = `CASE-${Date.now()}`;

  const created = await CaseModel.create({
    case_number: caseNumber,
    summary,
    start_date: new Date().toISOString().split("T")[0],
    complaint_id,
    user_id: userId,
    thana_id,
    priority,
  });

  // Notify thana officers
  await NotificationModel.notifyThanaOfficers(
    thana_id,
    "নতুন মামলা এসেছে",
    `একটি নতুন মামলা জমা দেওয়া হয়েছে: ${caseNumber}`,
    created.case_id,
    complaint_id
  );

  res.status(201).json(created);
});

export const assignWarrantOfficer = asyncHandler(async (req, res) => {
  const caseId = req.params.id;
  const { warrant_officer_id, priority_notes = "" } = req.body;

  // Check if current user is thana officer
  if (req.user.role !== "thana-officer") {
    throw new HttpError(403, "Only thana officers can assign cases");
  }

  const updated = await CaseModel.assignWarrantOfficer(
    caseId,
    warrant_officer_id,
    req.user.userId,
    priority_notes
  );

  // Notify warrant officer
  await NotificationModel.notifyWarrantOfficer(
    warrant_officer_id,
    "নতুন মামলা বরাদ্দ",
    `আপনাকে একটি নতুন মামলা বরাদ্দ করা হয়েছে: ${updated.case_number}. ${
      priority_notes ? "নোট: " + priority_notes : ""
    }`,
    caseId
  );

  res.json({
    message: "ওয়ারেন্ট অফিসার সফলভাবে নিয়োগ দেওয়া হয়েছে",
    case: updated,
  });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const caseId = req.params.id;
  const { progress_percentage, notes } = req.body;

  // Check if current user is warrant officer assigned to this case
  const caseData = await CaseModel.findById(caseId);
  if (!caseData) throw new HttpError(404, "Case not found");

  if (
    req.user.role !== "warrant-officer" ||
    caseData.assigned_warrant_officer_id !== req.user.userId
  ) {
    throw new HttpError(
      403,
      "Only assigned warrant officer can update progress"
    );
  }

  const updated = await CaseModel.updateProgress(
    caseId,
    progress_percentage,
    notes
  );

  // Notify user about progress update
  await NotificationModel.create({
    recipient_user_id: caseData.user_id,
    recipient_role: "user",
    title: "মামলার অগ্রগতি আপডেট",
    message: `আপনার মামলা ${caseData.case_number} এর অগ্রগতি ${progress_percentage}% এ পৌঁছেছে`,
    type: "progress_update",
    case_id: caseId,
  });

  // Notify thana officers
  await NotificationModel.notifyThanaOfficers(
    caseData.thana_id,
    "মামলার অগ্রগতি আপডেট",
    `মামলা ${caseData.case_number} এর অগ্রগতি ${progress_percentage}% এ পৌঁছেছে`,
    caseId
  );

  res.json({
    message: "মামলার অগ্রগতি সফলভাবে আপডেট করা হয়েছে",
    case: updated,
  });
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
