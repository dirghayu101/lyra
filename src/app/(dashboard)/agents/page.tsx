import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getQueryClient, trpc } from "@/trpc/server";
import {
  AgentsView,
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";

const Page = async () => {
   const session = await auth.api.getSession({
      headers: await headers(),
    })
  
    if(!session){
      redirect("/sign-in");
    }

  const queryClient = getQueryClient();
  
  // If you ignore this step, AgentView's useSuspenseQuery will fallback to useQuery. You shouldn't ignore it because your application will break if there is a protected route involved.
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
    <AgentsListHeader />
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsViewLoading />}>
        <ErrorBoundary fallback={<AgentsViewError />}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
    </>
  );
};

export default Page;
