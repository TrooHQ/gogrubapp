import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { FaArrowLeftLong, FaCirclePlus } from 'react-icons/fa6';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';

type SelectedOption = { name: string; quantity: number };
type BasketItem = { id: string; name: string; quantity: number; totalPrice: number; selectedOptions?: SelectedOption[] };

export default function OrderSummary() {
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<'dine in' | 'pickup' | null>(null);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerTable, setCustomerTable] = useState('');
  const [note, setNote] = useState('');

  const [items, setItems] = useState<BasketItem[]>([
    { id: '1', name: 'Jollof Rice', quantity: 1, totalPrice: 2500, selectedOptions: [{ name: 'Chicken', quantity: 1 }] },
    { id: '2', name: 'Plantain', quantity: 2, totalPrice: 1200 },
  ]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0), [items]);
  const serviceCharge = useMemo(() => subtotal * 0.1, [subtotal]);
  const total = useMemo(() => subtotal + serviceCharge, [subtotal, serviceCharge]);

  const home = '/';

  const canCheckout =
    (orderType === 'dine in' && customerTable.trim().length > 0) ||
    (orderType === 'pickup' && customerName.trim().length > 0 && customerPhone.trim().length > 0 && customerEmail.trim().length > 0);

  const handlePlaceOrder = () => { };

  const handleQuantityUpdate = (id: string, quantity: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)));
  };

  return (
    <div className="relative w-full min-h-screen mb-24">
      <div className='flex items-center w-full gap-4 px-4 py-3 border-b-2 border-b-gray-100'>
        <FaArrowLeftLong className='text-gray-600' onClick={() => navigate(-1)} />
        <h4 className='flex-1 font-semibold text-center'>Order Summary</h4>
      </div>

      <div className='px-4'>
        {items.map((item) => (
          <OrderSummaryCard key={item.id} item={item} onUpdateQuantity={handleQuantityUpdate} />
        ))}
      </div>

      <Link to={home} className='flex items-center gap-2 px-4 py-3 border-y-2 border-y-gray-100'>
        <FaCirclePlus className='fill-blue-600' />
        <p className='text-sm font-semibold text-blue-600'>Add more items</p>
      </Link>

      <div className='px-4 py-3 border-b-2 border-b-gray-100'>
        <div className='flex items-center justify-between gap-2 py-3 cursor-pointer' onClick={() => { setOrderType('dine in'); setShowCheckOut(false); }}>
          <div className='flex items-center gap-2'>
            <img src="/utensils.svg" alt="" className='w-5 h-5' />
            <p>Dine In</p>
          </div>
          <input type='radio' checked={orderType === 'dine in'} onChange={() => { setOrderType('dine in'); setShowCheckOut(false); setCustomerTable(''); setCustomerName(''); setCustomerPhone(''); setCustomerEmail(''); }} className='cursor-pointer' />
        </div>

        <div className='flex items-center justify-between gap-2 py-3 cursor-pointer' onClick={() => { setOrderType('pickup'); setShowCheckOut(false); setCustomerName(''); setCustomerPhone(''); setCustomerEmail(''); setCustomerTable(''); }}>
          <div className='flex items-center gap-2'>
            <img src="/takeout.svg" alt="" className='w-5 h-5' />
            <p>Pick Up</p>
          </div>
          <input type='radio' checked={orderType === 'pickup'} onChange={() => { setOrderType('pickup'); setShowCheckOut(false); }} className='cursor-pointer' />
        </div>
      </div>

      <div className="px-4 py-4 border-b-2 border-b-gray-100">
        <label className="block mb-2 font-medium text-gray-900">Leave a note</label>
        <input className="w-full px-3 py-2 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="tell the restaurant your preference" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className='px-4 py-3 border-b-2 border-b-gray-100'>
        <div className='flex items-center justify-between py-2'>
          <p className='text-sm font-medium'>SubTotal</p>
          <p className='font-semibold'>₦{subtotal.toLocaleString()}</p>
        </div>
        <div className='flex items-center justify-between py-2'>
          <p className='text-sm font-medium'>Service Charge</p>
          <p className='font-semibold'>₦{serviceCharge.toLocaleString()}</p>
        </div>
      </div>

      <div className='flex items-center justify-between px-4 py-3 border-b-2 border-b-gray-100'>
        <p className='text-sm font-medium'>Total</p>
        <p className='font-semibold'>₦{total.toLocaleString()}</p>
      </div>

      {(orderType !== null && !showCheckOut) && (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-end w-full h-full shadow-lg bg-gray-600/50'>
          <UserInfoCard
            orderType={orderType}
            setOrderType={() => setOrderType(null)}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            customerTable={customerTable}
            setCustomerTable={setCustomerTable}
            setShowCheckOut={setShowCheckOut}
          />
        </div>
      )}

      {(showCheckOut && canCheckout) && (
        <div className='fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between w-full py-2 bg-white shadow-lg'>
          <button className="text-center w-[90%] px-4 py-3 mx-auto text-white bg-black rounded-full hover:bg-gray-800 transition-colors" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

function OrderSummaryCard({ item, onUpdateQuantity }: { item: BasketItem; onUpdateQuantity: (id: string, quantity: number) => void }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
      onUpdateQuantity(item.id, value);
    }
  };

  const handleEdit = () => {
    navigate(`/item-details?id=${item.id}`);
  };

  return (
    <div className="my-4 bg-white">
      <div className='flex items-center justify-between w-full gap-4'>
        <p className="text-base font-medium text-gray-700">{item.name}</p>
        <p className="font-semibold text-gray-900">₦{(item.totalPrice * quantity).toLocaleString()}</p>
      </div>

      <div className='flex w-full gap-4 my-2'>
        {item.selectedOptions?.length ? (
          <div className='flex flex-wrap items-center w-full gap-2 text-xs'>
            {item.selectedOptions.map((option, index) => (
              <span key={index} className='px-2 py-1 text-gray-600 bg-gray-100 rounded-lg text-[12px]'>
                {option.quantity} {option.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center justify-center gap-2 px-2 py-1 my-2 border-2 border-gray-100 w-fit rounded-2xl'>
          <Minus className='w-5 transition-colors cursor-pointer hover:text-red-500' onClick={handleDecrement} />
          <input className='w-12 text-center rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500' value={quantity} onChange={handleQuantityChange} type="number" min="1" />
          <Plus className='w-5 transition-colors cursor-pointer hover:text-green-500' onClick={handleIncrement} />
        </div>

        <div className='flex items-center gap-4'>
          <span className='text-sm font-semibold text-blue-500 cursor-pointer hover:text-blue-700' onClick={handleEdit}>Edit</span>
          <span className='text-sm font-semibold text-red-500 cursor-pointer hover:text-red-700'>Remove</span>
        </div>
      </div>
    </div>
  );
}

function UserInfoCard({ orderType, setOrderType, customerName, setCustomerName, customerPhone, setCustomerPhone, customerEmail, setCustomerEmail, customerTable, setCustomerTable, setShowCheckOut }: any) {
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleSaveUserInfo = () => {
    const isDineInValid = orderType === 'dine in' && Boolean(customerTable);
    const isPickupValid = orderType === 'pickup' && Boolean(customerName && customerPhone && customerEmail);

    if (isDineInValid || isPickupValid) {
      setShowCheckOut(true);
      setErrorState(null);
    } else {
      setErrorState('Please fill in the above fields');
    }
  };

  return (
    <div className='w-full p-4 bg-white rounded-t-2xl'>
      <div className="w-full mb-2">
        <div className="flex items-center justify-between w-full">
          <h4 className="font-semibold">{orderType} details</h4>
          <CloseLineIcon onClick={setOrderType} />
        </div>
        <p className='mt-2 text-sm'>{orderType === 'dine in' && 'Your order will be brought to your table when ready'}</p>
      </div>

      {orderType === 'pickup' && (
        <div className="flex flex-col justify-center w-full space-y-4 item-center">
          <input placeholder='Full name' className='w-full p-2 border border-gray-100 active:outline-none focus:outline-none rounded-xl' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <input placeholder='Email' className='w-full p-2 my-4 border border-gray-100 active:outline-none focus:outline-none rounded-xl' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          <div className="flex items-center overflow-hidden border border-gray-100 rounded-xl">
            <span className='p-2 font-semibold bg-gray-100'>+234</span>
            <input placeholder='Phone Number' className='w-full p-2 rounded-xl active:outline-none focus:outline-none' value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} type='number' />
          </div>
        </div>
      )}

      {orderType === 'dine in' && (
        <div className="flex flex-col justify-center w-full space-y-4 item-center">
          <input placeholder='Table number' className='w-full p-2 my-4 border border-gray-100 active:outline-none focus:outline-none rounded-xl' value={customerTable} onChange={(e) => setCustomerTable(e.target.value)} type='number' />
        </div>
      )}

      <p className='text-xs text-red-500 '>{errorState}</p>
      <button className='px-4 py-2 mx-auto my-4 text-white bg-black rounded-lg w-fit' onClick={handleSaveUserInfo}>Done</button>
    </div>
  );
}
