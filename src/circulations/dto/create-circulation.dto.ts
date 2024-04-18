import { ApiProperty } from "@nestjs/swagger";
import * as JOI from "joi";

export enum EventType {
    RETURN = "return",
    CHECKOUT = "checkout",
}


export class CreateCirculationDto {
    @ApiProperty({ enum: EventType, required: true })
    eventtype: String
    @ApiProperty({ type: Number, required: true })
    book_id: number
    @ApiProperty({ type: Number, required: true })
    member_id: number
    @ApiProperty({ type: Date, required: true })
    date: Date
}

export const createCirculationValidation = JOI.object({
    eventtype: JOI.string().allow(EventType.CHECKOUT, EventType.RETURN).required(),
    book_id: JOI.number().required(),
    member_id: JOI.number().required(),
    date: JOI.date().required()
})