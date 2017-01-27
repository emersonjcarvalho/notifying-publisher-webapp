import React, { Component } from 'react';
import ErrorMessageContainer from '../../exceptions/ErrorMessageContainer';
import ErrorHandler from '../../exceptions/ErrorHandler';
import {AuthService} from '../../auth/AuthService';

let Auth = null;

export default class SignUpForm extends Component{

	constructor(){
		super();
		Auth = new AuthService();
		
		this.state = {
			error	: 	false, //flag  error in the container
			email 	: 	'',
			pass	: 	''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.setFEmail = this.setFEmail.bind(this);
		this.setFPass = this.setFPass.bind(this);
	}

	uiFieldsValidation(){
		console.log('//TODO: Implment Validation in the User Inteface Html5 or JS');
	}

	resetForm(){
		if(this.state.error){
			this.setState({error:false});
			new ErrorHandler().cleanError();
		}
	}

	handleSubmit(event){
		event.preventDefault();

		this.resetForm();
		this.uiFieldsValidation();

		const email = this.state.email.trim();
    	const password = this.state.pass.trim();

		Auth.signingUp(email, password, function(error, cognitoUserConfirmation){
			if(error){
				this.setState({error : true});				
				new ErrorHandler().pushError(error);
				return;
			}				
						
			this.handleSignUpSuccess(cognitoUserConfirmation);	

		}.bind(this));		
	}

	handleSignUpSuccess(cognitoUserConfirmation){
			
		if(cognitoUserConfirmation !== "SUCCESS"){					
			this.props.router.replace('/confirm');
			return;
		}

		this.props.router.replace('/login');		
	}



	setFEmail(event){
		this.setState({email : event.target.value});
	}

	setFPass(event){
		this.setState({pass : event.target.value});
	}

	render(){
		return(
			<div>
				<div className="header">
	              <h1>SignUpForm</h1>
	            </div>
	            <div className="content" id="content"> 
	            	<form onSubmit={this.handleSubmit}>
			          <label><input type="text" value={this.state.email} onChange={this.setFEmail} placeholder="email" /></label>
			          <br />
			          <label><input type="password" value={this.state.pass} onChange={this.setFPass}  placeholder="password" /></label>
			          <br />
			          <button type="submit">login</button>
			           <ErrorMessageContainer />		   	       
			        </form>             
	            </div>
            </div>
			);
	}
}