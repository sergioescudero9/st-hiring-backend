import { Event } from '../entity/event';
import { EventDto } from '../dto/event.dto';
import { toTicketDto } from './ticket.mapper';

export const toEventDto = (event: Event): EventDto => ({
    id: event.id,
    name: event.name,
    date: event.date,
    location: event.location,
    description: event.description,
    availableTickets: event.availableTickets.map(toTicketDto),
});
