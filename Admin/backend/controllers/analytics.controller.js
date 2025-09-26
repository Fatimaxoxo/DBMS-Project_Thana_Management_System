import { pool } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const AnalyticsController = {
  // Get overall dashboard analytics
  getDashboardAnalytics: asyncHandler(async (req, res) => {
    // Get total counts
    const [thanaCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Thana"
    );
    const [officerCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Officer"
    );
    const [crimeCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Crime_detection"
    );
    const [complaintCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Makes_complaint"
    );
    const [caseCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Case_filing"
    );
    const [victimCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Victim"
    );

    // Get crime types distribution
    const [crimeTypes] = await pool.query(`
      SELECT crime_type, COUNT(*) as count 
      FROM Crime_detection 
      GROUP BY crime_type
      ORDER BY count DESC
    `);

    // Get case status distribution
    const [caseStatuses] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM Case_filing 
      GROUP BY status
      ORDER BY count DESC
    `);

    // Get complaint status distribution
    const [complaintStatuses] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM Makes_complaint 
      GROUP BY status
      ORDER BY count DESC
    `);

    // Get monthly crime trends
    const [crimeMonthly] = await pool.query(`
      SELECT 
        YEAR(date) as year,
        MONTH(date) as month,
        MONTHNAME(date) as month_name,
        COUNT(*) as count
      FROM Crime_detection 
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY YEAR(date), MONTH(date), MONTHNAME(date)
      ORDER BY year, month
    `);

    // Get thana-wise statistics
    const [thanaStats] = await pool.query(`
      SELECT 
        t.thana_id,
        t.name as thana_name,
        t.address,
        COUNT(DISTINCT o.officer_id) as officer_count,
        COUNT(DISTINCT cd.crime_id) as crime_count,
        COUNT(DISTINCT mc.complaint_id) as complaint_count,
        COUNT(DISTINCT cf.case_id) as case_count
      FROM Thana t
      LEFT JOIN Officer o ON t.thana_id = o.thana_id
      LEFT JOIN Crime_detection cd ON t.thana_id = cd.thana_id
      LEFT JOIN Makes_complaint mc ON t.thana_id = mc.thana_id
      LEFT JOIN Case_filing cf ON t.thana_id = cf.thana_id
      GROUP BY t.thana_id, t.name, t.address
      ORDER BY crime_count DESC
    `);

    res.json({
      success: true,
      data: {
        totals: {
          thanas: thanaCount[0].count,
          officers: officerCount[0].count,
          crimes: crimeCount[0].count,
          complaints: complaintCount[0].count,
          cases: caseCount[0].count,
          victims: victimCount[0].count,
        },
        distributions: {
          crimeTypes,
          caseStatuses,
          complaintStatuses,
        },
        trends: {
          crimeMonthly,
        },
        thanaStats,
      },
    });
  }),

  // Get thana-specific analytics
  getThanaAnalytics: asyncHandler(async (req, res) => {
    const { thanaId } = req.params;

    // Get thana details
    const [thanaDetails] = await pool.query(
      "SELECT * FROM Thana WHERE thana_id = ?",
      [thanaId]
    );

    if (!thanaDetails.length) {
      return res.status(404).json({
        success: false,
        message: "Thana not found",
      });
    }

    // Get officers in this thana
    const [officers] = await pool.query(
      `
      SELECT officer_id, name, grade, email, phone
      FROM Officer 
      WHERE thana_id = ?
    `,
      [thanaId]
    );

    // Get crime statistics for this thana
    const [crimeStats] = await pool.query(
      `
      SELECT 
        crime_type,
        COUNT(*) as count
      FROM Crime_detection 
      WHERE thana_id = ?
      GROUP BY crime_type
      ORDER BY count DESC
    `,
      [thanaId]
    );

    // Get crime types distribution for this thana
    const [crimeTypeDistribution] = await pool.query(
      `
      SELECT crime_type, COUNT(*) as count
      FROM Crime_detection 
      WHERE thana_id = ?
      GROUP BY crime_type
      ORDER BY count DESC
    `,
      [thanaId]
    );

    // Get recent crimes
    const [recentCrimes] = await pool.query(
      `
      SELECT *
      FROM Crime_detection 
      WHERE thana_id = ?
      ORDER BY date DESC
      LIMIT 10
    `,
      [thanaId]
    );

    // Get case statistics
    const [caseStats] = await pool.query(
      `
      SELECT 
        status,
        COUNT(*) as count
      FROM Case_filing
      WHERE thana_id = ?
      GROUP BY status
    `,
      [thanaId]
    );

    // Get complaint statistics
    const [complaintStats] = await pool.query(
      `
      SELECT 
        status,
        COUNT(*) as count
      FROM Makes_complaint
      WHERE thana_id = ?
      GROUP BY status
    `,
      [thanaId]
    );

    // Get monthly crime trends for this thana
    const [monthlyTrends] = await pool.query(
      `
      SELECT 
        YEAR(date) as year,
        MONTH(date) as month,
        MONTHNAME(date) as month_name,
        COUNT(*) as count
      FROM Crime_detection 
      WHERE thana_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY YEAR(date), MONTH(date), MONTHNAME(date)
      ORDER BY year, month
    `,
      [thanaId]
    );

    res.json({
      success: true,
      data: {
        thanaDetails: thanaDetails[0],
        officers,
        statistics: {
          crimeTypeDistribution,
          caseStats,
          complaintStats,
          monthlyTrends,
        },
        recentCrimes,
      },
    });
  }),

  // Get crime analytics
  getCrimeAnalytics: asyncHandler(async (req, res) => {
    // Get crime severity analysis (based on crime types)
    const [crimeSeverity] = await pool.query(`
      SELECT 
        crime_type,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Crime_detection)), 2) as percentage
      FROM Crime_detection
      GROUP BY crime_type
      ORDER BY count DESC
    `);

    // Get location-based crime analysis
    const [locationAnalysis] = await pool.query(`
      SELECT 
        last_seen_location,
        COUNT(*) as count,
        GROUP_CONCAT(DISTINCT crime_type) as crime_types
      FROM Crime_detection
      GROUP BY last_seen_location
      HAVING count > 1
      ORDER BY count DESC
      LIMIT 20
    `);

    // Get criminal patterns (suspect analysis)
    const [suspectAnalysis] = await pool.query(`
      SELECT 
        suspects,
        COUNT(*) as count,
        GROUP_CONCAT(DISTINCT crime_type) as crime_types
      FROM Crime_detection
      WHERE suspects != 'Unknown' AND suspects IS NOT NULL
      GROUP BY suspects
      HAVING count > 1
      ORDER BY count DESC
    `);

    // Get time-based analysis
    const [timeAnalysis] = await pool.query(`
      SELECT 
        DAYNAME(date) as day_of_week,
        DAYOFWEEK(date) as day_number,
        COUNT(*) as count
      FROM Crime_detection
      GROUP BY DAYNAME(date), DAYOFWEEK(date)
      ORDER BY DAYOFWEEK(date)
    `);

    // Get seasonal analysis
    const [seasonalAnalysis] = await pool.query(`
      SELECT 
        QUARTER(date) as quarter,
        CASE 
          WHEN QUARTER(date) = 1 THEN 'Q1 (Jan-Mar)'
          WHEN QUARTER(date) = 2 THEN 'Q2 (Apr-Jun)'
          WHEN QUARTER(date) = 3 THEN 'Q3 (Jul-Sep)'
          WHEN QUARTER(date) = 4 THEN 'Q4 (Oct-Dec)'
        END as quarter_name,
        COUNT(*) as count
      FROM Crime_detection
      GROUP BY QUARTER(date), CASE 
          WHEN QUARTER(date) = 1 THEN 'Q1 (Jan-Mar)'
          WHEN QUARTER(date) = 2 THEN 'Q2 (Apr-Jun)'
          WHEN QUARTER(date) = 3 THEN 'Q3 (Jul-Sep)'
          WHEN QUARTER(date) = 4 THEN 'Q4 (Oct-Dec)'
        END
      ORDER BY quarter
    `);

    res.json({
      success: true,
      data: {
        crimeSeverity,
        locationAnalysis,
        suspectAnalysis,
        timeAnalysis,
        seasonalAnalysis,
      },
    });
  }),

  // Get officer performance analytics
  getOfficerAnalytics: asyncHandler(async (req, res) => {
    // Get officer case load
    const [officerCaseLoad] = await pool.query(`
      SELECT 
        o.officer_id,
        o.name,
        o.grade,
        t.name as thana_name,
        COUNT(cf.case_id) as total_cases,
        COUNT(CASE WHEN cf.status = 'Closed' THEN 1 END) as closed_cases,
        COUNT(CASE WHEN cf.status = 'Open' THEN 1 END) as open_cases,
        COUNT(CASE WHEN cf.status = 'Under Investigation' THEN 1 END) as investigating_cases
      FROM Officer o
      LEFT JOIN Case_filing cf ON o.officer_id = cf.officer_id
      LEFT JOIN Thana t ON o.thana_id = t.thana_id
      GROUP BY o.officer_id, o.name, o.grade, t.name
      ORDER BY total_cases DESC
    `);

    // Get grade distribution
    const [gradeDistribution] = await pool.query(`
      SELECT grade, COUNT(*) as count
      FROM Officer
      GROUP BY grade
      ORDER BY count DESC
    `);

    // Get thana-wise officer distribution
    const [thanaDistribution] = await pool.query(`
      SELECT 
        t.name as thana_name,
        COUNT(o.officer_id) as officer_count,
        GROUP_CONCAT(o.grade ORDER BY o.grade) as grades
      FROM Thana t
      LEFT JOIN Officer o ON t.thana_id = o.thana_id
      GROUP BY t.thana_id, t.name
      ORDER BY officer_count DESC
    `);

    res.json({
      success: true,
      data: {
        officerCaseLoad,
        gradeDistribution,
        thanaDistribution,
      },
    });
  }),
};
