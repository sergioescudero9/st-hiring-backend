import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { knex } from 'knex';
import dbConfig from './knexfile';
import { createEventDAL } from './dal/events.dal';
import { createTicketDAL } from './dal/tickets.dal';
import { createGetEventsController } from './controllers/get-events';
import { createSettingsDAL } from './dal/settings.dal';
import { createSettingsController } from './controllers/settings.controller';
import { createEventsService } from './services/events.service';
import { createSettingsService } from './services/settings.service';
import { errorHandler } from './middleware/error-handler';

const Knex = knex(dbConfig.development);

const eventDAL = createEventDAL(Knex);
const ticketDAL = createTicketDAL(Knex);
const settingsDAL = createSettingsDAL(Knex);

const eventsService = createEventsService({ eventsDAL: eventDAL, ticketsDAL: ticketDAL });
const settingsService = createSettingsService({ settingsDAL });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/events', createGetEventsController({ eventsService }));
app.use('/settings', createSettingsController({ settingsService }));

app.use('/', (_req, res) => {
    res.json({ message: 'Hello API' });
});

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server Started');
});
