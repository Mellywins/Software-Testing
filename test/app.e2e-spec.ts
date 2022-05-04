import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { todos } from '../src/todo/mock/todos.mock';
import { TodoService } from '../src/todo/todo.service';
import { assert } from 'console';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  it('/api/todos (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/todos')
      .expect(200)
      .expect({ todos: await app.get(TodoService).getAllTodo() });
  });
  it('/api/todos/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/todos/eac408d0-3c78-11e9-b210-d663bd873d93')
      .expect(200)
      .expect({
        id: 'eac408d0-3c78-11e9-b210-d663bd873d93',
        name: 'Traveling Todo  list',
        description: null,
        owner: {
          id: 'cafb1073-0ace-4dec-95e7-8f8934e0d019',
          username: 'karim',
          email: 'karim@gmail.com',
        },
        tasks: [],
      });
  });
  it('/api/todos (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/todos')
      .send({
        name: 'Newly Posted todo for Test purpose',
        description: 'Random description',
        userId: 'cafb1073-0ace-4dec-95e7-8f8934e0d019',
      })
      .expect(201)
      .then((response) => {
        const payload = response.body;
        delete payload.id;
        expect(payload).toStrictEqual({
          name: 'Newly Posted todo for Test purpose',
          description: 'Random description',
          owner: {
            id: 'cafb1073-0ace-4dec-95e7-8f8934e0d019',
            username: 'karim',
            email: 'karim@gmail.com',
          },
        });
      });
  });
  it('/api/todos (PUT)', async () => {
    return request(app.getHttpServer())
      .put('/api/todos/eac40736-3c78-11e9-b210-d663bd873d93')
      .send({
        name: 'Edited Name',
        description: 'Office Todo list',
        userId: 'cafb1073-0ace-4dec-95e7-8f8934e0d019',
      })
      .expect(200)
      .expect({
        id: 'eac40736-3c78-11e9-b210-d663bd873d93',
        name: 'Edited Name',
        description: 'Office Todo list',
        owner: {
          id: 'cafb1073-0ace-4dec-95e7-8f8934e0d019',
          username: 'karim',
          email: 'karim@gmail.com',
        },
        tasks: [
          {
            id: 'b91a5a90-3cce-11e9-b210-d663bd873d93',
            name: 'Bring chairs',
          },
          {
            id: 'b91a5bf8-3cce-11e9-b210-d663bd873d93',
            name: 'Bring tables',
          },
        ],
      });
  });
  afterAll(async () => {
    await app.close();
  });
});
