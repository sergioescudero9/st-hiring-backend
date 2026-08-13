import { Settings, SettingsFields } from '../entity/settings';
import { SettingsDto } from '../dto/settings.dto';

export const toSettingsDto = (settings: Settings): SettingsDto => ({
    currency: settings.currency,
    timezone: settings.timezone,
});

export const fromSettingsDto = (dto: Partial<SettingsDto>): Partial<SettingsFields> => ({
    currency: dto.currency,
    timezone: dto.timezone,
});
