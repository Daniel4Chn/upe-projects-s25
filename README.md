# UPE-Project-s25

## Introduction
This project is a web-based application that tracks the amount of time lost while waiting for the Boston T. It compares the actual arrival time of a train to a predetermined, but modifiable expected wait time (e.g., 5 minutes) and adds the difference to a cumulative time counter. The application detects when the user leaves the station by monitoring changes in speed or acceleration, stopping the timer once movement surpasses a threshold. The backend is built with Flask (Python) to handle data processing and communication with external transit APIs, while the frontend is implemented using JavaScript and Bootstrap.
