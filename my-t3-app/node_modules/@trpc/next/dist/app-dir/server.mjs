import { createTRPCUntypedClient, clientCallTypeToProcedureType } from '@trpc/client';
import { TRPCError, getTRPCErrorFromUnknown } from '@trpc/server';
import { createRecursiveProxy, transformTRPCResponse, getErrorShape } from '@trpc/server/shared';
import { revalidateTag } from 'next/cache';
import { cache } from 'react';
import { g as generateCacheTag, i as isFormData } from '../shared-f6996341.mjs';

/* eslint-disable @typescript-eslint/no-non-null-assertion */ function set(obj, path, value) {
    if (typeof path === 'string') {
        path = path.split(/[\.\[\]]/).filter(Boolean);
    }
    if (path.length > 1) {
        const p = path.shift();
        const isArrayIndex = /^\d+$/.test(path[0]);
        obj[p] = obj[p] || (isArrayIndex ? [] : {});
        set(obj[p], path, value);
        return;
    }
    const p1 = path[0];
    if (obj[p1] === undefined) {
        obj[p1] = value;
    } else if (Array.isArray(obj[p1])) {
        obj[p1].push(value);
    } else {
        obj[p1] = [
            obj[p1],
            value
        ];
    }
}
function formDataToObject(formData) {
    const obj = {};
    for (const [key, value] of formData.entries()){
        set(obj, key, value);
    }
    return obj;
}

/// <reference types="next" />
// ts-prune-ignore-next
function experimental_createTRPCNextAppDirServer(opts) {
    const getClient = cache(()=>{
        const config = opts.config();
        return createTRPCUntypedClient(config);
    });
    return createRecursiveProxy((callOpts)=>{
        // lazily initialize client
        const client = getClient();
        const pathCopy = [
            ...callOpts.path
        ];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const action = pathCopy.pop();
        const procedurePath = pathCopy.join('.');
        const procedureType = clientCallTypeToProcedureType(action);
        const cacheTag = generateCacheTag(procedurePath, callOpts.args[0]);
        if (action === 'revalidate') {
            revalidateTag(cacheTag);
            return;
        }
        return client[procedureType](procedurePath, ...callOpts.args);
    });
}
function experimental_createServerActionHandler(t, opts) {
    const config = t._config;
    const { normalizeFormData =true , createContext  } = opts;
    const transformer = config.transformer;
    // TODO allow this to take a `TRouter` in addition to a `AnyProcedure`
    return function createServerAction(proc) {
        return async function actionHandler(rawInput) {
            const ctx = undefined;
            try {
                const ctx1 = await createContext();
                if (normalizeFormData && isFormData(rawInput)) {
                    // Normalizes formdata so we can use `z.object({})` etc on the server
                    try {
                        rawInput = formDataToObject(rawInput);
                    } catch  {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'Failed to convert FormData to an object'
                        });
                    }
                } else if (rawInput && !isFormData(rawInput)) {
                    rawInput = transformer.input.deserialize(rawInput);
                }
                const data = await proc({
                    input: undefined,
                    ctx: ctx1,
                    path: 'serverAction',
                    rawInput,
                    type: proc._type
                });
                const transformedJSON = transformTRPCResponse(config, {
                    result: {
                        data
                    }
                });
                return transformedJSON;
            } catch (cause) {
                const error = getTRPCErrorFromUnknown(cause);
                const shape = getErrorShape({
                    config,
                    ctx,
                    error,
                    input: rawInput,
                    path: 'serverAction',
                    type: proc._type
                });
                // TODO: send the right HTTP header?!
                return transformTRPCResponse(t._config, {
                    error: shape
                });
            }
        };
    };
}
// ts-prune-ignore-next
async function experimental_revalidateEndpoint(req) {
    const { cacheTag  } = await req.json();
    if (typeof cacheTag !== 'string') {
        return new Response(JSON.stringify({
            revalidated: false,
            error: 'cacheTag must be a string'
        }), {
            status: 400
        });
    }
    revalidateTag(cacheTag);
    return new Response(JSON.stringify({
        revalidated: true,
        now: Date.now()
    }), {
        status: 200
    });
}

export { experimental_createServerActionHandler, experimental_createTRPCNextAppDirServer, experimental_revalidateEndpoint };
