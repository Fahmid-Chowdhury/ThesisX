export const DangerAlert = ({ text }) => {
    return (
        <div className="px-2 py-2 rounded-md border bg-[hsl(0,50%,10%)] border-[hsl(0,50%,50%)]">
            <p className="text-center text-[hsl(0,50%,60%)]">
                {text}
            </p>
        </div>
    )
}
