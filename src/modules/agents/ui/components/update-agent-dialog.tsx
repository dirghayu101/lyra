import { ResponsiveDialog } from "@/components/responsive-dialog"
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: AgentGetOne
}

export const UpdateAgentDialog = ({open, onOpenChange, initialValues}: Props) => {
    return (
        <ResponsiveDialog
            title="Edit Agent"
            description="Edit agent details"
            open={open}
            onOpenChange={onOpenChange}
        >
            <AgentForm 
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}
