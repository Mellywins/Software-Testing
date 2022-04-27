import { Injectable, Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './todo/entity/user.entity';
import { todos } from './todo/mock/todos.mock';
import { TodoEntity } from './todo/entity/todo.entity';
import { TaskEntity } from './todo/entity/task.entity';
@Injectable()
export class DatabaseInitService {
  private logger: Logger;
  constructor(
    @InjectRepository(UserEntity) userRepo: Repository<UserEntity>,
    @InjectRepository(TodoEntity) todoRepo: Repository<TodoEntity>,
    @InjectRepository(TaskEntity) taskRepo: Repository<TaskEntity>,
  ) {
    this.logger = new Logger('DatabaseInitService');
    userRepo.findOne({ where: { username: 'karim' } }).then((user) => {
      if (!user) {
        const user = userRepo.create({
          username: 'karim',
          password: '@dF%^hGb03W~',
          email: 'karim@gmail.com',
        });
        userRepo.save(user);
      }
      todoRepo.find().then((queriedTodos) => {
        if (queriedTodos.length === 0) {
          this.logger.log('No todos found in db. Creating mock data...');
          todos.forEach((todo) => {
            const dbTodo = todoRepo.create({
              ...todo,
              owner: user,
            });
            if (todo.tasks) {
              const tasks = todo.tasks.reduce((acc, task) => {
                const newTask = taskRepo.create({ ...task, todo: dbTodo });
                acc.push(newTask);
                taskRepo.save(newTask);
                return acc;
              }, []);
              todoRepo.merge(dbTodo, { tasks });
            }
            console.log(dbTodo);
            todoRepo.save(dbTodo);
            this.logger.log(`Created todo: ${dbTodo.name}`);
          });
        } else {
          this.logger.log('Todos already exist in db');
        }
      });
    });
  }
}
