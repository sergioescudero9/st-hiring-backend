import { TicketDto } from './ticket.dto';

export interface EventDto {
    id: number;
    name: string;
    date: Date;
    location: string;
    description: string;
    availableTickets: TicketDto[];
}
