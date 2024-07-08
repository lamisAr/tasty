import { Table, Column, Model as SequelizeModel, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, AllowNull, NotEmpty, DataType } from "sequelize-typescript";
import User from "./User"; // Assuming User model is defined in a separate file

@Table
export default class MealPlan extends SequelizeModel<MealPlan> {

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  meal_plan_id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @NotEmpty
  @Column
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column
  start_date!: Date;

  @Column
  end_date!: Date;

  @Column
  isActive!: boolean;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}
