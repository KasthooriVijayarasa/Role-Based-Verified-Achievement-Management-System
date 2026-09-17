const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

const [, , name, email, password, category] = process.argv;

const validCategories = [
  "Leadership",
  "CommunityService",
  "Sports",
  "AestheticTechnical",
  "ConferencePresentation",
  "Other",
];

if (!name || !email || !password || !category) {
  console.log('Usage: node src/seed/createCoordinator.js "Name" email password Category');
  console.log(`Categories: ${validCategories.join(", ")}`);
  process.exit(1);
}

if (!validCategories.includes(category)) {
  console.log(`Invalid category "${category}". Must be one of: ${validCategories.join(", ")}`);
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const exists = await User.findOne({ email });
    if (exists) {
      console.log(`A user with email "${email}" already exists.`);
    } else {
      const coordinator = await User.create({
        name,
        email,
        password,
        role: "coordinator",
        coordinatorCategory: category,
      });
      console.log(`Coordinator created: ${coordinator.email} — category: ${coordinator.coordinatorCategory}`);
    }
  } catch (err) {
    console.error("Error creating coordinator:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
})();