'use strict';

require('@trpc/server/shared');

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

exports.generateCacheTag = generateCacheTag;
exports.isFormData = isFormData;
