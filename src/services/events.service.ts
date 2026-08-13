import { EventDAL } from '../dal/events.dal';
import { TicketsDAL } from '../dal/tickets.dal';
import { EventDto } from '../dto/event.dto';
import { toEventDto } from '../mappers/event.mapper';

export interface EventsService {
    getEvents(limit: number): Promise<EventDto[]>;
}

export const createEventsService = ({
    eventsDAL,
    ticketsDAL,
}: {
    eventsDAL: EventDAL;
    ticketsDAL: TicketsDAL;
}): EventsService => {
    return {
        async getEvents(limit): Promise<EventDto[]> {
            const events = await eventsDAL.getEvents(limit);
            for (let i = 0; i < events.length; i++) {
                const tickets = await ticketsDAL.getTicketsByEvent(events[i].id);
                events[i].availableTickets = tickets.filter(ticket => ticket.status === 'available');
            }
            return events.map(toEventDto);
        },
    };
};
