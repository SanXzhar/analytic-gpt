import { TRPCClientError, createTRPCUntypedClient, clientCallTypeToProcedureType } from '@trpc/client';
import { createRecursiveProxy } from '@trpc/server/shared';
import { transformResult } from '@trpc/client/shared';
import { observable } from '@trpc/server/observable';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { i as isFormData } from '../shared-f6996341.mjs';

// ts-prune-ignore-next
function experimental_serverActionLink() {
    return (runtime)=>({ op  })=>observable((observer)=>{
                const context = op.context;
                context._action(isFormData(op.input) ? op.input : runtime.transformer.serialize(op.input)).then((data)=>{
                    const transformed = transformResult(data, runtime);
                    if (!transformed.ok) {
                        observer.error(TRPCClientError.from(transformed.error, {}));
                        return;
                    }
                    observer.next({
                        context: op.context,
                        result: transformed.result
                    });
                    observer.complete();
                }).catch((cause)=>{
                    observer.error(TRPCClientError.from(cause));
                });
            });
}
// ts-prune-ignore-next
function experimental_createActionHook(opts) {
    const client = createTRPCUntypedClient(opts);
    return function useAction(handler, useActionOpts) {
        const count = useRef(0);
        const [state, setState] = useState({
            status: 'idle'
        });
        const actionOptsRef = useRef(useActionOpts);
        actionOptsRef.current = useActionOpts;
        useEffect(()=>{
            return ()=>{
                // cleanup after unmount to prevent calling hook opts after unmount
                count.current = -1;
                actionOptsRef.current = undefined;
            };
        }, []);
        const mutateAsync = useCallback((input, requestOptions)=>{
            const idx = ++count.current;
            const context = {
                ...requestOptions?.context,
                _action (innerInput) {
                    return handler(innerInput);
                }
            };
            setState({
                status: 'loading'
            });
            return client.mutation('serverAction', input, {
                ...requestOptions,
                context
            }).then(async (data)=>{
                await actionOptsRef.current?.onSuccess?.(data);
                if (idx !== count.current) {
                    return;
                }
                setState({
                    status: 'success',
                    data: data
                });
            }).catch(async (error)=>{
                await actionOptsRef.current?.onError?.(error);
                throw error;
            }).catch((error)=>{
                if (idx !== count.current) {
                    return;
                }
                setState({
                    status: 'error',
                    error: TRPCClientError.from(error, {})
                });
                throw error;
            });
        }, [
            handler
        ]);
        const mutate = useCallback((...args)=>{
            void mutateAsync(...args).catch(()=>{
            // ignored
            });
        }, [
            mutateAsync
        ]);
        return useMemo(()=>({
                ...state,
                mutate,
                mutateAsync
            }), [
            mutate,
            mutateAsync,
            state
        ]);
    };
}

// ts-prune-ignore-next
function experimental_createTRPCNextAppDirClient(opts) {
    const client = createTRPCUntypedClient(opts.config());
    // const useProxy = createUseProxy<TRouter>(client);
    const cache = new Map();
    return createRecursiveProxy(({ path , args  })=>{
        // const pathCopy = [key, ...path];
        const pathCopy = [
            ...path
        ];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const procedureType = clientCallTypeToProcedureType(pathCopy.pop());
        if (procedureType === 'query') {
            const queryCacheKey = JSON.stringify([
                path,
                args[0]
            ]);
            const cached = cache.get(queryCacheKey);
            if (cached?.promise) {
                return cached.promise;
            }
        }
        const fullPath = pathCopy.join('.');
        const promise = client[procedureType](fullPath, ...args);
        if (procedureType !== 'query') {
            return promise;
        }
        const queryCacheKey1 = JSON.stringify([
            path,
            args[0]
        ]);
        cache.set(queryCacheKey1, {
            promise
        });
        return promise;
    });
// });
}

export { experimental_createActionHook, experimental_createTRPCNextAppDirClient, experimental_serverActionLink };
