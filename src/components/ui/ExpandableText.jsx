import { useState, useRef, useEffect } from 'react'

export default function ExpandableText({
  text,
  lines = 3,
  className = '',
  buttonClassName = '',
  buttonText = 'بیشتر بخوانید',
  onExpand,
}) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef(null)

  useEffect(() => {
    if (!textRef.current) return
    // چک کن آیا متن بیشتر از lines خط است
    const el = textRef.current
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    const maxHeight = lineHeight * lines
    setIsOverflowing(el.scrollHeight > maxHeight + 2)
  }, [text, lines])

  if (!text) return null

  const clampStyle = isOverflowing
    ? {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : {}

  return (
    <div>
      <p ref={textRef} className={className} style={clampStyle}>
        {text}
      </p>

      {isOverflowing && (
        <button
          onClick={onExpand}
          className={`mt-2 text-sm font-medium text-white/90 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition ${buttonClassName}`}
        >
          {buttonText}...
        </button>
      )}
    </div>
  )
}