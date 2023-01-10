import Repository from './Repository';

class UserRepository extends Repository {
  protected readonly table: string = 'users';
}

export default new UserRepository();
