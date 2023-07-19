'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var client = require('@trpc/client');
var server = require('@trpc/server');
var shared = require('@trpc/server/shared');
var cache = require('next/cache');
var React = require('react');
var shared$1 = require('../shared-e49b9cdc.js');

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
    const getClient = React.cache(()=>{
        const config = opts.config();
        return client.createTRPCUntypedClient(config);
    });
    return shared.createRecursiveProxy((callOpts)=>{
        // lazily initialize client
        const client$1 = getClient();
        const pathCopy = [
            ...callOpts.path
        ];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const action = pathCopy.pop();
        const procedurePath = pathCopy.join('.');
        const procedureType = client.clientCallTypeToProcedureType(action);
        const cacheTag = shared$1.generateCacheTag(procedurePath, callOpts.args[0]);
        if (action === 'revalidate') {
            cache.revalidateTag(cacheTag);
            return;
        }
        return client$1[procedureType](procedurePath, ...callOpts.args);
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
                if (normalizeFormData && shared$1.isFormData(rawInput)) {
                    // Normalizes formdata so we can use `z.object({})` etc on the server
                    try {
                        rawInput = formDataToObject(rawInput);
                    } catch  {
                        throw new server.TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message: 'Failed to convert FormData to an object'
                        });
                    }
                } else if (rawInput && !shared$1.isFormData(rawInput)) {
                    rawInput = transformer.input.deserialize(rawInput);
                }
                const data = await proc({
                    input: undefined,
                    ctx: ctx1,
                    path: 'serverAction',
                    rawInput,
                    type: proc._type
                });
                const transformedJSON = shared.transformTRPCResponse(config, {
                    result: {
                        data
                    }
                });
                return transformedJSON;
            } catch (cause) {
                const error = server.getTRPCErrorFromUnknown(cause);
                const shape = shared.getErrorShape({
                    config,
                    ctx,
                    error,
                    input: rawInput,
                    path: 'serverAction',
                    type: proc._type
                });
                // TODO: send the right HTTP header?!
                return shared.transformTRPCResponse(t._config, {
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
    cache.revalidateTag(cacheTag);
    return new Response(JSON.stringify({
        revalidated: true,
        now: Date.now()
    }), {
        status: 200
    });
}

exports.experimental_createServerActionHandler = experimental_createServerActionHandler;
exports.experimental_createTRPCNextAppDirServer = experimental_createTRPCNextAppDirServer;
exports.experimental_revalidateEndpoint = experimental_revalidateEndpoint;
