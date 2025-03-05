from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = tf.keras.models.load_model("constellation_model.h5")
CONSTELLATION_LABELS = {
    0: "Aquila",
    1: "Bootes",
    2: "Canis Major",
    3: "Canis Minor",
    4: "Cassiopeia",
    5: "Cygnus",
    6: "Gemini",
    7: "Leo",
    8: "Lyra",
    9: "Moon",
    10: "Orion",
    11: "Pleiades",
    12: "Sagittarius",
    13: "Scorpius",
    14: "Taurus",
    15: "Ursa Major"
}

@app.route("/upload", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    predictions = detect_constellations(filepath)

    return jsonify({"constellations": predictions})

def detect_constellations(image_path):

    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        return ["Error: Could not read the image"]

    image = cv2.resize(image, (256, 256)) / 255.0 
    image = np.expand_dims(image, axis=0)  

    predictions = model.predict(image)[0]  
    top_indices = np.argsort(predictions)[-3:][::-1] 

    results = [
        {
            "constellation": CONSTELLATION_LABELS.get(idx, "Unknown"),
            "probability": float(predictions[idx]) 
        }
        for idx in top_indices if predictions[idx] > 0.05  
    ]

    return results if results else [{"constellation": "Unknown", "probability": 0.0}]

if __name__ == "__main__":
    app.run(debug=True)
