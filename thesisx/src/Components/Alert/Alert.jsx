export const DangerAlert = ({ text }) => {
    return (
        <div className="px-2 py-2 rounded-md border bg-[hsl(0,50%,90%)] dark:bg-[hsl(0,50%,10%)]  border-[hsl(0,50%,50%)]">
            <p className="text-center text-[hsl(0,50%,40%)] dark:text-[hsl(0,50%,60%)]">
                {text}
            </p>
        </div>
    )
}
export const SuccessAlert = ({ text }) => {
    return (
        <div className="px-2 py-2 rounded-md border bg-[hsl(120,50%,90%)] dark:bg-[hsl(120,50%,10%)]  border-[hsl(120,50%,50%)]">
            <p className="text-center text-[hsl(120,50%,40%)] dark:text-[hsl(120,50%,60%)]">
                {text}
            </p>
        </div>
    )
}


