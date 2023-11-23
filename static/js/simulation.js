componentUniverse = {}
athlete_probs = {}
coach_probs = {}
goal = ""
iterations = 1000
numAthleteSkillSets = 0
numCoachSkillSets = 0


function runSimulation(){
	iterations = document.getElementById("numIterations").value
	document.getElementById("run_simulation_modal").style.display = "none";
	
	//https://reqbin.com/code/javascript/wzp2hxwh/javascript-post-request-example
	let xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			alert(xhr.responseText);
			data = JSON.parse(xhr.responseText);
			const link = document.createElement("a");
			const content = JSON.stringify(data);
			const file = new Blob([content], { type: 'text/plain' });
			link.href = URL.createObjectURL(file);
			link.download = "SIM_RESULTS";
			link.click();
			URL.revokeObjectURL(link.href);
		}
	}
  
	xhr.open("POST", "/simulation/run");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-Type", "application/json");


	let data = {
		"component_universe":componentUniverse,
		"athlete_probs":athlete_probs,
		"coach_probs":coach_probs,
		"goal": goal,
		"iterations":iterations
	}
	xhr.send(JSON.stringify(data));
}


function onRunSimulationButtonClicked(){
		document.getElementById("run_simulation_modal").style.display = "block";
}

function onLoadComponentUniverseButtonClicked(){
	var input = document.createElement('input');
	input.type = 'file';
	input.onchange = e => { 
	  var file = e.target.files[0]; 
	  var reader = new FileReader();
	  reader.readAsText(file,'UTF-8');
	  reader.onload = readerEvent => {
        var content = readerEvent.target.result; 
		json = JSON.parse(content)
		componentUniverse = json
      }
	}
	input.click();
}


function onConfigureAthletesButtonClicked(){
	document.getElementById("configure_athletes_modal").style.display = "block";
}

function onConfigureCoachesButtonClicked(){
	document.getElementById("configure_coaches_modal").style.display = "block";
}

function setGoal(component){
	goal = component
	document.getElementById("set_goal_modal").style.display = "none";
}


function setAthleteProbs(){
	athlete_probs = {}
	for(let i = 1; i <= numAthleteSkillSets; i++) {
		skillset = {}
		for (let component in componentUniverse){
			skillset[component] = document.getElementById("athlete_skillset_"+i+"_"+component).value
		}
		athlete_probs[JSON.stringify(skillset)] = document.getElementById("athlete_skillset_"+i+"_num_athletes").value
	}
	//console.log(athlete_probs)
	document.getElementById("configure_athletes_modal").style.display = "none";
}


function setCoachProbs(){
	coach_probs = {}
	for(let i = 1; i <= numCoachSkillSets; i++) {
		skillset = {}
		for (let component in componentUniverse){
			skillset[component] = document.getElementById("coach_skillset_"+i+"_"+component).value
		}
		coach_probs[JSON.stringify(skillset)] = document.getElementById("coach_skillset_"+i+"_num_coaches").value
	}
	//console.log(coach_probs)
	document.getElementById("configure_coaches_modal").style.display = "none";
}


function onSetGoalButtonClicked(){
	document.getElementById("goals").innerHTML = ""
	for (let component in componentUniverse) {
		if(componentUniverse[component][0].length != 0){ //if its an atomic component it cannot be the goal
			document.getElementById("goals").innerHTML += `
				<button class="goal_button" onclick="setGoal('`+component+`')">`+component+`</button>
			`
		}
	}
	
	document.getElementById("set_goal_modal").style.display = "block";
}


function onAddAthleteSkillsetButtonClicked(){
	numAthleteSkillSets++
	skillsetId = "athlete_skillset_"+numAthleteSkillSets
	document.getElementById("athleteSkillsets").innerHTML += `
		<br>
		<div class="skillset" id=`+skillsetId+`></div>
	`
	
	for (let component in componentUniverse) {
		if(componentUniverse[component][0].length == 0){ //if its an atomic component
			document.getElementById(skillsetId).innerHTML += `
				<label>`+component+`:</label>
				<input type="number" id="`+skillsetId+`_`+component+`" value="1" style="width: 40px;" min="0" max="1" readonly>
			`
		}
		
		else if(component == goal){
			document.getElementById(skillsetId).innerHTML += `
				<label>`+component+`:</label>
				<input type="number" id="`+skillsetId+`_`+component+`" value="0" style="width: 40px;" min="0" max="1" readonly>
			`
		}
		
		else{
			document.getElementById(skillsetId).innerHTML += `
				<label>`+component+`:</label>
				<input type="number" id="`+skillsetId+`_`+component+`" value="0.5" style="width: 40px; color:red;" min="0" max="1">
			`
		}
	}
	
	document.getElementById(skillsetId).innerHTML += `
	<br>
	<label>Number in simulation:</label>
	<input type="number" id="`+skillsetId+`_`+"num_athletes"+`" value="1" style="width: 40px; color:red;">
	`
}


function onAddCoachSkillsetButtonClicked(){
	numCoachSkillSets++
	skillsetId = "coach_skillset_"+numCoachSkillSets
	document.getElementById("coachSkillsets").innerHTML += `
		<br>
		<div class="skillset" id=`+skillsetId+`></div>
	`
	
	for (let component in componentUniverse) {
		if(componentUniverse[component][0].length == 0){ //if its an atomic component
			document.getElementById(skillsetId).innerHTML += `
				<label>`+component+`:</label>
				<input type="number" id="`+skillsetId+`_`+component+`" value="1" style="width: 40px;" min="0" max="1" readonly>
			`
		}
		
		else if(component == goal){
			document.getElementById(skillsetId).innerHTML += `
				<label>`+component+`:</label>
				<input type="number" id="`+skillsetId+`_`+component+`" value="1" style="width: 40px;" min="0" max="1" readonly>
			`
		}
		
		else{
			document.getElementById(skillsetId).innerHTML += `
				<label>`+component+`:</label>
				<input type="number" id="`+skillsetId+`_`+component+`" value="1" style="width: 40px; color:red;" min="0" max="1">
			`
		}
	}
	
	document.getElementById(skillsetId).innerHTML += `
	<br>
	<label>Number in simulation:</label>
	<input type="number" id="`+skillsetId+`_`+"num_coaches"+`" value="1" style="width: 40px; color:red;">
	`
}


function closeModal(id){
	document.getElementById(id).style.display = "none";
}