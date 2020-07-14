//for time
#include <NTPClient.h>
#include <WiFiUdp.h>

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Servo.h>  // for servo movement

int ledOpen1=0;
int ledClose1=4;
int switchReed1=16;

int ledOpen2=14;
int ledClose2=12;
int switchReed2=5;


// Update these with values suitable for your network.
//Net casa: MEO PT Pass:rt7lim13
//net Casa Cata:NOWO-1B319 EXT pass:P7Y7KP82
//net phone: AndroidAP_5128 pass: getthejets
//net Acredita: Acredita Portugal II pass: equipaacredita
//Lab_UA: defalut pass:""


const char* ssid = "AndroidAP_5128";
const char* password = "getthejets";
const char* mqtt_server = "farmer.cloudmqtt.com";
const char* mqtt_user = "aivvlaza";
const char* mqtt_pass = "qHyhTip002KD";
const int port_server = 16820;


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
int duration, posStart, posEnd, pause;
String dString = "";
Servo myservo1;
Servo myservo2;





/*
 * control the servo to mimic a button press action
 * duration in seconds, posStart & posEnd in degrees
 */
void buttonPress1(unsigned int duration, unsigned int posStart, unsigned int posEnd,unsigned int pause) {
  myservo1.write(posStart);  // make sure at starting position
  delay(100);  // let servo stops properly
  
  // start the movement
  myservo1.write(posEnd);  // move to ending position
  if (digitalRead(switchReed1)==HIGH){
    digitalWrite(ledOpen1, HIGH);
    digitalWrite(ledClose1, LOW);
  }
  delay(pause*1000);  // stay there for a given duration
  myservo1.write(posStart); // back to starting position
  delay(100);  // let servo stops properly

    if (digitalRead(switchReed1)==HIGH){
    digitalWrite(ledOpen1, LOW);
    digitalWrite(ledClose1, HIGH);
  }
}

void buttonPress2(unsigned int duration, unsigned int posStart, unsigned int posEnd, unsigned int pause) {
  myservo2.write(posStart);  // make sure at starting position
  delay(100);  // let servo stops properly
  
  // start the movement


  
  myservo2.write(posEnd);  // move to ending position
  if (digitalRead(switchReed2)==HIGH){
    digitalWrite(ledOpen2, HIGH);
    digitalWrite(ledClose2, LOW);
  }
  delay(pause*1000);  // stay there for a given duration
  myservo2.write(posStart); // back to starting position
  delay(100);  // let servo stops properly

  if (digitalRead(switchReed2)==HIGH){
    digitalWrite(ledOpen2, LOW);
    digitalWrite(ledClose2, HIGH);
  }
}


void setup() {
  
// prepare Door1
   pinMode(ledOpen1, OUTPUT);
  pinMode(ledClose1, OUTPUT);
  pinMode(switchReed1, INPUT);
  
// prepare Door2
  pinMode(ledOpen2, OUTPUT);
  pinMode(ledClose2, OUTPUT);
  pinMode(switchReed2, INPUT);
  
// prepare servo1
  myservo1.attach(15);  // attach the servo at GIO2 at it is right next to 3.3V and GND pins
  myservo1.write(0);  // make sure start from 0


  // prepare servo2
  myservo2.attach(13);  // attach the servo at GIO2 at it is right next to 3.3V and GND pins
  myservo2.write(0);  // make sure start from 0

  
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
  Serial.println(String(topic));
  Serial.println(String(payloadStr));

  // parse the payload message
  duration = 1;
  posStart = 0;
  posEnd = 180;
  pause = 5;

  if (digitalRead(switchReed1)==HIGH){ //Porta 1 fechada
  if(String(topic).equals("1")){
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
    buttonPress1(duration, posStart, posEnd, pause);  // perform servo press
  }
  }

  if (digitalRead(switchReed2)==HIGH){ //Porta 2 fechada
    if(String(topic).equals("2")){
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
    buttonPress2(duration, posStart, posEnd, pause);  // perform servo press
  }
  }
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
      client.subscribe("1");
      client.subscribe("2");
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

    if (digitalRead(switchReed1)==HIGH){
    digitalWrite(ledOpen1, LOW);
    digitalWrite(ledClose1, HIGH);
  }
  else {
    digitalWrite(ledOpen1, HIGH);
    digitalWrite(ledClose1, LOW);
  }
  delay(1);



    if (digitalRead(switchReed2)==HIGH){
    digitalWrite(ledOpen2, LOW);
    digitalWrite(ledClose2, HIGH);
  }
  else {
    digitalWrite(ledOpen2, HIGH);
    digitalWrite(ledClose2, LOW);
  }
  delay(1);
/*long now = millis();
  if (now - lastMsg > 1000) {
    lastMsg = now;
    ++value;
    snprintf (msg, 50, "#%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    //client.publish("Msg_Num", msg);
    }
    delay(1);*/

    
}
