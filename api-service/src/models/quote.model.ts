import { AllowNull, AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiModel } from 'swagger-express-ts/api-model.decorator';
import { ApiModelProperty } from 'swagger-express-ts/api-model-property.decorator';
import User from './user.model';

@ApiModel({
  description: 'Model quote',
  name: 'Quote',
})
@Table({ modelName: 'quote', timestamps: true })
export default class Quote extends Model<Quote> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiModelProperty({
    description: 'Quote name',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @ApiModelProperty({
    description: 'Quote symbol',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.STRING(255))
  symbol: string;

  @ApiModelProperty({
    description: 'Quote open',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.DECIMAL)
  open: number;

  @ApiModelProperty({
    description: 'Quote high',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.DECIMAL)
  high: number;

  @ApiModelProperty({
    description: 'Quote low',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.DECIMAL)
  low: number;

  @ApiModelProperty({
    description: 'Quote close',
    required: true,
  })
  @AllowNull(false)
  @Column(DataType.DECIMAL)
  close: number;

  @ApiModelProperty({
    description: 'Id UploadFile',
  })
  @ForeignKey(() => User)
  @Column(DataType.DECIMAL)
  userId: number;
}
