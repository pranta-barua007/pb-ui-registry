"use client"

import { ActionButton } from "./components/action-button"

export default function ActionButtonDemo() {
    return (
        <div className="flex items-center justify-center p-8">
            <ActionButton
                action={async () => {
                    await new Promise((resolve) => setTimeout(resolve, 2000))
                    return { error: false, message: "Action completed!" }
                }}
            >
                Trigger Async Action
            </ActionButton>
        </div>
    )
}
