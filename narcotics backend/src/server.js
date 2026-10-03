const casesRouter = require("./routes/cases");
const express = require("express");
const cors = require("cors");
const { getConnection } = require("./config/database");
const dashboardRouter = require("./routes/dashboard");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/cases", casesRouter);

app.use("/api/dashboard", dashboardRouter);

app.get("/", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        res.json({
            message: "VYUHA Narcotics API is running",
            database: "Oracle connection successful"
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(500).json({
            message: "VYUHA API is running, but database connection failed"
        });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`VYUHA backend running on port ${PORT}`);
});