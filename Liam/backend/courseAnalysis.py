import sqlite3;
import re;
from scrapenstore import my_classes;
from linearSolver import minvertices;

courseDict = {}
graph = {}
my_hubs = ["Critical Thinking", "Critical Thinking 2","Research and Information Literacy", "Research and Information Literacy 2", "Teamwork/Collaboration", "Teamwork/Collaboration 2","Creativity/Innovation", "Creativity/Innovation 2","First-Year Writing Seminar", "Writing, Research, and Inquiry","Writing-Intensive Course", "Writing-Intensive Course 2","Oral and/or Signed Communication", "Digital/Multimedia Expression", "The Individual in Community", "Global Citizenship and Intercultural Literacy", "Global Citizenship and Intercultural Literacy 2", "Ethical Reasoning", "Quantitative Reasoning I", "Quantitative Reasoning II", "Scientific Inquiry I", "Scientific Inquiry II", "Social Inquiry", "Philosophical Inquiry and Life's Meanings", "Aesthetic Exploration", "Historical Consciousness"]


# Copied from scrapenstore.py
def initCourse(title, description):
    course = {} # Create a dictionary to represent the course
    for _, cat in my_classes:
        course[cat] = 0 # Set all the hub categories to 0 indicating that the course does not fulfill that hub credit
    course["Title"] = title # Set the title of the course to an empty string
    course["Description"] = description # Set the description of the course to an empty string
    return course

def fetchData():
    connection = sqlite3.connect("courses.db")
    cursor = connection.cursor()
    res = connection.execute("SELECT * FROM COURSE")
    data = res.fetchall()

    # Go row by row through the database and create a dictionary for each course and add it to the courseDict
    for row in data:
        courseDict[row[0]] = initCourse(row[1], row[2])
        for i, cat in enumerate(my_classes):
            courseDict[row[0]][cat[1]] = row[i + 3]

def createBipartiteGraph():
    # Loop through each course in the courseDict
    for course in courseDict:
        graph[course] = {}
        # Loop through each category in the course
        for _, cat in my_classes:
            # If the course fulfills the category, add an edge of value 1 to the graph
            if courseDict[course][cat] == 1:
                graph[course][cat] = 1
    return graph

def processList(hubs=my_hubs, rem_list=[], filterCAS=False, numFilter=1000):
    fetchData()
    copyDict = courseDict.copy()

    for course in courseDict:
        match = re.search(r"\d{3}", course)
        if course in rem_list:
            del copyDict[course]
        elif filterCAS and "CAS" not in course:
            del copyDict[course]
        elif match and int(match.group()) > numFilter:
            del copyDict[course]
            

    graph = {}
    V = {}
    for cat in hubs:
        V[cat] = 1
    
    for course in copyDict:
        graph[course] = {}
        for _, cat in my_classes:
            if courseDict[course][cat] == 1:
                if cat in V:
                    graph[course][cat] = 1
                if cat == "Social Inquiry I" and "Social Inquiry" in V:
                    graph[course]["Social Inquiry"] = 1
                if cat == "Social Inquiry II" and "Social Inquiry" in V:
                    graph[course]["Social Inquiry"] = 1
                if cat == "Global Citizenship and Intercultural Literacy" and "Global Citizenship and Intercultural Literacy 2" in V:
                    graph[course]["Global Citizenship and Intercultural Literacy 2"] = 1
                if cat == "Writing-Intensive Course" and "Writing-Intensive Course 2" in V:
                    graph[course]["Writing-Intensive Course 2"] = 1
                if cat == "Critical Thinking" and "Critical Thinking 2" in V:
                    graph[course]["Critical Thinking 2"] = 1
                if cat == "Research and Information Literacy" and "Research and Information Literacy 2" in V:
                    graph[course]["Research and Information Literacy 2"] = 1
                if cat == "Teamwork/Collaboration" and "Teamwork/Collaboration 2" in V:
                    graph[course]["Teamwork/Collaboration 2"] = 1
                if cat == "Creativity/Innovation" and "Creativity/Innovation 2" in V:
                    graph[course]["Creativity/Innovation 2"] = 1

    choices = minvertices(graph, copyDict, V)
    out = []
    for course in choices:
        out.append({ "course_code" : course, "title" : courseDict[course]["Title"], "description" : courseDict[course]["Description"] })
    return out

def main():
    fetchData()
    graph = createBipartiteGraph()
    V = {}
    for _, cat in my_classes:
        V[cat] = 1
    
    choices = minvertices(graph, courseDict, V)

    i = 1
    for vertex in choices:
        if vertex in courseDict:
            mystr = str(i) + ") " + vertex + ": "
            for cat in courseDict[vertex]:
                if courseDict[vertex][cat] == 1:
                    mystr += cat + ", "
            print(mystr)
        i += 1


if __name__ == "__main__":
    main()