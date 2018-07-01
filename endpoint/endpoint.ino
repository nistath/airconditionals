#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define VERBOSE false
#define WEBDATA false

#define DHTPIN            14
#define LGTPIN            26

// Define the API route
#define HOST "iesc-s1.mit.edu"
#define URL "/608dev/sandbox/nistath/laser/main.py"

// Uncomment the type of sensor in use:
#define DHTTYPE           DHT11     // DHT 11
// #define DHTTYPE           DHT22     // DHT 22 (AM2302)
// #define DHTTYPE           DHT21     // DHT 21 (AM2301)

DHT_Unified dht(DHTPIN, DHTTYPE);

uint32_t delayMS;

void setup() {
  Serial.begin(115200);

  // Connect to wifi

  if (WEBDATA) {
    // wifi_connect(SSID, "");
    // wifi_connect(SSID, PASSWORD);
    // wifi_auto_setup();
  }

  // Initialize light sensor.
  pinMode(LGTPIN, INPUT);

  // Initialize device.
  dht.begin();
  // Print temperature sensor details.
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  if (VERBOSE) {
    Serial.println("DHTxx Unified Sensor Example");
    Serial.println("------------------------------------");
    Serial.println("Temperature");
    Serial.print  ("Sensor:       "); Serial.println(sensor.name);
    Serial.print  ("Driver Ver:   "); Serial.println(sensor.version);
    Serial.print  ("Unique ID:    "); Serial.println(sensor.sensor_id);
    Serial.print  ("Max Value:    "); Serial.print(sensor.max_value); Serial.println(" *C");
    Serial.print  ("Min Value:    "); Serial.print(sensor.min_value); Serial.println(" *C");
    Serial.print  ("Resolution:   "); Serial.print(sensor.resolution); Serial.println(" *C");
    Serial.println("------------------------------------");
  }
  // Print humidity sensor details.
  dht.humidity().getSensor(&sensor);
  if (VERBOSE) {
    Serial.println("------------------------------------");
    Serial.println("Humidity");
    Serial.print  ("Sensor:       "); Serial.println(sensor.name);
    Serial.print  ("Driver Ver:   "); Serial.println(sensor.version);
    Serial.print  ("Unique ID:    "); Serial.println(sensor.sensor_id);
    Serial.print  ("Max Value:    "); Serial.print(sensor.max_value); Serial.println("%");
    Serial.print  ("Min Value:    "); Serial.print(sensor.min_value); Serial.println("%");
    Serial.print  ("Resolution:   "); Serial.print(sensor.resolution); Serial.println("%");
    Serial.println("------------------------------------");
  }
  // Set delay between sensor readings based on sensor details.
  delayMS = sensor.min_delay / 1000;
}


#define LIMIT(period)                                       \
  static uint32_t last_sent = 0;                            \
  if (millis() - last_sent < period) return;                \
  last_sent = millis();

void loop() {
  // Delay between measurements.
  LIMIT(delayMS);
  // Get temperature event and print its value.
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (isnan(event.temperature)) {
    Serial.println("Error reading temperature!");
  }
  else {
    if (VERBOSE) Serial.print("Temperature: ");
    Serial.print(event.temperature);
    if (VERBOSE) Serial.println(" *C");
    else Serial.print(',');
  }
  // Get humidity event and print its value.
  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    Serial.println("Error reading humidity!");
  }
  else {
    if (VERBOSE) Serial.print("Humidity: ");
    Serial.print(event.relative_humidity);
    if (VERBOSE) Serial.println("%");
    else Serial.print(',');
  }

  if (VERBOSE) Serial.print("Light: ");
  float lightlvl = analogRead(LGTPIN);
  Serial.println(lightlvl / 16.0);

  if (WEBDATA)
    do_POST( "tmp=" + String(event.temperature) +
            "&hmd=" + String(event.relative_humidity) +
            "&lgt=" + String(lightlvl));
}
