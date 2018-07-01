#include <WiFi.h>

bool in_req = false;

#define WIFI_DELAY 1000
#define MAX_SSID_LEN 64
#define MAX_BSSID_LEN 12
#define MAX_CONNECT_TIME 10000
#define NUM_APS 255
#define OPEN_THRESHOLD -60

#define WIFI_VERBOSE true

char auto_ssid[MAX_SSID_LEN] = "";
const int response_timeout = 6000;
uint8_t *bssid;
uint8_t indices[NUM_APS];
uint8_t ap_count;
int channel;
int strength;
int winner;

bool wifi_in_request() {
  return in_req;
}

void wifi_scan() {
  memset(auto_ssid, 0, MAX_SSID_LEN);
  ap_count = WiFi.scanNetworks(); // Scans the network for all WiFi
  #if WIFI_VERBOSE
    Serial.println("Scan done!");
  #endif
  if (ap_count == 0) {
    #if WIFI_VERBOSE
      Serial.println("No networks found!");
    #endif
  } else {
    #if WIFI_VERBOSE
      Serial.print(ap_count);
      Serial.println(" networks found.");
    #endif
    for (int i = 0; i < ap_count; ++i) {
      // Print auto_ssid and RSSI for each network found
      #if WIFI_VERBOSE
        Serial.print(i + 1);
        Serial.print(": ");
        Serial.print(WiFi.SSID(i));
        Serial.print(" ");
        uint8_t *cc = WiFi.BSSID(i);
        for (int k = 0; k < 6; k++) {
          Serial.print(*cc, HEX);
          if (k != 5)
            Serial.print(":");
          cc++;
        }
        Serial.print(" (");
        Serial.print(WiFi.RSSI(i));
        Serial.print(" dBm)");
        Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN) ? " " : "*");
        delay(10);
      #endif
    }
    for (int i = 0; i < ap_count; i++) {
      indices[i] = i;
    }
    for (int i = 0; i < ap_count; i++) {
      for (int j = i + 1; j < ap_count; j++) {

        // Sorts based on signal strengths
        if (WiFi.RSSI(indices[j]) > WiFi.RSSI(indices[i])) {
          std::swap(indices[i], indices[j]);
        }
      }
    }
    for (int i = 0; i < ap_count; ++i) {
      #if WIFI_VERBOSE
        Serial.print(WiFi.SSID(indices[i]));
        Serial.print(" ");
        Serial.print(WiFi.RSSI(indices[i]));
        Serial.print(" ");
        Serial.print(WiFi.encryptionType(indices[i]));
        Serial.print(" ");
        Serial.print(WiFi.channel(indices[i]));
        Serial.println();
      #endif
      // Chooses open WiFi from the sorted list
      if (WiFi.encryptionType(indices[i]) == WIFI_AUTH_OPEN) {
        Serial.println("Found a strong non-encrypted network. Store it and "
                       "exit to connect.");
        memset(auto_ssid, 0, MAX_SSID_LEN);
        strncpy(auto_ssid, WiFi.SSID(indices[i]).c_str(), MAX_SSID_LEN);
        bssid = WiFi.BSSID(indices[i]);
        strength = WiFi.RSSI(indices[i]);
        channel = WiFi.channel(indices[i]);
        break;
      }
    }
  }
}

void wifi_auto_setup() {
  WiFi.setAutoConnect(true);
  WiFi.setAutoReconnect(true);
  while (WiFi.status() != WL_CONNECTED) {
    // WiFi.softAPdisconnect();
    WiFi.disconnect(true);
    wifi_scan();
    // WiFi.mode(WIFI_OFF);

    // Connects to the first WiFi network in the sorted list
    if (strlen(auto_ssid) > 0) {
      #if WIFI_VERBOSE
        Serial.print("Going to connect for : ");
        Serial.print(auto_ssid);
        Serial.print(" at ");
        uint8_t *cc = bssid;
        for (int k = 0; k < 6; k++) {
          // Serial.print(String(*cc));
          Serial.print(*cc, HEX);
          if (k != 5)
            Serial.print(":");
          cc++;
        }
        Serial.print(" on channel ");
        Serial.print(String(channel));
        Serial.print(" at ");
        Serial.print(String(strength));
        Serial.println(" dBm.");
        Serial.println(auto_ssid);
        Serial.println(NULL);
        Serial.println(channel);
      #endif
      WiFi.begin(auto_ssid, NULL, NULL, bssid, true); // renee
      WiFi.printDiag(Serial);
      // WiFi.begin(auto_ssid); //,NULL,channel,bssid,true); //renee

      // wm.addAP(auto_ssid, "none"); //renee
      //      while (WiFi.waitForConnectResult() != WL_CONNECTED) {
      //          Serial.println("Connection Failed! Rebooting...");
      //          ESP.restart();
      //      }

      unsigned short try_cnt = 0;

      while (WiFi.status() != WL_CONNECTED &&
             try_cnt < MAX_CONNECT_TIME / WIFI_DELAY) {
        delay(WIFI_DELAY);
        // WiFi.begin(auto_ssid,NULL,channel,bssid,true);
        int a = WiFi.status();
        #if WIFI_VERBOSE
          Serial.println(WiFi.status());
        #endif
        // Serial.println(SYSTEM_EVENT_STA_DISCONNECTED);
        if (a == 1) {
          Serial.println("reconnecting");
          wifi_scan();
          WiFi.disconnect(true);
          WiFi.begin(auto_ssid, NULL, NULL, bssid, true); // renee
          // WiFi.reconnect();
        }
        // Serial.print(".");
        try_cnt++;
      }
    }
  }
}

String do_GET(String req) {
  WiFiClient client;
  while (!client.connect(HOST, 80)) {
    Serial.println("connection failed");
    return "";
  }

  client.println("GET "URL + req + " HTTP/1.1");
  client.println("Host: "HOST);
  client.print("\r\n");
  unsigned long count = millis();
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
    if (millis()-count>response_timeout) break;
  }
  count = millis();

  String res = "";

  while (client.available()) {
    res += (char)client.read();
  }
  client.stop();

  in_req = false;
  return res;
}

String do_POST(String req) {
  in_req = true;
  WiFiClient client;                           // instantiate a client object

  if (client.connect(HOST, 80)) { // try to connect to class server
    // This will send the request to the server
    // If connected, fire off HTTP GET:
    String thing = req;
    client.println("POST "URL" HTTP/1.1");
    client.println("Host: "HOST);
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Content-Length: " + String(thing.length()));
    client.print("\r\n");
    client.print(thing);
    unsigned long count = millis();

    while (client.connected()) {
      String line = client.readStringUntil('\n');
      Serial.println(line);

      if (line == "\r") { // found a blank line!
        // headers have been received! (indicated by blank line)
        break;
      }

      if (millis() - count > response_timeout) break;
    }
    count = millis();
    String op;                   // create empty String object

    while (client.available()) { // read out remaining text (body of response)
      op += (char)client.read();
    }
    Serial.println(op);
    client.stop();
    Serial.println();
    Serial.println("-----------");

    in_req = false;
    return op;
  } else {
    Serial.println("connection failed");
    Serial.println("wait 0.5 sec...");
    client.stop();
    delay(300);

    in_req = false;
    return "FAILED";
  }
}

void wifi_connect(String network_name, String password = "") {
  // connect to wifi
  if (password.length() == 0) WiFi.begin(network_name.c_str());
  else WiFi.begin(network_name.c_str(), password.c_str());

  Serial.println("Wifi Starting");

  int count = 0; // count used for Wifi check times

  while (WiFi.status() != WL_CONNECTED && count < 6) {
    delay(500);
    Serial.print(".");
    count++;
  }

  delay(2000);

  if (WiFi.isConnected()) { // if we connected then print our IP, Mac, and SSID
                            // we're on
    Serial.println(
      WiFi.localIP().toString() + " (" + WiFi.macAddress() + ") (" + WiFi.SSID() +
      ")");
    delay(500);
  } else {         // if we failed to connect just ry again.
    Serial.println(WiFi.status());
    ESP.restart(); // restart the ESP
  }
}
