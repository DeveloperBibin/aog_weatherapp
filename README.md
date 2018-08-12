# aog_weatherapp
An android assistant app that shows air pollution index based on user location using node js client library.
  

You can test this app in your dialogflow console by following these steps 


1) in DialogFlow -> Create a new Agent (Create or link a existing gcp proejct)
2) From settings -> import and export Tab -> Restore From Zip and upload Airpollution.zip
3) goto fullfillment section and turn on fullfillment and paste the index.js code and package.json and deploy (Replace            MapApikey with your google maps api key)
3) Go to your gcp console enable billing (Since it fetches data from third party api)
4)viola! now you can try it on simulator
