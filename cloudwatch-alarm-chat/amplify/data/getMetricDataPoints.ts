import { CloudWatch } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatch();

export const handler = async (event: any) => {
    try {
        const { namespace, metricName, dimensionName, dimensionValue } = event.arguments;

        // Calculate time range for last hour
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - (60 * 60 * 1000)); // 1 hour ago

        const params = {
            MetricDataQueries: [
                {
                    Id: 'm1',
                    MetricStat: {
                        Metric: {
                            Namespace: namespace,
                            MetricName: metricName,
                            Dimensions: [
                                {
                                    Name: dimensionName,
                                    Value: dimensionValue
                                }
                            ]
                        },
                        Period: process.env.METRIC_PERIOD ? parseInt(process.env.METRIC_PERIOD) : 300, // Period in seconds from env var
                        Stat: 'Average'
                    }
                }
            ],
            StartTime: startTime,
            EndTime: endTime
        };

        const data = await cloudwatch.getMetricData(params);
        if (!data.MetricDataResults || data.MetricDataResults.length === 0) {
            return {
                statusCode: 404,
                error: 'No metric data found'
            }
        }

        const label = data.MetricDataResults[0].Label
        const datapoints = data.MetricDataResults[0].Timestamps?.map((timestamp, index) => {
            return {
                timestamp: timestamp,
                value: data.MetricDataResults![0].Values![index]
            }
        });

        const returnObject = {
            statusCode: 200,
            label: data.MetricDataResults[0].Label,
            datapoints: datapoints,
        };
        return returnObject;

    } catch (error) {
        console.log('Error getting datapoints:', error)
        return {
            statusCode: 500,
            error: 'Internal server error'
        };
    }
};
