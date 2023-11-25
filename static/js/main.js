//https://builtin.com/software-engineering-perspectives/javascript-sleep
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

let tasks = document.getElementsByClassName("textbox");
const spin = async () => {
	for(let i = 0; i < tasks.length; i++){
		tasks[i].style.backgroundColor = "rgba(255,255,255,.33)"
	}
	
	let sleepTime = 0
	let i = 0
	let ti = 0
	while(sleepTime <  250){
		if(i == tasks.length){ i = 0 }
		let prevI = i - 1
		if(i == 0){ prevI = tasks.length - 1 }
		await sleep(sleepTime)
		tasks[i].style.backgroundColor = "red"
		tasks[prevI].style.backgroundColor = "rgba(255,255,255,.33)"
		sleepTime = Math.pow(2, ti * (1/10))
		i = i + 1
		ti = ti + 1
	}
	//make the spin button clickable again at the end of this function
}

function holdSpinButton(){
	
}