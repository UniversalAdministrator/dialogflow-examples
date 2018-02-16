//In Dialogflow type: "I need help with starting a program"
//This utterance will be translated to start een programma
//This intent should match a Dutch intent
//Response will be given in Dutch.

const translate = require('@google-cloud/translate')();
const dialogflow = require('dialogflow');

const projectId = 'demoing-826f1'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';

function detectTextIntent(projectId, sessionId, queries, languageCode, response) {

  // Instantiates a sessison client
  const sessionClient = new dialogflow.SessionsClient();

  if (!queries || !queries.length) {
    return;
  }

  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  let promise;

  // Detects the intent of the queries.
  for (const query of queries) {
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };

    if (!promise) {
      // First query.
      console.log(`Sending query "${query}"`);
      promise = sessionClient.detectIntent(request);
    } else {
      promise = promise.then(responses => {
        console.log('Detected intent');
        const response = responses[0];
        logQueryResult(sessionClient, response.queryResult);

        // Use output contexts as input contexts for the next query.
        response.queryResult.outputContexts.forEach(context => {
          console.log(context);
            // There is a bug in gRPC that the returned google.protobuf.Struct
          // value contains fields with value of null, which causes error
          // when encoding it back. Converting to JSON and back to proto
          // removes those values.
          //context.parameters = structjson.jsonToStructProto(
          //  structjson.structProtoToJson(context.parameters)
          //);
        });
        request.queryParams = {
          contexts: response.queryResult.outputContexts,
        };

        console.log(`Sending query "${query}"`);
        return sessionClient.detectIntent(request);
      });
    }
  }

  promise
    .then(responses => {
      console.log('Detected intent');
      console.log(sessionClient);
      var qResult = responses[0].queryResult;

      console.log(qResult.fulfillmentText);

      response.setHeader('Content-Type', 'application/json');
      response.status(200).send({
              translatedOutput: qResult.fulfillmentText
      });



    })
    .catch(err => {
      console.error('ERROR:', err);
    });

  // [END dialogflow_detect_intent_text]
}


  var getTranslation = function(text, callback){
      
        translate.detect(text, function(err, results) {

            var from = results.language;
            var to = 'en';

            if(from == 'en') to = 'nl';

            if (!err) {
                translate.translate(text, { 
                    from: from, 
                    to: to
                }, function(err, translation, apiResponse) {
                    if (!err) {
                        //console.log(apiResponse.data.translations);
                        if(callback) callback(translation, to);
                    } else {
                        console.log("[ERROR] - translate.translate");
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
     
  
  };

exports.index = function main(req, res) {

        var o = req.query;
        var text = o[Object.keys(o)[0]];
       
        if(text){
            

            getTranslation(text, function(translation, langCode){

                var lang = 'en-US';
                if(langCode == 'nl') lang = 'nl-NL';

                console.log(text);
                console.log(translation);
                console.log("Lang to: " + lang);
                

                //NOTE THAT THE GOOGLE TRANSLATION NEED TO MATCH A DIALOGFLOW ENTITY

                //res.setHeader('Content-Type', 'application/json');
                //res.status(200).send({
                //    "success": "ok",
                //    "result": [{
                //        lang1: text,
                //        lang2: translation
                //    }]
                //});

                //programmatically match an intent
                detectTextIntent(projectId, sessionId, [translation], lang, res);

            });

        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                "success": "ok",
                "result": "Missing query parameter"
            });
        }


};

