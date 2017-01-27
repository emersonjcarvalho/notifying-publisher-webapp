import PubSub from 'pubsub-js';
import AppConfig from '../config/app-config';

export default class ErrorHandler{

	pushError(error){
		//if(error.__type === 'InvalidParameterException')
			PubSub.publish(AppConfig.TOPIC_ERROR, error.message);
	}

	cleanError(){
		var emptyMessage = '';
		PubSub.publish(AppConfig.TOPIC_CLEAN_ERROR, emptyMessage);
	}
}