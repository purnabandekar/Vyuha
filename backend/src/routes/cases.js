const express = require("express");
const oracledb = require("oracledb");
const { getConnection } = require("../config/database");

const router = express.Router();


// GET ALL CASES
router.get("/", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT
                c.id,
                c.case_number,
                c.title,
                c.description,
                c.incident_date,
                c.incident_time,
                c.location,
                c.latitude,
                c.longitude,
                c.status,
                o.name AS officer_name,
                ps.name AS station_name
            FROM cases c
            JOIN officers o
                ON c.assigned_officer_id = o.id
            JOIN police_stations ps
                ON c.station_id = ps.id
            ORDER BY c.id
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching cases:", error);

        res.status(500).json({
            error: "Failed to fetch cases"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.get("/map", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const result = await connection.execute(`
            SELECT
                c.id,
                c.case_number,
                c.location,
                c.latitude,
                c.longitude,
                c.status,
                c.incident_date
            FROM cases c
            WHERE c.latitude IS NOT NULL
              AND c.longitude IS NOT NULL
            ORDER BY c.incident_date DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching map data:", error);

        res.status(500).json({
            error: "Failed to fetch map data"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.get("/:id/related", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const caseId = req.params.id;

        const result = await connection.execute(`
            SELECT DISTINCT
                c.id,
                c.case_number,
                c.title,
                c.location,
                c.incident_date,
                c.status
            FROM cases c
            JOIN case_persons cp
                ON c.id = cp.case_id
            WHERE cp.person_id IN (
                SELECT person_id
                FROM case_persons
                WHERE case_id = :caseId
            )
            AND c.id != :caseId
            ORDER BY c.incident_date DESC
        `, { caseId });

        res.json(result.rows);

    } catch (error) {
        console.error("Error finding related cases:", error);

        res.status(500).json({
            error: "Failed to find related cases"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.get("/:id/related/substances", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const caseId = req.params.id;

        const result = await connection.execute(`
            SELECT DISTINCT
                c.id,
                c.case_number,
                c.title,
                c.location,
                c.incident_date,
                c.status
            FROM cases c
            JOIN case_substances cs
                ON c.id = cs.case_id
            WHERE cs.substance_id IN (
                SELECT substance_id
                FROM case_substances
                WHERE case_id = :caseId
            )
            AND c.id != :caseId
            ORDER BY c.incident_date DESC
        `, { caseId });

        res.json(result.rows);

    } catch (error) {
        console.error("Error finding substance-related cases:", error);

        res.status(500).json({
            error: "Failed to find substance-related cases"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

router.get("/:id/related/location", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const caseId = req.params.id;

        const result = await connection.execute(`
            SELECT DISTINCT
                c.id,
                c.case_number,
                c.title,
                c.location,
                c.incident_date,
                c.status
            FROM cases c
            WHERE c.location = (
                SELECT location
                FROM cases
                WHERE id = :caseId
            )
            AND c.id != :caseId
            ORDER BY c.incident_date DESC
        `, { caseId });

        res.json(result.rows);

    } catch (error) {
        console.error("Error finding location-related cases:", error);

        res.status(500).json({
            error: "Failed to find location-related cases"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// GET SINGLE CASE
router.get("/:id/related", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const caseId = req.params.id;

        const result = await connection.execute(`
            SELECT DISTINCT
                c.id,
                c.case_number,
                c.title,
                c.location,
                c.incident_date,
                c.status,

                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM case_persons cp1
                        JOIN case_persons cp2
                            ON cp1.person_id = cp2.person_id
                        WHERE cp1.case_id = :caseId
                          AND cp2.case_id = c.id
                    )
                    THEN 1 ELSE 0
                END AS SHARED_PERSON,

                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM case_substances cs1
                        JOIN case_substances cs2
                            ON cs1.substance_id = cs2.substance_id
                        WHERE cs1.case_id = :caseId
                          AND cs2.case_id = c.id
                    )
                    THEN 1 ELSE 0
                END AS SHARED_SUBSTANCE,

                CASE
                    WHEN c.location = (
                        SELECT location
                        FROM cases
                        WHERE id = :caseId
                    )
                    THEN 1 ELSE 0
                END AS SHARED_LOCATION

            FROM cases c
            WHERE c.id != :caseId
              AND (
                    EXISTS (
                        SELECT 1
                        FROM case_persons cp1
                        JOIN case_persons cp2
                            ON cp1.person_id = cp2.person_id
                        WHERE cp1.case_id = :caseId
                          AND cp2.case_id = c.id
                    )
                    OR
                    EXISTS (
                        SELECT 1
                        FROM case_substances cs1
                        JOIN case_substances cs2
                            ON cs1.substance_id = cs2.substance_id
                        WHERE cs1.case_id = :caseId
                          AND cs2.case_id = c.id
                    )
                    OR
                    c.location = (
                        SELECT location
                        FROM cases
                        WHERE id = :caseId
                    )
              )
            ORDER BY c.incident_date DESC
        `, {
            caseId
        });

        res.json(result.rows);

    } catch (error) {
        console.error("Error finding related cases:", error);

        res.status(500).json({
            error: "Failed to find related cases"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// CREATE NEW CASE
router.post("/", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const {
            caseNumber,
            title,
            description,
            incidentDate,
            incidentTime,
            location,
            latitude,
            longitude,
            stationId,
            assignedOfficerId,
            status
        } = req.body;

        // Basic validation
        if (
            !caseNumber ||
            !title ||
            !incidentDate ||
            !stationId ||
            !assignedOfficerId
        ) {
            return res.status(400).json({
                error: "Missing required case information"
            });
        }

        const result = await connection.execute(
            `
            INSERT INTO cases (
                id,
                case_number,
                title,
                description,
                incident_date,
                incident_time,
                location,
                latitude,
                longitude,
                station_id,
                assigned_officer_id,
                status
            )
            VALUES (
                cases_seq.NEXTVAL,
                :caseNumber,
                :title,
                :description,
                TO_DATE(:incidentDate, 'YYYY-MM-DD'),
                :incidentTime,
                :location,
                :latitude,
                :longitude,
                :stationId,
                :assignedOfficerId,
                :status
            )
            RETURNING id INTO :newCaseId
            `,
            {
                caseNumber,
                title,
                description: description || null,
                incidentDate,
                incidentTime: incidentTime || null,
                location: location || null,
                latitude: latitude || null,
                longitude: longitude || null,
                stationId,
                assignedOfficerId,
                status: status || "OPEN",

                newCaseId: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.NUMBER
                }
            }
        );

        await connection.commit();

        res.status(201).json({
            message: "Case created successfully",
            caseId: result.outBinds.newCaseId[0]
        });

    } catch (error) {

        console.error("Error creating case:", error);

        res.status(500).json({
            error: "Failed to create case"
        });

    } finally {

        if (connection) {
            await connection.close();
        }
    }
});

router.put("/:id", async (req, res) => {
    let connection;

    try {
        connection = await getConnection();

        const caseId = req.params.id;

        const {
            caseNumber,
            title,
            description,
            incidentDate,
            incidentTime,
            location,
            latitude,
            longitude,
            stationId,
            assignedOfficerId,
            status
        } = req.body;

        if (
            !caseNumber ||
            !title ||
            !incidentDate ||
            !stationId ||
            !assignedOfficerId ||
            !status
        ) {
            return res.status(400).json({
                error: "Missing required case information"
            });
        }

        const result = await connection.execute(
            `
            UPDATE cases
            SET
                case_number = :caseNumber,
                title = :title,
                description = :description,
                incident_date = TO_DATE(:incidentDate, 'YYYY-MM-DD'),
                incident_time = :incidentTime,
                location = :location,
                latitude = :latitude,
                longitude = :longitude,
                station_id = :stationId,
                assigned_officer_id = :assignedOfficerId,
                status = :status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :caseId
            `,
            {
                caseNumber,
                title,
                description: description || null,
                incidentDate,
                incidentTime: incidentTime || null,
                location: location || null,
                latitude: latitude || null,
                longitude: longitude || null,
                stationId,
                assignedOfficerId,
                status,
                caseId
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({
                error: "Case not found"
            });
        }

        await connection.commit();

        res.json({
            message: "Case updated successfully",
            caseId: Number(caseId)
        });

    } catch (error) {
        console.error("Error updating case:", error);

        res.status(500).json({
            error: "Failed to update case"
        });

    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


module.exports = router;