import { Table, Column, Model as SequelizeModel, ForeignKey, BelongsTo } from "sequelize-typescript";
import ShoppingList from "./ShoppingList";
import Ingredient from "./Ingredient";
@Table
export default class ShoppingListItem extends SequelizeModel<ShoppingListItem> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
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
