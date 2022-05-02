# coding=utf-8

"""
UNI: rl3250
Name: Ruize Li

This is the flask backend for homeworks in UI COMS 4111.


@TODO:
    1. welcome page
    2. learn page -> GET POST methods to receive locations of objects and return corresponding feedback/hints
    3. quiz page -> GET POST methods to receive the user's answer and return feedback, maintain scores for user
"""

from tkinter import scrolledtext
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import random
import sys
app = Flask(__name__)

"""
@TODO:
global variables to maintain
    2. quiz score, correct answer for each question
"""
homepage_image = "https://i.pinimg.com/564x/17/0c/5d/170c5dd798020fb9a8a9a2f2087ee50f.jpg"

furniture = [
    {
        "furniture_id" : "1",
        "furniture" : "bed",
        "img_url": "../static/images/Bed.JPG" ,
        "width" : 6,
        "height" : 12,
        "left" : 6,
        "top" : 2
    },
    {
        "furniture_id": "2",
        "furniture": "desk",
        "img_url": "../static/images/Desk.JPG",
        "width": 10,
        "height": 4,
        "left" : 13,
        "top" : 2
    },
    {
        "furniture_id" : "3",
        "furniture" : "drawers",
        "img_url": "../static/images/Drawers.JPG",
        "width" : 8,
        "height": 4.3,
        "left" : 13,
        "top" : 15
    },
    {
        "furniture_id" : "4",
        "furniture" : "wardrobe",
        "img_url": "../static/images/Wardrobe.JPG",
        "width" : 9,
        "height": 4.3,
        "left" : 13,
        "top" : 8
    }
]

tutorial_steps = [
    {
        "id" : "1",
        "step" : "Welcome",
        "instruction" : "An important component of Feng Shui is that it is fluid and that there are no strict rules, rather helping guidelines. As such, use this room builder to explore different layouts and see what can be considered good and bad examples of Feng Shui."
    },
    {
        "id" : "2",
        "step" : "Click and drag",
        "instruction" : "Click and drag the furniture to arrange it in the room"
    },
    {
        "id" : "3",
        "step" : "Rotate",
        "instruction" : "Great job! Click on the furniture, and then click and drag on the square on top to rotate."
    },
    {
        "id" : "4",
        "step" : "Free arrange",
        "instruction" : "Well done! Drag and arrange the rest of the furniture and press submit when you’re done."
    }

]

# relative image urls, use thses in the furniture defined above!!
img_urls = [
    "../static/images/_door.png",
    "../static/images/_window.jpeg",
    "../static/images/Bed.JPG"
]

good_lessons = [
    {   
        "id" : "1",
        "title" : "Bed in corner",
        "complete": False,
        "feedback" : "Great! It is good practice in a college dorm (or smaller rooms in general) to position the bed in a corner with a solid backing for a good night's sleep.",
        "summary" : "Beds should be in the corner with a solid backing (e.g. a wall)."
    },
    {
        "id" : "2",
        "title" : "Large clear space",
        "complete": False,
        "feedback" : "Excellent! You’ve identified another good rule. Pushing your furniture against the wall can help create a (relatively) large open space. Clearing out space will clear your mind and prevent distractions.",
        "summary" : "Furniture against the wall can help create a large open space."
    },
    {
        "id" : "3",
        "title" : "Desk should have view of door",
        "complete": False,
        "feedback" : "Amazing! It’s good to have your desk allow a view of the door. Try to always position the desk so that the door is in sight!",
        "summary" : "The desk should have a view of the door to reduce vulnerability."
    },
    {
        "id" : "4",
        "title" : "Desk close to window",
        "complete": False,
        "feedback" : "Nicely done! It’s good to have the desk close to the window. Having the desk close to the window allows for nice natural lighting during the day!",
        "summary" : "Desks close to the window get good natural light."
    }
]

bad_lessons = [
    {
        "id" : "1",
        "title" : "Bed should not backed by window",
        "complete": False,
        "feedback" : "Oh dear! In Feng Shui for a good night’s sleep your bed needs to be backed by something solid, like a wall - not a window where something could sneak up on you",
        "summary" : "Beds should not be backed by windows because they leave you vulnerable."
    },
    {
        "id" : "2",
        "title" : "Bed should not be in line with door",
        "complete": False,
        "feedback" : "Oh no! In Feng Shui it is bad to have your bed directly in line with the door, because “the chi (energy) is too intense”. It is known as “dead man’s position” or 'coffin position'.",
        "summary" : "Beds should not be in line with the door, this is the coffin position."
    },
    {
        "id" : "3",
        "title" : "Desk should not be facing away from door",
        "complete": False,
        "feedback" : "Oh dear! In Feng Shui people try to not have their backs against the door as this could lead to one feeling vulnerable. Imagine all the things that could sneak up on you!",
        "summary" : "Desk's should not be facing away from the door."
    },
    {
        "id" : "4",
        "title" : "Bed and desk should not be too close",
        "complete": False,
        "feedback" : "Oops! In Feng Shui, the bed is seen as an area for rest and the desk a workspace. Try to not have the bed and desk so close for some Feng Shui work life balance!",
        "summary" : "Keep the bed and desk separate for work-life balance."
    }
]

mc_quiz_questions = [
    {
        "mc_quiz_id" : "1",
        "mc_image" : "",#to be filled
        "mc_question" : "What are some potential issues with the room shown above?",
        "option_1" : "Bed direction",
        "option_2" : "Bed and desk proximity",
        "option_3" : "Bed positioning relative to walls",
        "mc_answer" : "Bed direction",
        "mc_next_question" : "2"
    },
    {
        "mc_quiz_id" : "2",
        "mc_image" : "", #to be filled
        "mc_question" : "What are some potential issues with the room shown above?",
        "option_1" : "Bed direction",
        "option_2" : "Bed and desk proximity",
        "option_3" : "Bed positioning relative to walls",
        "mc_answer" : "Bed and desk proximity",
        "mc_next_question" : "3"
    },
    {
        "mc_quiz_id" : "3",
        "mc_image" : "",#to be filled
        "mc_question":  "What are some positive things about this layout?",
        "option_1" : "Bed is in the corner and open space",
        "option_2" : "Bed is in the corner",
        "option_3" : "Desk location (people have their backs against the door)",
        "mc_answer" : "Bed is in the corner and open space",
        "mc_next_question" : "4",
    },
    {
        "mc_quiz_id" : "4",
        "mc_image" : "",#to be filled
        "mc_question" : "What are some negative things about this layout?",
        "option_1" : "Bed is in the corner and open space",
        "option_2" : "Bed is in the corner",
        "option_3" : "Desk location (people have their backs against the door)",
        "mc_answer" : "Desk location (people have their backs against the door)",
        "mc_next_question" : "end"
    }
]

tf_quiz_questions = [
    {
        "tf_quiz_id" : "1",
        "tf_image" : "",#to be filled
        "tf_question" : "Desk should be close to the window",
        "true" : "True",
        "false" : "False",
        "tf_answer" : "True",
        "tf_next_question" : "2"

    },
    {
        "tf_quiz_id" : "2",
        "tf_image" : "", #to be filled
        "tf_question" : "Desk should face door",
        "true" : "True",
        "false" : "False",
        "tf_answer" : "True",
        "tf_next_question" : "end"
    },

]



# check if user has learned all lessions
# return boolean
def is_learn_done():
    # completed all good ones
    for l in good_lessons:
        print(l)
        if l['complete'] is False:
            return False
    # completed all good ones
    for l in bad_lessons:
        if l['complete'] is False:
            return False
    return True
# count progress so far
def get_progress():
    # total = len(good_lessons) + len(bad_lessons)
    good = 0
    bad = 0
    # count finished
    for l in good_lessons:
        if l['complete'] is True:
            good += 1
    # completed all good ones
    for l in bad_lessons:
        if l['complete'] is True:
            bad += 1
    return [round(good / len(good_lessons) * 100), round(bad / len(bad_lessons) * 100)]

# helper function to check location of furniture
# return boolean
def is_in_room(c):
    # get coords and degree
    x,y,w,h =c['left'], c['top'], c['width'], c['height']
    a = c['angle']
    print("x is", x)
    print("y is", y)
    print("w is", w)
    print("h is", h)

    check_x = True
    check_y = True

    # check x-axis
    if x < 24 or x+w > 40:
        check_x = False
    # check y-axis
    if y < 2 or y+h > 28:
        check_y = False

    # print('y', y)
    print("cy: ", check_y)
    print("cx: ", check_x)
    return check_x and check_y

# check if facing toward door
def is_facing_door(c):
    return c['angle'] == 0 and c['left'] >= 33

#check if back against door
def back_against_door(c):
    return c['angle'] == 0

# check if has window backing
def has_window_backing(c):
   return c['angle'] == 0 and c['left'] >= 24 and c['top']==2

# check if desk close to window
def desk_window(c):
    return c['top']+c['height'] <= 15

# check if in corner
def is_in_corner(c):
    x,y,w,h =c['left'], c['top'], c['width'], c['height']
    a = c['angle']

    corner = False

    if a==270 and x==24 and y==2:
        corner = True
    elif a==90 and x==28 and y==2:
        corner = True
    elif a==180 and x==24 and y==16:
        corner = True
    
    return corner

# check desk has view of door
def can_view_door(c):
    x,y,w,h =c['left'], c['top'], c['width'], c['height']
    a = c['angle']
    # angle
    # print("a)
    check_angle = a == 90 or a == 270
    # position
    check_pos = x >= 33 and x+w <= 40
    print("check can view door", check_angle, check_pos, a)
    return check_angle and check_pos

# check for open space
def open_space(c1, c2, c3, c4):
    x1,y1,w1,h1 =c1['left'], c1['top'], c1['width'], c1['height']
    x2,y2,w2,h2 =c2['left'], c2['top'], c2['width'], c2['height']
    x3,y3,w3,h3 =c3['left'], c3['top'], c3['width'], c3['height']
    x4,y4,w4,h4 =c4['left'], c4['top'], c4['width'], c4['height']

    check = False

    #checks if all furniture is pushed against wall
    if (x1==24 or x1+w1==40) and (x2==24 or x2+w2==40) and (x3==24 or x3+w3==40) and (x4==24 or x4+w4==40):
        check = True

    return check

# check two objects are two close
def are_too_close(c1, c2):
    x1,y1,w1,h1 =c1['left'], c1['top'], c1['width'], c1['height']
    x2,y2,w2,h2 =c2['left'], c2['top'], c2['width'], c2['height']
    # if overlap, return false

    xa = x1 + w1/2
    ya = y1 + h1/2
    xb = x2 + w2/2
    yb = y2 + h2/2
    
    check_x = False
    if not(x1 > x2+w2 or x1+w1 < x2):
        check_x = abs(ya-yb) <= h1/2 + h2/2 +1
    check_y = False
    if not(y1 > y2+h2 or y1+h1 < y2):
        check_y = abs(xa-xb) <= w1/2 + w2/2 +1
     
    return check_x or check_y

def deskChecks(res, coordsDesk, coordsBed):
    count = len(res)+1
    # check if desk has back to door
    if  bad_lessons[2]['complete'] is False and back_against_door(coordsDesk):
        res[count] = {}
        res[count]['status'] = 'no'
        res[count]['mark'] = 'desk'
        res[count]['feedback'] = bad_lessons[2]['feedback']
        bad_lessons[2]['complete'] = True
        count=count+1
    # check if desk close to window
    elif good_lessons[3]['complete'] is False and desk_window(coordsDesk):
        res[count] = {}
        res[count]['status'] = 'yes'
        res[count]['mark'] = 'desk'
        res[count]['feedback'] = good_lessons[3]['feedback']
        good_lessons[3]['complete'] = True
        count=count+1
    #check if desk can view door
    elif good_lessons[2]['complete'] is False and can_view_door(coordsDesk):
        res[count] = {}
        res[count]['status'] = 'yes'
        res[count]['mark'] = 'desk'
        res[count]['feedback'] = good_lessons[2]['feedback']
        good_lessons[2]['complete'] = True
        count=count+1
    #check if desk and bed are too close
    elif bad_lessons[3]['complete'] is False and are_too_close(coordsDesk, coordsBed):
        res[count] = {}
        res[count]['status'] = 'no'
        res[count]['mark'] = 'desk'
        res[count]['feedback'] = bad_lessons[3]['feedback']
        bad_lessons[3]['complete'] = True
        count=count+1
    return res
     
# ROUTES
@app.route('/') 
def welcome():
    return render_template('welcome.html', homepage_image = homepage_image)

"""
learn route

"""
@app.route('/learn', methods = ['GET', 'POST'])
def learn():
    # user hit submit button
    if request.method == 'POST':
        # get grid size
        global grid 
        data = request.get_json()
        grid = data['grid']
        coordsBed = data['bed_coords']
        coordsDesk = data['desk_coords']
        coordsDrawers = data['drawers_coords']
        coordsWardrobe = data['wardrobe_coords']

        res = {}
        count = 1

        # check if furniture is in room
        if (is_in_room(coordsBed) and is_in_room(coordsDesk) and is_in_room(coordsWardrobe) and is_in_room(coordsDrawers)) is False:
            res[count] = {}
            res[count]['status'] = 'no'
            res[count]['mark'] = 'room_outline'
            res[count]['feedback'] = 'Please place all the furniture inside the room!!!'
            count=count+1
        #check if there's open space
        elif good_lessons[1]['complete'] is False and open_space(coordsBed, coordsDesk, coordsDrawers, coordsWardrobe):
            res[count] = {}
            res[count]['status'] = 'yes'
            res[count]['mark'] = 'room_outline' # is there a way to select room outline?
            res[count]['feedback'] = good_lessons[1]['feedback']
            good_lessons[1]['complete'] = True
            count=count+1
        # check if facing toward door
        elif bad_lessons[1]['complete'] is False and is_facing_door(coordsBed):
            res[count] = {}
            res[count]['status'] = 'no'
            res[count]['mark'] = 'bed'
            res[count]['feedback'] = bad_lessons[1]['feedback']
            bad_lessons[1]['complete'] = True
            count=count+1
            #performs all desk related checks
            res = deskChecks(res, coordsDesk, coordsBed)
            count = len(res)+1
        #check if has window backing
        elif bad_lessons[0]['complete'] is False and has_window_backing(coordsBed):
            res[count] = {}
            res[count]['status'] = 'no'
            res[count]['mark'] = 'bed'
            res[count]['feedback'] = bad_lessons[0]['feedback']
            bad_lessons[0]['complete'] = True
            count=count+1
            #performs all desk related checks
            res = deskChecks(res, coordsDesk, coordsBed)
            count = len(res)+1
        #check if in corner and solid backing
        elif good_lessons[0]['complete'] is False and is_in_corner(coordsBed):
            res[count] = {}
            res[count]['status'] = 'yes'
            res[count]['mark'] = 'bed'
            res[count]['feedback'] = good_lessons[0]['feedback']
            good_lessons[0]['complete'] = True
            count=count+1
            #performs all desk related checks
            res = deskChecks(res, coordsDesk, coordsBed)
            count = len(res)+1
        # performs all desk checks
        else: 
            res = deskChecks(res, coordsDesk, coordsBed)
            count = len(res)+1
        
        count = 0
        res[count] = {}
        # complete status
        res[count]['complete'] = "True" if is_learn_done() else "False"
        # progress percentage
        res[count]['progress'] = get_progress()
        # send lessons learned so far
        res[count]['good_lessons'] = good_lessons
        res[count]['bad_lessons'] = bad_lessons
        # return the feedback
        print("final sent res", res)
        return jsonify(res)
    else:
        return render_template('edit.html', furniture=furniture)


"""
Tutorial route
"""
@app.route('/tutorial/<id>', methods = ['GET', 'POST'])
def tutorial(id):

    # Send if the furniture is inside the room
    if request.method == 'POST':
        # get grid size
        global grid 
        data = request.get_json()
        grid = data['grid']
        coordsBed = data['bed_coords']
        coordsDesk = data['desk_coords']
        coordsDrawers = data['drawers_coords']
        coordsWardrobe = data['wardrobe_coords']

        res = {}
        # check if bed is in room
        if is_in_room(coordsBed) is True:
            res['status'] = 'yes'

        #check if desk is in room
        elif is_in_room(coordsDesk) is True:
            res['status'] = 'yes'
        
        elif is_in_room(coordsDrawers) is True:
            res['status'] = 'yes'
        
        elif is_in_room(coordsWardrobe) is True:
            res['status'] = 'yes'

        
        return jsonify(res)

    else:      
        # welcome will be only the first step (intro to tutorial)
        welcome = tutorial_steps[0]

        # steps will be an array of the other 3 rules
        steps=[]
        for i in range(1,4):
            steps.append(tutorial_steps[i])
        return render_template('tutorial.html', furniture=furniture, tutorial=steps, welcome=welcome)

"""
Quiz route
"""
@app.route('/quiz_yourself/<id>', methods = ['GET', 'POST'])
def quiz_yourself(id):
    mc_quiz = mc_quiz_questions
    tf_quiz = tf_quiz_questions
    currentMultipleChoiceQuestion = mc_quiz_questions[id]
    currentTrueFalseQuestion = tf_quiz_questions[id]
    if request.method == 'POST':
        global score
        data = request.get_json() 
        user_answer = data['answer']
        res = {}
        
        # check if MC or TF question
        if (user_answer == 'True' or user_answer == 'False'):
            if user_answer == tf_quiz_questions[id+1]['tf_answer']:
                res['score'] = score + 1
            else:
                res['score'] = scroll
            
        res['correct'] = False
        return jsonify(res)
    else :
        return render_template('quiz.html', mc_quiz=mc_quiz, tf_quiz=tf_quiz)

if __name__ == '__main__':
    app.run(debug=True)
