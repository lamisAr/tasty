import { Table, Column, Model as SequelizeModel, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, DataType } from "sequelize-typescript";
import Recipe from "./Recipe"; // Assuming Recipe model is defined in a separate file
import Ingredient from "./Ingredient"; // Assuming Ingredient model is defined in a separate file

@Table
export default class RecipeIngredient extends SequelizeModel<RecipeIngredient> {

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  recipe_ingredient_id!: number;

  @ForeignKey(() => Recipe)
  @Column
  recipe_id!: number;

  @BelongsTo(() => Recipe)
  recipe!: Recipe;

  @ForeignKey(() => Ingredient)
  @Column
  ingredient_id!: number;

  @BelongsTo(() => Ingredient)
  ingredient!: Ingredient;

  @Column
  quantity!: number;

  @Column
  unit!: string;

  @Column(DataType.TEXT)
  note!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
