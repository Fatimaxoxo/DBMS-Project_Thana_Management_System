import { ComplaintModel } from "../models/complaint.model.js";
import { NotificationModel } from "../models/notification.model.js";
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
  const { title, description, complaint_type, location, incident_date } =
    req.body;
  const userId = req.user.userId; // From auth middleware

  // Auto-detect thana based on user or default to 1
  let thanaId = req.user.thanaId || 1;

  // Create complaint
  const created = await ComplaintModel.create({
    title: title || `${complaint_type} অভিযোগ`,
    description,
    complaint_type,
    location,
    incident_date,
    user_id: userId,
    thana_id: thanaId,
    status: "pending",
  });

  // Auto-create case for this complaint
  const { CaseModel } = await import("../models/case.model.js");

  const caseNumber = `CASE-${Date.now()}-${created.complaint_id}`;
  const caseTitle = `${complaint_type} সম্পর্কিত মামলা`;
  const caseDescription = `${description}. ঘটনাস্থল: ${location}`;

  const caseCreated = await CaseModel.create({
    case_number: caseNumber,
    complaint_id: created.complaint_id,
    user_id: userId,
    case_title: caseTitle,
    case_description: caseDescription,
    case_type: "criminal",
    crime_type: complaint_type,
    incident_location: location,
    incident_date,
    thana_id: thanaId,
    priority:
      complaint_type === "assault" || complaint_type === "fraud"
        ? "high"
        : complaint_type === "theft" || complaint_type === "property_damage"
        ? "medium"
        : "low",
    status: "pending",
  });

  // Notify thana officers about new complaint and case
  await NotificationModel.notifyThanaOfficers(
    thanaId,
    "নতুন অভিযোগ ও মামলা",
    `নতুন ${complaint_type} অভিযোগ এবং মামলা ${caseNumber} তৈরি হয়েছে। এলাকা: ${location}`,
    caseCreated.case_id,
    created.complaint_id
  );

  // Notify complaint user
  await NotificationModel.create({
    recipient_user_id: userId,
    recipient_role: "user",
    title: "অভিযোগ গ্রহণ সফল",
    message: `আপনার ${complaint_type} অভিযোগ সফলভাবে গ্রহণ করা হয়েছে। মামলা নম্বর: ${caseNumber}`,
    type: "new_case",
    case_id: caseCreated.case_id,
    complaint_id: created.complaint_id,
  });

  res.status(201).json({
    complaint: created,
    case: caseCreated,
    message: "অভিযোগ ও মামলা সফলভাবে তৈরি হয়েছে",
  });
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
