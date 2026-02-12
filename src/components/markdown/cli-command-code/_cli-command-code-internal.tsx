
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { CheckIcon, ClipboardIcon, TerminalIcon, XIcon } from "lucide-react"
import { useState } from "react"

export function CliCommandCodeInternal({
    commands,
}: {
    commands: {
        label: string
        code: string
    }[]
}) {
    const [selectedTab, setSelectedTab] = useLocalStorage(
        "cli-method",
        commands[0].label,
    )
    const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
        "idle",
    )

    function handleCopy() {
        const command = commands.find(cmd => cmd.label === selectedTab)
        if (command) {
            navigator.clipboard
                .writeText(command.code)
                .then(() => setCopyState("copied"))
                .catch(() => setCopyState("error"))
                .finally(() => setTimeout(() => setCopyState("idle"), 2000))
        }
    }

    return (
        <Card className="not-content bg-zinc-950 p-0">
            <CardContent className="p-0">
                <Tabs
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    className="gap-0"
                >
                    <div className="flex items-center border-b border-zinc-800 px-3 py-1">
                        <div className="mr-2 flex size-4 items-center justify-center bg-zinc-800/70 rounded-sm">
                            <TerminalIcon className="size-3 text-zinc-400" />
                        </div>
                        <TabsList className="h-auto bg-transparent p-0 font-mono">
                            {commands.map((command, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={command.label}
                                    className="h-auto rounded-none border-b-2 border-transparent bg-transparent px-3 py-1 text-xs text-zinc-400 shadow-none data-[state=active]:border-zinc-400 data-[state=active]:bg-zinc-800/50 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none"
                                >
                                    {command.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TooltipProvider>
                            <Tooltip open={copyState !== "idle"}>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleCopy}
                                        variant="ghost"
                                        className="ml-auto size-6 h-6 w-6 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                                    >
                                        {copyState === "idle" ? (
                                            <ClipboardIcon className="size-3" />
                                        ) : copyState === "copied" ? (
                                            <CheckIcon className="size-3" />
                                        ) : (
                                            <XIcon className="size-3 text-red-500" />
                                        )}
                                        <span className="sr-only">Copy</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    {copyState === "error" ? "Error!" : "Copied"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div>
                        {commands.map(command => (
                            <TabsContent
                                key={command.label}
                                value={command.label}
                                className="mt-0 no-scrollbar overflow-x-auto py-3.5 text-zinc-100"
                            >
                                <pre className="mb-0 mt-0">
                                    <code className="bg-transparent px-4 py-0 text-sm font-mono text-zinc-100">{command.code}</code>
                                </pre>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    )
}
