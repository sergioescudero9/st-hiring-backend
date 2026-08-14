import { Request, Response, NextFunction } from "express";
import { EventsService } from "../services/events.service";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

const convertOrFallback = (value: unknown, fallback: number): number => {
    const parsed = parseInt(value as string, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

export const createGetEventsController = ({
    eventsService,
}: {
    eventsService: EventsService;
}) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Math.max(1, convertOrFallback(req.query.page, DEFAULT_PAGE));
        const limit = Math.min(MAX_LIMIT, Math.max(1, convertOrFallback(req.query.limit, DEFAULT_LIMIT)));
        const events = await eventsService.getEvents({ page, limit });
        res.json(events);
    } catch (err) {
        next(err);
    }
};
