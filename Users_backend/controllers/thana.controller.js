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

// Dashboard methods
export const getThanaOfficerDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const thanaId = req.user.thanaId || 1;

  try {
    // Import models dynamically to avoid circular deps
    const { ComplaintModel } = await import("../models/complaint.model.js");
    const { CaseModel } = await import("../models/case.model.js");
    const { NotificationModel } = await import(
      "../models/notification.model.js"
    );
    const { UserModel } = await import("../models/user.model.js");

    // Get complaints for this thana
    const complaints = await ComplaintModel.findAll({
      thana_id: thanaId,
      limit: 100,
    });

    // Get cases for this thana
    const cases = await CaseModel.findAll({
      thana_id: thanaId,
      limit: 100,
    });

    // Get notifications for this officer
    const notifications = await NotificationModel.findByUserId(userId, {
      limit: 20,
    });

    // Get available warrant officers for this thana
    const warrantOfficers = await UserModel.findByThanaAndRole(
      thanaId,
      "warrant-officer"
    );

    // Calculate statistics
    const stats = {
      totalComplaints: complaints.length,
      newComplaints: complaints.filter((c) => c.status === "pending").length,
      totalCases: cases.length,
      pendingCases: cases.filter((c) => c.status === "pending").length,
      ongoingCases: cases.filter((c) => c.status === "investigating").length,
      completedCases: cases.filter((c) => c.status === "resolved").length,
    };

    res.json({
      stats,
      complaints,
      cases,
      notifications,
      warrantOfficers,
      thanaInfo: {
        thana_id: thanaId,
        officer_name: req.user.name,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Dashboard data fetch করতে সমস্যা হয়েছে" });
  }
});

export const assignCaseToWarrantOfficer = asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const { warrant_officer_id, priority_notes } = req.body;
  const thanaOfficerId = req.user.userId;

  const { CaseModel } = await import("../models/case.model.js");
  const { NotificationModel } = await import("../models/notification.model.js");

  // Check if case exists
  const caseData = await CaseModel.findById(caseId);
  if (!caseData) {
    throw new HttpError(404, "মামলা খুঁজে পাওয়া যায়নি");
  }

  // Update case assignment
  const updatedCase = await CaseModel.assignWarrantOfficer(
    caseId,
    warrant_officer_id,
    thanaOfficerId,
    priority_notes
  );

  // Create notification for warrant officer
  await NotificationModel.create({
    recipient_user_id: warrant_officer_id,
    recipient_role: "warrant-officer",
    title: "নতুন মামলা বরাদ্দ",
    message: `আপনাকে মামলা ${caseData.case_number} বরাদ্দ করা হয়েছে। ${
      priority_notes || ""
    }`,
    type: "case_assigned",
    case_id: caseId,
  });

  // Notify user about case assignment
  if (caseData.user_id) {
    await NotificationModel.create({
      recipient_user_id: caseData.user_id,
      recipient_role: "user",
      title: "মামলা তদন্তের জন্য বরাদ্দ",
      message: `আপনার মামলা ${caseData.case_number} তদন্তের জন্য ওয়ারেন্ট অফিসারের কাছে পাঠানো হয়েছে।`,
      type: "case_assigned",
      case_id: caseId,
    });
  }

  res.json({
    success: true,
    case: updatedCase,
    message: "মামলা সফলভাবে বরাদ্দ করা হয়েছে",
  });
});
