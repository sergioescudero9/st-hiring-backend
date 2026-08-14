import { Request, Response, NextFunction } from 'express';
import { createGetEventsController } from './get-events';
import { EventsService } from '../services/events.service';

const buildEventsService = (overrides: Partial<EventsService> = {}): EventsService => ({
    getEvents: jest.fn().mockResolvedValue({ data: [], page: 1, limit: 50, total: 0, totalPages: 0 }),
    ...overrides,
});

const buildRequest = (query: Record<string, string> = {}): Request => ({ query } as unknown as Request);

const buildResponse = (): Response => {
    const res = {} as Response;
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('get-events controller', () => {
    it('defaults to page 1 and limit 50 when no query params are provided', async () => {
        const eventsService = buildEventsService();
        const controller = createGetEventsController({ eventsService });
        const req = buildRequest();
        const res = buildResponse();
        const next = jest.fn();

        await controller(req, res, next);

        expect(eventsService.getEvents).toHaveBeenCalledWith({ page: 1, limit: 50 });
        expect(next).not.toHaveBeenCalled();
    });

    it('passes through valid page and limit query params', async () => {
        const eventsService = buildEventsService();
        const controller = createGetEventsController({ eventsService });
        const req = buildRequest({ page: '3', limit: '20' });
        const res = buildResponse();
        const next = jest.fn();

        await controller(req, res, next);

        expect(eventsService.getEvents).toHaveBeenCalledWith({ page: 3, limit: 20 });
    });

    it('clamps limit to 100 when a larger limit is requested', async () => {
        const eventsService = buildEventsService();
        const controller = createGetEventsController({ eventsService });
        const req = buildRequest({ limit: '500' });
        const res = buildResponse();
        const next = jest.fn();

        await controller(req, res, next);

        expect(eventsService.getEvents).toHaveBeenCalledWith({ page: 1, limit: 100 });
    });

    it('clamps page and limit to a minimum of 1 when given non-positive values', async () => {
        const eventsService = buildEventsService();
        const controller = createGetEventsController({ eventsService });
        const req = buildRequest({ page: '-5', limit: '0' });
        const res = buildResponse();
        const next = jest.fn();

        await controller(req, res, next);

        expect(eventsService.getEvents).toHaveBeenCalledWith({ page: 1, limit: 1 });
    });

    it('falls back to defaults when page or limit are not numbers', async () => {
        const eventsService = buildEventsService();
        const controller = createGetEventsController({ eventsService });
        const req = buildRequest({ page: 'abc', limit: 'xyz' });
        const res = buildResponse();
        const next = jest.fn();

        await controller(req, res, next);

        expect(eventsService.getEvents).toHaveBeenCalledWith({ page: 1, limit: 50 });
    });

    it('responds with the paginated result from the service', async () => {
        const paginated = { data: [{ id: 1 }], page: 2, limit: 10, total: 15, totalPages: 2 };
        const eventsService = buildEventsService({ getEvents: jest.fn().mockResolvedValue(paginated) });
        const controller = createGetEventsController({ eventsService });
        const req = buildRequest({ page: '2', limit: '10' });
        const res = buildResponse();
        const next = jest.fn();

        await controller(req, res, next);

        expect(res.json).toHaveBeenCalledWith(paginated);
    });

    it('forwards errors from the service to next', async () => {
        const error = new Error('boom');
        const eventsService = buildEventsService({ getEvents: jest.fn().mockRejectedValue(error) });
        const controller = createGetEventsController({ eventsService });
        const req = buildRequest();
        const res = buildResponse();
        const next: NextFunction = jest.fn();

        await controller(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res.json).not.toHaveBeenCalled();
    });
});
