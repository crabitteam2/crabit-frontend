'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button
      type="button"
      className="counter"
      onClick={() => setCount((currentCount) => currentCount + 1)}
    >
      Count is {count}
    </button>
  )
}
