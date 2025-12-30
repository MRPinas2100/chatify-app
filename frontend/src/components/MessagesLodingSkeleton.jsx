export const MessagesLodingSkeleton = () => {
  const fakeArray = [...Array(6)]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {fakeArray.map((_, index) => {
        const alignBubble = index % 2 === 0 ? "chat-start" : "chat-end"

        return (
          <div key={index} className={`chat ${alignBubble} animate-pulse`}>
            <div className="chat-bubble bg-slate-800 text-white w-32 h-16"></div>
          </div>
        )
      })}
    </div>
  )
}
