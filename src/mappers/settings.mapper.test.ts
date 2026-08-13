import { ObjectId } from 'mongodb';
import { toSettingsDto, fromSettingsDto } from './settings.mapper';
import { Settings } from '../entity/settings';

describe('settings.mapper', () => {
    describe('toSettingsDto', () => {
        it('maps a Settings entity to a SettingsDto', () => {
            const settings: Settings = {
                _id: new ObjectId(),
                currency: 'USD',
                timezone: 'UTC',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            };

            expect(toSettingsDto(settings)).toEqual({
                currency: 'USD',
                timezone: 'UTC',
            });
        });
    });

    describe('fromSettingsDto', () => {
        it('maps a full SettingsDto to SettingsFields', () => {
            expect(fromSettingsDto({ currency: 'COP', timezone: 'Bogota' })).toEqual({
                currency: 'COP',
                timezone: 'Bogota',
            });
        });

        it('leaves omitted fields undefined for a partial DTO', () => {
            expect(fromSettingsDto({ currency: 'COP' })).toEqual({
                currency: 'COP',
                timezone: undefined,
            });
        });

        it('returns all fields undefined for an empty DTO', () => {
            expect(fromSettingsDto({})).toEqual({
                currency: undefined,
                timezone: undefined,
            });
        });
    });
});
