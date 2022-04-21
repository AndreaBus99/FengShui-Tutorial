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
        "height": 4.8,
        "left" : 13,
        "top" : 15
    },
    {
        "furniture_id" : "4",
        "furniture" : "wardrobe",
        "img_url": "../static/images/Wardrobe.JPG",
        "width" : 9,
        "height": 4.8,
        "left" : 13,
        "top" : 8
    }
]
# changes

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
        "feedback" : "Great! It is good practice in a college dorm (or smaller rooms in general) to position the bed in a corner."
    },
    {
        "id" : "2",
        "title" : "Large clear space",
        "complte": "false",
        "complete": False,
        "feedback" : "Excellent! You’ve identified another good rule. For a college dorm, it’s good to have a (relatively) large open space. Clearing out space will clear your mind and prevent distractions."
    },
    {
        "id" : "3",
        "title" : "Desk should have view of door",
        "complete": False,
        "feedback" : "Amazing! It’s good to have your desk allow a view of the door. Try to always position the desk so that the door is in sight!"

    },
    {
        "id" : "4",
        "title" : "Desk close to window",
        "complete": False,
        "feedback" : "Nicely done! It’s good to have the desk close to the window. Having the desk close to the window allows for nice natural lighting during the day!"
    }
]

bad_lessons = [
    {
        "id" : "1",
        "title" : "Bed should not backed by window",
        "complete": False,
        "feedback" : "Oh dear! In Feng Shui for a good night’s sleep your bed needs to be backed by something solid, like a wall - not a window where something could sneak up on you"
    },
    {
        "id" : "2",
        "title" : "Bed should not be in line with door",
        "complete": False,
        "feedback" : "Oh no! In Feng Shui it is bad to have your bed directly in line with the door, because “the chi (energy) is too intense”. It is known as “dead man’s position” or 'coffin position'."
    },
    {
        "id" : "3",
        "title" : "Desk should not be facing away from door",
        "complete": False,
        "feedback" : "Oh dear! In Feng Shui people try to not have their backs against the door as this could lead to one feeling vulnerable. Imagine all the things that could sneak up on you!"
    },
    {
        "id" : "4",
        "title" : "Bed and desk should not be too close",
        "complete": False,
        "feedback" : "Oops! In Feng Shui, the bed is seen as an area for rest and the desk a workspace. Try to not have the bed and desk so close for some Feng Shui work life balance!"
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


# check two objects are two close
def are_too_close(c1, c2, depth = 1):
    x1,y1,w1,h1 =c1['left'], c1['top'], c1['width'], c1['height']
    x2,y2,w2,h2 =c2['left'], c2['top'], c2['width'], c2['height']
    # if overlap, return false
    # if x1 >= x2 and x1 <= x2+w2 and 
    # check up
    if x1 > x2 + w2 or x1+w1 < x2:
        up_too_close = False
    else:
        up_too_close = True
    print("up check : ", up_too_close)
    # check right
    if y1 > y2 + h2 or y1 + h1 < y2:
        right_too_close = False
    else:
        right_too_close = True
    print("right check : ", right_too_close)

    print("are too close: ", up_too_close, right_too_close)
    if depth == 0:
        return up_too_close or right_too_close
    return up_too_close or right_too_close or are_too_close(c2,c1,0)
    
     
# ROUTES
@app.route('/')
def welcome():
    return render_template('welcome.html')

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
        print("GRID SIZE: "+str(grid))
        # print(coordsBed)
        print(coordsDesk)

        res = {}

        # check if bed is in room
        if is_in_room(coordsBed) is False:
            res['status'] = 'no'
            res['mark'] = 'bed'
            res['feedback'] = 'please place the bed inside the room!!!'

        #check if desk is in room
        elif is_in_room(coordsDesk) is False:
            res['status'] = 'no'
            res['mark'] = 'desk'
            res['feedback'] = 'please place the desk inside the room!!!'
            
        # check if facing toward door
        elif bad_lessons[1]['complete'] is False and is_facing_door(coordsBed):
            res['status'] = 'no'
            res['mark'] = 'bed'
            res['feedback'] = bad_lessons[1]['feedback']
            bad_lessons[1]['complete'] = True
        
        #check if has window backing
        elif bad_lessons[0]['complete'] is False and has_window_backing(coordsBed):
            res['status'] = 'no'
            res['mark'] = 'bed'
            res['feedback'] = bad_lessons[0]['feedback']
            bad_lessons[0]['complete'] = True
        
        #check if in corner and solid backing
        elif good_lessons[0]['complete'] is False and is_in_corner(coordsBed):
            res['status'] = 'yes'
            res['mark'] = 'bed'
            res['feedback'] = good_lessons[0]['feedback']
            good_lessons[0]['complete'] = True

        # check if desk has back to door
        elif  bad_lessons[2]['complete'] is False and back_against_door(coordsDesk):
            res['status'] = 'no'
            res['mark'] = 'desk'
            res['feedback'] = bad_lessons[2]['feedback']
            bad_lessons[2]['complete'] = True
        
        # check if desk close to window
        elif good_lessons[3]['complete'] is False and desk_window(coordsDesk):
            res['status'] = 'yes'
            res['mark'] = 'desk'
            res['feedback'] = good_lessons[3]['feedback']
            good_lessons[3]['complete'] = True

        #check if desk can view door
        elif good_lessons[2]['complete'] is False and can_view_door(coordsDesk):
            res['status'] = 'yes'
            res['mark'] = 'desk'
            res['feedback'] = good_lessons[2]['feedback']
            good_lessons[2]['complete'] = True
        #check if desk and bed are too close
        elif bad_lessons[3]['complete'] is False and are_too_close(coordsDesk, coordsBed):
            res['status'] = 'no'
            res['mark'] = 'desk'
            res['feedback'] = bad_lessons[3]['feedback']
            bad_lessons[3]['complete'] = True

        # good layout
        else:
            res['status'] = 'yes'
            res['feedback'] = 'this is a good choice of placing the bed'
            res['mark'] = 'bed' 
            good_lessons[0]['complete'] = True
        
        # complete status
        res['complete'] = "True" if is_learn_done() else "False"
        # progress percentage
        res['progress'] = get_progress()
        # send lessons learned so far
        res['good_lessons'] = good_lessons
        res['bad_lessons'] = bad_lessons
        # return the feedback
        return jsonify(res)
    else:
        return render_template('edit.html', furniture=furniture)

# TODO: implement this
@app.route('/quiz_yourself')
def quiz_yourself():
    mc_quiz = mc_quiz_questions
    tf_quiz = tf_quiz_questions
    return render_template('quiz.html', mc_quiz=mc_quiz, tf_quiz=tf_quiz)


# @app.route('/search/<keywords>', methods = ['GET', 'POST'])
# def search_result(keywords):
#     """given keywords, search the database and return matching results
    
#     Args:
#         keywords(str): keywords
#     Returns:
#         json object of array. each element in the array is a json object
#         of matching result. If none matches, [].

#     """
#     matches = []
#     # find entries with matching keywords in title/description
#     for entry in restaurants:
#         desc = entry["desc"]
#         name = entry["name"]
#         dish = entry["dishes"]
#         openStatus = entry['open_status']
#         # 
#         # booleans, checck substring match for three fields:
#         inName = name.lower().find(keywords.lower()) != -1
#         inDesc = desc.lower().find(keywords.lower()) != -1
#         inOpenStatus = openStatus.lower().find(keywords.lower()) != -1
#         inDish = any(keywords.lower() in string.lower() for string in dish)

#         # if found any in above conditions -> return
#         if inName or inDesc or inDish or inOpenStatus :   # lower case matching
#         # if name.find(keywords) != -1:       # case sensitive searching
#             matches.append(entry)

#     # back to client
#     data = {"matches": matches, "keywords": keywords}
#     return render_template('search_result.html',
#                             search_results=data)



# @app.route('/get3', methods=['GET', 'POST'])
# def getThree():
#     """randomly choose three items from restaruants, return to client
    
#     Args:
#         None
#     Returns:
#         json object of three elements in restaurants.
#     """
#     res = []
#     for i in range(3):
#         res.append(restaurants[i])
#         # res.append(restaurants[random.randint(0, len(restaurants)-1)])
#     return jsonify(res)

# @app.route('/view/<id>', methods=['GET', 'POST'])
# def view(id):
#     """ render a template page using a given `id`
    
#     Args:
#         id(int): id for the specific entry
#     Returns:
#         renders view.html using entry
#     """
#     # print(request)
#     if request.method == 'GET':
#         entry = None
        
#         for r in restaurants:
#             if r["id"] == int(id):
#                 entry = r
#                 break
        
#         return render_template('view.html', entry = entry)
#     else:
#         # updated = jsonify(request.get_data())
#         # updated = request.get_data()
#         # data = request.form['name']
#         # print("test:   ", data)
#         updated = {
#             "id" : int(request.form['id']),
#             "name" : request.form['name'],
#             "desc" : request.form['desc'],
#             "image_url" : request.form['image_url'],
#             "rating" : request.form['rating'],
#             "pricing" : request.form['pricing'],
#             "dishes" : [s.strip() for s in request.form['dishes'].split(',')],
#             "similar_res" : [s.strip() for s in request.form['similar_res'].split(',')],
#             "open_status" : request.form['open_status'],
#             "hours" : request.form['hours']
#         }

#         print([s.strip() for s in request.form['dishes'].split(',')])
#         # print(updated)
#         for i in range(len(restaurants)):
#             r = restaurants[i]
#             if r['id'] == updated['id']:
#                 restaurants[i] = updated
#                 print(restaurants[0])
#                 print('found')
#                 # print('updated:' , updated) 
#                 break
#         # print()
#         return render_template('view.html', entry = updated)


# @app.route('/add', methods = ['GET', 'POST'])
# def add():
#     if request.method == 'GET':
#         return render_template('add.html')
#     else:
#         global current_id

#         data = request.get_json()
        
#         data["id"] = current_id
#         newID = current_id
#         current_id += 1
#         print(data)

#         res = {
#             "newID" : newID
#         }
#         restaurants.append(data)

#         return jsonify(res)




# @app.route('/edit/<id>', methods = ['GET', 'POST'])
# def edit(id):
#     if request.method == 'GET':
#         entry = None
#         for r in restaurants:
#             if r["id"] == int(id):
#                 entry = r
#                 break
#         return render_template('edit.html', entry = entry)
#     else:
#         # pass
#         # post request, saves the edited entry
#         updated = request.get_json()
#         print(updated)
#         for i in range(len(restaurants)):
#             r = restaurants[i]
#             if r['id'] == updated['id']:
#                 restaurants[i] = updated 
#                 break
        
#         # res = {
#         #     "id" : id
#         # }

#         # return jsonify(res)
    

# # @app.route('/edit_save', methods = ['GET', 'POST'])
# # def edit():
# #     global current_id
# #     data = request.get_json()
# #     for i in range(len(restaurants)):
# #         r = restaurants[i]
# #         if r['id'] == data['id']:
# #             restaurants[i] = data
# #             break
# #     return 
            
# # ROUTE : save sales
# # @app.route('/save_sale', methods=['GET', 'POST'])
# # def save_sale():
# #     global current_id


# #     jsonData = request.get_json()
# #     # print(jsonData, file=sys.stderr)

# #     # retreive info
# #     salesperson = jsonData["salesperson"]
# #     client = jsonData["client"]
# #     reams = jsonData["reams"]
# #     # update client if needed
# #     if client not in clients:
# #         clients.append(client)
# #     # update id
    
# #     newID = current_id

# #     # prepare new entry
# #     newSaleEntry = {
# #         "id"            : newID,
# #         "salesperson"   : salesperson,
# #         "client"        : client,
# #         "reams"         : reams
# #     }
    
# #     current_id += 1
# #     sales.append(newSaleEntry)

# #     return jsonify(sales=sales, clients=clients)

if __name__ == '__main__':
    app.run(debug=True)
