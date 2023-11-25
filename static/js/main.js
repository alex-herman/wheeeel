//https://builtin.com/software-engineering-perspectives/javascript-sleep
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

let tasks = document.getElementsByClassName("textbox");
const spin = async () => {
	let sleepTime = 100
	let i = 0
	while(sleepTime <  2500){
		if(i == tasks.length){ i = 0 }
		let prevI = i - 1
		if(i == 0){ prevI = tasks.length - 1 }
		await sleep(sleepTime)
		tasks[i].style.backgroundColor = "red"
		tasks[prevI].style.backgroundColor = "rgba(255,255,255,.33)"
		sleepTime = sleepTime * 1.15
		i = i + 1
	}
}