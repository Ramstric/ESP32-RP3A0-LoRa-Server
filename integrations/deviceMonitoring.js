import fs from "fs";
import mysql from "mysql2/promise";

import { eventBus } from "../src/lib/eventBus.js";
//import { rfm69 } from "../src/lib/rfm69radio/rfm69.js";

const DATABASE_NAME = "";
const TABLE_NAME = "";

const dbConfig = {
    host: "localhost",
    password: "root",
    database: DATABASE_NAME,
    port: 3306
};

async function insertTestData(id_dispositivo, temperatura, rojo, verde, azul) {
    let connection;
    
    try {
        // Create connection
        connection = await mysql.createConnection(dbConfig);
    
        // Get current date and time
        const now = new Date();
        const fecha = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        const hora = now.toTimeString().split(' ')[0]; // HH:MM:SS format
        
        // SQL query
        const query = `
        INSERT INTO ${TABLE_NAME} (id_dispositivo, fecha, hora, temperatura, rojo, verde, azul) 
        VALUES (${id_dispositivo}, '${fecha}', '${hora}', ${temperatura}, ${rojo}, ${verde}, ${azul})
        `;
        
        // Execute the query
        const [result] = await connection.execute(query);
        
        return result;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

//const RFM69 = new rfm69();

const currentDevices = new Set();

export default function backgroundScript() {
    fs.writeFileSync("currentDevices.json", JSON.stringify(Array.from(currentDevices)), "utf-8");

    return {
        name: "background-script",
        hooks: {"astro:server:start": async () => {
            /*
            function packetLog(packet) {
                const [temperatureValue, ...rgbValues] = packet.payload.split(/[/,]/);
                
                const esp32Data = {
                    id: packet.senderAddress,
                    temperature: parseInt(temperatureValue),
                    r: parseInt(rgbValues[0]),
                    g: parseInt(rgbValues[1]),
                    b: parseInt(rgbValues[2]),
                };

                if (!currentDevices.has(esp32Data.id)) {
                    currentDevices.add(esp32Data.id);
                    eventBus.emit("detectedDevices", {
                        amount: currentDevices.size,
                        devices: Array.from(currentDevices).map((id) => ({id,}))
                    });
                    fs.writeFileSync("currentDevices.json", JSON.stringify(Array.from(currentDevices)), "utf-8");
                }

                insertTestData(esp32Data.id, esp32Data.temperature, esp32Data.r, esp32Data.g, esp32Data.b);
                    
            }

            RFM69.initialize({
                interruptPin: 536,
                resetPin: 517,
                address: 1,
                networkID: 100
            }).then(() => {
                RFM69.registerPacketReceivedCallback(packetLog);
                return true;
            });
            */
        }
    }
};}
