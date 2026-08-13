import { createEventsService } from './events.service';
import { EventDAL } from '../dal/events.dal';
import { TicketsDAL } from '../dal/tickets.dal';
import { Event } from '../entity/event';
import { Ticket } from '../entity/ticket';

const buildEvent = (overrides: Partial<Event> = {}): Event => ({
    id: 1,
    name: 'Concert',
    date: new Date('2024-06-01'),
    location: 'Madrid',
    description: 'A great concert',
    availableTickets: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
});

const buildTicket = (overrides: Partial<Ticket> = {}): Ticket => ({
    id: 1,
    eventId: 1,
    type: 'general',
    status: 'available',
    price: 1000,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
});

const buildEventsDAL = (overrides: Partial<EventDAL> = {}): EventDAL => ({
    getEvents: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    ...overrides,
});

const buildTicketsDAL = (overrides: Partial<TicketsDAL> = {}): TicketsDAL => ({
    getTicketsByEvent: jest.fn().mockResolvedValue([]),
    ...overrides,
});

describe('events.service', () => {
    describe('getEvents', () => {
        it('requests the page and limit from the DAL and returns pagination metadata', async () => {
            const eventsDAL = buildEventsDAL({
                getEvents: jest.fn().mockResolvedValue({ data: [buildEvent()], total: 12 }),
            });
            const ticketsDAL = buildTicketsDAL();
            const service = createEventsService({ eventsDAL, ticketsDAL });

            const result = await service.getEvents({ page: 2, limit: 5 });

            expect(eventsDAL.getEvents).toHaveBeenCalledWith({ page: 2, limit: 5 });
            expect(result).toEqual({
                data: [expect.objectContaining({ id: 1, name: 'Concert' })],
                page: 2,
                limit: 5,
                total: 12,
                totalPages: 3,
            });
        });

        it('attaches only available tickets to each event', async () => {
            const eventsDAL = buildEventsDAL({
                getEvents: jest.fn().mockResolvedValue({ data: [buildEvent({ id: 7 })], total: 1 }),
            });
            const ticketsDAL = buildTicketsDAL({
                getTicketsByEvent: jest.fn().mockResolvedValue([
                    buildTicket({ status: 'available', type: 'general' }),
                    buildTicket({ status: 'sold', type: 'vip' }),
                ]),
            });
            const service = createEventsService({ eventsDAL, ticketsDAL });

            const result = await service.getEvents({ page: 1, limit: 50 });

            expect(ticketsDAL.getTicketsByEvent).toHaveBeenCalledWith(7);
            expect(result.data[0].availableTickets).toEqual([
                { type: 'general', status: 'available', price: 1000 },
            ]);
        });

        it('returns an empty page with totalPages 0 when there are no events', async () => {
            const eventsDAL = buildEventsDAL({
                getEvents: jest.fn().mockResolvedValue({ data: [], total: 0 }),
            });
            const ticketsDAL = buildTicketsDAL();
            const service = createEventsService({ eventsDAL, ticketsDAL });

            const result = await service.getEvents({ page: 1, limit: 50 });

            expect(result).toEqual({ data: [], page: 1, limit: 50, total: 0, totalPages: 0 });
        });
    });
});
