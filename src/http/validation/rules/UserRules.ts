export const showRules = Object.freeze({
  id: 'required|uuid',
});

export const createRules = Object.freeze({
  username: 'required|string',
  age: 'required|number',
  hobbies: 'required|arrayOfStrings',
});

export const updateRules = Object.freeze({
  id: 'required|uuid',
  username: 'required|string',
  age: 'required|number',
  hobbies: 'required|arrayOfStrings',
});

export const deleteRules = Object.freeze({
  id: 'required|uuid',
});
