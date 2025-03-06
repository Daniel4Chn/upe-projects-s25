0.0 Coffee Calculator - SwiftUI App

This is a SwiftUI-based app that calculates your ideal bedtime based on the time you want to wake up, the desired amount of sleep, and your daily coffee intake. Sadly 


1.0 Requirements

Xcode: Make sure you have Xcode installed (version 12.0 or later).
Swift: This project is built with Swift 5.0+ and SwiftUI.
CoreML: The app uses CoreML for the bedtime calculation model.


2.0 Setup Instructions

Follow these steps to run the project locally:

2.1 Clone the Repository

2.2 Open the Project in Xcode
Once you've cloned the repository, navigate to the project folder in Finder and open the .xcodeproj file by double-clicking on it.

Alternatively, you can open it from the terminal:

cd just-go-to-bed
open JustGoToBed.xcodeproj

3.0Ensure You Have a Valid CoreML Model (SleepCalculatorC)

4.0 Configure the Simulator
Select the appropriate simulator in Xcode’s toolbar (e.g., iPhone 12).
For this particular app, any simulator should work but the iphone modles are preferred

5.0 Build and Run the Project
Build the Project: Click on the Product menu and select Build, or press Cmd + B.
Run the Project: Click the Play button or press Cmd + R to run the app on the simulator or your device.


6.0 Interacting with the App: Once the app is running, you will see:

Main Screen: A background image with a "Coffee" button in brown.

Calculation Screen: When the "Coffee" button is clicked >> You can set:
Desired wake-up time.
Desired sleep amount.
Coffee consumption.
Press "Calculate" to get your ideal bedtime.
Press "Dismiss" to return to the main screen.



