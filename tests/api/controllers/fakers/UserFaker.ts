export const notFoundUuid = '00000000-0000-0000-0000-000000000000';

export const notValidUuid = 'Not a valid UUID';

export const validUserDataList = [
  {
    username: 'Valid user 1',
    age: 20,
    hobbies: [
      'hobby 1',
      'hobby 2',
    ],
  },
  {
    username: 'Valid user 2',
    age: 20,
    hobbies: [],
  },
  {
    username: 'Valid user 3',
    age: 20,
    hobbies: [],
  },
];

export const notValidUserDataList = [
  {
    describe: 'username field is empty',
    data: {
      username: null,
      age: 20,
      hobbies: [
        'hobby 1',
        'hobby 2',
      ],
    },
  },
  {
    describe: 'username field is not string',
    data: {
      username: 2000,
      age: 20,
      hobbies: [
        'hobby 1',
        'hobby 2',
      ],
    },
  },
  {
    describe: 'age field is empty',
    data: {
      username: 'name',
      age: null,
      hobbies: [
        'hobby 1',
        'hobby 2',
      ],
    },
  },
  {
    describe: 'age field is not number',
    data: {
      username: 'name',
      age: 'twenty',
      hobbies: [
        'hobby 1',
        'hobby 2',
      ],
    },
  },
  {
    describe: 'hobbies field is empty',
    data: {
      username: 'name',
      age: 20,
      hobbies: null,
    },
  },
];
