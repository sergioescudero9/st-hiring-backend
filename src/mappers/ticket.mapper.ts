import { Ticket } from '../entity/ticket';
import { TicketDto } from '../dto/ticket.dto';

export const toTicketDto = (ticket: Ticket): TicketDto => ({
    type: ticket.type,
    status: ticket.status,
    price: ticket.price,
});
