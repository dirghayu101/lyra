import Link from "next/link";
import { format } from "date-fns";
import { ClockFadingIcon, SparklesIcon, SearchIcon } from "lucide-react";
import Markdown from "react-markdown";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUri } from "@/lib/avatar";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { TabsContent } from "@/components/ui/tabs";

import { formatDuration } from "@/lib/utils";
import { ChatProvider } from "./chat-provider";

export const VideoContent = ({
  recordingUrl,
}: {
  recordingUrl: string | null;
}) => {
  return (
    <TabsContent value="recording">
      <div className="bg-white rounded-lg border px-4 py-5">
        {recordingUrl ? (
          <video src={recordingUrl} className="w-full rounded-lg" controls />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No recording available
          </div>
        )}
      </div>
    </TabsContent>
  );
};

type SummaryProps = {
  meetingName: string;
  agentId: string;
  agentName: string;
  startedAt: string | null;
  duration: number;
  summary: string | null;
};

export const SummaryContent = ({
  meetingName,
  agentId,
  agentName,
  startedAt,
  duration,
  summary,
}: SummaryProps) => {
  return (
    <TabsContent value="summary">
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 flex flex-col gap-y-5 col-span-5">
          <h2 className="text-2xl font-medium capitalize">{meetingName}</h2>
          <div className="flex gap-x-2 items-center">
            <Link
              href={`/agents/${agentId}`}
              className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
            >
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={agentName}
                className="size-5"
              />
              {agentName}
            </Link>{" "}
            <p>{startedAt ? format(startedAt, "PPP") : ""}</p>
          </div>
          <div className="flex gap-x-2 items-center">
            <SparklesIcon className="size-4" />
            <p>General Summary</p>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <ClockFadingIcon className="text-blue-700" />
            {duration ? formatDuration(duration) : "No duration"}
          </Badge>
          <div>
            <Markdown
              components={{
                h1: (props) => (
                  <h1 className="text-2xl font-medium mb-6" {...props} />
                ),
                h2: (props) => (
                  <h2 className="text-xl font-medium mb-6" {...props} />
                ),
                h3: (props) => (
                  <h3 className="text-lg font-medium mb-6" {...props} />
                ),
                h4: (props) => (
                  <h4 className="text-base font-medium mb-6" {...props} />
                ),
                p: (props) => <p className="mb-6 leading-relaxed" {...props} />,
                ul: (props) => (
                  <ul className="list-disc list-inside mb-6" {...props} />
                ),
                ol: (props) => (
                  <ol className="list-decimal list-inside mb-6" {...props} />
                ),
                li: (props) => <li className="mb-1" {...props} />,
                strong: (props) => (
                  <strong className="font-semibold" {...props} />
                ),
                code: (props) => (
                  <code
                    className="bg-gray-100 px-1 py-0.5 rounded"
                    {...props}
                  />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="border-l- 4 pl-4 italic my-4"
                    {...props}
                  />
                ),
              }}
            >
              {summary}
            </Markdown>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

type TranscriptProps = {
  meetingId: string;
};

export const TranscriptContent = ({ meetingId }: TranscriptProps) => {
  return (
    <TabsContent value="transcript">
      <Transcript meetingId={meetingId} />
    </TabsContent>
  );
};

const Transcript = ({ meetingId }: { meetingId: string }) => {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId })
  );
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = (data ?? []).filter((item) =>
    item.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-y-4 w-full">
      <p className="text-sm font-medium">Transcript</p>
      <div className="relative">
        <Input
          placeholder="Search Transcript"
          className="pl-7 h-9 w-[240px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-y-4">
          {filteredData.map((item) => {
            return (
              <div
                key={item.start_ts}
                className="flex flex-col gap-y-2 hover:bg-muted p-4 rounded-md border"
              >
                <div className="flex gap-x-2 items-center">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={
                        item.user.image ??
                        generateAvatarUri({
                          seed: item.user.name,
                          variant: "initials",
                        })
                      }
                      alt="User Avatar"
                    />
                  </Avatar>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <p className="text-sm text-blue-500 font-medium">
                    {format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), "mm:ss")}
                  </p>
                </div>
                <Highlighter 
                  className="text-sm text-neutral-700"
                  highlightClassName="bg-yellow-200"
                  searchWords={[searchQuery]}
                  autoEscape={true}
                  textToHighlight={item.text}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

type ChatProps = {
  meetingId: string;
  meetingName: string;
}

export const ChatContent = ({meetingId, meetingName}: ChatProps) => {
  
 return (
    <TabsContent value="chat">
      <ChatProvider meetingId={meetingId} meetingName={meetingName} />
    </TabsContent>
  );
}
