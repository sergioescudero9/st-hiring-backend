import { SettingsDAL } from '../dal/settings.dal';
import { Settings } from '../entity/settings';
import { SettingsDto } from '../dto/settings.dto';
import { toSettingsDto } from '../mappers/settings.mapper';
import { NotFoundError } from '../errors/not-found.error';

export interface SettingsService {
    getSettings(): Promise<SettingsDto>;
    createOrUpdateSettings(data: Partial<Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SettingsDto>;
}

export const createSettingsService = ({ settingsDAL }: { settingsDAL: SettingsDAL }): SettingsService => {
    return {
        async getSettings(): Promise<SettingsDto> {
            const settings = await settingsDAL.getSettings();
            if (!settings) throw new NotFoundError('Settings');
            return toSettingsDto(settings);
        },

        async createOrUpdateSettings(data): Promise<SettingsDto> {
            const settings = await settingsDAL.createOrUpdateSettings(data);
            return toSettingsDto(settings);
        },
    };
};
