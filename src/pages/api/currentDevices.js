import fs from 'fs';

export async function GET() {
    const currentDevices = fs.existsSync('currentDevices.json') ? JSON.parse(fs.readFileSync('currentDevices.json', 'utf-8')) : [];

    return new Response(JSON.stringify({
        devices: currentDevices,
        count: currentDevices.length,
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}