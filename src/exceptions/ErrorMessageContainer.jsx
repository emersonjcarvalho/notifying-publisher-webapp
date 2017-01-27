import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import AppConfig from '../config/app-config';

export default class ErrorMessageContainer extends Component{

	constructor(){
		super();
		//this.state = {error : {__type:'', message:''}};
		this.state = {messageError : ''};	
	}

	componentDidMount(){
		//Subscribe to Push ERROR Messages
		let rthis = this;
		PubSub.subscribe(AppConfig.TOPIC_ERROR, function(topic, newError){
			rthis.setState({messageError : newError});
		});

		//Subscribe to Clean ERROR		
		PubSub.subscribe(AppConfig.TOPIC_CLEAN_ERROR, function(topic){
			rthis.setState({messageError : ''});
		});
	}

	render(){
		return (
			<div>
				<span className="errorCss" style={{color: "red"}}>{this.state.messageError}</span>
			</div>
			);
	}

}
