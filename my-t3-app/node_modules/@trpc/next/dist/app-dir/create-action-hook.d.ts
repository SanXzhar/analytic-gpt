import { CreateTRPCClientOptions, TRPCClientError, TRPCLink } from '@trpc/client';
import { AnyProcedure, AnyRouter, inferHandlerInput, MaybePromise, ProcedureOptions, Simplify } from '@trpc/server';
import { TRPCActionHandler } from './server';
import { ActionHandlerDef } from './shared';
type MutationArgs<TDef extends ActionHandlerDef> = TDef['input'] extends void ? [input?: undefined | void, opts?: ProcedureOptions] : [input: FormData | TDef['input'], opts?: ProcedureOptions];
interface UseTRPCActionBaseResult<TDef extends ActionHandlerDef> {
    mutate: (...args: MutationArgs<TDef>) => void;
    mutateAsync: (...args: MutationArgs<TDef>) => Promise<TDef['output']>;
}
interface UseTRPCActionSuccessResult<TDef extends ActionHandlerDef> extends UseTRPCActionBaseResult<TDef> {
    data: TDef['output'];
    error?: never;
    status: 'success';
}
interface UseTRPCActionErrorResult<TDef extends ActionHandlerDef> extends UseTRPCActionBaseResult<TDef> {
    data?: never;
    error: TRPCClientError<TDef['errorShape']>;
    status: 'error';
}
interface UseTRPCActionIdleResult<TDef extends ActionHandlerDef> extends UseTRPCActionBaseResult<TDef> {
    data?: never;
    error?: never;
    status: 'idle';
}
interface UseTRPCActionLoadingResult<TDef extends ActionHandlerDef> extends UseTRPCActionBaseResult<TDef> {
    data?: never;
    error?: never;
    status: 'loading';
}
export type UseTRPCActionResult<TDef extends ActionHandlerDef> = UseTRPCActionErrorResult<TDef> | UseTRPCActionIdleResult<TDef> | UseTRPCActionLoadingResult<TDef> | UseTRPCActionSuccessResult<TDef>;
export declare function experimental_serverActionLink<TRouter extends AnyRouter = AnyRouter>(): TRPCLink<TRouter>;
/**
 * @internal
 */
export type inferActionResultProps<TProc extends AnyProcedure> = {
    input: inferHandlerInput<TProc>[0];
    output: TProc['_def']['_output_out'];
    errorShape: TProc['_def']['_config']['$types']['errorShape'];
};
interface UseTRPCActionOptions<TDef extends ActionHandlerDef> {
    onSuccess?: (result: TDef['output']) => MaybePromise<void> | void;
    onError?: (result: TRPCClientError<TDef['errorShape']>) => MaybePromise<void>;
}
export declare function experimental_createActionHook<TRouter extends AnyRouter>(opts: CreateTRPCClientOptions<TRouter>): <TDef extends ActionHandlerDef>(handler: TRPCActionHandler<TDef>, useActionOpts?: UseTRPCActionOptions<Simplify<TDef>> | undefined) => UseTRPCActionResult<TDef>;
export {};
//# sourceMappingURL=create-action-hook.d.ts.map