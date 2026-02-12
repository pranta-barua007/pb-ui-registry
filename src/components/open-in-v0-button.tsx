
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon } from "lucide-react"

export function OpenInV0Button({ url }: { url: string }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => window.open(`https://v0.dev/chat?url=${url}`, "_blank")}
        >
            <ExternalLinkIcon className="size-4" />
            <span className="sr-only">Open in v0</span>
        </Button>
    )
}
