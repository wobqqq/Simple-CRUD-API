import Entity from './Entity';

class User extends Entity {
  constructor(
    public username: string,
    public age: number,
    public hobbies: string[],
    public id: string | null = null,
  ) {
    super();
  }
}

export default User;
