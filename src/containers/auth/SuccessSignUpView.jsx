import React, { Component } from 'react';

export default class SuccessSignUpForm extends Component{

	constructor(){
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event){
		event.preventDefault();

		this.props.router.replace('/confirm');		
	}

	render(){
		return(
			<div>
				<div className="header">
	              <h1>Success SignUp Form</h1>
	            </div>
	            <div className="content" id="content"> 
	            	<div>
	            		<h4>Thank you for Signed Up!</h4>
	            		<p>A confirmation code has been sent to your e-mail. Click in the button and put the codes</p>
	            	</div>
	            	<form onSubmit={this.handleSubmit}>			          			      
			          <button type="submit">Go to Confirm</button>			           	   	      
			        </form>             
	            </div>
            </div>
			);
	}
}