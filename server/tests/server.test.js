const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
