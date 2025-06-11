// RFM69HCW Transmitter device

#include <Arduino.h>
#include <RFM69.h>
#include <Adafruit_TCS34725.h>

// RFM69 Module Configuration
#define NETWORK_ID 200        // Network ID, must be the same for all nodes and server
#define NODE_ID 3             // Device ID, must be unique for each node
#define TO_NODE_ID 2          // Node ID to send data, in this case the server ID
#define FREQUENCY RF69_915MHZ // Module working frequency
#define ENCRYPT_KEY "TOP"     // Encryption key
#define IS_RFM69HCW true      // Is RFM69HCW module
#define SPI_CS 5              // NSS or Cable Select to GPIO 5
#define IRQ_PIN 2             // DIO0 to GPIO 2
#define IRQ_NUM 2             // Same as DIO0
#define USE_ACK true          // Request ACK response

#define PIN_LM35 32        // LM35 temperature sensor
#define ADC_VREF_mV 3300.0 // ADC reference voltage
#define ADC_RESOLUTION 4096.0

unsigned long t_Evento = millis();
int tiempo_de_TX = 500;

char buffer[30]; // Message buffer

int sensorLM35;
float milliVolt;
float tempC;

// Initialise with specific int time and gain values
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

RFM69 radio = RFM69(SPI_CS, IRQ_PIN, IS_RFM69HCW, IRQ_NUM);

void setup()
{
    tcs.begin();

    pinMode(BUILTIN_LED, OUTPUT);

    // Init the RFM69 module
    if (radio.initialize(FREQUENCY, NODE_ID, NETWORK_ID))
    {
        digitalWrite(BUILTIN_LED, HIGH);
    }

    digitalWrite(BUILTIN_LED, LOW);

    // radio.setHighPower();
    // radio.encrypt(ENCRYPT_KEY);
}

void sendData(float lm35, int R, int G, int B)
{
    if (millis() - t_Evento >= tiempo_de_TX)
    {   // Send the message every 500 ms...
        digitalWrite(BUILTIN_LED, HIGH);

        sprintf(buffer, "%.1f/%d,%d,%d/", lm35, R, G, B); // Build the message...
        radio.send(TO_NODE_ID, buffer, sizeof(buffer));   // Send the buffer...

        t_Evento = millis();
        digitalWrite(BUILTIN_LED, LOW);
    }
}

void loop()
{
    float r, g, b;

    tcs.getRGB(&r, &g, &b);

    sensorLM35 = analogRead(PIN_LM35);
    milliVolt = sensorLM35 * (ADC_VREF_mV / ADC_RESOLUTION);
    tempC = milliVolt / 10;

    sendData(tempC, int(r), int(g), int(b));
}