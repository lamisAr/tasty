import {
  Table,
  Column,
  Model as SequelizeModel,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  NotEmpty,
  DataType,
} from "sequelize-typescript";
import User from "./User";
import ShoppingListItem from "./ShoppingListItem";

@Table
export default class ShoppingList extends SequelizeModel<ShoppingList> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  shopping_list_id!: number;

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

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @HasMany(() => ShoppingListItem)
  items!: ShoppingListItem[];
}
