//https://builtin.com/software-engineering-perspectives/javascript-sleep
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

let tasks = document.getElementsByClassName("textbox");
const spin = async () => {
	document.getElementById("spin-button").disabled = true;

	for(let i = 0; i < tasks.length; i++){
		tasks[i].style.backgroundColor = "rgba(255,255,255,.66)"
	}
	
	let sleepTime = 0
	let i = Math.floor(Math.random() * tasks.length)
	let ti = 0
	while(sleepTime <  250){
		if(i == tasks.length){ i = 0 }
		let prevI = i - 1
		if(i == 0){ prevI = tasks.length - 1 }
		await sleep(sleepTime)
		tasks[i].style.backgroundColor = "#ff4d01"
		tasks[prevI].style.backgroundColor = "rgba(255,255,255,.66)"
		sleepTime = Math.pow(2, ti * (1/10))
		i = i + 1
		ti = ti + 1
	}
	document.getElementById("spin-button").disabled = false;
}

function showDelete(id){
	document.getElementById(id).style.display = "inline";
}

const hideDelete = async (id) => {
	await sleep(250)
	document.getElementById(id).style.display = "none";
}

function holdSpinButton(){
	
}