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
    id = db.Column(db.String(36), nullable=False, primary_key=True)


#@app.route('/delete-document/', methods=['POST'])
#def delete_document():
#  json = request.get_json()
#  nodesToDelete = Node.query.filter_by(document=json["document_name"]).all() 
#  for node in nodesToDelete:
#    Node.query.filter_by(document=json["document_name"], divId=node.divId).delete()
#  Document.query.filter_by(name=json["document_name"]).delete()
#  db.session.commit() 
#  return "DELETE DOCUMENT"
  

#@app.route('/cudownload/<document_name>', methods=['GET'])
#def cudownload(document_name):
#    component_universe = {}
#    
#    nodes = Node.query.filter_by(document=document_name).all()
#    for node in nodes:
#        children_nodes = Node.query.filter_by(document=document_name, parent=node.divId).all()
#        children_texts = []
#        for child_node in children_nodes:
#            children_texts.append(child_node.text)
#        if node.text not in component_universe:
#            component_universe[node.text] = []
#        
#        component_universe[node.text].append(children_texts)
#        if len(component_universe[node.text]) > 1 and [] in component_universe[node.text]:
#            component_universe[node.text].remove([]) #we dont want a node to have an atomic breakdown if there is a real breakdown
#  
#    notes = Notes.query.filter_by(document=document_name).first()
#  
#    data = {}
#    data["component_universe"] = component_universe
#    data["file_name"] = document_name
#    return data


#@app.route('/download/<document_name>/<largestDivId>', methods=['GET'])
#def download(document_name, largestDivId):
#    dict = {}
#    trees = []
#    roots = Node.query.filter_by(document=document_name, parent=0).all()
#    notes = Notes.query.filter_by(document=document_name).first().text
#    for root in roots:
#        trees.append(makeTree(document_name, root.divId))
#    dict["document_name"] = document_name
#    dict["largestDivId"] = largestDivId
#    dict["trees"] = trees
#    dict["notes"] = notes
#    return dict


#@app.route('/save/', methods=['POST'])
#def save():
#  print("in flaskapp.save")  
#  json = request.get_json()  
#  print(json["notes"])  
#  documentObj = Document.query.filter_by(name=json["document_name"]).first()
#  if documentObj is not None:  
#    print("document exists")
#    setattr(documentObj, 'largestDivId', json["largestDivId"])
#  else:
#    documentObj = Document(name=json["document_name"], largestDivId=json["largestDivId"])
#    db.session.add(documentObj)
#  for node in json["nodes"]:
#    nodeObj = Node.query.filter_by(divId=node["node"]["id"], document=json["document_name"]).first()  
#    if nodeObj is not None:
#      print("node exists, overwritting")
#      setattr(nodeObj, 'parent', node["parent"]["id"])
#      setattr(nodeObj, 'text', node["node"]["text"])
#    else:
#      nodeObj = Node(divId=node["node"]["id"], document=json["document_name"], parent=node["parent"]["id"], text=node["node"]["text"])
#      db.session.add(nodeObj)
#      
#  for divId in json["nodesToDelete"]:
#    Node.query.filter_by(document=json["document_name"], divId=divId).delete()
#    
#  notesObj = Notes.query.filter_by(document=json["document_name"]).first()
#  if notesObj is not None:  
#    print("notes exists")
#    setattr(notesObj, 'text', json["notes"])
#    setattr(notesObj, 'document', json["document_name"])
#  else:
#    notesObj = Notes(document=json["document_name"], text=json["notes"])
#    db.session.add(notesObj)
#  
#  db.session.commit() 
#  return "SAVED TO DATABASE"
  
  
#http://www.cs.cmu.edu/~15110-f19/slides/week8-2-trees.pdf
#def makeTree(document_name, divId):
#  tree = {}
#  children = []
#  childrenObjs = Node.query.filter_by(parent=divId, document=document_name).all()  
#  for childObj in childrenObjs:
#    children.append( makeTree(document_name, childObj.divId) ) 
#  tree["divId"] = divId
#  tree["text"] = Node.query.filter_by(divId=divId, document=document_name).first().text
#  tree["parent"] = Node.query.filter_by(divId=divId, document=document_name).first().parent
#  tree["children"] = children
#  return tree


#@app.route('/document/<document_name>', methods=['GET']) #Currently deprecated. Will matter again in the future once the DB is re-connected
#@app.route('/document/')
#def document(document_name=""):
#  trees = []
#  document = Document.query.filter_by(name=document_name).first()
#  notesObj = Notes.query.filter_by(document=document_name).first()
#  notes = ""
#  largestId = 1
#  if(document_name == "" or document is None):
#    trees = []
#  else:
#    roots = Node.query.filter_by(document=document_name, parent=0).all()
#    for root in roots:
#        trees.append(makeTree(document_name, root.divId))
#  if document is not None:
#    largestId = document.largestDivId
#  if notesObj is not None:
#    notes = notesObj.text
#    
#  return render_template('tree.html', trees=trees, largestId=largestId, document_name=document_name, notes=notes)
  

#@app.route('/documents/')
#def documents():
#    documents = db.session.query(Document).all()
#    return render_template('documents.html', documents=documents)
  
  
#@app.route('/simulation/')
#def simulation():
#    return render_template('simulation.html')
 
 
#@app.route('/simulation/run', methods=['POST'])
#def simulation_run():
#    data = json.loads(request.data)
#    athlete_skillsets = list(data["athlete_probs"].keys())
#    coach_skillsets = list(data["coach_probs"].keys())
#    athletes = []
#    coaches = []
#    
#    for skillset in athlete_skillsets:
#        athletes.extend(lh.generate_entities(int(data["athlete_probs"][skillset]), json.loads(skillset)))
#    for skillset in coach_skillsets:
#        coaches.extend(lh.generate_entities(int(data["coach_probs"][skillset]), json.loads(skillset)))
#    
#    return json.dumps(lh.run(athletes, coaches, data["goal"], data["component_universe"], int(data["iterations"])))


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
    credentials = bytes(username+password, 'utf-8')
    h = hashlib.new('sha256')
    h.update(credentials)
    hashedCredentials = h.hexdigest()
    user = User.query.filter_by(HashedCredentials=hashedCredentials).first()
    if(user == None):
        return redirect('/home/')
    return redirect('/lists/')
    
@app.route('/signup/', methods=['POST'])
def signup():    
    username = request.form.get("username")
    password = request.form.get("password")
    credentials = bytes(username+password, 'utf-8')
    h = hashlib.new('sha256')
    h.update(credentials)
    hashedCredentials = h.hexdigest()
    user = User.query.filter_by(HashedCredentials=hashedCredentials).first()
    if(user != None):
        return redirect('/home/')
    newUser = User(username, hashedCredentials)
    db.session.add(newUser)
    db.session.commit()
    return redirect('/lists/')
    
@app.route('/lists/')
def lists():
    return "yup"


if __name__ == "__main__":
  app.run(debug=True)

