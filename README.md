
# Note!t - A Simple Note-Taking App

This project is React Native version of the Native Version **https://github.com/siagust/NoteIt** 

**Note!t** is a mobile note-taking app built with **React Native**, using **Expo** for fast development and **TypeScript** for type safety. It allows users to manage their notes, including adding, editing, and deleting notes, as well as searching through them with an optimized experience.


## 📦 Tech Stack

- **React Native**: Cross-platform mobile development framework for building native apps.
- **Expo**: A framework and platform for universal React applications, enabling fast development and easy deployment.
- **TypeScript**: A superset of JavaScript that adds static typing, providing type safety and reducing bugs.
- **Expo Router**: Simplifies navigation between screens in a React Native app.
- **AsyncStorage**: A simple key-value storage system for persisting data locally on the device.
- **Lodash**: A utility library for working with arrays, objects, and functions, used for **debouncing** the search functionality.
- **Expo Clipboard**: For accessing the system clipboard to allow users to paste text into notes.

## 🚀 How to Build & Run

### 1. Clone the Repository

### 2. Install Dependencies

Make sure you have **Node.js** installed. If not, download it from [nodejs.org](https://nodejs.org/).

Install project dependencies using **npm** or **yarn**:

```bash
npm install
```

Or, if you prefer **yarn**:

```bash
yarn install
```

### 3. Start the Development Server

Start the Expo development server:

```bash
npx expo start
```

This will open the **Expo Developer Tools** in your browser.

### 4. Run on a Device or Emulator

#### For Android:
- Press `a` to launch the app on an Android emulator.
- Or scan the QR code in the Expo DevTools to run the app on your physical Android device.

#### For iOS (Mac only):
- Press `i` to launch the app on an iOS simulator (requires Xcode).
- Or scan the QR code with the **Expo Go** app on your iOS device.

#### For Web:
- Press `w` to launch the app in a web browser.

### 5. Building for Production

To build your app for production (APK or AAB for Android):

```bash
npx eas build --platform android --profile production
```

This will generate a production-ready APK or AAB that you can distribute or upload to the Google Play Store.

## 🧰 Features

- **Add Note**: Create new notes with a title and content.
- **Edit Note**: Modify existing notes.
- **Delete Note**: Remove notes from the app.
- **Search Notes**: Filter through notes based on the title or content.
- **Clipboard Integration**: Paste clipboard content directly into note fields.
- **Responsive UI**: Optimized for both Android and iOS devices with Expo.

## 🤖 Contributing

Feel free to fork this repository and submit pull requests to improve the app. Contributions are always welcome! 😊

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
