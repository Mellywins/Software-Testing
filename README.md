# Software Testing: Unit, Integration, End-to-end
This repository will hold an example of how to test a backend application. 
## Navigation guide
You'll find the test written in files following this glob pattern: `*.spec.ts`
The mocked data will be contained in this [todos.mock.ts](./src/todo/mock/todos.mock.ts) file.
The e2e tests are written in this file: [app.e2e-spec.ts](./test/app.e2e-spec.ts).
Note that the e2e test will perform changes to the database, as this project is puprosely made for test reasons. In real life scenarios, you'd want to use a seperate testing database for this feature.
## Running the tests:
To run the test, you first need to build the project and startup postgres with docker.
Follow these steps:
1. Clone the repository.
2. `npm install`
3. `npm run build`
4. `docker-compose up`
5. `npm run test` for unit and integration tests.
6. `npm run test:e2e` to run the e2e tests.

## Detailed explanation
For the unit tests, since we'd want to mock the API calls and the Database calls, I encapculated the mocked repositories pattern used for the different entities in this [file](./src/todo/test-artifacts/repositories/mocks.ts). This is a brief explanation of the file:

Every repository is in this form: 
```typescript
const xRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
}
```
Then the jest library allows to mock the implementation of the repository functions to fit our test logic.
What's left now is to override the NestJS Provider of the Typeorm to use our object instead of the abstract functions provided by the typeorm library. We do it this way:
```typescript

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });
```
In the normal service definition, we defined it this way instead
```typescript
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
  // Some methods definitions
}
```
The userRepo is a dependency of the service, so we have to overwrite it with our mocked dependency to run the unit tests.

After the dependencies are mocked, we now have to mock the service itself. This can be achieved like this: 
```typescript
describe('UsersService', () => {
  let service: UsersService;
  const mockUserService = {
    findOne: jest.fn((options) => {
      return mockUserRepository.findOne(options.id);
    }),
    create: jest.fn(
      async (userDto: CreateUserDto): Promise<UserEntity> =>
        mockUserRepository.create(userDto),
    ),
  };
```