const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentIndexNo: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  eventOrOrgName: { type: String },
  positionOrPrize: { type: String },
  year: { type: Number, required: true },
  proofDocument: { type: String },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["unclaimed", "pending_verification", "verified", "rejected"],
    default: "unclaimed",
  },
  verifiedDate: { type: Date },
  rejectionReason: { type: String },
}, { timestamps: true });

// Same schema, six separate physical collections
const LeadershipCertificate = mongoose.model("LeadershipCertificate", certificateSchema, "leadership_certificates");
const CommunityServiceCertificate = mongoose.model("CommunityServiceCertificate", certificateSchema, "community_service_certificates");
const SportsCertificate = mongoose.model("SportsCertificate", certificateSchema, "sports_certificates");
const AestheticTechnicalCertificate = mongoose.model("AestheticTechnicalCertificate", certificateSchema, "aesthetic_technical_certificates");
const ConferencePresentationCertificate = mongoose.model("ConferencePresentationCertificate", certificateSchema, "conference_presentation_certificates");
const OtherCertificate = mongoose.model("OtherCertificate", certificateSchema, "other_certificates");

const categoryModelMap = {
  Leadership: LeadershipCertificate,
  CommunityService: CommunityServiceCertificate,
  Sports: SportsCertificate,
  AestheticTechnical: AestheticTechnicalCertificate,
  ConferencePresentation: ConferencePresentationCertificate,
  Other: OtherCertificate,
};

module.exports = { categoryModelMap };