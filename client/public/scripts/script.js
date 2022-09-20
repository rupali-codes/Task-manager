const searchIn = document.querySelector('#searchIn')
const searchBtn = document.querySelector('.searchBtn')
const Tasks = document.querySelector('#tasks')
const title = document.querySelector('#title')
const desc = document.querySelector('#desc')
const tId = document.querySelector('#tId')
const completed = document.querySelector('#completed')
const pending = document.querySelector('#pending')
const all = document.querySelector('#all')
const updateProfile = document.querySelector('.updateProfile')
const updateProfileBtn = document.querySelector('#updateProfileBtn')
const closeBtn = document.querySelector('.closeBtn')
const uName = document.querySelector('#uName')
const uEmail = document.querySelector('#uEmail')
const uPassword = document.querySelector('#uPassword')
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')

const tasksArr = [{
	title: 'Work',
	desc: 'Lorem ipsum dolor sit. xcepteur sint occaecat cupidatat non proident, sunt in qui ...',
	completed: false
},{
	title: 'Play',
	desc: 'Lorem ipsum dolor sit. xcepteur sint occaecat cupidatat non proident, sunt in qui ...',
	completed: false
}, {
	title: 'Walk',
	desc: 'Lorem ipsum dolor sit. xcepteur sint occaecat cupidatat non proident, sunt in qui ...',
	completed: false
}, {
	title: 'Workout',
	desc: 'Lorem ipsum dolor sit. xcepteur sint occaecat cupidatat non proident, sunt in qui ...',
	completed: true
}, {
	title: 'Workout',
	desc: 'Lorem ipsum dolor sit. xcepteur sint occaecat cupidatat non proident, sunt in qui ...',
	completed: true
}, {
	title: 'Workout',
	desc: 'Lorem ipsum dolor sit. xcepteur sint occaecat cupidatat non proident, sunt in qui ...',
	completed: true
}, {
	title: 'Workout',
	desc: 'Lorem ipsum dolor sit. xcepteur sint occaecat cupidatat non proident, sunt in qui ...',
	completed: true
}]

const colors = ['blue', 'orange', 'violet', 'skyblue', 'light-red-s', 'light-red-w', 'green']


const cardMarkup = (task) => {
	const index = Math.floor( Math.random() * colors.length)
	const color = colors[index]
	let status = 'Pending'
	let statusIcon = 'alarm-fill'
	if(task.completed){
		status = "Completed"
		statusIcon = 'check2-circle'
	}
	// title.value = task.title
	return `
	<div class="card mx-2 rounded ${color}">
    <div class="ms-auto mx-4 fs-4 hover-transform-backward">
    	${status}
      <i class="bi bi-${statusIcon} "></i>
    </div>
    <div class="card-body" title="Edit Task" data-bs-toggle="modal" data-bs-target="#editTask">
      <div style="display:none;" class="taskId">${task._id}</div>
        <h4 class="card-title col-md-9 hover-transform-forward">${task.title}</h4>

      <h5 class="desc">${task.desc}</h5>
     	
    </div>
    	<div class="mx-3">
    		<a class="ms-auto fs-4" href="/user/tasks/remove/${task._id}">
					<button class="actionBtn hover-transform-forward fw-bold" title="Remove Task" data-bs-toggle="" data-bs-target=" "><i class="bi bi-archive"></i> Remove</button>
    		</a>
    	</div>
  </div>
	`
}

const noTaskFound = () => {
	Tasks.innerHTML = `<div class="w-50 mx-auto"><h2 class="text-center text-light">No Task found. </h2></div>`
}

const render = (tasks) => {
	Tasks.innerHTML = ''
	tasks.map(task => {
		if(task)
			Tasks.insertAdjacentHTML('beforeend', cardMarkup(task))
	})
}

// render(tasksArr)
let myTasks = []
const allTasks = () => {
	fetch('/user/tasks/all')
	.then(res => res.json())
	.then(data => {
		myTasks = [...data]
		render(data)
	})
}

const completedTasks = () => {
	fetch('/user/tasks/completed')
	.then(res => res.json())
	.then(data => {
		render(data)
	})
}

const pendingTasks = () => {
	fetch('/user/tasks/pending')
	.then(res => res.json())
	.then(data => {
		render(data)
	})
}

allTasks()

completed.addEventListener('click', completedTasks)
pending.addEventListener('click', pendingTasks)
all.addEventListener('click', allTasks)


Tasks.addEventListener('click', (e) => {
	const parent = e.target.parentElement
	if(parent.classList.contains('card-body')){
		tId.value = parent.childNodes[1].textContent
		title.value = parent.childNodes[3].childNodes[1].textContent
		desc.value = parent.childNodes[5].textContent
	}
})

updateProfileBtn.addEventListener('click', () => {
	updateProfile.classList.toggle('hidden')
})

closeBtn.addEventListener('click', () => {
	updateProfile.classList.add('hidden')
})

searchIn.addEventListener('input', () => {
	const input = searchIn.value.toLowerCase()
	const results = myTasks.filter(task => task.title.toLowerCase().includes(input))
	if(results.length === 0){
		noTaskFound()
	}else{
		render(results)
	}
})

// const generateQuote = function(){
	const setHeader = {
		headers: {
			Accept: "application/json"
		}
	}

	fetch('https://free-quotes-api.herokuapp.com/')
		.then(res => res.json())
		.then(data => {
			quote.textContent = data.quote
			author.textContent = data.author
		})
