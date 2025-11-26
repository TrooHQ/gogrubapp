import { Minus, Plus } from 'lucide-react'
import React from 'react'

export default function ProdCount({ handleDecrement,
  quantity,
  handleQuantityChange,
  handleIncrement }: {
    handleDecrement: () => void,
    quantity: number,
    handleQuantityChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleIncrement: () => void,
  }) {
  return (
    <div className='flex items-center justify-center gap-2 px-2 py-1 my-2 border-2 border-gray-200 w-fit rounded-2xl'>
      <Minus
        className='w-5 transition-colors cursor-pointer hover:text-red-500'
        onClick={handleDecrement}
      />
      <input
        className='w-12 text-center rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500'
        value={quantity}
        onChange={handleQuantityChange}
        type="number"
        min="1"
      />
      <Plus
        className='w-5 transition-colors cursor-pointer hover:text-green-500'
        onClick={handleIncrement}
      />
    </div>
  )
}
