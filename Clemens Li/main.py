from flask import Flask, render_template, jsonify, request, redirect, url_for
import gradescopeapi
from gradescopeapi.classes.connection import GSConnection
import analysis as an

email = ""
password = ""
file = ""

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching

@app.after_request # Disable caching after every request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

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
    temp_c = an.get_data(connection)
    temp_a = an.categorize_data(connection)
    file = open("temp.txt", "w")
    file.write(str(temp_c) + "\n\n" + str(temp_a))
    return jsonify({"status": "success", "redirect": "/home", "message": (email, password)})

@app.route("/home")
def home_screen():
    # Checking data validity
    if not an.course_names or not an.assignments:
        return redirect(url_for("index"))
    return render_template("home.html", course_names=an.course_names, assignments=an.assignments)

@app.route("/course/<int:course_index>")
def course_screen(course_index):
    # Checking data validity
    if not an.course_names or not an.assignments:
            return redirect(url_for("index"))
    
    course_name = an.course_names[course_index]
    course_assignments = an.assignments[course_index]
    course_stats = an.get_stats(course_assignments)
    return render_template("course.html", course_name=course_name, course_assignments=course_assignments, course_stats = course_stats)