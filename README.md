# 60W Constant Current Electronic Load Capture Serial Data

A simple Node.js script to capture serial data from a cheap 60W Constant Current Electronic Load


## Instructions
1. Connect your USB serial adapter as following:

 ![settings](/serial-settings.jpg)

2. Clone this repository

3. Run `npm install` (make sure that you have Node.js installed on your system)
4. Customize your COM port directly on the script (edit `index.js` file)
5. Run `npm start` to start capturing data 

![results](/log_csv_e_index_js.png)

6. Stop the script execution to analyse the captured CSV file (NOTE: by default the CSV uses the ';' character as a separator because it's the Excel default on my system)

 ![excel](/excel.png)

## Requirements
- USB serial adapter (5V logic level)
- Node.js and NPM/Yarn installed (can run basically on every system)
- 60W Constant Current Electronic Load ( You can buy one from China or Amazon. Picture bellow: )

![load](/load.jpg)


## Motivation and History
I quickly wrote this script because I needed to plot the data (voltage over time) from my Constant Current Electronic Load module. I've tried some solutions like some terminal software but I couldn't found free software that plots the data with the timestamp.
This is a very simple and raw code, so you need to directly edit the script file to customize your options. 
I only shared this code, because the serial adapter connection instructions can be useful to someone.


## Credits
- Node-SerialPort team: https://github.com/serialport/node-serialport
 

## License
- Licensed under MIT

- Copyright (c) 2017-2020 [Samuel Carreira]