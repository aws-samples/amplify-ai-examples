# Amplify AI Example: Story Teller With Claude and Amazon Bedrock Knowledge Base

This is a Vite React application that displays stories. It also has a chat interface to query external APIs, including Amazon Bedrock Knowledge Base.

This example uses:

- Amplify Gen2
- React Router
- shadcn/ui
- Tailwind

## Getting Started

### Prerequisites

- Node.js 18+ installed
- AWS account that has been set up for AWS Amplify and has access to the Claude models in Amazon Bedrock
- If you like to test the News API chat, you'll need to sign up for a [News API](https://newsapi.org) account. You'll then need to add the NEWS_API_KEY as a [secret](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/).

### Installation

1. Clone the repository and `cd` into the `story-teller` directory
2. Install the dependencies with your favorite Javscript package manager. For example, `npm install`
3. (optional) Add the News API key `npx ampx sandbox secret set NEWS_API_KEY`
4. Setup Amazon Bedrock Knowledge Base. Enter your KB_ID and KB_REGION in the `amplify/backend.ts` file and update the `amplify/data/kbResolver.js` file with the correct `resourcePath` with the KB_ID.
5. Run `npx ampx sandbox` to spin up a sandbox cloud backend
6. Run `npm run dev` to start up the Vite React app locally.
