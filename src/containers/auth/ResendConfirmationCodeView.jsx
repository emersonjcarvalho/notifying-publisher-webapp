import React, { Component } from 'react';
import ErrorHandler from '../../exceptions/ErrorHandler';
import {AuthService} from '../../auth/AuthService';

let Auth = null;

export default class ResendConfirmationCode extends Component{

	constructor(){
		super();
		Auth = new AuthService();

		this.handleResendConfirmation = this.handleResendConfirmation.bind(this);
	}

	handleResendConfirmation(){		

		const username = this.props.username;
		const setError = this.props.setError;

		Auth.resendConfirmationCode(username, function(error, success){
			if(error){									
				new ErrorHandler().pushError(error);				
				setError(true);
				return;
			}			
		});
	}

	render(){
		return(
			<div>		        
	        	<p>Missing your code?</p>	        	        	
				<button type="submit" onClick={this.handleResendConfirmation}>Resend Confirmation Code</button>	        	
            </div>
			);
	}
}