import { createSettingsService } from './settings.service';
import { SettingsDAL } from '../dal/settings.dal';
import { Settings } from '../entity/settings';
import { NotFoundError } from '../errors/not-found.error';

const buildSettings = (overrides: Partial<Settings> = {}): Settings => ({
    currency: 'USD',
    timezone: 'UTC',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
});

const buildDAL = (overrides: Partial<SettingsDAL> = {}): SettingsDAL => ({
    getSettings: jest.fn(),
    createOrUpdateSettings: jest.fn(),
    ...overrides,
});

describe('settings.service', () => {
    describe('getSettings', () => {
        it('returns the mapped settings when a document exists', async () => {
            const settingsDAL = buildDAL({
                getSettings: jest.fn().mockResolvedValue(buildSettings({ currency: 'COP', timezone: 'Bogota' })),
            });
            const service = createSettingsService({ settingsDAL });

            await expect(service.getSettings()).resolves.toEqual({ currency: 'COP', timezone: 'Bogota' });
        });

        it('throws NotFoundError when no settings document exists', async () => {
            const settingsDAL = buildDAL({ getSettings: jest.fn().mockResolvedValue(undefined) });
            const service = createSettingsService({ settingsDAL });

            await expect(service.getSettings()).rejects.toThrow(NotFoundError);
        });
    });

    describe('createOrUpdateSettings', () => {
        it('Creates settings when none exist', async () => {
            const settingsDAL = buildDAL({
                createOrUpdateSettings: jest
                    .fn()
                    .mockResolvedValue(buildSettings({ currency: 'COP', timezone: 'Bogota' })),
            });
            const service = createSettingsService({ settingsDAL });

            const result = await service.createOrUpdateSettings({ currency: 'COP', timezone: 'Bogota' });

            expect(settingsDAL.createOrUpdateSettings).toHaveBeenCalledWith({
                currency: 'COP',
                timezone: 'Bogota',
            });
            expect(result).toEqual({ currency: 'COP', timezone: 'Bogota' });
        });

        it('Updates partially settings', async () => {
            const settingsDAL = buildDAL({
                createOrUpdateSettings: jest.fn().mockResolvedValue(buildSettings({ currency: 'COP' })),
            });
            const service = createSettingsService({ settingsDAL });

            await service.createOrUpdateSettings({ currency: 'COP' });

            expect(settingsDAL.createOrUpdateSettings).toHaveBeenCalledWith({
                currency: 'COP',
                timezone: undefined,
            });
        });
    });
});
