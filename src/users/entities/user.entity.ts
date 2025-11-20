import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'admin' | 'user';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;
}

