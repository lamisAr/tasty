import { Table, Column, HasMany, Model as SequelizeModel, NotEmpty, AllowNull, DataType } from "sequelize-typescript";
import {IngredientType} from "../Enums";

const IngredientTypeEnum = DataType.ENUM(...Object.values(IngredientType));

@Table
export default class Ingredient extends SequelizeModel<Ingredient> {

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  ingredient_id!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  name!: string;
  
  @Column(IngredientTypeEnum)
  ingredientType!: IngredientType[];

    
  @Column
  ingredientType2!: string;

  @Column
  caloriesPer100g!: number;
  
}
