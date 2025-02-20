from flask import Flask, render_template
import time, math

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

##########################
# STARTUP INSTRUCTIONS:
# Run Flask webserver with "flask run --host=0.0.0.0 --port=5001", and then navigate to http://<ip address>:5001