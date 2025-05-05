import { ZodIssue } from 'zod';

export function formatZodErrors(errors: ZodIssue[]): string[] {
    return errors.map((error) => `${error.path.join('.')}: ${error.message}`);
}