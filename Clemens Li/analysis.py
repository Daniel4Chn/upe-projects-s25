import gradescopeapi
from gradescopeapi.classes.connection import GSConnection

raw_course_data = []
courses = []
assignments = []

def get_data(connection):
    global raw_course_data
    raw_course_data = connection.account.get_courses()
    pass

def categorize_data(connection):
    global courses, assignments
    courses = raw_course_data["student"].keys()
    for course in courses:
        assignments.append(connection.account.get_assignments(course))


