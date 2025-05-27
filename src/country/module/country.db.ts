import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CountryDocument = Country & Document;

@Schema()
@Schema()
export class Country {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  population: number; 

  @Prop()
  area: number; 
};

export const CountrySchema = SchemaFactory.createForClass(Country);
