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

from itsdangerous import json
app = Flask(__name__)



"""
@TODO:
global variables to maintain
    1. function(room arrangement) -> feedback, correct or not
    2. quiz score, correct answer for each question
"""

restaurants = []

# current_id = restaurants[-1]['id'] + 1



# ROUTES
@app.route('/')
def welcome():
    return render_template('welcome.html')

# TODO: implement this
@app.route('/learn<lesson_number>')
def learn():
    return render_template('learn.html')

# TODO: implement this
@app.route('/quiz_yourself/<quiz_number>')
def quiz_yourself():
    pass


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
