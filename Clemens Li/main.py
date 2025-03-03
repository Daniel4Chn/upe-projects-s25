from flask import Flask, render_template, jsonify, request
import gradescopeapi
from gradescopeapi.classes.connection import GSConnection
import analysis as an

email = ""
password = ""

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def receive_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    connection = GSConnection()
    connection.login(email, password)
    an.get_data(connection)
    an.categorize_data(connection)
    return jsonify({"status": "success", "redirect": "/home", "message": (email, password)})

@app.route("/home")
def home_screen():
    return render_template("home.html", course_names=an.course_names, assignments=an.assignments)