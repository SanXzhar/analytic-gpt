'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var client = require('@trpc/client');
var shared$2 = require('@trpc/server/shared');
var shared$1 = require('@trpc/client/shared');
var observable = require('@trpc/server/observable');
var React = require('react');
var shared = require('../shared-e49b9cdc.js');

// ts-prune-ignore-next
function experimental_serverActionLink() {
    return (runtime)=>({ op  })=>observable.observable((observer)=>{
                const context = op.context;
                context._action(shared.isFormData(op.input) ? op.input : runtime.transformer.serialize(op.input)).then((data)=>{
                    const transformed = shared$1.transformResult(data, runtime);
                    if (!transformed.ok) {
                        observer.error(client.TRPCClientError.from(transformed.error, {}));
                        return;
                    }
                    observer.next({
                        context: op.context,
                        result: transformed.result
                    });
                    observer.complete();
                }).catch((cause)=>{
                    observer.error(client.TRPCClientError.from(cause));
                });
            });
}
// ts-prune-ignore-next
function experimental_createActionHook(opts) {
    const client$1 = client.createTRPCUntypedClient(opts);
    return function useAction(handler, useActionOpts) {
        const count = React.useRef(0);
        const [state, setState] = React.useState({
            status: 'idle'
        });
        const actionOptsRef = React.useRef(useActionOpts);
        actionOptsRef.current = useActionOpts;
        React.useEffect(()=>{
            return ()=>{
                // cleanup after unmount to prevent calling hook opts after unmount
                count.current = -1;
                actionOptsRef.current = undefined;
            };
        }, []);
        const mutateAsync = React.useCallback((input, requestOptions)=>{
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
            return client$1.mutation('serverAction', input, {
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
                    error: client.TRPCClientError.from(error, {})
                });
                throw error;
            });
        }, [
            handler
        ]);
        const mutate = React.useCallback((...args)=>{
            void mutateAsync(...args).catch(()=>{
            // ignored
            });
        }, [
            mutateAsync
        ]);
        return React.useMemo(()=>({
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
    const client$1 = client.createTRPCUntypedClient(opts.config());
    // const useProxy = createUseProxy<TRouter>(client);
    const cache = new Map();
    return shared$2.createRecursiveProxy(({ path , args  })=>{
        // const pathCopy = [key, ...path];
        const pathCopy = [
            ...path
        ];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const procedureType = client.clientCallTypeToProcedureType(pathCopy.pop());
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
        const promise = client$1[procedureType](fullPath, ...args);
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

exports.experimental_createActionHook = experimental_createActionHook;
exports.experimental_createTRPCNextAppDirClient = experimental_createTRPCNextAppDirClient;
exports.experimental_serverActionLink = experimental_serverActionLink;
