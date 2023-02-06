import { AllowNull, AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiModel } from 'swagger-express-ts/api-model.decorator';
import { ApiModelProperty } from 'swagger-express-ts/api-model-property.decorator';
import { SwaggerDefinitionConstant } from 'swagger-express-ts';
import Quote from './quote.model';

export enum UserRole {
  USER = "user",
  ADMIN = "admin"
}

@ApiModel({
  description: 'Model user',
  name: 'User',
})
@Table({ modelName: 'users', timestamps: true })
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiModelProperty({
    description: 'User e-mail',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  email: string;

  @ApiModelProperty({
    description: 'User password',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  password: string;

  @ApiModelProperty({
    description: 'User role',
    required: true,
  })
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.USER
  })
  role: UserRole;

  @ApiModelProperty({
    description: 'user queries',
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    required: false
  })
  @HasMany(() => Quote)
  quotes: Quote[];
}
