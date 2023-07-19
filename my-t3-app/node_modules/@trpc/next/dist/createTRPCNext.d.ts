import { CreateReactUtilsProxy, DecoratedProcedureRecord, TRPCUseQueries } from '@trpc/react-query/shared';
import { AnyRouter, ProtectedIntersection } from '@trpc/server';
import { NextPageContext } from 'next/types';
import { withTRPC, WithTRPCNoSSROptions, WithTRPCSSROptions } from './withTRPC';
/**
 * @internal
 */
export interface CreateTRPCNextBase<TRouter extends AnyRouter, TSSRContext extends NextPageContext> {
    useContext(): CreateReactUtilsProxy<TRouter, TSSRContext>;
    withTRPC: ReturnType<typeof withTRPC<TRouter, TSSRContext>>;
    useQueries: TRPCUseQueries<TRouter>;
}
/**
 * @internal
 */
export type CreateTRPCNext<TRouter extends AnyRouter, TSSRContext extends NextPageContext, TFlags> = ProtectedIntersection<CreateTRPCNextBase<TRouter, TSSRContext>, DecoratedProcedureRecord<TRouter['_def']['record'], TFlags>>;
export declare function createTRPCNext<TRouter extends AnyRouter, TSSRContext extends NextPageContext = NextPageContext, TFlags = null>(opts: WithTRPCNoSSROptions<TRouter> | WithTRPCSSROptions<TRouter>): CreateTRPCNext<TRouter, TSSRContext, TFlags>;
//# sourceMappingURL=createTRPCNext.d.ts.map