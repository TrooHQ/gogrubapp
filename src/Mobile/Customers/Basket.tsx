import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TopMenuNav from "./TopMenuNav";
import { Link, useNavigate } from "react-router-dom";

import {
  removeItemFromBasket,
  updateItemQuantity,
} from "../../slices/BasketSlice";
import { TiDelete } from "react-icons/ti";
import { HiMinusSm, HiPlusSm } from "react-icons/hi";

export const Basket = () => {
  const navigate = useNavigate();
  const basketDetails = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();

  const userDetails = useSelector(
    (state: RootState) => state.business.businessDetails
  );

  const colorScheme = userDetails?.colour_scheme;

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    dispatch(updateItemQuantity({ id, quantity: currentQuantity + 1 }));
  };

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateItemQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  return (
    <div className=" ">
      <TopMenuNav exploreMenuText="Basket" />

      <div className="mt-[68px]">
        {basketDetails?.items && (
          <div className="py-[20px] mx-[24px] grid gap-[10px]">
            <p className="">
              Hello{" "}
              <span className="font-bold">{basketDetails?.customerName}</span>
            </p>
            <p>
              Table Number:{" "}
              <span className="font-bold">
                {basketDetails?.customerTableNumber}
              </span>
            </p>
            <p>Below are the items you ordered:</p>
          </div>
        )}
        {basketDetails?.items.length > 0 ? (
          basketDetails.items.map((item, index) => (
            <>
              <div key={index}>
                <div className="mx-[14px]  border-b pb-[16px] border-[#E7E7E7] mt-[16px]">
                  <div className=" grid gap-[8px]">
                    <div className="  flex items-start justify-between gap-[20px] place-items-center">
                      <Link to={`/demo/menu-details/${item.id}/orderandpay`}>
                        <p className="text-[16px] text-[#121212] font-[500] max-w-[100px] w-full">
                          <span className="pr-2">{item.quantity}x</span>
                          {item?.name?.length > 12
                            ? `${item.name.slice(0, 8)}...`
                            : item.name}
                        </p>
                      </Link>
                      <div className="flex items-center justify-center w-full max-w-[100px] ">
                        <div
                          className="  cursor-pointer text-white   rounded-full"
                          onClick={() =>
                            handleDecreaseQuantity(item.id, item.quantity)
                          }
                          style={{
                            backgroundColor: colorScheme || "#414141",
                          }}
                        >
                          <HiMinusSm className=" text-[20px]" />
                        </div>

                        <p
                          className="text-[18px] font-[500] mx-[10px]"
                          style={{
                            color: colorScheme || "#121212",
                          }}
                        >
                          x{item?.quantity}
                        </p>
                        <div
                          className="  cursor-pointer text-white   rounded-full"
                          onClick={() =>
                            handleIncreaseQuantity(item.id, item.quantity)
                          }
                          style={{
                            backgroundColor: colorScheme || "#414141",
                          }}
                        >
                          <HiPlusSm className=" text-[20px]" />
                        </div>
                      </div>
                      {item.menuItem && (
                        <p className="text-[#121212]">
                          &#x20A6;
                          {(
                            item.menuItem.menu_item_price * item.quantity
                          ).toLocaleString()}
                        </p>
                      )}

                      <p
                        className=" text-[30px] text-[#ff0000]"
                        onClick={() =>
                          dispatch(removeItemFromBasket({ id: item.id }))
                        }
                      >
                        <TiDelete />
                      </p>
                    </div>
                    {item.selectedOptions &&
                      item.selectedOptions.length > 0 && (
                        <div className="ml-4">
                          {item.selectedOptions.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-start justify-between"
                            >
                              <p className="text-[14px] text-[#121212] font-[400]">
                                {option.name}
                              </p>

                              <p className="text-[14px] text-[#121212] font-[400]  text-start w-[100px]">
                                &#x20A6;
                                {(
                                  option.price * item.quantity
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </>
          ))
        ) : (
          <div className="py-[20px] mx-[24px] text-center text-[16px] text-[#121212] font-[500] grid place-items-center items-center">
            <p className=" text-7xl font-bold text-black">
              {/* <GiShoppingCart /> */}
            </p>
            <p>Your cart is empty.</p>
            <p
              className=" px-[16px] py-[9px]  text-white rounded-[8px] cursor-pointer"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: colorScheme || "#121212",
              }}
            >
              Start Ordering
            </p>
          </div>
        )}
        {basketDetails?.items.length > 0 && (
          <div className="py-[16px] mx-[24px]">
            <div className="flex items-center justify-between">
              <p className="text-[16px] text-[#121212] font-[500]">Total:</p>
              <p
                className="text-[16px]  font-[500] w-[100px]"
                style={{
                  color: colorScheme || "#121212",
                }}
              >
                &#x20A6;{basketDetails?.totalPrice.toLocaleString()}
              </p>
            </div>

            <div className="mt-[60px] flex items-center justify-center gap-[16px]">
              <p
                className="cursor-pointer font-[500] text-[16px] text-[#FF0000] py-[10px] px-[24px]"
                onClick={() => navigate(-1)}
              >
                Cancel
              </p>
              <Link to="/demo/tip/orderandpay">
                <p
                  className="inline font-[500] text-[16px] rounded-[5px]  text-white py-[10px] px-[24px]"
                  style={{
                    backgroundColor: colorScheme || "#121212",
                  }}
                >
                  Proceed to Pay
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
