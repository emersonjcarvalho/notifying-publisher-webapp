import React, { Component } from 'react';
import ResendConfirmationCodeView from './ResendConfirmationCodeView';

import ErrorMessageContainer from '../../exceptions/ErrorMessageContainer';
import ErrorHandler from '../../exceptions/ErrorHandler';

//import Auth from '../../auth/Authentication';
import {AuthService} from '../../auth/AuthService';

let Auth = null;

export default class ConfirmUser extends Component{
	
	constructor(props) {		
   		super(props);
   		Auth = new AuthService();
   		
		this.state = {
			error : false, //flag  error in the container
			email : '',
			code : ''			
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.setFCode = this.setFCode.bind(this);
		this.setError = this.setError.bind(this);
	}

	componentDidMount(){
		let username = Auth.getUserConfirmationTemp() == null ? '' : Auth.getUserConfirmationTemp().user.username;		
		this.setState({email : username});		
		//if(this.state.user.userConfirmed === true)	
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

		const code = this.state.code;
		const username = this.state.email;

		Auth.confirmUser(username, code, function(error, success){
			if(error){
				this.setState({error : true});		
				new ErrorHandler().pushError(error);
				return;
			}
			//success === "SUCCESS"
			this.props.router.replace('/success-confirm');	

		}.bind(this));
	}

	setFCode(event){
		this.setState({code : event.target.value});
	}

	setError(state){		
		this.setState({error : state});		
	}

	render(){
		return(
			<div>
				<div className="header">
	              <h1>Confirm User MODAL</h1>
	            </div>
	            <div className="content" id="content"> 
	            	<form onSubmit={this.handleSubmit}>
						<table>
							<tbody>
								<tr>
									<td>E-mail:</td>
									<td><b>{this.state.email}</b></td>
								</tr>
								<tr>
									<td>Code:</td>
									<td><input type="text" value={this.state.code} onChange={this.setFCode} placeholder="#####" /></td>
								</tr>
							</tbody>
						</table>	            				          		        
			          <br />
			          <button type="submit">confirm</button>
			           <ErrorMessageContainer />		   	       
			        </form>
			        <hr />
			      	<div>
			      		<ResendConfirmationCodeView 
			      			username={this.state.email} 
			      			setError={this.setError}			   
			      			/>
			      	</div>           
	            </div>
            </div>
			);
	}
}