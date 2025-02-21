import requests
from bs4 import BeautifulSoup

my_urls = ["http://bu.edu/hub/hub-courses/philosophical-aesthetic-and-historical-interpretation/", "https://www.bu.edu/hub/hub-courses/scientific-and-social-inquiry/", "https://www.bu.edu/hub/hub-courses/quantitative-reasoning/", "https://www.bu.edu/hub/hub-courses/diversity-civic-engagement-and-global-citizenship/", "https://www.bu.edu/hub/hub-courses/communication/", "https://www.bu.edu/hub/hub-courses/intellectual-toolkit/"]
my_classes = [("cf-hub-area-1", "Critical Thinking"), ("cf-hub-area-2", "Research and Information Literacy"), ("cf-hub-area-3", "Teamwork/Collaboration"), ("cf-hub-area-4", "Creativity/Innovation"), ("cf-hub-area-L", "First-Year Writing Seminar"), ("cf-hub-area-M", "Writing, Research, and Inquiry"),("cf-hub-area-6", "Writing-Intensive Course"), ("cf-hub-area-N", "Oral and/or Signed Communication"), ("cf-hub-area-O", "Digital/Multimedia Expression"), ("cf-hub-area-I", "The Individual in Community"), ("cf-hub-area-J", "Global Citizenship and Intercultural Literacy"), ("cf-hub-area-K", "Ethical Reasoning"), ("cf-hub-area-G", "Quantitative Reasoning I"), ("cf-hub-area-H", "Quantitative Reasoning II"), ("cf-hub-area-D", "Scientific Inquiry I"), ("cf-hub-area-F", "Scientific Inquiry II"), ("cf-hub-area-E", "Social Inquiry I"), ("cf-hub-area-P", "Social Inquiry II"), ("cf-hub-area-A", "Philosophical Inquiry and Life's Meanings"), ("cf-hub-area-B", "Aesthetic Exploration"), ("cf-hub-area-C", "Historical Consciousness")]
courseDict = {}

def get_html(url):
    response = requests.get(url)
    return response.content

def get_soup(html):
    return BeautifulSoup(html, 'html.parser')

def scrapeClass(url, className, catName):
    html = get_html(url)
    soup = get_soup(html)
    s = soup.find_all(class_=className) # find all classes with the class name

    for i in s: # Loop through the classes in the category
        courseName = "" # Create a string that represents the course title
        card = i.findParent(class_="cf-course-card") # Find the parent of the class

        courseName += card.find(class_="cf-course-college").text # Add the college to the course name
        courseName += " " + card.find(class_="cf-course-dept").text # Add the department to the course name with a space
        courseName += card.find(class_="cf-course-number").text # Add the course number to the course name

        if courseName not in courseDict: # If the course is not in the dictionary of courses, add it
            title = card.find(class_="bu_collapsible").text[1:] # Get the title of the course
            description = card.find(class_="cf-course-description").text # Get the description of the course
            courseDict[courseName] = initCourse(title, description)

        courseDict[courseName][catName] = 1 # Set the courses hub category to 1 indicating that it fulfills that hub credit
        print(courseName)



def initCourse(title, description):
    course = {} # Create a dictionary to represent the course
    for _, cat in my_classes:
        course[cat] = 0 # Set all the hub categories to 0 indicating that the course does not fulfill that hub credit
    course["Title"] = title # Set the title of the course to an empty string
    course["Description"] = description # Set the description of the course to an empty string
    return course

def main():
    url = my_urls[0]
    for code, catName in my_classes:
        scrapeClass(url, code, catName)
    for course in courseDict:
        print(course)
        for cat in courseDict[course]:
            print(cat + ": " + str(courseDict[course][cat]))
        print("\n")

if __name__ == "__main__":
    main()