import { Router, Request, Response, NextFunction } from 'express'
import { SettingsService } from '../services/settings.service'

export const createSettingsController = ({ settingsService }: { settingsService: SettingsService }): Router => {
    const router = Router()

    router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
        try {
            return res.json(await settingsService.getSettings())
        } catch (err) {
            return next(err)
        }
    })

    router.post('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currency, timezone } = req.body
            const settings = await settingsService.createOrUpdateSettings({
                currency,
                timezone,
            })
            return res.json(settings)
        } catch (err) {
            return next(err)
        }
    })

    return router
}
