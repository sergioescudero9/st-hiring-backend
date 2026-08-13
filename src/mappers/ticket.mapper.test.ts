import { toTicketDto } from './ticket.mapper';
import { Ticket } from '../entity/ticket';

describe('ticket.mapper', () => {
    describe('toTicketDto', () => {
        it('maps a Ticket entity to a TicketDto', () => {
            const ticket: Ticket = {
                id: 1,
                eventId: 10,
                type: 'vip',
                status: 'sold',
                price: 5000,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            };

            expect(toTicketDto(ticket)).toEqual({
                type: 'vip',
                status: 'sold',
                price: 5000,
            });
        });
    });
});
