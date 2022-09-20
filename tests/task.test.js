const request = require('supertest')
const app = require('../server/app')
const Task = require('../server/models/task')
const {
       userOneId, 
       userOne, 
       userTwo, 
       userTwoId, 
       taskOne, 
       taskTwo, 
       taskThree, 
       taskFour,
       setupDatabase
       } = require('./fixtures/db')

beforeEach(setupDatabase)

test("should create task for user", async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', '')) 
    .send({
        title: "Finish nodejs section",
        desc: "I have to finish my udemy's NodeJS courses current section ",
        completed: false
    })
    .expect(200)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test("should fetch tasks of user", async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', '')) 
    .send()
    .expect(200)
})

//starting changes
test("should fetch only completed tasks of user", async () => {
    const response = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', '')) 
    .send()
    .expect(200)

    console.log(response.body.length) 
    response.body.forEach(res => {
        expect(res.completed).toBe(false)
    })
})

test("should fetch only incompleted tasks of user", async () => {
    const response = await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', '')) 
    .send()
    .expect(200)

    console.log(response.body.length) 
    response.body.forEach(res => {
        expect(res.completed).toBe(true)
    })
})

test("should fetch task by its id", async () => {
    const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', '')) 
    .send()
    .expect(200)

    // console.log(response.body.completed) 
})

test("should not fetch task if user's unauthenticated", async () => {
    const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', (`Bearer ${userTwo.tokens[0].token}`).replace('Bearer ', '')) 
    .send()
    .expect(404)
})


test("should delete task if user's authenticated", async () => {
    const response = await request(app)
    .delete(`/tasks/${taskTwo._id}`)
    .set('Authorization', (`Bearer ${userTwo.tokens[0].token}`).replace('Bearer ', '')) 
    .send()
    .expect(200)
})

test("should check security of tasks", async () => {
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', (`Bearer ${userTwo.tokens[0].token}`).replace('Bearer ', '')) 
    .send()
    .expect(500)
})
