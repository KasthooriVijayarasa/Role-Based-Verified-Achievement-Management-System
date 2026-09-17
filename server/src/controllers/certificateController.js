const { customAlphabet } = require("nanoid");
const { categoryModelMap } = require("../models/certificateModels");

// Avoids ambiguous characters (0/O, 1/I) since students type this manually
const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

const prefixMap = {
  Leadership: "LEAD",
  CommunityService: "COMM",
  Sports: "SPRT",
  AestheticTechnical: "AEST",
  ConferencePresentation: "CONF",
  Other: "OTHR",
};

// Helper: search all 6 category collections for a given certificate ID
async function findCertificateAnywhere(certificateId) {
  for (const [category, Model] of Object.entries(categoryModelMap)) {
    const certificate = await Model.findOne({ certificateId });
    if (certificate) return { category, Model, certificate };
  }
  return null;
}

// ==========================================
// COORDINATOR — upload a certificate
// ==========================================
exports.uploadCertificate = async (req, res) => {
  try {
    const category = req.user.coordinatorCategory;
    if (!category || !categoryModelMap[category]) {
      return res.status(403).json({ message: "Your account has no coordinator category assigned" });
    }

    const { studentIndexNo, title, eventOrOrgName, positionOrPrize, year } = req.body;
    if (!studentIndexNo || !title || !year) {
      return res.status(400).json({ message: "studentIndexNo, title and year are required" });
    }

    const Model = categoryModelMap[category];

    // Generate a unique certificate ID for this category
    let certificateId;
    let unique = false;
    while (!unique) {
      certificateId = `${prefixMap[category]}-${nanoid()}`;
      unique = !(await Model.findOne({ certificateId }));
    }

    const certificate = await Model.create({
      certificateId,
      studentIndexNo,
      title,
      eventOrOrgName,
      positionOrPrize,
      year,
      proofDocument: req.file ? req.file.path : null,
      coordinatorId: req.user.id,
    });

    // certificate.certificateId is what the coordinator hands to the student
    res.status(201).json(certificate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ==========================================
// COORDINATOR — view their own uploaded certificates (index)
// ==========================================
exports.getMyUploadedCertificates = async (req, res) => {
  try {
    const Model = categoryModelMap[req.user.coordinatorCategory];
    if (!Model) return res.status(403).json({ message: "No coordinator category assigned" });

    const certificates = await Model.find({ coordinatorId: req.user.id }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// STUDENT — Step 1: request verification using the certificate ID
// ==========================================
exports.requestVerification = async (req, res) => {
  try {
    const { certificateId } = req.body;
    if (!certificateId) {
      return res.status(400).json({ message: "certificateId is required" });
    }

    const found = await findCertificateAnywhere(certificateId);
    if (!found) {
      return res.status(404).json({ message: "No certificate found with that ID" });
    }

    const { certificate } = found;

    if (certificate.status !== "unclaimed") {
      return res.status(400).json({ message: `This certificate is already ${certificate.status}` });
    }

    certificate.studentId = req.user.id;
    certificate.status = "pending_verification";
    await certificate.save();

    res.json({ message: "Verification requested. Awaiting coordinator approval.", certificate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// COORDINATOR — Step 2a: view pending requests in their own category
// ==========================================
exports.getPendingRequests = async (req, res) => {
  try {
    const Model = categoryModelMap[req.user.coordinatorCategory];
    if (!Model) return res.status(403).json({ message: "No coordinator category assigned" });

    const pending = await Model.find({ status: "pending_verification" })
      .populate("studentId", "name studentIndexNo email");

    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// COORDINATOR — Step 2b: approve a request
// ==========================================
exports.approveCertificate = async (req, res) => {
  try {
    const Model = categoryModelMap[req.user.coordinatorCategory];
    if (!Model) return res.status(403).json({ message: "No coordinator category assigned" });

    const certificate = await Model.findOne({ certificateId: req.params.certificateId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found in your category" });
    }

    certificate.status = "verified";
    certificate.verifiedDate = new Date();
    await certificate.save();

    res.json({ message: "Certificate approved and verified", certificate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// COORDINATOR — Step 2c: reject a request (reason required)
// ==========================================
exports.rejectCertificate = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const Model = categoryModelMap[req.user.coordinatorCategory];
    if (!Model) return res.status(403).json({ message: "No coordinator category assigned" });

    const certificate = await Model.findOne({ certificateId: req.params.certificateId });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found in your category" });
    }

    certificate.status = "rejected";
    certificate.rejectionReason = reason;
    await certificate.save();

    res.json({ message: "Certificate rejected", certificate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// STUDENT — Step 3: view verified certificates (their public profile)
// ==========================================
exports.getMyProfile = async (req, res) => {
  try {
    const results = [];
    for (const [category, Model] of Object.entries(categoryModelMap)) {
      const certs = await Model.find({ studentId: req.user.id, status: "verified" });
      certs.forEach((c) => results.push({ category, ...c.toObject() }));
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// STUDENT — view all their own requests, any status
// ==========================================
exports.getMyRequests = async (req, res) => {
  try {
    const results = [];
    for (const [category, Model] of Object.entries(categoryModelMap)) {
      const certs = await Model.find({ studentId: req.user.id });
      certs.forEach((c) => results.push({ category, ...c.toObject() }));
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};