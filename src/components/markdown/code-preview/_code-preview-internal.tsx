
import { lazy, Suspense, type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2Icon, SettingsIcon } from "lucide-react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { SERVER_URL_CLIENT_SIDE as SERVER_URL } from "../../../../environment.js"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import {
    ICON_LIBRARIES,
    iconLibraryToLabel,
    type IconLibrary,
} from "@/components/registry-helpers/icon-placeholder"

// Define available demos here
export type Demo =
    | "form/form-demo"
    | "action-button/demo"
// Add others as needed

export function CodePreviewInternal({
    demo,
    children,
}: {
    demo: string // Relaxed type to string to avoid constant updates
    children: ReactNode
}) {
    const componentName = demo.split("/")[0]
    const demoName = demo.split("/")[1]
    const Component = getComponentCached(componentName, demoName)
    const [iconLibrary, setIconLibrary] = useLocalStorage<IconLibrary>(
        "preferred-icon-library",
        "lucide",
    )

    return (
        <Tabs defaultValue="preview" className="not-content group">
            <div className="flex w-full items-center justify-between pb-3">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                        value="preview"
                        className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                        Preview
                    </TabsTrigger>
                    <TabsTrigger
                        value="code"
                        className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                        Code
                    </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    {/* Settings Popover could go here */}
                    <div className="hidden">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <SettingsIcon className="size-4" />
                                    <span className="sr-only">Settings</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="grid gap-4">
                                    <Label>Icon Library</Label>
                                    <Select value={iconLibrary} onValueChange={(v) => setIconLibrary(v as IconLibrary)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {ICON_LIBRARIES.map(lib => (
                                                <SelectItem key={lib} value={lib}>{iconLibraryToLabel(lib)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Open In V0 */}
                    <OpenInV0Button url={`${SERVER_URL}/r/${componentName}.json`} />
                </div>
            </div>

            <Card className="relative overflow-hidden border bg-background">
                <CardContent className="space-y-4 p-0">
                    <TabsContent
                        value="preview"
                        className="flex min-h-[350px] items-center justify-center p-10 mt-0"
                    >
                        <Suspense
                            fallback={<Loader2Icon className="size-16 animate-spin text-muted-foreground" />}
                        >
                            <Component />
                        </Suspense>
                    </TabsContent>
                    <TabsContent value="code" className="border-t bg-muted/40 mt-0">
                        <div className="flex flex-col space-y-4">
                            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
                                {children}
                            </div>
                        </div>
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
    )
}

const componentCache: Record<string, React.LazyExoticComponent<React.ComponentType>> = {}

function getComponentCached(component: string, demo: string) {
    const path = `../../../registry/new-york/items/${component}/${demo}.tsx`
    if (componentCache[path]) return componentCache[path]

    // We need to use glob import for dynamic imports in Vite/Astro
    const modules = import.meta.glob('../../../registry/new-york/items/**/*.tsx')
    const importer = modules[path]

    if (!importer) {
        console.error(`Demo not found: ${path}`)
        const ErrorComponent = () => <div>Demo not found: {path}</div>
        const lazyError = lazy(async () => ({ default: ErrorComponent }))
        componentCache[path] = lazyError
        return lazyError
    }

    const lazyComponent = lazy(async () => {
        const module = (await importer()) as { default?: React.ComponentType;[key: string]: unknown }
        // Assume default export or first named export
        const namedExport = Object.keys(module).find(
            key => typeof module[key] === "function" && key !== "default"
        )
        return {
            default: module.default ?? (namedExport ? (module[namedExport] as React.ComponentType) : () => <div>No component found</div>),
        }
    })

    componentCache[path] = lazyComponent
    return lazyComponent
}
