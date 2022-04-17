# coding=utf-8

"""
UNI: rl3250
Name: Ruize Li

This is the flask backend for homeworks in UI COMS 4111.


@TODO:
    1. welcome page
    2. learn page -> GET POST methods to receive locations of objects and return corresponding feedback/hints
    3. quiz page -> GET POST methods to receive the user's answer and return feedback, maintain scores for user
    3. I intentially left my code from midterm so that we have some template for ajax/storing json
"""

from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import random
import sys

# from itsdangerous import json
app = Flask(__name__)



"""
@TODO:
global variables to maintain
    1. function(room arrangement) -> feedback, correct or not
    2. quiz score, correct answer for each question
"""
furniture = [
    {
        "furniture_id" : "1",
        "furniture" : "bed",
        "img_url": "../static/images/Bed.JPG" 
        # "img_url" : "https://media.istockphoto.com/vectors/cat-lying-on-the-bed-cute-funny-scene-top-view-cartoon-style-image-vector-id1084804806?k=20&m=1084804806&s=612x612&w=0&h=t_8yAXc40RKVHjQXflR6oDzkwIgQ7fVsEr7proyJHo8="
    }
]

good_lessons = [
    {
        "good_id" : "1",
        "good_title" : "Bed in corner",
        "good_feedback" : "Great! It is good practice in a college dorm (or smaller rooms in general) to position the bed in a corner."
    },
    {
        "good_id" : "2",
        "good_title" : "Large clear space",
        "good_feedback" : "Excellent! You’ve identified another good rule. For a college dorm, it’s good to have a (relatively) large open space. Clearing out space will clear your mind and prevent distractions."
    },
    {
        "good_id" : "3",
        "good_title" : "Desk should have view of door",
        "good_feedback" : "Amazing! It’s good to have your desk allow a view of the door. Try to always position the desk so that the door is in sight!"

    },
    {
        "good_id" : "4",
        "good_title" : "Desk close to window",
        "good_feedback" : "Nicely done! It’s good to have the desk close to the window. Having the desk close to the window allows for nice natural lighting during the day!"
    }
]

bad_lessons = [
    {
        "bad_id" : "1",
        "bad_title" : "Bed should not backed by window",
        "bad_feedback" : "Oh dear! In Feng Shui for a good night’s sleep your bed needs to be backed by something solid, like a wall - not a window where something could sneak up on you"
    },
    {
        "bad_id" : "2",
        "bad_title" : "Bed should not be in line with door",
        "bad_feedback" : "Oh no! In Feng Shui it is bad to have your bed directly in line with the door, because “the chi (energy) is too intense”. It is known as “dead man’s position” or 'coffin position'."
    },
    {
        "bad_id" : "3",
        "bad_title" : "Desk should not be facing away from door",
        "bad_feedback" : "Oh dear! In Feng Shui people try to not have their backs against the door as this could lead to one feeling vulnerable. Imagine all the things that could sneak up on you!"
    },
    {
        "bad_id" : "4",
        "bad_title" : "Bed and desk should not be too close",
        "bad_feedback" : "Oops! In Feng Shui, the bed is seen as an area for rest and the desk a workspace. Try to not have the bed and desk so close for some Feng Shui work life balance!"
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


# ROUTES
@app.route('/')
def welcome():
    return render_template('welcome.html')

# TODO: implement this
@app.route('/learn')
def learn():
    # relative image urls, use thses in the furniture defined above!!
    img_urls = [
        "../static/images/_door.png",
        "../static/images/_window.jpeg",
        "../static/images/Bed.JPG"
    ]
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
