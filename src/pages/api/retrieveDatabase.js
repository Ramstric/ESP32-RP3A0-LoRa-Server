import mysql from "mysql2/promise";

import { DATABASE_NAME, TABLE_NAME } from "astro:env/client";

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: DATABASE_NAME,
    port: 3306
};

export async function GET({ url }) {
    let connection;

    try {
        // Create database connection
        connection = await mysql.createConnection(dbConfig);

        // Get query parameters for filtering and sorting
        const searchParams = new URL(url).searchParams;
        const sortBy = searchParams.get("sort") || "fecha";
        const sortOrder = searchParams.get("order") || "DESC";
        const nodeFilter = searchParams.get("nodes");
        const limit = searchParams.get("limit") || "100";

        // Build the SQL query
        let query = `
        SELECT 
            id_dispositivo as id,
            DATE_FORMAT(fecha, '%Y-%m-%d') as fecha,
            TIME_FORMAT(hora, '%H:%i:%s') as hora,
            truncate(temperatura, 2) as temperatura,
            rojo as r,
            verde as g,
            azul as b
        FROM ${TABLE_NAME}
        `;

        // Add node filtering if specified
        if (nodeFilter) {
            const nodes = nodeFilter.split(",").map((n) => parseInt(n.trim())).filter((n) => !isNaN(n));
            if (nodes.length > 0) {query += ` WHERE id_dispositivo IN (${nodes.map((node) => node).join(",")})`;}
        }

        // Add sorting
        const validSortColumns = ["fecha", "hora", "temperatura", "id_dispositivo"];
        const validSortOrders = ["ASC", "DESC"];

        if (validSortColumns.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
            query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
        }

        // Add limit
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {query += ` LIMIT ` + limitNum;}

        // Execute query
        const [rows] = await connection.execute(query);

        // Return JSON response
        return new Response(
            JSON.stringify({
                success: true,
                data: rows,
                count: rows.length,
            }),
            {
                status: 200,
                headers: {"Content-Type": "application/json", "Cache-Control": "no-cache"}, // Prevent caching for real-time data
            }
        );
    } catch (error) {
        console.error("Database error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                error: "Failed to fetch data from database",
                message: error.message,
            }), {status: 500, headers: {"Content-Type": "application/json"}}
        );
    } finally {
        if (connection) {await connection.end()}

    }
}
