import { v4, validate } from 'uuid';

class Uuid {
  public static newUuid(): string {
    return v4();
  }

  public static validate(uuid: string): boolean {
    return validate(uuid);
  }
}

export default Uuid;
