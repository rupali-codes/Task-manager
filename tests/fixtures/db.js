const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId() //generating objectID
const userOne = {
    _id: userOneId,
    name: 'rupali',
    email: 'rupali@abracadabra.com',
    password: 'itsRups1234',
    age: 18,
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId() //generating objectID
const userTwo = {
    _id: userTwoId,
    name: 'pinku',
    email: 'pinku@abracadabra.com',
    password: 'itsPinku1234',
    age: 28,
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

//defining tasks in database
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'create UI structure for task app',
    desc: 'create an UI structure for the Task manager app',
    completed: false,
    author: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'comelete jest section',
    desc: 'will complete jest section today',
    completed: true,
    author: userTwoId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Dishes',
    desc: 'I have to wash dishes after dinner',
    completed: true,
    author: userOneId
}

const taskFour = {
     _id: new mongoose.Types.ObjectId(),
    title: 'Dishes',
    desc: 'I have to wash dishes after dinner',
    completed: false,
    author: userOneId
}
const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()

    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
    await new Task(taskFour).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    taskFour,
    setupDatabase
}