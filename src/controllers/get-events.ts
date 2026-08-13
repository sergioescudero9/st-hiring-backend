import { Request, Response, NextFunction } from "express";
import { EventsService } from "../services/events.service";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export const createGetEventsController = ({
    eventsService,
}: {
    eventsService: EventsService;
}) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
        const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit as string, 10) || DEFAULT_LIMIT));
        const events = await eventsService.getEvents({ page, limit });
        res.json(events);
    } catch (err) {
        next(err);
    }
};
