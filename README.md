# Motherly Mantras 👶💕

A beautiful mother and baby tracking app built with Expo and React Native, featuring a stunning claymorphism design.

## Features

- 🎨 **Beautiful Claymorphism UI** - Soft, puffy elements with gentle shadows and pastel colors
- 🔐 **Simple Email Authentication** - Secure login with just your email address
- 👶 **Baby Profile Setup** - Easy setup with name and date of birth
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 💾 **Persistent Storage** - Your data stays safe with AsyncStorage

## Planned Features

- 🍼 Feed tracking with timing and amounts
- 🧷 Diaper change logging
- 🤖 AI-powered poop analysis from photos
- 😴 Quick nap time logging
- 📊 Analytics and insights

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and Android Emulator

## Setup Instructions

### 1. Clone and Install

```bash
cd motherlymantras
npm install
```

### 2. Run the App

```bash
# Start the development server
npx expo start

# Run on specific platforms
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ClayButton.tsx  # Beautiful claymorphism button
│   └── ClayInput.tsx   # Soft input component
├── screens/            # App screens
│   ├── LoginScreen.tsx      # Email authentication
│   └── BabySetupScreen.tsx  # Baby profile setup
├── services/           # Business logic
│   └── authService.ts  # Email authentication
├── styles/             # Design system
│   └── theme.ts        # Colors, typography, shadows
├── types/              # TypeScript definitions
│   └── index.ts        # App-wide types
└── utils/              # Helper functions
```

## Design System

### Colors
- **Lavender**: `#E6E6FA` - Primary accent
- **Mint Green**: `#F0FFF0` - Success states
- **Baby Blue**: `#E0F6FF` - Secondary accent
- **Soft Peach**: `#FFE5CC` - Warm accent
- **Blush Pink**: `#FFE4E1` - Gentle accent

### Typography
- **Headings**: Bold, dark text with generous spacing
- **Body**: Regular weight, readable line height
- **Captions**: Lighter color for secondary information

### Shadows
- **Soft**: Gentle elevation with low opacity
- **Deep**: More prominent shadows for focus states

## Development

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add navigation logic in `App.tsx`
3. Update types in `src/types/index.ts`

### Creating Components
1. Follow claymorphism design principles
2. Use theme colors and typography
3. Add proper TypeScript interfaces
4. Include loading and error states

### Testing
```bash
# Run tests (when implemented)
npm test

# Type checking
npx tsc --noEmit
```

## Deployment

### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for app stores
eas build --platform all
```

### Web Deployment
```bash
# Build for web
npx expo export:web

# Deploy to your preferred hosting service
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the design system
4. Test on all platforms
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Made with 💕 for loving parents everywhere 