'use strict';

const projectId = 'demo-ing-search-in-excel'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';
 
// Instantiate a DialogFlow client.
const DialogflowApp = require('actions-on-google').DialogflowApp;
const request = require('request');

const fetchResponse = function(url, res){
    console.log(url);
 
    request(url, function (error, response, body) {
        if(response && response.statusCode == 200){
            //var data = JSON.parse(body);
  
            console.log(body);

            sendResponse(body, res);
        
        } else {
            sendResponse("Something went wrong in the router when requesting an URL.", res);
        }
    });
 };

exports.router = function (req, res){
    const assistant = new DialogflowApp({request: req, response: res});
    var result = req.body.queryResult;

    //https://dialogflow.com/docs/examples/contexts
    //console.log(result.parameters);

    if(result){

      var action = (result.action) ? result.action : 'default';
  
        console.log(action);

      var url = ``;
      switch (action) {
          case 'table-whats-the-code':
  
            var color = result.parameters.color;
            var cat = result.parameters.category;
            url = `https://us-central1-leeboonstra-blogdemos.cloudfunctions.net/ingdemo?color=${color}&category=${cat}`;
  
          break;
          case 'multilang':
  
          var task = result.parameters.task;
          url = `https://us-central1-leeboonstra-blogdemos.cloudfunctions.net/ingdemo-multilang?task=${task}`;
          
          break;
          case 'another-action': //mention the action name
  
              url = ``;
  
          break;
          default:
              console.log('No Dialogflow action matches the Cloud Function Router.');
      }
  
      fetchResponse(url, res);
  
    } else {
        var text = "POST parameters and action are missing.";
        sendResponse(text, res);
    }
};

function sendResponse (responseToUser, response) {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
        let responseJson = {fulfillmentText: responseToUser}; // displayed response
        response.json(responseJson); // Send response to Dialogflow
    } else {
        // If the response to the user includes rich responses or contexts send them to Dialogflow
        let responseJson = {};
        // Define the text response
        responseJson.fulfillmentText = responseToUser.fulfillmentText;
        // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
        if (responseToUser.fulfillmentMessages) {
            responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
        }
        // Optional: add contexts (https://dialogflow.com/docs/contexts)
        if (responseToUser.outputContexts) {
            responseJson.outputContexts = responseToUser.outputContexts;
        }
        // Send the response to Dialogflow
        console.log('Response to Dialogflow: ' + JSON.stringify(responseJson));
        response.json(responseJson);
    }
}
