import {
  Table,
  Column,
  Model as SequelizeModel,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsToMany,
  AllowNull,
  NotEmpty,
  DataType,
} from "sequelize-typescript";
import User from "./User"; // Assuming User model is defined in a separate file
import ImageURL from "./ImageURL";
import { Cuisine, RecipeType } from "../Enums";
import RecipeIngredient from "./RecipeIngredient";
import Ingredient from "./Ingredient";
import Favorite from "./Favorite";

const RecipeTypeEnum = DataType.ENUM(...Object.values(RecipeType));
const CuisineEnum = DataType.ENUM(...Object.values(Cuisine));

@Table
export default class Recipe extends SequelizeModel<Recipe> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  recipe_id!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.TEXT)
  instructions!: string;

  @Column(CuisineEnum)
  country_of_origin!: Cuisine;

  @Column(RecipeTypeEnum)
  type!: RecipeType[];

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @HasMany(() => ImageURL)
  image!: ImageURL[];

  @BelongsToMany(() => Ingredient, () => RecipeIngredient)
  ingredients!: Ingredient[];

  @HasMany(() => Favorite, "recipe_id") // Define the association
  favorites!: Favorite[];
}
