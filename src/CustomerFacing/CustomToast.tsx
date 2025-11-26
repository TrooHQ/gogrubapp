import { FaShoppingCart } from "react-icons/fa";

export default function CustomAddToCartToast({ count = 1, text = "" }: { count?: number, text?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-200 w-full max-w-[720px] mx-auto justify-center">
      <FaShoppingCart className="w-4 h-4" />
      <p className="text-sm font-medium text-gray-900">{count} {text}</p>
    </div>
  )
}
