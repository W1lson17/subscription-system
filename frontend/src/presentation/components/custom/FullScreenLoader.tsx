import { Spinner } from "../ui/spinner"

export const FullscreenLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="size-8"/>
    </div>
  )
}