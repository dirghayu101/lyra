import Link from "next/link";
import { format } from "date-fns";
import { ClockFadingIcon, SparklesIcon } from "lucide-react";
import Markdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { TabsContent } from "@/components/ui/tabs";

import { formatDuration } from "@/lib/utils";

type SummaryProps = {
  meetingName: string;
  agentId: string;
  agentName: string;
  startedAt: string | null;
  duration: number;
  summary: string | null;
};

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
