import { SettingsDAL } from '../dal/settings.dal';
import { SettingsDto } from '../dto/settings.dto';
import { toSettingsDto, fromSettingsDto } from '../mappers/settings.mapper';
import { NotFoundError } from '../errors/not-found.error';

export interface SettingsService {
    getSettings(): Promise<SettingsDto>;
    createOrUpdateSettings(data: Partial<SettingsDto>): Promise<SettingsDto>;
}

export const createSettingsService = ({ settingsDAL }: { settingsDAL: SettingsDAL }): SettingsService => {
    return {
        async getSettings(): Promise<SettingsDto> {
            const settings = await settingsDAL.getSettings();
            if (!settings) throw new NotFoundError('Settings');
            return toSettingsDto(settings);
        },

        async createOrUpdateSettings(data): Promise<SettingsDto> {
            const settings = await settingsDAL.createOrUpdateSettings(fromSettingsDto(data));
            return toSettingsDto(settings);
        },
    };
};
