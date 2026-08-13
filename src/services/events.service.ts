import { EventDAL } from '../dal/events.dal';
import { TicketsDAL } from '../dal/tickets.dal';
import { EventDto } from '../dto/event.dto';
import { toEventDto } from '../mappers/event.mapper';

export interface PaginatedEventsDto {
    data: EventDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface EventsService {
    getEvents(params: { page: number; limit: number }): Promise<PaginatedEventsDto>;
}

export const createEventsService = ({
    eventsDAL,
    ticketsDAL,
}: {
    eventsDAL: EventDAL;
    ticketsDAL: TicketsDAL;
}): EventsService => {
    return {
        async getEvents({ page, limit }): Promise<PaginatedEventsDto> {
            const { data: events, total } = await eventsDAL.getEvents({ page, limit });
            for (let i = 0; i < events.length; i++) {
                const tickets = await ticketsDAL.getTicketsByEvent(events[i].id);
                events[i].availableTickets = tickets.filter(ticket => ticket.status === 'available');
            }
            return {
                data: events.map(toEventDto),
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };
        },
    };
};
