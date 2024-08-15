import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import bcrypt from 'bcryptjs';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'FIRST_NAME',
  })
  @MaxLength(50)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'FIRST_NAME contains only letters and number' })
  firstName!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'LAST_NAME',
  })
  @MaxLength(50)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'LAST_NAME contains only letters and number' })
  lastName!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    name: 'EMAIL',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    name: 'PASSWORD',
  })
  @MinLength(8)
  @MaxLength(10)
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contains  number , special chracter, letter, one capitalLetter and must be more than or equal to 8 character',
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'ADDRESS',
  })
  @MinLength(5)
  @MaxLength(40)
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s]+$/, { message: 'ADDRESS contains only letters and number' })
  address!: string;

  @BeforeInsert()
  async encrypctPassword(): Promise<string> {
    this.password = await bcrypt.hash(this.password, 12);
    return this.password;
  }

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt!: Date;
}

export default User;
