from pulp import LpVariable, LpBinary, LpProblem, LpMinimize, lpSum, GLPK

def minvertices(G, U, V):
    courseUsed = {}

    for course in U:
        # For every course, create a binary variable that is 1 if a course is being used in the minimum set
        # of courses and 0 if it isn't being used
        courseUsed[course] = LpVariable(course, cat=LpBinary)

    # Create the optimatization problem which is a minimization problem
    minVertices = LpProblem("minVertices", LpMinimize)

    # Create the constraint that we're trying to minimize which is
    # the sum of the binary variables for all the courses.
    # Minimizing this sum minimizes the number of courses used.
    minVertices += lpSum(courseUsed[course] for course in U), "numCourses"

    for hub in V:
        cap = 1
        if (hub == "Creativity/Innovation" and "Creativity/Innovation 2" in V):
            cap = 2
        if (hub == "Teamwork/Collaboration" and "Teamwork/Collaboration 2" in V):
            cap = 2
        if (hub == "Research and Information Literacy" and "Research and Information Literacy 2" in V):
            cap = 2
        if (hub == "Critical Thinking" and "Critical Thinking 2" in V):
            cap = 2
        if (hub == "Writing-Intensive Course" and "Writing-Intensive Course 2" in V):
            cap = 2
        if (hub == "Global Citizenship and Intercultural Literacy" and "Global Citizenship and Intercultural Literacy 2" in V):
            cap = 2
        
        # For each hub unit, create the constraint that at least one course must fulfill that unit
        minVertices += lpSum(courseUsed[course] for course in U if hub in G[course]) >= cap, f"Cover_{hub}"
    
    # Uses a linear optimization solver to solve given the constraints we've created
    minVertices.solve(GLPK(msg=True))

    # Output dictionary
    out = {}

    for course in courseUsed:
        # If the value of courseUsed[course] is 1, that means it is being used
        # In the minimum set of courses so we add it to the dictionary.
        if courseUsed[course].value() == 1:
            out[course] = 1
    
    return out




