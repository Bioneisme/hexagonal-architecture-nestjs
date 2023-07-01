import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountId } from '../../domains/entities/account.entity';

@Entity('Activity', {})
export class ActivityOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: number;

  @Column()
  ownerAccountId: AccountId;

  @Column()
  sourceAccountId: AccountId;

  @Column()
  targetAccountId: AccountId;

  @Column()
  amount: number;
}
