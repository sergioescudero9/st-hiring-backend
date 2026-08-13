import { Knex } from 'knex';
import { Event } from '../entity/event';

export interface PaginatedEvents {
    data: Event[];
    total: number;
}

export interface EventDAL {
    getEvents(params: { page: number; limit: number }): Promise<PaginatedEvents>;
}

export const createEventDAL = (knex: Knex): EventDAL => {
    return {
        async getEvents({ page, limit }): Promise<PaginatedEvents> {
            const offset = (page - 1) * limit;
            const [data, [{ count }]] = await Promise.all([
                knex<Event>('events').select('*').limit(limit).offset(offset),
                knex<Event>('events').count<[{ count: string }]>('id as count'),
            ]);
            return { data, total: Number(count) };
        },
    };
}
