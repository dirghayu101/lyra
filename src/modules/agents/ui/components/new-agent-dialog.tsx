import { ResponsiveDialog } from "@/components/responsive-dialog"
import { AgentForm } from "./agent-form";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({open, onOpenChange}: Props) => {
    return (
        <ResponsiveDialog
            title="New Agent"
            description="Create a new Agent"
            open={open}
            onOpenChange={onOpenChange}
        >
            <AgentForm 
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}
