import React from 'react'

function DayShow({day}) {
  return (
    <div
    key={day} 
    className='bg-[#e2e8f4] border-1 border-[#6B7280] w-fit h-fit  rounded-xl px-2 py-0.5 self-center'>
          <p className='text-xs font-inter text-[#6B7280]'>{String(day).split('-').reverse().join('-')}</p>

        </div>
  )
}

export default DayShow