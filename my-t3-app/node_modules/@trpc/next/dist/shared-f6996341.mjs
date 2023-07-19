import '@trpc/server/shared';

/**
 * @internal
 */ function generateCacheTag(procedurePath, input) {
    return input ? `${procedurePath}?input=${JSON.stringify(input)}` : procedurePath;
}
function isFormData(value) {
    if (typeof FormData === 'undefined') {
        // FormData is not supported
        return false;
    }
    return value instanceof FormData;
}

export { generateCacheTag as g, isFormData as i };
