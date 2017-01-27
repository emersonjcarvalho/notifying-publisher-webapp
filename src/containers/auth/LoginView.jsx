import React, { Component } from 'react';
import { Link } from 'react-router';
import ErrorMessageContainer from '../../exceptions/ErrorMessageContainer';
import ErrorHandler from '../../exceptions/ErrorHandler';

import {AuthService} from '../../auth/AuthService';

let Auth = null;

//export default withRouter(Login);
export default class LoginForm extends Component{

	constructor(){	
		super();

		Auth = new AuthService();	

		this.state = {
			error	: 	false, //ERROR Login Flow
			email 	: 	'emersonjcarvalho@gmail.com',
			pass	: 	''
		};

		this.setEmail = this.setEmail.bind(this);
		this.setPass = this.setPass.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.logoutApp = this.logoutApp.bind(this);
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

	handleSubmit(event) {
      event.preventDefault();

      this.resetForm();
		  this.uiFieldsValidation();

      const username = this.state.email;
      const password = this.state.pass;

      let promiseLogin = Auth.login(username, password);

      promiseLogin
      	.then(function(result){
      		
          const { location } = this.props;

          if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname);
          } else {
            this.props.router.replace('/');
          }      		

      	}.bind(this))
      	.catch(function(error){      		
      		this.setState({error : true});				
			new ErrorHandler().pushError(error);      		
      	}.bind(this));
    }

    setEmail(event){
    	this.setState({email : event.target.value.trim()});
    }

    setPass(event){
    	this.setState({pass : event.target.value.trim()});
    }

    logoutApp(){    	
    	const username = this.state.email;
    	Auth.logoutApp(username, function(error){
    		if(error){
				alert(error);
    			return;    			
    		}
    		//SUCCESS LOGOUT
    	});    	
    }

	render(){
		return(
			<div>
				<div className="header">
	              <h1>Login</h1>
	            </div>
	            <div className="content" id="content"> 

	            	<form onSubmit={this.handleSubmit}>
			          <label><input type="text" value={this.state.email} onChange={this.setEmail} placeholder="email" /></label>
			          <br />
			          <label><input type="password" value={this.state.pass} onChange={this.setPass}  placeholder="password" /></label>
			          <br />
			          <button type="submit">login</button>			          
			        </form>   
			        <div>
		            	<ErrorMessageContainer />
		            </div>          
	            </div>
	            <hr />
	            <div>
	            	<li><Link to="/signup">Go Sing-Up Page</Link></li>
	            </div>
            </div>
			);
	}
}