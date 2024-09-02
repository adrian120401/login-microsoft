import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;
}