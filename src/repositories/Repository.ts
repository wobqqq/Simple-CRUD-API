import { db } from '../services/DB';
import Uuid from '../services/Uuid';
import Entity from '../entities/Entity';

class Repository {
  protected readonly table: string = '';

  protected readonly primaryKey: string = 'id';

  public async findAll(): Promise<any[]> {
    const result = await db.createQuery({
      type: 'select',
      table: this.table,
      data: {},
      select: '*',
    });

    return result;
  }

  public async find(id: string, primaryKey: string | null = null): Promise<any> {
    const result = await db.createQuery({
      type: 'select',
      table: this.table,
      data: id,
      select: 'wherePrimaryKey',
      primaryKey: primaryKey ?? this.primaryKey,
    });

    return result;
  }

  public async create(entity: Entity): Promise<any> {
    const newEntity = Object.assign(entity, { id: Uuid.newUuid() });

    await db.createQuery({
      type: 'insert',
      table: this.table,
      data: newEntity,
    });

    return newEntity;
  }

  public async update(entity: Entity): Promise<any> {
    await db.createQuery({
      type: 'update',
      table: this.table,
      data: entity,
      primaryKey: this.primaryKey,
    });

    return entity;
  }

  public async remove(entity: Entity): Promise<void> {
    await db.createQuery({
      type: 'delete',
      table: this.table,
      data: (entity as { [id: string]: string })[this.primaryKey],
      primaryKey: this.primaryKey,
    });
  }
}

export default Repository;
