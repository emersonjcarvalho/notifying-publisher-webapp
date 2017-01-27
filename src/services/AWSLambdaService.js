import AWS  from 'aws-sdk';
import { AuthService } from '../auth/AuthService';

const LAMBDA_JS_API_VERSION = '2015-03-31';
const FUNC_NAME_TEST = 'TutorialServerlessWebsite';
const FUNC_REGION_TEST = 'us-west-2';

export class AWSLambdaService{
	constructor(){
		this.Auth = new AuthService();
	}

	invokeFunction(dataInput, callback){			
		this.Auth.getCredentials(function(error, success){
			if(error){				
				//new InvalidSessionHandler().invalidate(error);
				callback(error, null);
				return;
			}		
	
			let lambda = new AWS.Lambda({region: FUNC_REGION_TEST, apiVersion: LAMBDA_JS_API_VERSION});
			// create JSON object for parameters for invoking Lambda function
			let pullParams = {
			  FunctionName : FUNC_NAME_TEST,
			  InvocationType : 'RequestResponse',
			  LogType : 'None',
			  Payload : dataInput
			};

			// create variable to hold data returned by the Lambda function
			let pullResults;

			lambda.invoke(pullParams, function(error, data) {
			  if (error) {
			    prompt(error);
			    console.log('callLambdaFunc - error: '+JSON.stringify(error));
			    callback(error, null);
			  } else {
			    pullResults = JSON.parse(data.Payload);			    			    
			    callback(null, pullResults);
			  }
			});
		});
	}
}