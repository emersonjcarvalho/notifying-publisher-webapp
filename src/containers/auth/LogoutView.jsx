import React, { Component } from 'react';
import {AuthService} from '../../auth/AuthService';

const Auth = new AuthService();

export default class Logout extends Component {
	render(){
		return( 
			<div>Please Wait...</div>
			);
	}

	componentDidMount(){		
		Auth.logoutApp((error)=>{
    		if(error){
				alert(error);
    			return;    			
    		}    		
    	}); 		
		this.props.router.replace('/');	
	}
}