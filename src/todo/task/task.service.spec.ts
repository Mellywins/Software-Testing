import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from '../entity/todo.entity';
import { TaskEntity } from '../entity/task.entity';
import { TaskService } from './task.service';
import {
  mockTaskRepository,
  mockTodoRepository,
} from '../test-artifacts/repositories/mocks';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockTodoRepository,
        },
        TaskService,
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
