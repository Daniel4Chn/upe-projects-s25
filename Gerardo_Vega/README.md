🌌 Star Constellation Identifier

📌 Project Overview

This project is an AI-powered Star Constellation Identifier that allows users to upload images of the night sky and detect visible constellations. The model was trained using CNN (Convolutional Neural Networks) and predicts the most likely constellations in the image. Here is the video showing the project at work: https://drive.google.com/file/d/1RlyFRH_tp3wangy_eAg3_b9vsTvw51nZ/view?usp=sharing. For some reason on the video it won't show me opening and uploading images of constellations and their respective name so here are the images used in the video.

 
🚀 Features

✅ Upload an image of the night sky and detect constellations.✅ View information about detected constellations, including facts from Wikipedia.✅ Responsive UI with React + TailwindCSS.✅ Flask API backend for image processing & AI model inference.

Tech Stack

Frontend: React, TailwindCSS

Backend: Flask (Python)

Machine Learning: TensorFlow/Keras

Data Handling: OpenCV, NumPy

API Integration: Wikipedia API

Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/stargazerJerry2023/upe-projects-s25.git
cd upe-projects-s25

2️⃣ Install Dependencies

Backend (Flask)

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Frontend (React)

cd ../frontend
npm install

3️⃣ Set Up Environment Variables

Create a .env file in the backend folder:

API_KEY=your_roboflow_api_key

Running the Application
Start the Backend

cd backend
python app.py

Start the Frontend

cd frontend
npm run dev

Now, open http://localhost:5173 to use the application! 🚀

Training Your Own Model (Optional)

If you want to train your own model:

cd backend
run python dataset.py 
this will download roboflow's Dataset and models you can use to train your own model 
python train_model.py
This will use the DataSet to train your model and save the model after its done training as a file called constellation_model.h5 (This will be a large file depending on how many times you run the model through the DataSet)



