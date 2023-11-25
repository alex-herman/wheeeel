function spin(){
	let tasks = document.getElementsByClassName("textbox");
	setTimeout(tick(0, 100), 100);
}

let tasks = document.getElementsByClassName("textbox");
function tick(i, counter){
	console.log(i)
	if(counter < 2000){
		if(i == tasks.length) { i = 0 }
		tasks[i].style.backgroundColor = "red"
		let prevI = i-1 
		if(i == 0){ prevI = tasks.length - 1}
		tasks[prevI].style.backgroundColor = "rgba(255,255,255,.33)"
		setTimeout(tick(i+1, counter*1.01))
	}
}
