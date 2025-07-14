# Warupay 💰

A modern cryptocurrency payment application built with React Native and Expo, designed for the Bolivian market. Warupay enables users to manage digital assets, make payments with Stellar (XLM) and other cryptocurrencies, and find places that accept crypto payments.

![Warupay Banner](https://via.placeholder.com/800x200/7D00FF/FFFFFF?text=Warupay+-+Crypto+Payments+Made+Easy)

## 🚀 Features

### 💳 **Digital Wallet**
- Multi-currency support (BOB, XLM, USDT, USDC)
- Real-time balance tracking
- Transaction history with detailed information
- Bank account integration ( BCP)
- Animated balance updates

### 🔄 **Currency Exchange**
- Real-time cryptocurrency trading
- BOB ↔ Crypto conversions
- Live market rates and price charts
- Portfolio management
- Trading history

### 💱 **Currency Converter**
- Multi-currency converter with live rates
- Support for fiat and cryptocurrencies
- Historical rate charts
- Quick conversion shortcuts
- Rate alerts and notifications

### 🗺️ **Interactive Maps**
- Find Stellar-accepting businesses
- Locate P2P cashiers for cash exchanges
- Detailed business information (hours, ratings, currencies)
- Search and filter functionality
- Navigation integration

### 📱 **QR Code Payments**
- Generate payment QR codes
- Scan and pay functionality
- Custom payment amounts
- Transaction receipts
- Unlimited payment receiving

### 👤 **User Profile**
- Personal information management
- Security settings (PIN, biometrics)
- Payment methods configuration
- Notification preferences
- App settings and support

## 🛠️ Technologies Used

### **Frontend Framework**
- **React Native** (0.79.5) - Cross-platform mobile development
- **Expo** (SDK 53) - Development platform and tools
- **TypeScript** - Type-safe JavaScript

### **Navigation & Routing**
- **Expo Router** - File-based routing system
- **React Navigation** - Navigation library for tab navigation

### **UI & Styling**
- **React Native SVG** - Vector graphics support
- **Expo Linear Gradient** - Gradient backgrounds
- **Lucide React Native** - Modern icon library
- **React Native Safe Area Context** - Safe area handling

### **Features & Functionality**
- **React Native QR Code SVG** - QR code generation
- **React Native Reanimated** - Advanced animations
- **Expo Camera** - Camera functionality for QR scanning
- **Expo Clipboard** - Clipboard operations
- **React Native Picker** - Selection components

### **Development Tools**
- **Metro** - JavaScript bundler
- **Babel** - JavaScript compiler
- **ESLint** - Code linting

## 📁 Project Structure

```
warupay/
├── app/                          # Main application screens
│   ├── (tabs)/                   # Tab-based navigation screens
│   │   ├── index.tsx            # Home screen with balance & transactions
│   │   ├── crypto.tsx           # Cryptocurrency trading
│   │   ├── convert.tsx          # Currency converter
│   │   ├── maps.tsx             # Maps with places & P2P cashiers
│   │   ├── qr.tsx               # QR code generation & scanning
│   │   ├── profile.tsx          # User profile & settings
│   │   └── _layout.tsx          # Tab navigation layout
│   ├── auth.tsx                 # Authentication screen
│   ├── index.tsx                # App entry point
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 error screen
├── assets/                       # Static assets
│   └── images/                  # App icons and images
├── hooks/                        # Custom React hooks
│   └── useFrameworkReady.ts     # Framework initialization hook
├── components/                   # Reusable UI components (future)
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/warupay.git
cd warupay
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start Development Server**
```bash
npm run dev
```

### **4. Run on Device/Simulator**
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## 📱 App Screens Overview

### **🏠 Home Screen**
- **Balance Display**: Multi-currency wallet overview
- **Quick Actions**: Recharge, Transfer, Pay, Maps
- **Transaction History**: Recent payment activity
- **Bank Integration**: BCP account linking

### **₿ Crypto Trading**
- **Portfolio Overview**: Current holdings and values
- **Trading Interface**: Buy/sell cryptocurrencies
- **Market Charts**: Price history and trends
- **Order Management**: Active and completed orders

### **🔄 Currency Converter**
- **Multi-Currency Support**: BOB, USD, XLM, USDT, USDC
- **Real-Time Rates**: Live exchange rate updates
- **Quick Conversion**: Preset amount shortcuts
- **Rate History**: Historical exchange rate charts

### **🗺️ Maps**
- **Stellar Places**: Businesses accepting crypto payments
  - Restaurants, Hotels, Pharmacies
  - Business hours, ratings, contact info
  - Supported cryptocurrencies
- **P2P Cashiers**: Individual cash exchange points
  - Transaction history and limits
  - Commission rates and verification status
  - Contact and meeting information

### **📱 QR Payments**
- **Payment Generation**: Create QR codes for receiving payments
- **Scanner**: Read QR codes for making payments
- **Payment History**: Track sent and received payments
- **Custom Amounts**: Set specific payment amounts

### **👤 User Profile**
- **Account Settings**: Personal information management
- **Security**: PIN, biometrics, verification status
- **Payment Methods**: Linked cards and accounts
- **Preferences**: Notifications, language, app settings
- **Support**: Help center, contact support, app rating

## 🌟 Key Features in Detail

### **Multi-Currency Wallet**
- Support for Bolivian Boliviano (BOB) tokens
- Stellar Lumens (XLM) integration
- Stablecoins (USDT, USDC) support
- Real-time balance synchronization
- Secure transaction processing

### **Stellar Network Integration**
- Native Stellar (XLM) support
- Fast and low-cost transactions
- Decentralized payment processing
- Cross-border payment capabilities

### **Local Market Focus**
- Bolivian market specifically designed
- Local business directory
- P2P cash exchange network
- BOB token for local transactions

### **Security Features**
- Biometric authentication
- PIN protection
- Account verification system
- Secure payment processing
- Transaction history encryption

## 🚀 Development

### **Available Scripts**
```bash
# Start development server
npm run dev

# Build for production
npm run build:web

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### **Adding New Features**
1. Create new screen in `app/(tabs)/` directory
2. Add corresponding tab in `app/(tabs)/_layout.tsx`
3. Import required icons from `lucide-react-native`
4. Follow existing styling patterns and color scheme

### **Styling Guidelines**
- Use the predefined color palette in each component
- Follow React Native styling best practices
- Maintain consistent spacing and typography
- Ensure responsive design for different screen sizes

## 🎨 Design System

### **Color Palette**
```typescript
const colors = {
  stellarPrimary: '#7D00FF',    // Primary brand color
  stellarSecondary: '#00BFFF',  // Secondary accent
  stellarDark: '#090C1C',       // Dark backgrounds
  success: '#00D1B2',           // Success states
  danger: '#FF3860',            // Error states
  warning: '#FFDD57',           // Warning states
  white: '#FFFFFF',             // White backgrounds
  gray: '#636E72',              // Text secondary
  textPrimary: '#2D3436',       // Primary text
}
```

### **Typography**
- **Headers**: Bold, 24-28px
- **Titles**: SemiBold, 18-22px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 12-14px

## 🤝 Contributing

We welcome contributions to Warupay! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add new feature'`
5. **Push to the branch**: `git push origin feature/new-feature`
6. **Submit a Pull Request**

### **Contribution Guidelines**
- Follow the existing code style and patterns
- Add proper TypeScript types for new components
- Test your changes on both iOS and Android
- Update documentation for new features
- Write clear commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- **Stellar Development Foundation** - For the Stellar network protocol
- **Expo Team** - For the excellent development platform
- **React Native Community** - For the amazing framework
- **Lucide Icons** - For the beautiful icon set

---

**Made with ❤️ for the Bolivian crypto community**

*Warupay - Making cryptocurrency payments accessible and easy for everyone in Bolivia.* 