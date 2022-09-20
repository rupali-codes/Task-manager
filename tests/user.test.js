const request = require('supertest')
const app = require('../server/app')
const User = require('../server/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create user', async () => {
    const response = await request(app).post('/users').send({
        name: "neha",
        email: "neha@abracadabra.com",
        password: "itsRups",
        age: 18
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    //checking whether the user is inserted into db or not
    expect(user).not.toBeNull()

    //matching user properties with an object
    expect(response.body).toMatchObject({
        user: {
            name: 'neha',
            age: 18
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('itsRups')
})

test('should login user', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'rupali@abracadabra.com',
        password: 'itsRups1234'
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toEqual(user.tokens[0].token)

})

test('should not login user', async () => {
    await request(app).post('/users/login').send({
        email: 'rupali@abracadabra.com',
        password: 'itsRups1234!'
    }).expect(400)
})

test('shhould get user profile', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', '')) //setting headers
    .send()
    .expect(200)
})

test('should not get user profile',async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

//challenge
test('should delete account for user', async () => {
    const response  = await request(app)
    .delete('/users/me')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', '')) //setting headers
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBe(null)
})

test('should not delete account for user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)

})

//uploading files using superset
test("should upload avatar images", async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', ''))
    .attach('avatar', 'tests/fixtures/profile-pic.jpg') //used to attach files
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) /**toEqual() is used to compare propertires of an object however toBe() works as === operator */
})

//challenge 
test('should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', (`Bearer ${userOne.tokens[0].token}`).replace('Bearer ', ''))
    .send({
        name: 'arun'
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('arun')
})

test('should not update invalid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .send({
        location: "India"
    })
    .expect(401)
})

