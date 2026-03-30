import {Loader} from "lucide-react"

function Loading({s}) {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="animate-spin" style={{animationDuration:'1.8s'}}>
                <Loader style={{width: `${s}px`, height: `${s}px`}} />
            </div>
        </div>
    )
}

export default Loading