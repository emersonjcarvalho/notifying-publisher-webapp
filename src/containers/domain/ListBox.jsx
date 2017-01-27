import React, { Component } from 'react';
import { AWSLambdaService } from '../../services/AWSLambdaService';

let AwsLambdaClient = null;

class ListBox extends Component{
	constructor(){
		super();	
		AwsLambdaClient = new AWSLambdaService();

		this.state = {lambdaResult : '????'};
		this.callLambdaFunc = this.callLambdaFunc.bind(this);		
	}

	callLambdaFunc(){
		let rthis = this;

		let dataInput = '{"key1": "1"}';
		
		AwsLambdaClient.invokeFunction(dataInput, function(error, data){
				if(error){
					alert(error);					
					return;
				}

			    rthis.setState({lambdaResult : data});
		});
	}

	render(){
		return(
			<div>
				<div className="header">
	              <h1>List</h1>
	            </div>
	            <div className="content" id="content"> 
	            	<p>Lambda Payload Result: <strong>{this.state.lambdaResult}</strong></p> 
	            	<p>
	            		<button onClick={this.callLambdaFunc} >callLambdaFunc</button>           
	            	</p>	
	            </div>
            </div>
		);
	}
}
export default ListBox;