import { Knex } from 'knex'
import { Settings } from '../entity/settings'

export interface SettingsDAL {
    getSettings(): Promise<Settings | undefined>
    createOrUpdateSettings(data: Partial<Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Settings>
}

export const createSettingsDAL = (knex: Knex): SettingsDAL => {
    return {
        async getSettings(): Promise<Settings | undefined> {
            return await knex<Settings>('settings').first()
        },

        async createOrUpdateSettings(data): Promise<Settings> {
            const existing = await knex<Settings>('settings').first()

            if (existing) {
                const [updated] = await knex('settings')
                    .where('id', existing.id)
                    .update({ ...data, updated_at: knex.fn.now() })
                    .returning('*')
                return updated as Settings
            }

            const [created] = await knex('settings').insert(data).returning('*')
            return created as Settings
        },
    }
}
