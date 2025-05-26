import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "../enum";

@Schema()
export class User {
    @Prop({required: true})
    telegramId: number;

    @Prop()
    username: string;

    @Prop()
    firstName: string;

    @Prop({required: true})
    phoneNumber: string;

    @Prop({type: String,enum: UserRole,default: UserRole.USER})
    role: UserRole;
};

export const UserSchema = SchemaFactory.createForClass(User);