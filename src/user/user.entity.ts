import { Roles } from 'src/types/user.types';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({
    type: 'mediumint',
    unsigned: true,
    comment: 'User identification number',
  })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fullName: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  login: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  // TODO: change the nullable to false
  @Column({ type: 'varchar', length: 40, nullable: true })
  salt: string;

  @Column({
    type: 'smallint',
    unsigned: true,
    nullable: false,
    comment: 'User Role identification number',
  })
  // TODO: change roleId to role
  roleId: number;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  isSuperAdmin: number;

  @Column({ type: 'char', length: 1, default: '0' })
  isSupportUser: string;

  @Column({ type: 'int', nullable: true })
  branchId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  activationCode: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  forgottenPasswordKey: string;

  @Column({ type: 'datetime', nullable: true })
  forgottenPasswordRequested: Date;

  @Column({ type: 'varchar', length: 40, nullable: true })
  rememberCode: string;

  @Column({ type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ type: 'datetime', nullable: true })
  createdOn: Date;

  @Column({ type: 'int', nullable: true })
  modifiedBy: number;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  modifiedOn: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLogin: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  lastIp: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currentStatus: string;

  @Column({ type: 'tinyint', width: 1, default: () => "'0'" })
  isDeleted: number;

  @Column({ type: 'int', nullable: true })
  deletedBy: number;

  @Column({ type: 'datetime', nullable: true })
  deletedOn: Date;

  @Column({ type: 'varchar', length: 30, default: 'english' })
  defaultLanguage: string;

  @Column({ type: 'smallint', nullable: true })
  employeeId: number;

  @Column({ type: 'datetime', nullable: true })
  lastPasswordChanged: Date;
}

// @Entity({
//   name: 'users',
// })
// export class User {
//   @PrimaryGeneratedColumn({
//     type: 'mediumint',
//     unsigned: true,
//     comment: 'User identification number',
//   })
//   id: number;

//   @Column({ type: 'varchar', length: 100, nullable: false })
//   fullName: string;

//   @Column({ type: 'varchar', length: 40, nullable: true })
//   login: string;

//   @Column({ type: 'varchar', length: 100, nullable: false })
//   password: string;

//   @Column({
//     type: 'varchar',
//     nullable: false,
//     comment: 'User Role identification number',
//     default: Roles.USER,
//   })
//   // TODO: change roleId to role
//   role: Roles;

//   @Column({ type: 'varchar', length: 100, nullable: true })
//   email: string;

//   @Column({ type: 'int', nullable: true })
//   createdBy: number;

//   @CreateDateColumn({ type: 'datetime', nullable: true })
//   createdOn: Date;

//   @UpdateDateColumn({ type: 'datetime', nullable: true })
//   modifiedOn: Date;

//   @Column({ type: 'varchar', length: 10, nullable: true })
//   currentStatus: string;

//   @Column({ type: 'tinyint', width: 1, default: '0', nullable: true })
//   isDeleted: number;

//   @Column({ type: 'datetime', nullable: true })
//   deletedOn: Date;

//   @Column({ type: 'varchar', length: 30, default: 'english', nullable: true })
//   defaultLanguage: string;
// }
