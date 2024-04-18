import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from 'uuid';

@Schema({
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"},
    versionKey: false,
    collection: "members"
})
export class Members {
    @Prop({type: String, required: true, default: uuidv4})
    _id: string;
    @Prop({type: String, required: true})
    member_name: string;
    @Prop({type: Boolean, required: true, default: true})
    is_active: boolean;
}

export const membersCollection = 'members';
export type MembersDocument = Members & Document;
export const MembersSchema = SchemaFactory.createForClass(Members);
