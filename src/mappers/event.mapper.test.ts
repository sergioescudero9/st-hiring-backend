import { toEventDto } from './event.mapper';
import { Event } from '../entity/event';

describe('event.mapper', () => {
    describe('toEventDto', () => {
        it('maps an Event entity, including its tickets, to an EventDto', () => {
            const event: Event = {
                id: 1,
                name: 'Concert',
                date: new Date('2024-06-01'),
                location: 'Madrid',
                description: 'A great concert',
                availableTickets: [
                    {
                        id: 1,
                        eventId: 1,
                        type: 'general',
                        status: 'available',
                        price: 1000,
                        createdAt: new Date('2024-01-01'),
                        updatedAt: new Date('2024-01-01'),
                    },
                ],
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            };

            expect(toEventDto(event)).toEqual({
                id: 1,
                name: 'Concert',
                date: event.date,
                location: 'Madrid',
                description: 'A great concert',
                availableTickets: [{ type: 'general', status: 'available', price: 1000 }],
            });
        });

        it('maps an event with no available tickets to an empty array', () => {
            const event: Event = {
                id: 2,
                name: 'Empty Event',
                date: new Date('2024-07-01'),
                location: 'Barcelona',
                description: 'No tickets left',
                availableTickets: [],
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            };

            expect(toEventDto(event).availableTickets).toEqual([]);
        });
    });
});
