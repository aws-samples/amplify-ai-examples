import { CloudWatch } from '@aws-sdk/client-cloudwatch';
import { Schema } from './resource';

const cloudwatch = new CloudWatch();

export const handler: Schema["getAlarms"]["functionHandler"] = async (event) => {
    const { prefix = '' } = event.arguments;
    try {
        const response = await cloudwatch.describeAlarms({
            AlarmNamePrefix: prefix || undefined
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Successfully retrieved CloudWatch alarms',
                alarms: response.MetricAlarms
            })
        };

    } catch (error) {
        console.error('Error retrieving CloudWatch alarms:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error retrieving CloudWatch alarms',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};