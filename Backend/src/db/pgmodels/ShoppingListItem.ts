import { Table, Column, Model as SequelizeModel, ForeignKey, BelongsTo } from "sequelize-typescript";
import ShoppingList from "./ShoppingList"; // Assuming ShoppingList model is defined in the same directory
import Ingredient from "./Ingredient"; // Assuming Ingredient model is defined in the same directory

@Table
export default class ShoppingListItem extends SequelizeModel<ShoppingListItem> {

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  shopping_list_item_id!: number;

  @ForeignKey(() => ShoppingList)
  @Column
  shopping_list_id!: number;

  @BelongsTo(() => ShoppingList)
  shoppingList!: ShoppingList;

  @ForeignKey(() => Ingredient)
  @Column
  ingredient_id!: number;

  @BelongsTo(() => Ingredient)
  ingredient!: Ingredient;

  @Column
  quantity!: number;

  @Column
  unit!: string;
}
