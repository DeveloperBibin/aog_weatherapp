

  'use strict';
  const fetch = require('isomorphic-fetch');

  const {dialogflow,Permission,BasicCard,SimpleResponse,Image,Suggestions} = require('actions-on-google');


  const MapsApiKey='YOUR_KEY';

  const functions = require('firebase-functions');
  var finalname;

 
  const app = dialogflow({debug: true});
  const XMLHttpRequest = require('xhr2');
  const NodeGeocoder = require('node-geocoder');
  var options = {
    provider: 'google',
    httpAdapter: 'https', 
    apiKey: MapsApiKey,
    formatter: null,

  };
  var geocoder = NodeGeocoder(options);
  var userLat;
  var userLon;
  var Finaldata = [];


 
  app.intent('Default Welcome Intent', (conv) => {
      conv.data.ptype=1;
      conv.ask(new Permission({
      context: 'To get air pollution index',
      permissions: 'DEVICE_PRECISE_LOCATION'
    }));
      
  });
  
  
  app.intent('permission_given - yes - yes', (conv) => {
     var temp=Finaldata['pls'];
     var sm=temp.split(', ');
     var i=0;
     for(i=0;i<sm.length;i++)
     {
      switch(sm[i])
        {
          case 'CO':
          sm[i]='Carbon monoxide';
          break;
          case 'OZONE':
          sm[i]='OZONE';
          break;
          case 'SO2':
          sm[i]='Sulfur dioxide';
          break;
          case 'PM2.5':
          sm[i]='Particulate matter 2.5';
          break;
          case 'NO2':
          sm[i]='Nitrogen dioxide';
          break;
          case 'PM10':
          sm[i]='Particulate matter 10';
          break;
          case 'NH3':
          sm[i]='Ammonia';
          break;
          default:
          sm[i]='';

        }

     }
     sm.pop(0);
     var andP=sm.pop();
  
  
     temp=sm.join(', ');


     conv.ask(new SimpleResponse({
         text:`The other pollutants in your area are ${temp} and ${andP}`,
         speech:`The other pollutants in your area are ${temp} and ${andP}`
     }));
    
     conv.ask(`which of these pollutant you would like to know more about?`);
    
      
  });
  
  app.intent('e_permission_given', (conv,{pollutant}) => {




      
    conv.data.ptype=2;
    conv.data.epollutant=pollutant;
  conv.ask(new Permission({
    
    context: 'To retrieve the data you asked for',
    permissions:'DEVICE_PRECISE_LOCATION'
  }));
});
  
   app.intent('permission_given - yes - yes - custom', (conv,{Pollutant}) => {





    
      var title,subtitle,text,speech;
      switch (Pollutant) {
      case 'Carbon monoxide':
        title = 'Carbon monoxide';
        subtitle='Colourless, odourless, non-irritating but very poisonous gas.';
        text ='Reduces the amount of oxygen reaching the body’s organs and tissues; aggravates heart disease, resulting in chest pain and other symptoms.';
        speech=title + text;
        break;
      case 'OZONE':
        title = 'OZONE';
        subtitle='Formed from NOx and VOCs';
        text ='Decreases lung function and causes respiratory symptoms, such as coughing and shortness of breath, and also makes asthma and other lung diseases get worse.';
        speech=' it can ' + text;
        break;
      case 'Sulfur dioxide':
        title = 'Sulfur dioxide';
        subtitle= 'Produced by various industrial processes.';
        text ='Aggravates asthma and makes breathing difficult. It also contributes to particle formation with associated health effects.';
        speech=' it can ' + text;
        break;
      case 'Particulate matter 2.5':
        title = 'Particulate matter 2.5';
        subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + ' it ' + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
      case 'Nitrogen dioxide':
        title = 'Nitrogen dioxide';
        subtitle='Emitted from high temperature combustion.';
        text ='Worsens lung diseases leading to respiratory symptoms, increased susceptibility to respiratory infection.';
        speech=`it can worsens lung diseases leading to respiratory symptoms`;
        break;
      case 'Particulate matter 10':
        title = 'Particulate matter 10';
         subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + ' it ' + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
      case 'Ammonia':
        title = 'Ammonia';
         subtitle='Emitted from agricultural processes.';
        text ='Exposure to high concentrations following an accidental release or in occupational settings could cause irritation of the eyes, nose and throat.';
        speech="it could cause irritation of the eyes, nose and throat";
        break;
      default:
        title = '';

    }


          var level=Finaldata[title];


          conv.ask(new SimpleResponse({
            text:`Here yu go`,
            speech:`The current level of ${title} is ${level} and ${speech}`
            }));

         
          conv.add(new BasicCard({
            title: title,
            subtitle: `Current level : ${level}` + '\n'+subtitle,
            text: text
          }));

          conv.ask(` Would you like to know anything else ?`);


});
  
  
  app.intent('about_city', (conv,{any}) => {




   var request = new XMLHttpRequest();

  return geocoder.geocode(any+",india").then (function (results) {

           
     var lat=results[0]['latitude'];
     var lon=results[0]['longitude'];






  return getAdress(lat, lon).then(city => {
  
    var poluant = city['polutant'];
   
    switch (poluant)
     {
      case 'CO':
        finalname = 'Carbon monoxide';
        break;
      case 'OZONE':
        finalname = 'OZONE';
        break;
      case 'SO2':
        finalname = 'Sulfur dioxide';
        break;
      case 'PM2.5':
        finalname = 'Particulate matter 2.5';
        break;
      case 'NO2':
        finalname = 'Nitrogen dioxide';
        break;
      case 'PM10':
        finalname = 'Particulate matter 10';
        break;
      case 'NH3':
        finalname = 'Ammonia';
        break;
      default:
        finalname = 'Others';

    }

  
  
  
  
  
  
  
   
        if (city['PM2s.5'] == 'undefined') {
        
        }
        else {
          var pm = city['PM2.5'];
        }
        var title, subtitle, text, url;
        var p = city['polution'];
        if (p < 50) {
          title = 'Good';
          text = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
          subtitle = 'Ideal for outdoor activites';
          url = '';
        }


        if (p > 50 && p <= 100) {
          title = 'Moderate';
          text = 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
          subtitle = 'Acceptable air quality for outdoor activities.';
          url = '';
        }



        if (p > 100 && p <= 150) {
          title = 'Unhealthy for Sensitive Groups';
          subtitle = 'Not suitable for Members of sensitive groups';
          text = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
          url = '';
        }

        if (p > 150 && p <= 200) {
          title = 'Unhealthy';
          text = 'Everyone may begin to experience health effects, members of sensitive groups may experience more serious health effects';
          subtitle = 'Try to minimize your time outside as much as possible';
          url = '';
        }
        if (p > 200 && p <= 300) {
          title = 'Very Unhealthy';
          text = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
          subtitle = 'Unless you really have to, our recommendation is to minimize your time outdoors.';
          url = '';
        }
        if (p > 300) {
          title = 'Hazardous';
          text = 'Health alert: everyone may experience more serious health effects.';
          subtitle = 'Everyone should avoid all outdoor exertion!';
          url = '';
        }

        if (city['error'] == 0) {
        


          conv.ask(new SimpleResponse({
            text: `Average Polution in ${any} is ${city['polution']} and the main polutant is  ${finalname}.`,
            speech: `Average Polution ${any} is ${city['polution']} and the main polutant is  ${finalname}.`,
          }));

          conv.data.pollutant=finalname;
          conv.ask(new BasicCard({
            title: city['polution']+'-'+title,
            subtitle:subtitle+`  \nMain pollutant: ${finalname}`,
            text: text
          }));
          conv.ask(`Would you like to know more about ${finalname}`);
         



        }
        else {
          conv.ask('Oops! data not availible');
        }
   


  
  
  

  });


});
  


  
});
  
  
  
app.intent('about_city - yes',(conv) => {






  var title,subtitle,text,speech;
  var pollutant=conv.data.pollutant;

    switch(pollutant)
    {
        case 'Carbon monoxide':
        title ='Carbon monoxide (CO)';
        subtitle='Colourless, odourless, non-irritating but very poisonous gas.';
        text ='Reduces the amount of oxygen reaching the body’s organs and tissues. aggravates heart disease, resulting in chest pain and other symptoms.';
        speech=title + text;
        break;
        case 'OZONE':
        title ='Ozone (O3)';
        subtitle='Formed from NOx and VOCs';
        text ='Decreases lung function and causes respiratory symptoms, such as coughing and shortness of breath, and also makes asthma and other lung diseases get worse.';
        speech=title + text;
        break;
        case 'Sulfur dioxide':
        title ='Sulfir dioxide (SO2)';
        subtitle= 'Produced by various industrial processes.';
        text ='Aggravates asthma and makes breathing difficult. It also contributes to particle formation with associated health effects.';
        speech=title + text;
        break;
        case 'Particulate matter 2.5':
        title ='Particulate matter 2.5';
        subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + title + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
        case 'Nitrogen dioxide':
        title ='Nitrogen dioxide (NO2)';
        subtitle='Emitted from high temperature combustion.';
        text ='Worsens lung diseases leading to respiratory symptoms, increased susceptibility to respiratory infection.';
        speech=title+`Worsens lung diseases leading to respiratory symptoms`;
        break;
        case 'Ammonia':
        title ='Ammonia (NH3)';
        subtitle='Emitted from agricultural processes.';
        text ='Exposure to high concentrations following an accidental release or in occupational settings could cause irritation of the eyes, nose and throat.';
        speech=title+"could cause irritation of the eyes, nose and throat";
        break;
        case 'Particulate matter 10':
        title ='Particulate matter 10';
        subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + title + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
        default:
        title='';
        subtitle='';
        text='';
        break;
    }
  
    conv.close(new SimpleResponse({
        text: `Here's some information about ${pollutant}`,
        speech: speech,
      }));
    conv.close(new BasicCard({
        text: text,
        title: title,
        subtitle: subtitle
      }));



});

  
  
  

  app.intent("pollutant_level",(conv,{pollutant}) => {
  
    var level=Finaldata[pollutant];
  
    if(level===null)
    {
      conv.close(`Oops! data from your location not availible`); 
    }
    else
    {
      
      conv.close(`The polution index of ${pollutant} is ${level}`);
    }

  });

  app.intent('about_pollutant',(conv, {pollutant}) => {
      var title,subtitle,text,speech;
    
       switch(pollutant)
    {
        case 'Carbon monoxide':
        title ='Carbon monoxide (CO)';
        subtitle='Colourless, odourless, non-irritating but very poisonous gas.';
        text ='Reduces the amount of oxygen reaching the body’s organs and tissues. aggravates heart disease, resulting in chest pain and other symptoms.';
        speech=title + text;
        break;
        case 'OZONE':
        title ='Ozone (O3)';
        subtitle='Formed from NOx and VOCs';
        text ='Decreases lung function and causes respiratory symptoms, such as coughing and shortness of breath, and also makes asthma and other lung diseases get worse.';
        speech=title + text;
        break;
        case 'Sulfur dioxide':
        title ='Sulfir dioxide (SO2)';
        subtitle= 'Produced by various industrial processes.';
        text ='Aggravates asthma and makes breathing difficult. It also contributes to particle formation with associated health effects.';
        speech=title + text;
        break;
        case 'Particulate matter 2.5':
        title ='Particulate matter 2.5';
        subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + title + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
        case 'Nitrogen dioxide':
        title ='Nitrogen dioxide (NO2)';
        subtitle='Emitted from high temperature combustion.';
        text ='Worsens lung diseases leading to respiratory symptoms, increased susceptibility to respiratory infection.';
        speech=title+`Worsens lung diseases leading to respiratory symptoms`;
        break;
        case 'Ammonia':
        title ='Ammonia (NH3)';
        subtitle='Emitted from agricultural processes.';
        text ='Exposure to high concentrations following an accidental release or in occupational settings could cause irritation of the eyes, nose and throat.';
        speech=title+"could cause irritation of the eyes, nose and throat";
        break;
        case 'Particulate matter 10':
        title ='Particulate matter 10';
        subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + title + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
        default:
        title='';
        subtitle='';
        text='';
        break;
    }
      var levels=Finaldata[pollutant];
    
     
        if(levels!==null)
        {
          conv.add(new SimpleResponse({
          text: `Here you go`,
          speech: speech
        }));
      conv.add(new BasicCard({
          text: text,
          title: title,
          subtitle:`Current level : ${levels}   \n`+ subtitle
        }));
        
        
        
        }
        else
        {
         conv.close(`Sorry, requested data is not availible`);   
        }
        
     

      
          
  });


  app.intent('permission_given', (conv, params, confirmationGranted) => {
  
    const {adress}=conv.device.location.coordinates;
    var lat = conv.device.location.coordinates.latitude;
    var lon = conv.device.location.coordinates.longitude;
    userLat = parseFloat(conv.device.location.coordinates.latitude);
    userLon = parseFloat(conv.device.location.coordinates.longitude);
    return getAdress(lat,lon).then(city =>
      {


        
      
        var poluant=city['polutant'];
        var finalname;
        switch(poluant)
        {
          case 'CO':
          finalname='Carbon monoxide';
          break;
          case 'OZONE':
          finalname='OZONE';
          break;
          case 'SO2':
          finalname='Sulfur dioxide';
          break;
          case 'PM2.5':
          finalname='Particulate matter 2.5';
          break;
          case 'NO2':
          finalname='Nitrogen dioxide';
          break;
          case 'PM10':
          finalname='Particulate matter 10';
          break;
          case 'NH3':
          finalname='Ammonia';
          break;
          default:
          finalname='Others';

        }
        if (confirmationGranted) {
        
  

    var title, subtitle, text, url;
    var p = city['polution'];
    if (p < 50) {
      title = 'Good';
      text = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
      subtitle = 'Ideal for outdoor activites';
      url = 'https://firebasestorage.googleapis.com/v0/b/airpolution-989f7.appspot.com/o/good_image-min.png?alt=media&token=2bcd2cf4-7738-49d0-8962-ec682187c768';
    }


    if (p > 50 && p <= 100) {
      title = 'Moderate';
      text = 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
      subtitle = 'Acceptable air quality for outdoor activities.';
      url = 'https://firebasestorage.googleapis.com/v0/b/airpolution-989f7.appspot.com/o/moderate_image-min.png?alt=media&token=2610dcbe-3cad-4342-8756-77be852b70e8';
    }



    if (p > 100 && p <= 150) {
      title = 'Unhealthy for Sensitive Groups';
      subtitle = 'Not suitable for Members of sensitive groups';
      text = 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.';
      url = 'https://firebasestorage.googleapis.com/v0/b/airpolution-989f7.appspot.com/o/unhelthy1-min.png?alt=media&token=07064513-5aa8-435e-8c44-c37a7e01194e';
    }

    if (p > 150 && p <= 200) {
      title = 'Unhealthy';
      text = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects';
      subtitle = 'Try to minimize your time outside as much as possible';
      url = 'https://firebasestorage.googleapis.com/v0/b/airpolution-989f7.appspot.com/o/unhealthy-min.png?alt=media&token=b63d7cfc-1d33-4926-ab29-ebd0006c662a';
    }
    if (p > 200 && p <= 300) {
      title = 'Very Unhealthy';
      text = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
      subtitle = 'Unless you really have to, our recommendation is to minimize your time outdoors.';
      url = 'https://firebasestorage.googleapis.com/v0/b/airpolution-989f7.appspot.com/o/very_unhealthy-min.png?alt=media&token=9a7b200c-1467-4a70-9c5e-d352924b3bbc';
    }
    if (p > 300) {
      title = 'Hazardous';
      text = 'Health alert: everyone may experience more serious health effects.';
      subtitle = 'Everyone should avoid all outdoor exertion!';
      url = 'https://firebasestorage.googleapis.com/v0/b/airpolution-989f7.appspot.com/o/hazardous-min.png?alt=media&token=beedd33c-30d3-418f-a16c-8d5495adb277';
    }

    if (city['error'] === 0) {
    


         if(conv.data.ptype==1)
           {
            conv.ask(new SimpleResponse({
            text: `Average Polution in your area is ${city['polution']} and the main polutant is  ${finalname}.`,
            speech: `Average Polution in your area is ${city['polution']} and the main polutant is  ${finalname}.`,
          }));


          conv.ask(new BasicCard({
            title: city['polution']+'-'+title,
            subtitle:subtitle+`  \nMain pollutant: ${finalname}`,
            text: text
          }));
          conv.data.pollutant=finalname;
          conv.ask(`Would you like to know more about ${finalname}?`);


           } 
           else if(conv.data.ptype==2)
           {


              var level=Finaldata[conv.data.epollutant];
            


              if(conv.data.epollutant=='PM')
              {
                level=Finaldata['Particulate matter 2.5'];
              }  
            
               if(level===null)
                {
                  conv.close(`Oops! data not availible`); 
                }
                else
                {
                    if(level=='NA')
                    {
                        level='not availible'
                    }
                    
                  conv.close(
                      new SimpleResponse({
                          text:`Current polution index of ${conv.data.epollutant} is ${level}`,
                          speech:`Current polution index of ${conv.data.epollutant} is ${level}`
                      })
                      );
                }

           }
      
    
          
       
     


    }
    else {
      conv.close('Oops! the requested data is not availible');
    }

         
    }
  });

  }).catch((err) => {


});






app.intent('permission_given - yes',(conv) => {






  var title,subtitle,text,speech;
  var pollutant=conv.data.pollutant;

    switch(pollutant)
    {
        case 'Carbon monoxide':
        title ='Carbon monoxide (CO)';
        subtitle='Colourless, odourless, non-irritating but very poisonous gas.';
        text ='Reduces the amount of oxygen reaching the body’s organs and tissues. aggravates heart disease, resulting in chest pain and other symptoms.';
        speech=title + text;
        break;
        case 'OZONE':
        title ='Ozone (O3)';
        subtitle='Formed from NOx and VOCs';
        text ='Decreases lung function and causes respiratory symptoms, such as coughing and shortness of breath, and also makes asthma and other lung diseases get worse.';
        speech=title + text;
        break;
        case 'Sulfur dioxide':
        title ='Sulfir dioxide (SO2)';
        subtitle= 'Produced by various industrial processes.';
        text ='Aggravates asthma and makes breathing difficult. It also contributes to particle formation with associated health effects.';
        speech=title + text;
        break;
        case 'Particulate matter 2.5':
        title ='Particulate matter 2.5';
        subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + title + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
        case 'Nitrogen dioxide':
        title ='Nitrogen dioxide (NO2)';
        subtitle='Emitted from high temperature combustion.';
        text ='Worsens lung diseases leading to respiratory symptoms, increased susceptibility to respiratory infection.';
        speech=title+`Worsens lung diseases leading to respiratory symptoms`;
        break;
        case 'Ammonia':
        title ='Ammonia (NH3)';
        subtitle='Emitted from agricultural processes.';
        text ='Exposure to high concentrations following an accidental release or in occupational settings could cause irritation of the eyes, nose and throat.';
        speech=title+"could cause irritation of the eyes, nose and throat";
        break;
        case 'Particulate matter 10':
        title ='Particulate matter 10';
        subtitle='Tiny particles of solid or liquid suspended in a gas.';
        text ='Short-term exposures can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths.';
        speech=`Short-term exposures of` + title + `can worsen heart or lung diseases and cause respiratory problems. Long-term exposures can cause heart or lung disease and sometimes premature deaths`;
        break;
        default:
        title='';
        subtitle='';
        text='';
        break;
    }
  
    conv.add(new SimpleResponse({
        text: `Here's some information about ${pollutant}`,
        speech:`${speech}` 
      }));
    conv.add(new BasicCard({
        text: text,
        title: title,
        subtitle: subtitle
      }));
      conv.ask(`if you wish, i can tell you about other pollutants in your locality, shall i?`);



});









  function calcCrow(lat1, lon1, lat2, lon2) {
              var R = 6371; // km
              var dLat = toRad(lat2 - lat1);
              var dLon = toRad(lon2 - lon1);
              var lat1f = toRad(lat1);
              var lat2f = toRad(lat2);

              var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1f) * Math.cos(lat2f);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              var d = R * c;
              return d;
            }
  function toRad(Value) {
              return Value * Math.PI / 180;
            }
            
            
            
  function getAdress(lat, lon) {
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
    
        var method = 'GET';
      
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key='+MapsApiKey;
        var async = true;
    
        request.open(method, url, async);
        request.onreadystatechange = function () {
          if (request.readyState == 4) {
            if (request.status == 200) {
            
    
              var data = JSON.parse(request.responseText);
            
    
    
            
    
            
    
    
    
    
              for (var ac = 0; ac < data.results[0].address_components.length; ac++) {
                var component = data.results[0].address_components[ac];
    
                switch (component.types[0]) {
                  case 'locality':
                    var city = component.long_name;
                    break;
                  case 'administrative_area_level_1':
                    var state = component.long_name;
                  
                    break;
                  case 'country':
                  
                  
                    break;
                }
              }
    
    
            
    
              var Stationsurl = 'https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001e3b6baee37a1400f496a81bc5be4308f&format=json&offset=0&limit=100&filters[state]=' + state;
    
              return fetch(Stationsurl)
                .then((response) => {
                  if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                  } else {
    
                    return response.json();
                  }
                })
                .then((json) => {
                  
                  var i;
                  var flag = true;
                  var stations = [];
                
                  var count = parseInt(json.count);
                
                  if (count === 0) {
                    Finaldata['error'] = 1;
    
    
                  
                    resolve(Finaldata);
                  }
                  else {
                  
                    for (i = 0; i < json.records.length; i++) {
                      stations.push(json.records[i].station);
                    }
    
    
                 
                     
                    var len = stations.length,
                      out = [],
                      obj = {};
    
                    for (i = 0; i < len; i++) {
                      obj[stations[i]] = 0;
                    }
                    for (i in obj) {
                      out.push(i);
    
                    }
    
                    var j = 0;
                  
                    var details = [];
                    for (i = 0; i < out.length; i++) {
                      details[i] = out[i].split('-').join(',').split(',');
                      details[i].pop();
                    
    
    
                    }
                    var addresses = [];
                    var finalAdress = [];
                    for (i = 0; i < details.length; i++) {
    
                    
                      addresses[i] = details[i].toString();
                    
                      finalAdress.push(addresses[i]);
    
                    }
                  
                  
    
                  
                    var finalCordinates = [[]];
                    var distances = [];
                    geocoder.batchGeocode(finalAdress, function (err, results) {
                   
                      try {
                        for (i = 0; i < details.length; i++) {
                          var test = results[i]['value'];
                          lat = parseFloat(test[0]['latitude']);
                          lon = parseFloat(test[0]['longitude']);
                        
                        
                          distances[i] = calcCrow(userLat, userLon, lat, lon);
                        
                          
                        }
                      } catch (error) {
                      
                      }
                      var minIndex = 0;
                      var minimum = distances[minIndex];
                      var testString="";
                      for (i = 0; i < distances.length; i++) {
                        if (distances[i] < minimum) {
                          minIndex = i;
                        }
    
                      }
                    
                    
                      var polutant;
                       var strings=[];
                      var polutatntIndex;
                      var maxpollutantIndex = 0;
                    
                      var PM = 0;
                    
                    
                    
                      for (i = 0; i < json.records.length; i++) {
                      
                        if (json.records[i].station == out[minIndex]) {
                          var data = json.records[i];
                        
                          var curp = parseFloat(data.pollutant_avg);
                        
    
                          var temppolutant = data.pollutant_id;
                        
                        var counter=0;
                        switch (temppolutant) 
                        {
                          
                          case 'CO':
                          Finaldata['Carbon monoxide']=data.pollutant_avg;
                        
                          testString =testString+`, ${temppolutant}`
                          strings.push(` ${temppolutant}`);
                            break;
                          case 'OZONE':
                          Finaldata['OZONE']=data.pollutant_avg;
                          testString = testString +`, ${temppolutant}`;
                        
                          strings.push(`${temppolutant}`);
                          break;
                          case 'SO2':
                          Finaldata['Sulfur dioxide']=data.pollutant_avg;
                        
                          testString =testString+`, ${temppolutant}`;
                          strings.push(` ${temppolutant}`);
                          break;
                          case 'PM2.5':
                          Finaldata['Particulate matter 2.5']=data.pollutant_avg;
                        
                          testString =testString+`, ${temppolutant}`;
                          strings.push(`${temppolutant}`);
                          break;
                          case 'NO2':
                          Finaldata['Nitrogen dioxide']=data.pollutant_avg;
                        
                          testString =testString+`, ${temppolutant}`;
                          strings.push(` ${temppolutant}`);
                          break;
                          case 'PM10':
                          Finaldata['Particulate matter 10']=data.pollutant_avg;
                        
                          testString =testString+`, ${temppolutant}`;
                          strings.push(` ${temppolutant}`);
                          break;
                          case 'NH3':
                          Finaldata['Ammonia']=data.pollutant_avg;
                        
                          testString =testString+`, ${temppolutant}`;
                          strings.push(` ${temppolutant}`);
                          break;
                          default:
                           Finaldata['something'] = 'Others';
                    
                        }
                      
                          if (curp > maxpollutantIndex) {
                            maxpollutantIndex = curp;
                            polutant = temppolutant;
                          
                          
                          }
                        }
    
                      }
                     
                      Finaldata['polutant'] = polutant;
                      Finaldata['polution'] = maxpollutantIndex;
                      Finaldata['error'] = 0;
                      Finaldata['strings']=strings;
                      Finaldata['pls']=testString;
                    
                      resolve(Finaldata);
    
                    
                    
    
                    
                    });
    
    
    
                   
    
                  
    
    
                  }
    
                });
    
    
    
    
      
    
            
            }
            else {
              reject(request.status);
            }
          }
        };
        request.send();
      });
    }
    

  exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

  
