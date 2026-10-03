const express = require("express");
const { getConnection } = require("../config/database");

const router = express.Router();


// GET DASHBOARD SUMMARY
router.get("/summary", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        // Total cases
        const totalResult = await connection.execute(`
            SELECT COUNT(*) AS TOTAL_CASES
            FROM cases
        `);

        // Active cases
        const activeResult = await connection.execute(`
            SELECT COUNT(*) AS ACTIVE_CASES
            FROM cases
            WHERE status IN ('OPEN', 'UNDER_INVESTIGATION')
        `);

        // Closed cases
        const closedResult = await connection.execute(`
            SELECT COUNT(*) AS CLOSED_CASES
            FROM cases
            WHERE status = 'CLOSED'
        `);

        const statusResult = await connection.execute(`
            SELECT
            status,
            COUNT(*) AS CASE_COUNT
            FROM cases
            GROUP BY status
            ORDER BY CASE_COUNT DESC
        `);

        const monthlyResult = await connection.execute(`
            SELECT
            TO_CHAR(incident_date, 'YYYY-MM') AS MONTH,
            COUNT(*) AS CASE_COUNT
            FROM cases
            GROUP BY TO_CHAR(incident_date, 'YYYY-MM')
            ORDER BY MONTH
        `);

        // Cases by substance
        const substanceResult = await connection.execute(`
            SELECT
                s.name AS SUBSTANCE,
                COUNT(DISTINCT cs.case_id) AS CASE_COUNT
            FROM substances s
            JOIN case_substances cs
                ON s.id = cs.substance_id
            GROUP BY s.id, s.name
            ORDER BY CASE_COUNT DESC
        `);

        // Cases by area
        const areaResult = await connection.execute(`
            SELECT
                location AS AREA,
                COUNT(*) AS CASE_COUNT
            FROM cases
            GROUP BY location
            ORDER BY CASE_COUNT DESC
        `);

        res.json({
            totalCases: totalResult.rows[0].TOTAL_CASES,
            activeCases: activeResult.rows[0].ACTIVE_CASES,
            closedCases: closedResult.rows[0].CLOSED_CASES,
            casesBySubstance: substanceResult.rows,
            casesByStatus: statusResult.rows,
            casesByMonth: monthlyResult.rows,
            casesByArea: areaResult.rows
        });

    } catch (error) {

        console.error("Error fetching dashboard data:", error);

        res.status(500).json({
            error: "Failed to fetch dashboard data"
        });

    } finally {

        if (connection) {
            await connection.close();
        }
    }
});


module.exports = router;