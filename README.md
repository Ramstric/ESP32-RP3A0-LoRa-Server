# ESP32-RP3A0-LoRa-Server

This repository contains a Long Range (LoRa) local server implementation using a Raspberry Pi Zero 2 W and ESP32 microcontrollers.

The whole project consists of an Astro project, which handles everything through the Sever-Side Rendering implementation. This helps to enable API endpoints and monitoring of the GPIO board.

## Table of contents

- [Hardware requirements](#hardware-requirements)
  - [RPIZero 2 W wiring](#rpizero-2-w-wiring)
  - [ESP32 wiring for sample script](#esp32-wiring-for-sample-script)
- [Dependencies (with versions)](#dependencies-with-versions)
    - [rfm69radio Modifications](#modifications-of-rfm69radio)
        - [Modifications of `registers.js`](#modifications-of-registersjs)
        - [Modifications of `config.js`](#modifications-of-configjs)
        - [Modifications of `rfm69.js`](#modifications-of-rfm69js)
- [Example setup](#example-setup)
  - [1. Install MariaDB](#1-install-mariadb)
  - [2. Create the database](#2-create-the-database)
  - [3. Install Node.js and Git](#3-install-nodejs-and-git)
  - [4. Clone the repository and install dependencies](#4-clone-the-repository-and-install-dependencies)
  - [5. Configure credentials](#5-configure-credentials)
  - [6. Start the server](#6-start-the-server)

## Hardware requirements

- Raspberry Pi Zero 2 W (recommended to use Raspberry Pi OS Lite with headless install)
- ESP32 microcontroller as data monitoring endpoints

You can review the script `/client_ESP32/RFM69HCW_Tx.cpp` for an example of how to set up the ESP32 microcontroller.

### RPIZero 2 W wiring

| RFM69HCW Pin | RPi Zero 2 W Pin   | Note |
|--------------|--------------------|------|
| 3v3          | 1 (3v3)            |      |
| GND          | 9 (GND)            | Can use any GND pin |
| DIO0         | 18 (GPIO24)        | Interrupt Pin |
| MOSI         | 19 (GPIO10)        |
| MISO         | 21 (GPIO09)        |
| SCK (CLK)    | 23 (GPIO11)        |
| NSS (CS)     | 24 (GPIO08 CS0)    |
| RESET        | 29 (GPIO05)        | Reset Pin |

### ESP32 wiring for sample script

| RFM69HCW Pin | ESP32 Pin |
|--------------|-----------|
| 3v3          | 3v3       |
| GND          | GND       |
| DIO0         | D2        |
| MOSI         | D23       |
| MISO         | D19       |
| SCK (CLK)    | D18       |
| NSS (CS)     | D5        |

## Dependencies (with versions)

- Node.js v22.13.0
- [Astro v5.8.0](https://astro.build/)
- [MariaDB v3.4.2](https://www.npmjs.com/package/mariadb)
- [mysql2 v3.14.1](https://www.npmjs.com/package/mysql2)
- [onoff v6.0.3](https://www.npmjs.com/package/onoff)
- [plotly v3.0.1](https://www.npmjs.com/package/plotly)
- [spi-device v3.1.2](https://www.npmjs.com/package/spi-device)

Package [rfm69radio](https://github.com/AndyFlem/rfm69radio) is used, but it had to be modified; you can find the modified source files inside `/src/lib/rfm69radio`.


> **IMPORTANT: GPIO Pin Configuration**
>
> The `onoff` library (used by `rfm69radio`) requires GPIO pins to be addressed by their **kernel line number**, not their BCM or board number (see [Use raspberry pi 4 GPIO with node js](https://stackoverflow.com/questions/78173749/use-raspberry-pi-4-gpio-with-node-js/78184108#78184108)).
>
> In this project's configuration:
> - `interruptPin: 536` corresponds to **GPIO24** (Board Pin 18).
> - `resetPin: 517` corresponds to **GPIO05** (Board Pin 29).
>
> If you change the wiring, you **must** find the new kernel line numbers.

```javascript
RFM69.initialize({
  interruptPin: 536, // GPIO24
  resetPin: 517, // GPIO05
  address: 1,
  networkID: 100
}).then(() => {
  RFM69.registerPacketReceivedCallback(packetLog);
  return true;
});
```


#### Modifications of `registers.js`

**Lines 4 - 5:** Update function export and transfer speed
```diff
- module.exports = Object.freeze({
+ export const reg = Object.freeze({

-       TRANSFER_SPEED: 40000,
+       TRANSFER_SPEED: 500000,
    // the rest of the object body remains unchanged
)};
```

**Lines 1061 - 1063:** Add default export
```diff
+ export default {
+ 	 reg,
+ };
```

#### Modifications of `config.js`

**Line 4:** Change to use **ES6 import**
```diff
- const reg = require('./registers');

+ import _reg from './registers.js';
+ const reg = _reg.reg;
```

**Line 10:** Update function export
```diff
- module.exports.getConfig = function(freqBand, networkID) {
+ export function getConfig(freqBand, networkID) {
    // function body remains unchanged
};
```

**Lines 68 - 71:** Add default export
```diff
+export default {
+	getConfig,
+};
```

#### Modifications of `rfm69.js`

**Lines 4 - 9:** Change to use **ES6 import**
``` diff
- const rfm69 = function() {

-   const spi = require('spi-device');
-   const Gpio = require('onoff').Gpio;
-   const config = require('./config');
-   const reg = require('./registers');

+ import spi from 'spi-device';
+ import {Gpio} from 'onoff';
+ import config from './config.js';
+ import _reg from './registers.js';

+ const reg = _reg.reg;

+ export function rfm69() {
    // the rest of the function body remains unchanged
};
```

## Example setup

For the current implementation of using **ESP32** microcontrollers to monitor a temperature sensor **LM35** and a RGB color sensor module **TCS34725**

You can use the sample code `/client_ESP32/RFM69HCW_Tx.cpp` to set up the ESP32 microcontroller.

### 1. Install MariaDB

First, make sure to install MariaDB and set your **username** and **password**. **Please make sure to take note of the credentials!**

```sh
sudo apt install mariadb-server
sudo mysql_secure_installation
```

### 2. Create the database

Use your credentials to access MariaDB

```sha
sudo mariadb -h localhost -u $USERNAME_HERE -p
```
Grant access to your user through password or make a new user for read access, in this example, we opt for the first option

```sql
ALTER USER $YOUR_USERNAME@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD($YOUR_PASSWORD);
```
Afterwards, create the database and table to log all incoming data. Feel free to change the database name and table name according to your needs

The example table is for logging the incoming data from the LM35 and the TCS34725

```sql
CREATE DATABASE $DATABASE_NAME;
USE $DATABASE_NAME;
CREATE TABLE $TABLE_NAME (
  id int NOT NULL auto_increment,
  id_dispositivo int NOT NULL,
  fecha date NOT NULL,
  hora time NOT NULL,
  temperatura float(6,3) NOT NULL,
  rojo int NOT NULL,
  verde int NOT NULL,
  azul int NOT NULL,
  PRIMARY KEY (id)
) AUTO_INCREMENT=1;
```

### 3. Install Node.js and Git

The following example uses the recommended method for installing the latest Node.js version as of this writing. Make sure to consult any new version available

```sh
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs
sudo apt-get install git
```

### 4. Clone the repository and install dependencies

Now you can clone the repository and install the required dependencies

```sh
git clone https://github.com/yourusername/ESP32-RP3A0-LoRa-Server.git
cd ESP32-RP3A0-LoRa-Server
npm install
```

### 5. Configure credentials

Lastly, add the MariaDB credentials to environment variables.

Your `.env` should look like:

```env
SQL_HOST=localhost
SQL_USER=
SQL_PASSWORD=
DATABASE_NAME=
TABLE_NAME=
```

Add your credentials and both the database and table names. If needed, you can also change the hostname.

### 6. Start the server

Now you can start the server with:

```sh
npm run dev
```

This will launch the Astro server and begin monitoring device data in the background to receive every incoming packet.
