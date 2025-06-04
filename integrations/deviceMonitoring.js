import { eventBus } from "../src/lib/eventBus.js";
import fs from "fs";

const currentDevices = new Set();

const exampleDevice_1 = { id: 1 };
const exampleDevice_2 = { id: 2 };
const exampleDevice_3 = { id: 3 };
const exampleDevice_4 = { id: 4 };

export default function backgroundScript() {
    fs.writeFileSync("currentDevices.json", JSON.stringify(Array.from(currentDevices)), "utf-8");

    return {
        name: "background-script",
        hooks: {"astro:server:start": async () => {
                // Your background code here
                // // Detected devices have the structure {id: string, type: string}
                
                
                setTimeout(() => {
                    currentDevices.add(exampleDevice_1.id);
                    eventBus.emit("detectedDevices", {amount: currentDevices.size, devices: Array.from(currentDevices).map(id => ({id}))});
                    fs.writeFileSync("currentDevices.json", JSON.stringify(Array.from(currentDevices)), "utf-8");
                }, 1000);

                setTimeout(() => {
                    currentDevices.add(exampleDevice_2.id);
                    eventBus.emit("detectedDevices", {amount: currentDevices.size, devices: Array.from(currentDevices).map(id => ({id}))});
                    fs.writeFileSync("currentDevices.json", JSON.stringify(Array.from(currentDevices)), "utf-8");
                }, 5000);

                setTimeout(() => {
                    currentDevices.add(exampleDevice_3.id);
                    eventBus.emit("detectedDevices", {amount: currentDevices.size, devices: Array.from(currentDevices).map(id => ({id}))});
                    fs.writeFileSync("currentDevices.json", JSON.stringify(Array.from(currentDevices)), "utf-8");
                }, 10000);

                setTimeout(() => {
                    currentDevices.add(exampleDevice_4.id);
                    eventBus.emit("detectedDevices", {amount: currentDevices.size, devices: Array.from(currentDevices).map(id => ({id}))});
                    fs.writeFileSync("currentDevices.json", JSON.stringify(Array.from(currentDevices)), "utf-8");
                }, 15000);

        }}
    };
}
