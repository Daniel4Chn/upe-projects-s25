from roboflow import Roboflow
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("API_KEY")

rf = Roboflow(api_key=api_key) 
project = rf.workspace("ws-qwbuh").project("constellation-dsphi")
dataset = project.version(1).download("yolov5") 
