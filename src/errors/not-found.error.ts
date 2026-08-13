export class NotFoundError extends Error {
    readonly statusCode = 404;

    constructor(resource: string) {
        super(`${resource} not found`);
    }
}
