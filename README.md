# Airconditionals
## Project description
Σύστημα αποφάσεων για τη λειτουργία κτηρίου που χρησιμοποιεί machine learning για την αυτορρύθμιση και προσαρμογή στις ανάγκες του χρήστη και του χώρου, με σκοπό την εξοικονόμιση ενέργειας και την ικανοποίηση των αναγκών χρήστη
* Συλλέγει δεδομένα από αισθητήρες στο χώρο και APIs, για τις εσωτερικές/εξωτερικές συνθήκες και τις συνήθειες των χρηστών
* Εκπαίδευση του μοντέλου machine learning πριν την εφαρμογή του στο χώρο (μέσω θερμικής προσομοίωσης) αλλά και αφού γίνει η εγκατάσταση
* Λήψη αποφάσεων και έλεγχος του Building Management System για την βελτιστοποίηση των συνθηκών και την ελαχιστοποίηση της κατανάλωσης ενέργειας
* Απευθύνεται σε ιδιώτες και επιχειρήσεις, καθώς και σε δημόσιους φορείς
* Εφαρμογή του συστήματος σε δημόσια κτήρια
* Χρήση προσομοιώσεων για την εκμάθηση και προσαρμογή σε κάθε κτήριο
![](https://cdn.discordapp.com/attachments/258624616430305280/462883103283871744/localhost_3000__2.png)
![](https://cdn.discordapp.com/attachments/258624616430305280/462883104432848897/localhost_3000_.png)
## Getting Started
### Prerequisites
#### Frontend
* [Node.js](https://nodejs.org/en/)
* [React.js](https://reactjs.org/)
#### Backend
* [Express.js](https://expressjs.com/)
* [Sequelize](http://docs.sequelizejs.com/)
#### IoT Sensor
* [Arduino IDE](https://www.arduino.cc/en/Main/Software?)
* [DHT adafruit library](https://github.com/adafruit/DHT-sensor-library)
* [adafruit unified sensor library](https://github.com/adafruit/Adafruit_Sensor)
#### ML model
* [Tensorflow](https://www.tensorflow.org/)
* [Keras](https://keras.io/)
* [Arduino](https://www.arduino.cc/)
#### Simulation 
* [Numpy](http://www.numpy.org/)
* [Matplotlib](https://matplotlib.org/)
### Functionality
* Thermal simulation
* Interacting with the B.M.S.
* Minimizing energy consumption
* Data collection through APIs and building blueprints (sensors)
* Retrains and adapts to user feedback

### Running the backend server and Dashboard
In one terminal run `cd backend && node index.js`.
In another start the dashboards using `cd q_ui && node index.js`.

They should both be running in localhost and you can visit the dashboard from your browser in the URL given to you by node.

### Adding the custom ESP32 IoT Sensor
Download Arduino IDE and adafruit sensor libraries. Open `endopoint.ino` in the Arduino IDE and hit `Upload` after connecting ESP32.
