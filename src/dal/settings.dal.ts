import { Db } from 'mongodb'
import { Settings, SettingsFields } from '../entity/settings'

const COLLECTION_NAME = 'settings'

export interface SettingsDAL {
    getSettings(): Promise<Settings | undefined>
    createOrUpdateSettings(data: Partial<SettingsFields>): Promise<Settings>
}

export const createSettingsDAL = (db: Db): SettingsDAL => {
    const collection = db.collection<Settings>(COLLECTION_NAME)

    return {
        async getSettings(): Promise<Settings | undefined> {
            const settings = await collection.findOne({})
            return settings ?? undefined
        },

        async createOrUpdateSettings(data): Promise<Settings> {
            const now = new Date()
            const existing = await collection.findOne({})

            if (existing) {
                await collection.updateOne({ _id: existing._id }, { $set: { ...data, updatedAt: now } })
                return { ...existing, ...data, updatedAt: now }
            }

            const settings: Settings = {
                ...(data as SettingsFields),
                createdAt: now,
                updatedAt: now,
            }
            const result = await collection.insertOne(settings)
            return { ...settings, _id: result.insertedId }
        },
    }
}
