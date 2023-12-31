from flask import Flask, render_template, url_for, request, redirect, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from datetime import datetime
import json
import hashlib
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
db = SQLAlchemy(app)


class Task(db.Model):
    id = db.Column(db.String(36), nullable=False, primary_key=True)
    listid = db.Column(db.String(7), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    desc = db.Column(db.String(400))
  
  
class List(db.Model):
    id = db.Column(db.String(7), nullable=False, primary_key=True)


@app.route('/')
def index():
    return redirect('/newlist')
  
  
@app.route('/list/<id>')
def list(id):
    tasks = Task.query.filter_by(listid=id).all() 
    return render_template('list.html', id=id, tasks=tasks)
   
   
@app.route('/newlist')
def newlist():
    uid = str(uuid.uuid4())
    id = uid[0:3] + "-" + uid[3:6]
    while(List.query.filter_by(id=id).first() != None):
        uid = str(uuid.uuid4())
        id = uid[0:3] + "-" + uid[3:6]
        
    newList = List(id=id)
    db.session.add(newList)
    db.session.commit()
    return redirect('/list/'+id)
    
    
@app.route('/updatetasks/<listid>', methods=['POST'])
def updatetasks(listid):
    add = request.form.get("add")
    save = request.form.get("save")
    delete = request.form.get("delete")
    
    if(add != None):
        newTask = Task(id=str(uuid.uuid4()), listid=listid, name="", desc="")
        db.session.add(newTask)
        db.session.commit()
        
    if(save != None):
        for key in request.form.to_dict().keys():
            if(str(key)[0:4] == "task"):
                text = request.form.get(key)
                id = key[5:]
                Task.query.filter_by(id=id).first().name = text
        db.session.commit()
    
    if(delete != None):
        task = Task.query.filter_by(id=delete).first()
        db.session.delete(task)
        db.session.commit()
    
    return redirect('/list/'+listid)
    


if __name__ == "__main__":
    app.run(debug=True)

