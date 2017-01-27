import PubSub from 'pubsub-js';
import AppConfig from '../config/app-config';

export default class InvalidSessionHandler{

	invalidate(reason){
		//if(error.__type === 'InvalidParameterException')
			PubSub.publish(AppConfig.TOPIC_INVALID_SESSION, reason);
	}
}