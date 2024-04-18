import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from 'uuid';

@Schema({
    timestamps: {createdAt: "created_at", updatedAt: "updated_at"},
    versionKey: false,
    collection: "books"
})
export class Books {
    @Prop({type: String, required: true, default: uuidv4})
    _id: string;
    @Prop({type: String, required: true})
    book_name: string;
    @Prop({type: Number, required: true})
    number_of_copies: number;
    @Prop({type: Boolean, required: true, default: true})
    is_active: boolean;
}

export const booksCollection = 'books';
export type BooksDocument = Books & Document;
export const BooksSchema = SchemaFactory.createForClass(Books);
