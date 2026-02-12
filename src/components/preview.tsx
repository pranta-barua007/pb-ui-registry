import { cn } from "@/lib/utils"

export function Preview({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                "preview flex min-h-[350px] w-full items-center justify-center p-10 ring-1 ring-border rounded-lg",
                className
            )}
        >
            {children}
        </div>
    )
}
