const express = require("express");
const router = express.Router();
const controller = require("../controllers/certificateController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);

// Coordinator
router.post("/", authorize("coordinator"), upload.single("proofDocument"), controller.uploadCertificate);
router.get("/pending", authorize("coordinator"), controller.getPendingRequests);
router.patch("/:certificateId/approve", authorize("coordinator"), controller.approveCertificate);
router.patch("/:certificateId/reject", authorize("coordinator"), controller.rejectCertificate);

// Student
router.post("/request-verification", authorize("student"), controller.requestVerification);
router.get("/profile", authorize("student"), controller.getMyProfile);
router.get("/my-requests", authorize("student"), controller.getMyRequests);

module.exports = router;