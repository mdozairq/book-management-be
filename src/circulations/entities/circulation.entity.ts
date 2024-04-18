import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from 'uuid';

@Schema({
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
    collection: "circulations"
})
export class Circulations {
    @Prop({ type: String, required: true, default: uuidv4 })
    _id: string;
    @Prop({ type: String, required: true })
    member_id: string;
    @Prop({ type: Number, required: true })
    book_id: number;
    @Prop({  required: true })
    due_date: Date;
    @Prop({ type: Boolean, required: true, default: true })
    is_active: boolean;
}

export const circulationsCollection = 'circulations';
export type CirculationsDocument = Circulations & Document;
export const CirculationsSchema = SchemaFactory.createForClass(Circulations);
