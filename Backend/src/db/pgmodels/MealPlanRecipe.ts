import { Table, Column, Model as SequelizeModel, ForeignKey, BelongsTo } from "sequelize-typescript";
import MealPlan from "./MealPlan"; // Assuming MealPlan model is defined in a separate file
import Recipe from "./Recipe"; // Assuming Recipe model is defined in a separate file
@Table
export default class MealPlanRecipe extends SequelizeModel<MealPlanRecipe> {

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  meal_plan_recipe_id!: number;

  @ForeignKey(() => MealPlan)
  @Column
  meal_plan_id!: number;

  @BelongsTo(() => MealPlan)
  mealPlan!: MealPlan;

  @ForeignKey(() => Recipe)
  @Column
  recipe_id!: number;

  @BelongsTo(() => Recipe)
  recipe!: Recipe;

  @Column
  dayTime!: string;
}
