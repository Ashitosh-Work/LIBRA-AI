require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/db");

const port = process.env.PORT || 8082;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
