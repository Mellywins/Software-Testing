import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { UserEntity } from './entity/user.entity';
import {
  mockTodoRepository,
  mockUserRepository,
} from './test-artifacts/repositories/mocks';
import { TodoService } from './todo.service';
import { UsersService } from './users.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: mockTodoRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        UsersService,
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
