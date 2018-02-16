ING Demo - Cloud Function Demo
===============================================================================

This is a cloud function which will run in the background of Dialogflow.
It takes an excel sheet, which is uploaded in Google Cloud Storage.
It transforms it to JSON, and then to a JS map.

In Dialogflow we will ask ask for a number, ask for a color. Which will be send as parameters
to the Cloud Function. The Cloud Function will return the cell value.
Dialogflow will show that response to the user of the chatbot.

Setup
-------------------------------------------------------------------------------

#. In the Cloud console upload the xslx file to a storage bucket.

Make sure the **Share publicly** checkbox is enabled. Note the public link.

#. In the Cloud console, navigate to Cloud Functions.

    If it's the first time use, enable the cloud functions API.

#. Choose: `Create Function`

    Specify the following:

        Name: **demo-ing-search-in-excel** (or **dlp-redact**)
        Region: **us-central1**
        Memory: **512 MB**
        Timeout: **120 sec**
        Trigger: **HTTP**
        Function to Execute: **index**

#. Choose: `Create Function`

    Specify the following:

        Name: **demo-ing-router** (or **dlp-redact**)
        Region: **us-central1**
        Memory: **256 MB**
        Timeout: **60 sec**
        Trigger: **HTTP**  
        Function to Execute: **router**      

#. In the inline editor copy the contents of **index.js** in the `index.js` tab.

    This is the JavaScript / Node.js code, which will run an HTTP Express function.

#. In the inline editor copy the contents of **package.json** in the `package.json` tab.

    This is the npm package.json file. Which loads the DLP Google Cloud package.

#. In the inline editor copy the contents of **index.js** in the `index.js` tab.

    This is the JavaScript / Node.js code, which will run an HTTP Express function. It contains the routes to the various Cloud Functions.   

#. In the inline editor copy the contents of **package.json** in the `package.json` tab.

    This is the npm package.json file. Which loads the DLP Google Cloud package.

#. Set the Stage bucket

    In case you don't have a Google Cloud Storage bucket yet, create a new bucket called:
    *yourname-examples-cloudfunctions*.

    This bucket will be used to upload this version of your function.

#. Enter the function to execute.

    This will be `index`.

#. Click create.

    It will return you an url, similar to: https://us-central1-[yourname]-examples.cloudfunctions.net/demo-ing-search-in-excel

    Visit the page in the browser, to check the response.

    Use the following parameter string: 
    ?color=red&number=2;

#. In case you like to try it out on a local cloud functions emulator install:

    `sudo npm install -g @google-cloud/functions-emulator`

    Then run the emulator: `sudo functions start` (or stop or kill)

    And deploy as how you usually would: `functions deploy inspect --trigger-http` but the file needs to be called index.js

    https://cloud.google.com/functions/docs/emulator

    You need to have an .env file in your root, which points to a service account key, and it needs to be enabled in index.js.

# Import the Dialogflow project. Note the **[TABLE-FULFILLMENT]** intent, the **category** and **color** entities,
and the custom **fulfillment**, which points to the Cloud Function router.

