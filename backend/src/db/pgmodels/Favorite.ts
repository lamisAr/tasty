import {
  Table,
  Column,
  Model as SequelizeModel,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import User from "./User"; // Assuming User model is defined in a separate file
import Recipe from "./Recipe"; // Assuming Recipe model is defined in a separate file

@Table
export default class Favorite extends SequelizeModel<Favorite> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  favorites_id!: number;

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

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;
}
