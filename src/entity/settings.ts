import { ObjectId } from 'mongodb';

export interface Settings {
    _id?: ObjectId;
    currency: string;
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
}

export type SettingsFields = Pick<Settings, 'currency' | 'timezone'>;
