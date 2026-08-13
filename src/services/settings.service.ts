import { SettingsDAL } from '../dal/settings.dal';
import { Settings } from '../entity/settings';
import { SettingsDto } from '../dto/settings.dto';
import { toSettingsDto } from '../mappers/settings.mapper';

export interface SettingsService {
    getSettings(): Promise<SettingsDto | undefined>;
    createOrUpdateSettings(data: Partial<Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SettingsDto>;
}

export const createSettingsService = ({ settingsDAL }: { settingsDAL: SettingsDAL }): SettingsService => {
    return {
        async getSettings(): Promise<SettingsDto | undefined> {
            const settings = await settingsDAL.getSettings();
            return settings ? toSettingsDto(settings) : undefined;
        },

        async createOrUpdateSettings(data): Promise<SettingsDto> {
            const settings = await settingsDAL.createOrUpdateSettings(data);
            return toSettingsDto(settings);
        },
    };
};
