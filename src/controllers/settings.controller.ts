import { Router, Request, Response, NextFunction } from 'express'
import { SettingsService } from '../services/settings.service'

export const createSettingsController = ({ settingsService }: { settingsService: SettingsService }): Router => {
    const router = Router()

    router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const settings = await settingsService.getSettings()
            if (!settings) {
                return res.status(404).json({ message: 'Settings not found' })
            }
            res.json(settings)
        } catch (err) {
            next(err)
        }
    })

    router.post('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currency, timezone } = req.body
            const settings = await settingsService.createOrUpdateSettings({
                currency,
                timezone,
            })
            res.json(settings)
        } catch (err) {
            next(err)
        }
    })

    return router
}
