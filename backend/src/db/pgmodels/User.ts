// user.ts
const bcrypt = require("bcryptjs");
import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Unique,
  ForeignKey,
  AllowNull,
  IsEmail,
  NotEmpty,
  DeletedAt,
  HasMany,
} from "sequelize-typescript";
import ImageURL from "./ImageURL";
import Favorite from "./Favorite";

@Table
export default class User extends Model<User> {
  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @Column
  description!: string;

  @ForeignKey(() => ImageURL)
  @Column
  profilePhoto!: number;

  @Unique
  @AllowNull(false)
  @IsEmail
  @NotEmpty
  @Column
  email!: string;

  @Unique
  @AllowNull(false)
  @NotEmpty
  @Column
  userName!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  password!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @HasMany(() => Favorite, "user_id") // Define the association with Favorite
  favorites!: Favorite[];

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
