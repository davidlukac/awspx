/**
 * Check if given error has optional `stats` attribute.
 *
 * @param error - Error to check the field for.
 * @returns True if attributed `status` is present in the {@link Error} otherwise false.
 */
export const isErrorWithStatus = (error: Error): error is Error & { status?: number } => {
    return 'status' in error;
};
