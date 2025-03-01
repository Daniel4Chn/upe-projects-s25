from flask import Flask, render_template, jsonify, request
import gradescopeapi
from gradescopeapi.classes.connection import GSConnection

email = ""
password = ""
courses = []
grades = []

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def receive_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    get_data(email, password)
    return jsonify({"status": "success", "redirect": "/home", "message": (email, password)})

@app.route("/home")
def home_screen():
    return render_template("home.html")

def get_data(email, password):
    connection = GSConnection()
    connection.login(email, password)
    courses = connection.account.get_courses()
    pass