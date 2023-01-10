import IResponse from '../../contracts/IResponse';
import Controller from './Controller';
import Validator from '../../services/Validator';
import StatusCodes from '../StatusCodes';
import NotFoundError from '../../errors/NotFoundError';
import * as UserRules from '../validation/rules/UserRules';
import userRepository from '../../repositories/UserRepository';
import User from '../../entities/User';

class UserController extends Controller {
  public async index(): Promise<IResponse> {
    const users = await userRepository.findAll();

    return this.makeResponse(users);
  }

  public async show(id: string): Promise<IResponse> {
    Validator.validate({ id }, UserRules.showRules);

    const user = await userRepository.find(id);

    if (user === null) {
      throw new NotFoundError('User is not found');
    }

    return this.makeResponse(user);
  }

  public async new(): Promise<IResponse> {
    const userData = this.request.data;

    Validator.validate(userData, UserRules.createRules);

    let user = new User(
      userData.username,
      userData.age,
      userData.hobbies,
    );
    user = await userRepository.create(user);

    this.response.setStatusCode(StatusCodes.CREATED);

    return this.makeResponse(user);
  }

  public async edit(id: string): Promise<IResponse> {
    const userData = Object.assign(this.request.data, { id });

    Validator.validate(userData, UserRules.updateRules);

    let user = await userRepository.find(id);

    if (user === null) {
      throw new NotFoundError('User is not found');
    }

    user = new User(
      userData.username,
      userData.age,
      userData.hobbies,
      userData.id,
    );
    user = await userRepository.update(user);

    return this.makeResponse(user);
  }

  public async delete(id: string): Promise<IResponse> {
    Validator.validate({ id }, UserRules.deleteRules);

    const user = await userRepository.find(id);

    if (user === null) {
      throw new NotFoundError('User is not found');
    }

    await userRepository.remove(user);

    this.response.setStatusCode(StatusCodes.NO_CONTENT);

    return this.makeResponse();
  }
}

export default UserController;
