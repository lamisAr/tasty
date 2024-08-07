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
import Recipe from "./Recipe";
import { Col } from "sequelize/types/utils";

@Table
export default class Rating extends SequelizeModel<Rating> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  rating_id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Recipe)
  @Column
  recipe_id!: number;

  @BelongsTo(() => Recipe)
  recipe!: Recipe;

  @Column
  rating!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}
