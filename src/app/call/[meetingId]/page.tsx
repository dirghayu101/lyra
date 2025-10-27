import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { CallView } from "@/modules/call/ui/views/call-view";

type Props = {
    params: Promise<{
        meetingId: string
    }>;
};

const Page = async ({params}: Props) => {
    const {meetingId} = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session){
        redirect("/sign-in");
    }
    
    

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId})
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CallView meetingId={meetingId}/>
        </HydrationBoundary>
    )

}

export default Page;
