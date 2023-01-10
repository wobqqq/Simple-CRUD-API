export const showRules = {
  id: 'required|uuid',
};

export const createRules = {
  username: 'required|string',
  age: 'required|number',
  hobbies: 'required|arrayOfStrings',
};

export const updateRules = {
  id: 'required|uuid',
  username: 'required|string',
  age: 'required|number',
  hobbies: 'required|arrayOfStrings',
};

export const deleteRules = {
  id: 'required|uuid',
};
