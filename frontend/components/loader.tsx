export function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    let spinnerSize = "w-8 h-8";
    if (size === "sm") spinnerSize = "w-4 h-4";
    if (size === "lg") spinnerSize = "w-12 h-12";
    return (
        <div className={`flex justify-center items-center`}>
            <div
            className={`${spinnerSize} border-4 border-t-transparent border-primary rounded-full animate-spin`}
            role="status"
            ></div>
        </div>
        );
}