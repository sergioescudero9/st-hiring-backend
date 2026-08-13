import { Settings } from '../entity/settings';
import { SettingsDto } from '../dto/settings.dto';

export const toSettingsDto = (settings: Settings): SettingsDto => ({
    currency: settings.currency,
    timezone: settings.timezone,
});
