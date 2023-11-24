from flask import Flask, render_template, url_for, request, redirect, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from datetime import datetime
import json
import hashlib
import uuid
#print uuid.uuid4()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
db = SQLAlchemy(app)


#https://www.youtube.com/watch?v=jTiyt6W1Qpo&ab_channel=PrettyPrinted
class User(db.Model):
    Username = db.Column(db.String(24), nullable=False, primary_key=True)
    HashedCredentials = db.Column(db.String(64), nullable=False)

class Task(db.Model):
    List = db.Column(db.String(24), nullable=False, primary_key=True)
    name = db.Column(db.String(200), nullable=False, primary_key=True)
    desc = db.Column(db.String(400))
  
class List(db.Model):
    name = db.Column(db.String(200), nullable=False, primary_key=True)
    owner = db.Column(db.String(24), nullable=False, primary_key=True)

@app.route('/home/')
def home():
    return render_template('home.html')

@app.route('/')
def index():
    return redirect('/home/')
  
@app.route('/login/', methods=['POST'])
def login():
    username = request.form.get("username")
    password = request.form.get("password")
    login = request.form.get("login")
    signup = request.form.get("signup")
    credentials = bytes(username+password, 'utf-8')
    h = hashlib.new('sha256')
    h.update(credentials)
    hashedCredentials = h.hexdigest()
    user = User.query.filter_by(Username=username).first()

    #TODO: Look into sessions to make it a proper authentication scheme
    # https://testdriven.io/blog/flask-sessions/
    if(login):
        if(user == None):
            return redirect('/home/')
        else: #This pass check scheme is dumb. DONT USE THIS IN PROD
            #user exists, now see if the user+password hash matches (AKA see if they typed the right password)
            passcheck = User.query.filter_by(HashedCredentials=hashedCredentials).first()
            if(passcheck == None):
                return redirect('/home/')
            else:
                return redirect('/lists/'+username) 
                #might need some secrety session key or something to prevent people from just going to the URL
    if(signup):
        if(user != None):
            return redirect('/home/')
        newUser = User(Username=username, HashedCredentials=hashedCredentials)
        db.session.add(newUser)
        db.session.commit()
        return redirect('/lists/'+username)
        
@app.route('/lists/<user>')
def lists(user):
    lists = List.query.filter_by(owner=user).all()
    print(lists)
    return render_template('lists.html', username=user, lists=lists)

@app.route('/newlist/', methods=['POST'])
def newlist():
    username = request.form.get("username")
    name = request.form.get("name")
    newList = List(owner=username, name=request.form.get("name"))
    db.session.add(newList)
    db.session.commit()
        
    return redirect('/lists/'+username)


if __name__ == "__main__":
    app.run(debug=True)

