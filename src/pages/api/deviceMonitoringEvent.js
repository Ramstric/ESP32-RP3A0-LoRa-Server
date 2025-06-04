import { eventBus } from "../../lib/eventBus.js";

export async function GET() {
    let callBack = (data) => {};
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) { 
          callBack = (data) => {
            controller.enqueue(encoder.encode("data: New device detected\n\n"));
          };
          
          eventBus.off("detectedDevices", callBack);
          eventBus.on("detectedDevices", callBack);
        },
        cancel() {
            eventBus.removeListener("detectedDevices", callBack);
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
