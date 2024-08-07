import {
  Table,
  Column,
  Model as SequelizeModel,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./User";

@Table
export default class Follows extends SequelizeModel<Follows> {
  @ForeignKey(() => User)
  @Column
  following_user_id!: number;

  @ForeignKey(() => User)
  @Column
  followed_user_id!: number;

  @BelongsTo(() => User)
  following_user!: User;

  @BelongsTo(() => User)
  followed_user!: User;

  @CreatedAt
  @Column
  createdAt!: Date;
}
