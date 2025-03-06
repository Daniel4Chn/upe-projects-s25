//
//  ContentView.swift
//  coffee_to_sleep
//
//  Created by Suhhyun Park on 2/24/25.
//

import CoreML
import SwiftUI

struct ContentView: View {
    @State private var showingCoffeeCalc = false
    var body: some View {
        ZStack {
            //main blackground
            Image("Background")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .ignoresSafeArea()
            
            //picture of menu
            Image("MenuBackground")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .padding(0)
                .ignoresSafeArea()
                .frame(width: 500)
    
                    //button to start game
                    Button(action: {showingCoffeeCalc = true},
                           label: {
                        Text("Coffee")
                            .font(.custom("Times New Roman", size: 24))
                            .foregroundColor(Color(red: 0.4, green: 0.2, blue: 0.1))
                            .bold()
                        })
                        .position(x: 150, y: 240)
                    
                    
            if showingCoffeeCalc {
                Calc(showingCoffeeCalc: $showingCoffeeCalc) // Pass the binding to Calc
                                    .frame(width: UIScreen.main.bounds.width * 0.8, // 80% of the screen width
                                           height: UIScreen.main.bounds.height * 0.6) // 60% of the screen height
                                    .background(Color.brown) // Optional background for the calc screen
                                    .cornerRadius(20) // Optional rounded corners
                                    .shadow(radius: 10) // Optional shadow for visual appeal
                                    .padding()
            }
                    
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
