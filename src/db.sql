CREATE TABLE users (
  id mediumint unsigned NOT NULL AUTO_INCREMENT COMMENT 'User identification number',
  full_name varchar(100) NOT NULL,
  login varchar(40) NOT NULL,
  password varchar(40) NOT NULL,
  salt varchar(40) DEFAULT NULL,
  role_id smallint unsigned NOT NULL COMMENT 'User Role identification number',
  is_super_admin tinyint(1) DEFAULT NULL,
  is_support_user char(1) DEFAULT '0',
  branch_id int DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  activation_code varchar(40) DEFAULT NULL,
  forgotten_password_key varchar(40) DEFAULT NULL,
  forgotten_password_requested datetime DEFAULT NULL,
  remember_code varchar(40) DEFAULT NULL,
  created_by int DEFAULT NULL,
  created_on datetime DEFAULT NULL,
  modified_by int DEFAULT NULL,
  modified_on datetime DEFAULT NULL,
  last_login datetime DEFAULT NULL,
  last_ip varchar(20) DEFAULT NULL,
  current_status varchar(10) DEFAULT NULL,
  is_deleted tinyint(1) DEFAULT '0',
  deleted_by int DEFAULT NULL,
  deleted_on datetime DEFAULT NULL,
  default_language varchar(30) NOT NULL DEFAULT 'english',
  employee_id smallint DEFAULT NULL,
  last_password_changed datetime DEFAULT NULL, 
  PRIMARY KEY (id),
  UNIQUE KEY UK_users_user_Name (login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;










import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
@Unique('UK_users_user_Name', ['login'])
export class User {
  @PrimaryGeneratedColumn({ type: 'mediumint', unsigned: true, comment: 'User identification number' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fullName: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  login: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  salt: string;

  @Column({ type: 'smallint', unsigned: true, nullable: false, comment: 'User Role identification number' })
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
