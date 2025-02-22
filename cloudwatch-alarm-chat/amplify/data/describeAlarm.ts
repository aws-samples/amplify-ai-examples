import { CloudWatch } from '@aws-sdk/client-cloudwatch';
import { Schema } from './resource';

const cloudwatch = new CloudWatch();

export const handler: Schema["describeAlarm"]["functionHandler"] = async (event) => {
  try {
    const {alarmName = ""} = event.arguments;

    if (!alarmName) {
      return {
        statusCode: 400,
        error: 'Alarm name is required' 
      };
    }

    const params = {
      AlarmNames: [alarmName]
    };

    const response = await cloudwatch.describeAlarms(params);

    if (!response.MetricAlarms || response.MetricAlarms.length === 0) {
      return {
        statusCode: 404,
        error: 'Alarm not found',
      };
    }
    const alarmDetails = response.MetricAlarms[0];

    const returnObject = {
        name: alarmDetails?.AlarmName,
        description: alarmDetails?.AlarmDescription,
        state: alarmDetails?.StateValue,
        threshold: alarmDetails?.Threshold,
        lastUpdate: alarmDetails?.StateUpdatedTimestamp ? new Date(alarmDetails.StateUpdatedTimestamp).toISOString() : null,
        namespace: alarmDetails?.Namespace,
        dimensions: alarmDetails?.Dimensions,
        deeplink: alarmDetails?.AlarmArn ? `https://${alarmDetails.AlarmArn.split(':')[3]}.console.aws.amazon.com/cloudwatch/home?region=${alarmDetails.AlarmArn.split(':')[3]}#alarmsV2:alarm/${alarmDetails.AlarmName}` : null
    }
    
    return {
        statusCode: 200,
        alarmDetails: JSON.stringify(returnObject)
    }

  } catch (error) {
    console.error('Error describing alarm:', error);
    return {
      statusCode: 500,
      error: 'Internal server error' 
    };
  }
};
