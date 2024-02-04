/**
 * Check if given error has optional `stats` attribute.
 *
 * @param error - Error to check the field for.
 * @returns Boolean on presence of `status` field.
 */
export const isErrorWithStatus = (error: Error): error is Error & { status?: number } => {
    return 'status' in error;
};
