import { Request, Response, NextFunction } from "express";
import { EventsService } from "../services/events.service";

export const createGetEventsController = ({
    eventsService,
}: {
    eventsService: EventsService;
}) => async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await eventsService.getEvents(50);
        res.json(events);
    } catch (err) {
        next(err);
    }
};
