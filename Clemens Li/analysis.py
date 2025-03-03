import gradescopeapi
from gradescopeapi.classes.connection import GSConnection

raw_data = {}
course_ids = []
course_data = {}
course_names = []
assignments = []

def get_data(connection):
    global raw_data
    raw_data.clear()
    raw_data = connection.account.get_courses()
    pass

def categorize_data(connection):
    global course_data, course_ids, course_names, assignments
    course_data.clear()
    course_ids.clear()
    course_names.clear()
    assignments.clear()
    course_ids = list(raw_data["student"].keys())
    course_data = raw_data["student"]
    for id in course_ids:
        assignments.append(connection.account.get_assignments(id))
        course_names.append(course_data[id].name) 
    pass
        

# def analyze_courses(courses):

# def analyze_assignments(assignments):
