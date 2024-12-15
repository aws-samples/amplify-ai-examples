# CloudWatch Alarms Chat: AI-Powered Monitoring Assistant

CloudWatch Alarms Chat is a Next.js application that provides an AI-powered conversation interface for interacting with AWS CloudWatch alarms. 

The application allows users to query alarm information, describe specific alarms, and retrieve metric data points through a chat interface. 

This example uses:

- AWS Amplify Gen2
- NextJS App router
- Mantine UI components

Key Files:
- `amplify/backend.ts`: Defines the Amplify backend configuration
- `amplify/data/resource.ts`: Contains the data schema with conversations and generation 
- `src/app/page.tsx`: Main page component for the application
- `src/components/Chat.tsx`: Chat component for the AI conversation interface

## Usage Instructions

### Installation

Prerequisites:
- Node.js 18+ installed
- AWS account that has been set up for AWS Amplify and has access to Anthropic Claude models in Amazon Bedrock

Steps:
1. Clone the repository and `cd` into the `claudwatch-alarms-chat` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Run Amplify sandbox to spin up a sandbox cloud backend
   ```
   npx ampx sandbox
   ```
   You can optionally add `--stream-function-logs` to see the logs stream in your CLI
   ```
   npx ampx sandbox --stream-function-logs
   ```
   Once deployment is complete, Amplify sandbox enters watch mode. Any changes to tracked files will trigger a new deployment. You can exit if you don't plan to make further modifications.
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000` (port may be different)

### Common Use Cases

1. Querying CloudWatch Alarms:
   - In the chat interface, ask: "Show me all CloudWatch alarms in oregon"

2. Describing a Specific Alarm:
   - Ask: "Describe the alarm named 'High CPU Utilization'"

3. Retrieving Metric Data:
   - Request: "Show me the datapoints related to this alarm"

## Infrastructure

The project uses AWS Amplify to define and manage its infrastructure. Key resources include:

Amplify Functions:
- `getAlarms`: Retrieves CloudWatch alarms
- `describeAlarm`: Provides detailed information about a specific alarm
- `getMetricDataPoints`: Fetches metric data points for CloudWatch metrics

IAM Policies:
- Policies are attached to functions to allow:
  - Invoking Bedrock models
  - Describing CloudWatch alarms
  - Retrieving CloudWatch metric data

Auth:
- Uses Amazon Cognito for user authentication
