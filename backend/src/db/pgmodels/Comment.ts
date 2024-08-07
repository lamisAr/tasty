import {
  Table,
  Column,
  Model as SequelizeModel,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  HasMany,
  NotEmpty,
  AllowNull,
  DataType,
  DeletedAt,
} from "sequelize-typescript";
import User from "./User";
import Recipe from "./Recipe";

@Table
export default class Comment extends SequelizeModel<Comment> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  comment_id!: number;

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

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.TEXT)
  comment!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @ForeignKey(() => Comment)
  @Column
  parent_comment_id!: number;

  @BelongsTo(() => Comment, { foreignKey: "parent_comment_id", targetKey: "comment_id" })
  parent_comment!: Comment;

  @HasMany(() => Comment, { foreignKey: "parent_comment_id" })
  child_comments!: Comment[];

  @DeletedAt
  @Column
  deletedAt!: Date;
}
