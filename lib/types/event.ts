export type Event = string;

export interface GetEventsParams {
    cashbox_id: number;
    from_time?: Date;
    to_time?: Date;
    contragent_phone?: string;
    entity_type?: string;
}