//https://www.w3schools.com/jsref/met_node_clonenode.asp
//https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode
//https://stackoverflow.com/questions/19159075/how-to-append-div-in-existing-div
//https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild
//https://stackoverflow.com/questions/31790233/how-to-clone-textareas-with-clonenode


toDelete = []

curId = 0;  
function nextId(){
  curId++;
  return curId;
}


function sanitize_string(str){
	str = str + "";
	str = str.replace( /[\r\n]+/gm, "" );
	str = str.replace(/ /g,"_");
	return str;
}


function deleteDocument(document){
  let data = {}
  data["document_name"] = document
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      alert(xhr.responseText);
	  window.location.href="/documents/"
    }
  }
  xhr.open("POST", "/delete-document");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}


function onCuDownloadButtonClicked(){
  alert("Did you save first?");
  documentData = associateNodes()
  documentData["document_name"] = document.getElementById("saveName").value;
	
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      alert(xhr.responseText);
	  data = JSON.parse(xhr.responseText);
	  const link = document.createElement("a");
      const content = JSON.stringify(data["component_universe"]);
      const file = new Blob([content], { type: 'text/plain' });
      link.href = URL.createObjectURL(file);
      link.download = "cu-" + data["file_name"];
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }
  xhr.open("GET", "/cudownload/" + documentData["document_name"]);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
}


//TODO MAKE THIS ACTUALLY WAIT FOR IT TO SAVE FIRST
function onDownloadButtonClicked(){
  alert("Did you save first?");
  documentData = associateNodes()
  documentData["document_name"] = document.getElementById("saveName").value;
  documentData["largestDivId"] = curId;
	
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      alert(xhr.responseText);
	  data = JSON.parse(xhr.responseText);
	  const link = document.createElement("a");
      const content = JSON.stringify(data);
      const file = new Blob([content], { type: 'text/plain' });
      link.href = URL.createObjectURL(file);
      link.download = data["document_name"];
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }
  xhr.open("GET", "/download/" + documentData["document_name"] + "/" + documentData["largestDivId"]);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
}


//https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Ajax-JavaScript-file-upload-example
//https://flaviocopes.com/file-upload-using-ajax/
//https://stackoverflow.com/questions/6211145/upload-file-with-ajax-xmlhttprequest
//https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
function onImportButtonClicked(){
	var input = document.createElement('input');
	input.type = 'file';
	
	input.onchange = e => { 
	  var file = e.target.files[0]; 
	  var reader = new FileReader();
	  reader.readAsText(file,'UTF-8');
	  reader.onload = readerEvent => {
        var content = readerEvent.target.result; 
		json = JSON.parse(content)
		renderDocument(json["trees"], json["largestDivId"], "IMPORT - " + json["document_name"])
		document.getElementById("notes").value = json["notes"]
      }
	}
	
	input.click();
}


function onLoadButtonClicked(){
  window.location.href = "/documents/"
}

function onNewButtonClicked(){
  window.location.href = "/document/"
}

function stickValueToHTML(){
	const node = document.getElementById("body")
	var textareas = node.getElementsByTagName("textarea");
	for (var i = 0; i < textareas.length; ++i) {
		textareas[i].innerHTML = textareas[i].value;
	}
}

function onAddTreeButtonClicked(){
	id = nextId()
	stickValueToHTML()
	renderTrees([{"divId":id, "text":"", "parent":0, "children":[]}], curId, )
}

function onAddButtonClicked(id){
	stickValueToHTML()
	addComponentToNode(id);
}


function associateNodes(){
  let data = {}
  let nodes = []
  for(let i = 1; i <= curId; i++) {
    node = document.getElementById(i.toString())
	if(node){
	  parentLink = document.getElementById("parent_" + i.toString())
	  parent = document.getElementById(parentLink.value)
	  if(parent){
	    nodes.push({ "node": {"id":node.id, "text":node.value}, "parent":{"id":parent.id, "text":parent.value} }) 
	  } else {
		nodes.push({ "node": {"id":node.id, "text":node.value}, "parent":{"id":0, "text":""} }) 
	  }
	}
  }

  data["nodes"] = nodes;
  return data;
}


function onSaveButtonClicked(){
  data = associateNodes();
  data["nodesToDelete"] = toDelete;
  data["document_name"] = document.getElementById("saveName").value;
  data["largestDivId"] = curId;
  data["notes"] = document.getElementById("notes").value;
  console.log(data["notes"])
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        alert(xhr.responseText);
		//window.location.href = "/tree/"+data["document_name"];
    }
  }
  xhr.open("POST", "/save");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}


//https://stackoverflow.com/questions/3387427/remove-element-by-id
function onXButtonClicked(id){
  node_li = document.getElementById("node_"+id);
  childTextareas = node_li.getElementsByTagName("textarea"); //all textareas at and below node_li in the DOM
  for(let i = 0; i < childTextareas.length; i++) {
	console.log(childTextareas[i].id)
	toDelete.push(childTextareas[i].id)
  }
  node_li.parentNode.removeChild(node_li);
  console.log(toDelete)
}


function showComponentToolBar(id){
  if(id != "goal_toolbar"){ id = "component_toolbar_" + id; }
  document.getElementById(id).style.opacity = "1.0";
}


function hideComponentToolBar(id){
  if(id != "goal_toolbar"){ id = "component_toolbar_" + id; }
  document.getElementById(id).style.opacity = "0.0";
}


function renderDocument(trees, largestId, document_name){
	document.getElementById("saveName").value = document_name
	renderTrees(trees, largestId)
}


function renderTrees(trees, largestId){
	curId = largestId;
	for(let i = 0; i < trees.length; i++) {
		document.getElementById("tree_container").innerHTML += '<div class="tree"><ul>' + generateTreeHtml(trees[i]) + '</ul></div>'
	}
}


function loopOverChildren(tree){
  treeHtml = ""
  if(tree.children){
    for(let i = 0; i < tree.children.length; i++) {
	  treeHtml += generateTreeHtml(tree.children[i])
	  tree.children[i].text + " " 
	}
  }
  return treeHtml
}


function createComponentHtml(id, parent, text){
	nodeHtml=`
    <li id=node_`+id+` class="node">
		<div id="component_div_`+id+`" class="component_div" onmouseover="showComponentToolBar('`+id+`')" onmouseout="hideComponentToolBar('`+id+`')">
			<div id="component_toolbar_`+id+`" class="component_toolbar">
				<button type="button" class="component_toolbar_button x_button" style="float:right" onclick="onXButtonClicked('`+id+`')">x</button>
				<button type="button" class="component_toolbar_button" style="float:right" onclick="onAddButtonClicked('`+id+`')">+</button>
			</div>
			<input type="hidden" id="parent_`+id+`" value="`+parent+`">
			<textarea name="`+id+`" id="`+id+`" class="component" placeholder="Component">`+text+`</textarea>
		</div>
  `
  
  return nodeHtml;
}


function generateTreeHtml(tree){
  nodeHtml = createComponentHtml(tree.divId, tree.parent, tree.text)
  
  treeHtml = ""
  if(tree.children.length > 0){
    treeHtml = nodeHtml + `
		<ul id="children_`+tree.divId+`">
	      `+loopOverChildren(tree)+`
	    </ul>
	  </li>
    `
  }
  else{
	treeHtml = nodeHtml + loopOverChildren(tree);
  }
  return treeHtml;
}


//Parent node is nodeId
function addComponentToNode(nodeId){
  id = nextId();
  nodeHtml = createComponentHtml(id, nodeId, "")
  
  children = document.getElementById("children_"+nodeId)
  if(children){
	children.innerHTML += nodeHtml;
  } else {
    document.getElementById("node_"+nodeId).innerHTML += `<ul id="children_`+nodeId+`">`+nodeHtml+`</ul>`
  }
}


function loadDocument(name){
  window.location.href="/document/" + name
}


function makeTdictFile(){
  
}