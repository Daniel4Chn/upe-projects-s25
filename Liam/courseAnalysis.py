import sqlite3;
from scrapenstore import my_classes;
from linearSolver import minvertices;

courseDict = {}
graph = {}

connection = sqlite3.connect("courses.db")
cursor = connection.cursor()

# res = connection.execute("SELECT * FROM COURSE")
# row = res.fetchone()
# print(row)

# Copied from scrapenstore.py
def initCourse(title, description):
    course = {} # Create a dictionary to represent the course
    for _, cat in my_classes:
        course[cat] = 0 # Set all the hub categories to 0 indicating that the course does not fulfill that hub credit
    course["Title"] = title # Set the title of the course to an empty string
    course["Description"] = description # Set the description of the course to an empty string
    return course

def fetchData():
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