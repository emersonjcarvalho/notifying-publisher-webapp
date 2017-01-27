import AWS from 'aws-sdk';
import AWSCognito from 'aws-sdk';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js'; // eslint-disable-line no-unused-vars
import AppConfig from "../config/app-config";
import { InMemorySession } from "./InMemorySession";

const ERROR_USER_NOT_LOGGED = 'User is not logged in!';

//Helper to enclose Persiste Cognito User Logic
 function persisteCognitoUserConfirmation(){
	return {
		set : function(cognitoUserConfirmation){			 	
				localStorage.setItem(AppConfig.LOCAL_STORAGE_KEY_COGNITO_USER_CONFIRMATION, JSON.stringify(cognitoUserConfirmation));
		}
	,	get : function(){
			return JSON.parse(localStorage.getItem(AppConfig.LOCAL_STORAGE_KEY_COGNITO_USER_CONFIRMATION));
		}
	,	remove : function(){
			localStorage.removeItem(AppConfig.LOCAL_STORAGE_KEY_COGNITO_USER_CONFIRMATION);
		}	
	}
}

export class AuthService{	

	constructor(){
 		// Required as mock credentials
      	AWSCognito.config.update({accessKeyId: 'mock', secretAccessKey: 'mock'});		
		AWSCognito.config.region = AppConfig.REGION_AWS;		
 
		this.poolData = {
		    UserPoolId : AppConfig.USER_POOL_ID_AWS, // your user pool id here
		    ClientId : AppConfig.CLIENT_ID_AWS // your app client id here
		};

		this.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
	}

	setCredentials(jwtToken){				
	    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	        IdentityPoolId : AppConfig.IDENTITY_POOL_ID_AWS, // your identity pool id here	        
	        Logins : {
	            // Change the key below according to the specific region your user pool is in.
	            [AppConfig.COGNITO_IDP_AWS] : jwtToken
	        }

	    });		
	}

	//Use case 17. Integrating User Pools with Cognito Identity.
	getCredentials(callback){
		const that = this;

	    var cognitoUser = this.userPool.getCurrentUser();

	    if (cognitoUser != null) {
	        cognitoUser.getSession(function(err, result) {
	            if (result) {	                

	                let jwtToken = result.getIdToken().getJwtToken();
	                that.setCredentials(jwtToken);                   		       
			        InMemorySession.setItem(InMemorySession.COGNITO_JWT, jwtToken);	                
	            }
	        });
	    }
	    //call refresh method in order to authenticate user and get new temp credentials
	    AWS.config.credentials.refresh((error) => {
	        if (error) {	            
	            callback(error, null);
	        } else {	            
	            callback(null, true);

	        }
	    });		
	}

	//Step 5: Signing Users in to Your App
	login(username, password){
		const that = this;
		return new Promise((resolve, reject) => {  

			let authenticationData = {
		        // Username : username,
		        Password : password,
		    };

		    let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
		   		    
		    let userData = {
		        Username : username,
		        Pool : this.userPool
		    };

		    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
											          
		    cognitoUser.authenticateUser(authenticationDetails, {
		        onSuccess: function (result) {			        		       		            		            		           
			        let jwtToken = result.getAccessToken().getJwtToken();			
			       	that.setCredentials(jwtToken);                   		       
			        InMemorySession.setItem(InMemorySession.COGNITO_JWT, jwtToken);  		            
			            
		            resolve(result);
		        },

		        onFailure: function(err) {		            		            
		            console.log(JSON.stringify(err));
		            reject(err);
		        },
		    });
	    });
	}

	//Use case 16. Retrieving the current user from local storage.
	userSession(callback){
		const that = this;
		const cognitoUser = this.userPool.getCurrentUser();		

	    if (cognitoUser != null) {	    	
	        cognitoUser.getSession(function(err, session) {
	            if (err) {	            	
	            	callback(err, null);
	            	return;
	            }	           
	            
		        let jwtToken = session.getIdToken().getJwtToken();			
		       	that.setCredentials(jwtToken);                   		       
		        InMemorySession.setItem(InMemorySession.COGNITO_JWT, jwtToken);            	            
	            callback(null, session);
	        });
	    }else{
	    	let err = ERROR_USER_NOT_LOGGED;
	   	 	callback(err, null);
	    }
	}

	userAttributes(callback){
		const cognitoUser = this.userPool.getCurrentUser();			
		cognitoUser.getUserAttributes(function(err, result) {
	        if (err) {	        	
	            callback(err, null);
	            return;
	        }

	        for (let i = 0; i < result.length; i++) {
	            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
	        }
	        callback(null, result);
	    });
	}

	//Step 7: Getting Credentials to Access AWS Resources for an App User
    logoutApp(callback){    	    	
    	const cognitoUser = this.userPool.getCurrentUser();    
    	
    	if(cognitoUser == null){    		
    		callback(ERROR_USER_NOT_LOGGED);
    		return;
    	}
    	
    	cognitoUser.signOut();    	    	
    	InMemorySession.clear();
    }

    getUserConfirmationTemp(){		
		return persisteCognitoUserConfirmation().get();
	}

//Step 3: Signing up Users for Your App
	signingUp(email, password, callback){

		const username = email;

		var attributeList = [];

	    var dataEmail = {
	        Name : 'email',
	        Value : email
	    };

	    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

	    attributeList.push(attributeEmail);    

	    this.userPool.signUp(username, password, attributeList, null, function(err, result){
	        if (err) {   	        	     	           
	            callback(err, null);            
	            return;
	        }

	        persisteCognitoUserConfirmation().set(result);	        
	        callback(null, result);        	        
	    });
	}

//Step 4: Confirming Users for Your App
	confirmUser(username, code, callback){
		var userData = {
			Username : username,
			Pool : this.userPool
		};

		var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
		cognitoUser.confirmRegistration(code, true, function(err, result) {
			if (err) {				
				callback(err, null);
				return;
			}		   			  			
			callback(null, result); 
			persisteCognitoUserConfirmation().remove();
		});
	}

	resendConfirmationCode(username, callback){	
		var userData = {
			Username : username,
			Pool : this.userPool
		};

		var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
		
		cognitoUser.resendConfirmationCode(function(err, result) {
			if (err) {				
				callback(err, null);
				return;
			}		 			  			  		
			callback(null, result); 
		});
	}
}