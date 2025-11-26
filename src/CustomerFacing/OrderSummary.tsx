import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { FaArrowLeftLong, FaCirclePlus } from 'react-icons/fa6';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import axios from 'axios';
import { SERVER_DOMAIN, PAYMENT_DOMAIN } from '../Api/Api';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { BiPackage } from "react-icons/bi";
import { TbPaperBag } from "react-icons/tb";
import type { BasketItem as BasketItemStore, Option } from '../slices/BasketSlice';

function extractBusinessIdentifierFromUrl(inputUrl?: string): string | null {
  const source = inputUrl ?? (typeof window !== 'undefined' ? window.location.href : '');
  const tryGet = (p: string): string | null => {
    const parts = p.split('/').filter(Boolean);
    const idx = parts.findIndex((s) => s === 'online_ordering');
    return idx !== -1 && parts[idx + 1] ? decodeURIComponent(parts[idx + 1]) : null;
  };
  try {
    const url = new URL(source, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    return tryGet(url.pathname);
  } catch {
    return tryGet(source);
  }
}

export default function OrderSummary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | null>(null);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [localGovernment, setLocalGovernment] = useState('');
  const [stateName, setStateName] = useState('');
  const [note, setNote] = useState('');

  const basket = useSelector((state: RootState) => state.basket);
  const items = basket.items as BasketItemStore[];
  const branchId = useSelector((state: RootState) => state.business?.branchID);
  const businessIdentifier = useSelector((state: RootState) => state.business?.businessIdentifier);
  const businessId = useSelector((state: RootState) => state.business?.businessDetails?._id);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0), [items]);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [pricePlusTax, setPricePlusTax] = useState(0);
  useMemo(() => pricePlusTax, [pricePlusTax]);
  const deliveryDetails = useSelector((state: RootState) => state.business?.deliveryDetails);
  const deliveryFee = deliveryDetails?.deliveryDetails?.fixedPrice;
  const [totalDue, setTotalDue] = useState(pricePlusTax);

  const storedHome = localStorage.getItem("gg_h_url") || '/';
  let home = storedHome;
  try {
    const u = new URL(storedHome, window.location.origin);
    home = u.pathname;
  } catch {
    home = storedHome;
  }

  const canCheckout =
    (orderType === 'delivery' && customerName.trim().length > 0 && customerPhone.trim().length > 0 && houseNumber.trim().length > 0 && streetAddress.trim().length > 0 && localGovernment.trim().length > 0 && stateName.trim().length > 0) ||
    (orderType === 'pickup' && customerName.trim().length > 0 && customerPhone.trim().length > 0 && customerEmail.trim().length > 0);

  useEffect(() => {
    const calc = async () => {
      if (!subtotal) {
        setServiceCharge(0);
        setPricePlusTax(0);
        return;
      }
      try {
        const response = await axios.post(`${SERVER_DOMAIN}/order/calculateTotalAmount`, { amount: subtotal });
        setPricePlusTax(response.data.total || subtotal);
        setServiceCharge(response.data.tax || 0);
      } catch (e) {
        setServiceCharge(0);
        setPricePlusTax(subtotal);
      }
    };
    calc();
  }, [subtotal]);

  useEffect(() => {
    if (deliveryFee !== undefined && deliveryFee !== null) {
      setTotalDue(parseFloat(pricePlusTax.toString()) + (orderType === 'delivery' ? parseFloat(deliveryFee.toString()) : 0));
    } else {
      setTotalDue(pricePlusTax);
    }
  }, [deliveryFee, pricePlusTax, orderType]);

  const handlePlaceOrder = async () => {
    const delOpt = orderType === 'delivery' ? 'delivery' : 'pickup';
    localStorage.setItem('selDelOpt', delOpt);
    sessionStorage.setItem('url', window.location.href);

    const orderItems = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      specialInstructions: item.specialInstructions,
      menuItem: {
        _id: item.menuItem?._id,
        menu_category_name: item.menuItem?.menu_category_name,
        menu_group_name: item.menuItem?.menu_group_name,
        menu_item_name: item.menuItem?.menu_item_name,
        menu_item_price: item.menuItem?.menu_item_price,
        menu_item_image: item.menuItem?.menu_item_image,
      },
      name: item.name,
      selectedOptions: (item.selectedOptions || []).map((option: Option) => ({
        name: option.name,
        price: option.price,
      })),
      complimentary: item.complimentary,
      tableNumber: item.tableNumber,
    }));

    const customerAddress = [
      houseNumber,
      streetAddress,
      landmark,
      localGovernment,
      stateName,
    ].filter(Boolean).join(', ');

    const payload = {
      is_paid: 'false',
      channel: 'Online',
      branch_id: branchId || undefined,
      businessIdentifier: businessIdentifier || undefined,
      customerName: customerName,
      ordered_by: customerName || 'User',
      customerTableNumber: '',
      customerData: {
        email: customerEmail,
        phoneNumber: customerPhone,
        customerName: customerName,
        address: customerAddress,
      },
      orderType: delOpt,
      order_type: delOpt,
      items: orderItems,
      menu_items: orderItems,
      total_price: totalDue,
      totalPrice: totalDue,
      totalQuantity: items.reduce((sum, it) => sum + it.quantity, 0),
    };

    localStorage.setItem('order_sdjgh', JSON.stringify(payload));
    if (deliveryFee) {
      sessionStorage.setItem('deliveryFee', deliveryFee.toString());
    }

    try {
      const headers = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      };
      const response = await axios.post(
        `${PAYMENT_DOMAIN}/transaction/initiate_paystack_transaction/`,
        {
          business_id: businessId,
          name: customerName || 'User',
          platform: 'Online',
          amount: totalDue,
          email: 'user@example.com',
          // callback_url: window.location.href,
          callback_url: window.location.origin + "/demo/order-status",
          menu_items: orderItems,
        },
        headers
      );
      sessionStorage.setItem('reference', response?.data?.transaction?.ref);
      window.location.href = response.data.paystack_data.data.authorization_url;
    } catch (error) {
      console.error('Error initiating payment:', error);
      window.location.href = '/demo/payment-type/online_ordering/';
    }
  };

  const handleQuantityUpdate = (id: string, quantity: number) => {
    dispatch({ type: 'basket/updateItemQuantity', payload: { id, quantity } });
  };

  return (
    <div className="relative w-full min-h-screen mb-24">
      <div className='flex items-center w-full gap-4 px-4 py-3 border-b-2 border-b-gray-100'>
        <FaArrowLeftLong className='text-gray-600' onClick={() => navigate(home)} />
        <h4 className='flex-1 font-semibold text-center'>Order Summary</h4>
      </div>

      <div className='px-4'>
        {items.map((item) => (
          <OrderSummaryCard key={item.id} item={item} onUpdateQuantity={handleQuantityUpdate} home={home} />
        ))}
      </div>

      <Link to={home} className='flex items-center gap-2 px-4 py-3 border-y-2 border-y-gray-100'>
        <FaCirclePlus className='fill-blue-600' />
        <p className='text-sm font-semibold text-blue-600'>Add more items</p>
      </Link>

      <div className='px-4 py-3 border-b-2 border-b-gray-100'>
        <div className='flex items-center justify-between gap-2 py-3 cursor-pointer' onClick={() => { setOrderType('delivery'); setShowCheckOut(false); setCustomerName(''); setCustomerPhone(''); setCustomerEmail(''); setHouseNumber(''); setStreetAddress(''); setLandmark(''); setLocalGovernment(''); setStateName(''); }}>
          <div className='flex items-center gap-2'>
            <BiPackage className='w-5 h-5' />
            <p>Delivery</p>
          </div>
          <input type='radio' checked={orderType === 'delivery'} onChange={() => { setOrderType('delivery'); setShowCheckOut(false); setCustomerName(''); setCustomerPhone(''); setCustomerEmail(''); setHouseNumber(''); setStreetAddress(''); setLandmark(''); setLocalGovernment(''); setStateName(''); }} className='cursor-pointer' />
        </div>

        <div className='flex items-center justify-between gap-2 py-3 cursor-pointer' onClick={() => { setOrderType('pickup'); setShowCheckOut(false); setCustomerName(''); setCustomerPhone(''); setCustomerEmail(''); setHouseNumber(''); setStreetAddress(''); setLandmark(''); setLocalGovernment(''); setStateName(''); }}>
          <div className='flex items-center gap-2'>
            <TbPaperBag className='w-5 h-5' />
            <p>Pick Up</p>
          </div>
          <input type='radio' checked={orderType === 'pickup'} onChange={() => { setOrderType('pickup'); setShowCheckOut(false); }} className='cursor-pointer' />
        </div>
      </div>

      <div className="px-4 py-4 border-b-2 border-b-gray-200">
        <label className="block mb-2 font-medium text-gray-900">Leave a note</label>
        <input className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="tell the restaurant your preference" value={note} onChange={(e) => setNote(e.target.value)} />
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
        <p className='font-semibold'>₦{totalDue.toLocaleString()}</p>
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
            houseNumber={houseNumber}
            setHouseNumber={setHouseNumber}
            streetAddress={streetAddress}
            setStreetAddress={setStreetAddress}
            landmark={landmark}
            setLandmark={setLandmark}
            localGovernment={localGovernment}
            setLocalGovernment={setLocalGovernment}
            stateName={stateName}
            setStateName={setStateName}
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

function OrderSummaryCard({ item, onUpdateQuantity, home }: { item: BasketItemStore; onUpdateQuantity: (id: string, quantity: number,) => void; home: string }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const businessIdentifier = extractBusinessIdentifierFromUrl(home) || '';

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
    navigate(`/demo/menudetails?id=${item.id}&bid=${businessIdentifier}`);
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
            {item.selectedOptions.map((option: Option, index) => (
              <span key={index} className='px-2 py-1 text-gray-600 bg-gray-100 rounded-lg text-[12px]'>
                {option.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center justify-center gap-2 px-2 py-1 my-2 border-2 border-gray-200 w-fit rounded-2xl'>
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

type UserInfoCardProps = {
  orderType: 'delivery' | 'pickup' | null;
  setOrderType: (value: 'delivery' | 'pickup' | null) => void;
  customerName: string;
  setCustomerName: (value: string) => void;
  customerPhone: string;
  setCustomerPhone: (value: string) => void;
  customerEmail: string;
  setCustomerEmail: (value: string) => void;
  houseNumber: string;
  setHouseNumber: (value: string) => void;
  streetAddress: string;
  setStreetAddress: (value: string) => void;
  landmark: string;
  setLandmark: (value: string) => void;
  localGovernment: string;
  setLocalGovernment: (value: string) => void;
  stateName: string;
  setStateName: (value: string) => void;
  setShowCheckOut: (value: boolean) => void;
};

function UserInfoCard({
  orderType,
  setOrderType,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerEmail,
  setCustomerEmail,
  houseNumber,
  setHouseNumber,
  streetAddress,
  setStreetAddress,
  landmark,
  setLandmark,
  localGovernment,
  setLocalGovernment,
  stateName,
  setStateName,
  setShowCheckOut,
}: UserInfoCardProps) {
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleSaveUserInfo = () => {
    const isDeliveryValid = orderType === 'delivery' && Boolean(customerName && customerPhone && houseNumber && streetAddress && localGovernment && stateName);
    const isPickupValid = orderType === 'pickup' && Boolean(customerName && customerPhone && customerEmail);

    if (isDeliveryValid || isPickupValid) {
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
          <CloseLineIcon onClick={() => setOrderType(null)} />
        </div>
        <p className='mt-2 text-sm'>{orderType === 'delivery' && 'Your order will be delivered to your address when ready'}</p>
      </div>

      {orderType === 'pickup' && (
        <div className="flex flex-col justify-center w-full space-y-4 item-center">
          <input placeholder='Full name' className='w-full p-2 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <input placeholder='Email' className='w-full p-2 my-4 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          <div className="flex items-center overflow-hidden border border-gray-200 rounded-xl">
            <span className='p-2 font-semibold bg-gray-100'>+234</span>
            <input placeholder='Phone Number' className='w-full p-2 rounded-xl active:outline-none focus:outline-none' value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} type='number' />
          </div>
        </div>
      )}

      {orderType === 'delivery' && (
        <div className="flex flex-col justify-center w-full space-y-4 item-center">
          <input placeholder='Full name' className='w-full p-2 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <div className="flex items-center overflow-hidden border border-gray-200 rounded-xl">
            <span className='p-2 font-semibold bg-gray-100'>+234</span>
            <input placeholder='Phone Number' className='w-full p-2 rounded-xl active:outline-none focus:outline-none' value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} type='number' />
          </div>
          <input placeholder='House address number' className='w-full p-2 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
          <input placeholder='Street address' className='w-full p-2 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
          <input placeholder='Landmark' className='w-full p-2 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={landmark} onChange={(e) => setLandmark(e.target.value)} />
          <input placeholder='Local government' className='w-full p-2 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={localGovernment} onChange={(e) => setLocalGovernment(e.target.value)} />
          <input placeholder='State' className='w-full p-2 border border-gray-200 active:outline-none focus:outline-none rounded-xl' value={stateName} onChange={(e) => setStateName(e.target.value)} />
        </div>
      )}

      <p className='text-xs text-red-500 '>{errorState}</p>
      <button className='px-4 py-2 mx-auto my-4 text-white bg-black rounded-lg w-full' onClick={handleSaveUserInfo}>Done</button>
    </div>
  );
}
