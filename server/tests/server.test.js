const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({
        text
      }).expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      }).end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });

  });

  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todos route', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);
  });
});

describe('GET /todos/:id route', () => {
  it('should retrieve a specific todo', (done) => {

    var id = todos[0]._id;

    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('First test todo');
      }).end((err, res) => {
        done();
      });
    });

  it('should throw 404 because invalid id', (done) => {

    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  });

  it('should throw 404 because id not found', (done) => {

    request(app)
      .get('/todos/59764bf7ea5c844c3020a671')
      .expect(404)
      .end(done);
  });

});

describe("DELETE /todos/:id route", () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      }).end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch(err => done(err));

      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete('/todos/59764bf7ea5c844c3020a671')
      .expect(404)
      .end(done);
  });

  it('should return 404 if objectID is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    updateString = 'Update text from mocha test'
    updateCompleted = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: updateString,
        completed: updateCompleted
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateString);
        expect(res.body.todo.completed).toBe(updateCompleted);
        expect(res.body.todo.completedAt).toBeA('number');
      }).end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(updateString);
          expect(todo.completed).toBe(updateCompleted);
          done();
        }).catch(err => done(err));
      });

  });

  it('should set completedAt to null, and completed to false', (done) => {
    var hexId = todos[1]._id.toHexString();

    updateString = 'Checking if completedAt is null'
    updateCompleted = false;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: updateString,
        completed: updateCompleted
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateString);
        expect(res.body.todo.completed).toBe(updateCompleted);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(updateString);
          expect(todo.completed).toBe(updateCompleted);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch(err => done(err));
      })
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .patch('/todos/59764bf7ea5c844c3020a671')
      .expect(404)
      .end(done);
  });

  it('should return 404 if objectID is invalid', (done) => {
    request(app)
      .patch('/todos/123')
      .expect(404)
      .end(done)
  });
});

describe('GET /user/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/user/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/user/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /user', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/user')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should return validation errors when request invalid', (done) => {
    var email = 'test';
    var password = '';

    request(app)
      .post('/user')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = 'steven@example.com';
    var password = 'password';

    request(app)
      .post('/user')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /user/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/user/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/user/login')
      .send({
        email: users[1].email,
        password: 'wrongPass'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });
});
