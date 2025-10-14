import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { redirect } from "next/navigation";
import { caller } from "@/trpc/server";


const Page = async () => {

  const data = await caller.hello({text: "Joshi Server"})

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!session){
    redirect("/sign-in");
  }
  return <p>{data.greeting}</p>
  return (
    <HomeView />

  )
}

export default Page;
