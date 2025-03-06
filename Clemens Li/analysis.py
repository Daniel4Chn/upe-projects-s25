from flask import Flask, render_template, jsonify, request, redirect, url_for
import gradescopeapi
from gradescopeapi.classes.connection import GSConnection
from datetime import datetime, timezone, timedelta

raw_data = {}
course_ids = []
course_data = {}
course_names = []
course_num_assignments = []
course_semesters = []
assignments = []

def get_data(connection):
    global raw_data
    raw_data.clear()
    raw_data = connection.account.get_courses()
    return raw_data

def categorize_data(connection):
    global course_data, course_ids, course_names, course_num_assignments, course_semesters, assignments
    course_data.clear()
    course_ids.clear()
    course_names.clear()
    course_num_assignments.clear()
    course_semesters.clear()
    assignments.clear()
    course_ids = list(raw_data["student"].keys())
    course_data = raw_data["student"]
    for id in course_ids:
        assignments.append(connection.account.get_assignments(id))
        course_names.append(course_data[id].name)
        course_num_assignments.append(course_data[id].num_assignments)
        course_semesters.append(f"{course_data[id].semester} {course_data[id].year}")
    return assignments

def get_stats(course_assignments):
    stats = [] # 0:average_display, 1:next_due_date, 2:raw_average
    stats.append(average_display(average(course_assignments)))
    stats.append(next_due_date(course_assignments))
    stats.append(average(course_assignments))
    return stats

# def analyze_courses(courses):

# def analyze_assignments(assignments):

def average(course_assignments):
    points_earned = 0
    points_possible = 0
    average = []
    for assignment in course_assignments:
        if assignment.grade is not None:
            points_earned += int(assignment.grade)
            points_possible += int(assignment.max_grade)
            average.append(points_earned/points_possible)
    if len(average) == 0:
        return "No grades found"
    return points_earned / points_possible

def average_display(average):
    if isinstance(average, float):          
        return f"{round(average*100, 2)}%"
    return "N/A"

def next_due_date(course_assignments):
    closest_date = course_assignments[len(course_assignments)-1].due_date
    now = datetime.now(timezone(timedelta(hours=-5)))
    for assignment in course_assignments:
        if assignment.submissions_status is not None and assignment.due_date is not None and assignment.due_date > now:
            if assignment.due_date < closest_date:
                closest_date = assignment.due_date
    return int(closest_date.timestamp() * 1000)
