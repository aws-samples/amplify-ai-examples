# Travel Planner App

https://github.com/user-attachments/assets/da3ba7d3-49f0-498a-9fee-f2493938771f

A comprehensive travel planning application built with Expo and TypeScript, featuring AI-assisted trip planning, destination discovery, and activity management.

## 🚀 Technology Stack

- **Frontend:** Expo (React Native)
- **Language:** TypeScript
- **Backend:** AWS Amplify Gen 2
  - **Authentication:** Amazon Cognito
  - **Database:** Amazon DynamoDB
  - **Storage:** Amazon S3
  - **AI Integration:** Amazon Bedrock
  - **In-app messaging:** AWS End User Messaging

## 🔧 Setup & Installation

1. **Prerequisites**
```bash

- Preferably latest versions of
    - node
    - npm
    - expo-cli
- A configured AWS account on your development machine. 
- A mobile test device or emulator/simulator
```

2. **Installation**
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install --force

3. **Running the Sandbox for AWS Amplify**
```bash
npx ampx sandbox
```
## 🔄 Development Workflow

1. **Running the App**
```bash
# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## 📁 Project Structure

```
src/
├── components/
│   └── common/
│       └── Header/
│           ├── Header.tsx
│           ├── Header.styles.ts
│           └── index.ts
├── navigation/
│   ├── AppNavigator.tsx
│   ├── TabNavigator.tsx
│   ├── navigationTypes.ts
│   ├── navigationOptions.tsx
│   └── index.ts
├── screens/
│   ├── Home/
│   │   ├── HomeScreen.tsx
│   │   ├── HomeScreenComponents.tsx
│   │   ├── HomeScreenHooks.ts
│   │   └── styles.ts
│   ├── AIAssistant/
│   │   ├── AIAssistantScreen.tsx
│   │   ├── AIAssistantComponents.tsx
│   │   ├── AIAssistantHooks.ts
│   │   └── styles.ts
│   ├── Profile/
│   │   ├── ProfileScreen.tsx
│   │   ├── ProfileComponents.tsx
│   │   ├── ProfileHooks.ts
│   │   └── styles.ts
│   ├── TripDetail/
│   │   ├── TripDetailScreen.tsx
│   │   ├── TripDetailComponents.tsx
│   │   ├── TripDetailHooks.ts
│   │   └── styles.ts
│   ├── ActivityDetail/
│   │   ├── ActivityDetailScreen.tsx
│   │   ├── ActivityDetailComponents.tsx
│   │   ├── ActivityDetailHooks.ts
│   │   └── styles.ts
│   └── DestinationDetail/
│       ├── DestinationDetailScreen.tsx
│       ├── DestinationDetailComponents.tsx
│       ├── DestinationDetailHooks.ts
│       └── styles.ts
```

## 🎯 Features

### Authentication
- User sign-up and sign-in functionality
- Profile management with customizable avatar

### In-App Messaging
- Integrated AWS Amplify In-App Messaging
- Real-time message synchronization
- Custom message display component
- Campaign-based messaging support

### Navigation
- Bottom tab navigation for main screens
- Stack navigation for detailed views
- Type-safe navigation using TypeScript

### Home Screen
- Display upcoming trips
- Show popular destinations
- List available activities
- Quick access to AI travel planning

### AI Assistant
- AI-powered travel planning
- Natural language interaction
- Automated trip creation
- Intelligent activity suggestions

### Profile Management
- User information display
- Profile picture management
- Trip history
- AWS S3 integration for image storage

### Trip Management
- Detailed trip information
- Flight details
- Accommodation information
- Associated activities

## 📱 Screen Details

### HomeScreen
- Displays upcoming trips
- Shows popular destinations
- Lists available activities
- Features a floating action button for new trip creation

### AIAssistantScreen
- Chat interface for AI interaction
- Natural language processing for trip planning
- Automated creation of trips, activities, and bookings

### ProfileScreen
- User information display
- Profile picture management
- Recent trips display
- Account settings

### TripDetailScreen
- Comprehensive trip information
- Flight details
- Accommodation information
- Associated activities

### ActivityDetailScreen
- Detailed activity information
- Duration and pricing
- Location details
- Availability status

### DestinationDetailScreen
- Destination overview
- Local activities
- Climate information
- Travel recommendations

## 🔐 Type Safety

The application uses TypeScript throughout, with comprehensive type definitions for:
- Navigation parameters
- API responses
- Component props
- State management
- AWS Amplify interactions

## 🎨 Styling

- Consistent color scheme throughout the app
- Responsive design using StyleSheet
- Shared components for consistent UI elements
- Platform-specific adjustments where necessary

## 📦 State Management

- Local state management using React hooks
- AWS Amplify for data persistence
- Custom hooks for business logic
- Proper type definitions for state

## 🛡 Best Practices

1. **Code Organization**
   - Separate concerns (components, hooks, styles)
   - Consistent file naming
   - Modular component structure

2. **Type Safety**
   - Comprehensive TypeScript usage
   - Proper type definitions
   - Interface segregation

3. **Performance**
   - Proper use of useMemo and useCallback
   - Efficient re-rendering strategies
   - Optimized list rendering

4. **Error Handling**
   - Comprehensive error catching
   - User-friendly error messages
   - Graceful fallbacks


## 📝 License

This library is licensed under the MIT-0 License. See the LICENSE file.
