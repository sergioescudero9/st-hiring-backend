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
            //Just load settings for all users, there should be apply another set of roling rules for different users, but for now we will just load the settings for all users
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
