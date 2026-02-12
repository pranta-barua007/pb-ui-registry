
import { type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/useLocalStorage"

export function InstallationTabsInternal({
    children,
    cliSteps,
}: {
    children: ReactNode
    cliSteps: ReactNode
}) {
    const [selectedTab, setSelectedTab] = useLocalStorage(
        "installation-method",
        "cli",
    )
    return (
        <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="not-content mt-6"
        >
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                    value="cli"
                    className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    CLI
                </TabsTrigger>
                <TabsTrigger
                    value="manual"
                    className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                    Manual
                </TabsTrigger>
            </TabsList>
            <TabsContent value="cli" className="mt-4">{cliSteps}</TabsContent>
            <TabsContent value="manual" className="mt-4">{children}</TabsContent>
        </Tabs>
    )
}
