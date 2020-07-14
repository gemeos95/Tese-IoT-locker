
//1º meter um led a acender.
//Perceber como: incorporar magnetic sensor (condicionar com isso)
//Calcular através tempo  --> Afinal fazer no server mais facil.



//for time
#include <NTPClient.h>
#include <WiFiUdp.h>

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Servo.h>  // for servo movement


//Hardware varibles (button)
const int buttonPin = 12;     // the number of the pushbutton pin
const int ledPin =  16;      // the number of the LED pin
long timer = 0;

// Update these with values suitable for your network.
//Net casa: Vodafone-2F52DD Pass:84jwUTTUaj
//net phone: AndroidAP_5128 pass: getthejets
//Lab_UA: defalut pass:""
//Casa Cata:NOWO-1B319 EXT;pass:P7Y7KP82
//Acredita Portugal: Acredita Portugal II pass:equipaacredita

const char* ssid = "Acredita Portugal II";
const char* password = "equipaacredita";
const char* mqtt_server = "farmer.cloudmqtt.com";
const char* mqtt_user = "aivvlaza";
const char* mqtt_pass = "qHyhTip002KD";
const int port_server = 16820;




int duration, posStart, posEnd;
String dString = "";
Servo myservo;

//For time---------
WiFiUDP ntpUDP;
// You can specify the time server pool and the offset (in seconds, can be
// changed later with setTimeOffset() ). Additionaly you can specify the
// update interval (in milliseconds, can be changed using setUpdateInterval() ).
NTPClient timeClient(ntpUDP, "europe.pool.ntp.org", 3600, 60000);

// Variables to save date and time
String formattedDate;
String dayStamp;
String timeStamp;

WiFiClient espClient;
PubSubClient client(espClient); // ligação wifi do nosso esp
long lastMsg = 0;
char msg[50];
int value = 0;
DynamicJsonBuffer jsonBuffer(1024);


/*
 * control the servo to mimic a button press action
 * duration in seconds, posStart & posEnd in degrees
 */
void buttonPress(unsigned int duration, unsigned int posStart, unsigned int posEnd) {
  myservo.write(posStart);  // make sure at starting position
  delay(100);  // let servo stops properly
  
  // start the movement
  myservo.write(posEnd);  // move to ending position
  delay(duration*1000);  // stay there for a given duration
  myservo.write(posStart); // back to starting position
  delay(100);  // let servo stops properly
}


void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);
  Serial.begin(115200);  // connect to serial mainly for debugging

// prepare servo
  myservo.attach(16);  // attach the servo at GIO2 at it is right next to 3.3V and GND pins
  myservo.write(0);  // make sure start from 0

  
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  timeClient.begin();
  setup_wifi(); //call wifi ligação
  client.setServer(mqtt_server, port_server); //ligar ao servidor
  client.setCallback(callback);
}


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


/*
 * handle message arrived from MQTT and do the real actions depending on the command
 * payload format: start with a single character
 * P: button press, optionally follows by (in any order) 
 *    Dxxx: for xxx seconds duration,
 *    Exxx: ending at xxx angle
 * R: reset wifi settings
 */
 
void callback(char* topic, byte* payload, unsigned int length) { //sempre que o esp recebe uma mensagem mqtt, ele chama esta função
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String payloadStr ="";
  for (int i = 0; i < length; i++) {
    payloadStr += (char)payload[i];
  }
  Serial.println();
  Serial.print(String(topic));
  Serial.println();
  Serial.print(String(payloadStr));
  Serial.println();



// parse the payload message
  duration = 1;
  posStart = 0;
  posEnd = 90;
  if ((char)payload[0] == 'R') {
    Serial.println("Resetting wifi!");  // debug message
  } else if ((char)payload[0] == 'P') {
    if (length > 1) {
      for (int i = 1; i < length; i++) {
        dString = "";
        if ((char)payload[i] == 'D') { // modify 'duration', default 1 second
          for (int j = 1; j < 4; j++) {
            dString += (char)payload[i+j];
          }
          duration = dString.toInt();
        }
        if ((char)payload[i] == 'E') {  // modify 'ending position', default at 90 degress
          for (int j = 1; j < 4; j++) {
            dString += (char)payload[i+j];
          }
          posEnd = dString.toInt();
        }
      }
    }
    buttonPress(duration, posStart, posEnd);  // perform servo press
    snprintf(msg, 75, "Button pressed for %d second(s) at %d degrees!", duration, posEnd);
    Serial.println(msg);  // debug message
  } else {
    //snprintf(msg, 75, "Unknown command: %s, do nothing!", (char)payload[0]);
    snprintf(msg, 75, "Unknown command: %c, do nothing!", (char)payload[0]);
    Serial.println(msg);  // debug message
  }

/*
 * 
 * if(String(topic).equals("Topic")){
  // Switch on the LED if an 1 was received as first character
  if (payloadStr.equals("ON")) {
    Serial.print("ON");

    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else if (payloadStr.equals("OFF")) {
    Serial.print("OFF");

    digitalWrite(BUILTIN_LED, LOW);  // Turn the LED off by making the voltage HIGH
  } else{
    Serial.print("");
  }
}
*/




}


void reconnect() { //sempre á espera de uma perca de ligação e a reconectar
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-"; //ele edentifica-se com o nome!
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(),mqtt_user,mqtt_pass)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe
      client.subscribe("Topic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}



void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); 

     if (now - lastMsg > 1000) {
    lastMsg = now;
    ++value;
    snprintf (msg, 50, "#%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("Msg_Num", msg);

     JsonObject& root = jsonBuffer.createObject();
     root.set("State",Click);
     root.set("Time",Time);
     String payload = "";
     root.printTo(payload);
     client.publish("Clip1");
     Serial.println(payload.c_str());
    }
}
