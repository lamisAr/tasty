import { Unique, Column, Table, Model as SequelizeModel, ForeignKey } from "sequelize-typescript";
import Recipe from "./Recipe";

@Table
export default class ImageURL extends SequelizeModel<ImageURL> {

  @Column({
    primaryKey: true,
    autoIncrement: true
  })
  image_id!: number;

  @Unique
  @Column
  URL!: string;

  @ForeignKey(()=>Recipe)
  @Column 
  recipe_id!: number
}
