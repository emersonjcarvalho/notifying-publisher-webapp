import React, { Component } from 'react';

export default class SuccessConfirmUser extends Component{

	 constructor(){
	 	super();
	 	this.handleSubmit = this.handleSubmit.bind(this);
	 }

	handleSubmit(event){
		event.preventDefault();

		this.props.router.replace('/login');		
	}

	render(){
		return(
			<div>
				<div className="header">
	              <h1>Success Confirm Form</h1>
	            </div>
	            <div className="content" id="content"> 
	            	<div>
	            		<h3>Great!</h3>
	            		<p>E-mail successfully verified!</p>
	            		<p>Click in the button to Sign-In</p>
	            	</div>
	            	<form onSubmit={this.handleSubmit}>			          			      
			          <button type="submit">Go to Login</button>			           	   	      
			        </form>             
	            </div>
            </div>
			);
	}
}