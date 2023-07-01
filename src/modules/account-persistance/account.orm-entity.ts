import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountId } from '../../domains/entities/account.entity';

@Entity('Account', {})
export class AccountOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: AccountId;
}
