import React, { useState } from "react";
import "./PaymentPage.scss";
import paypal from "../../assets/paypal.png";
import momo from "../../assets/momo.png";
import axios from "axios";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountError, setDiscountError] = useState("");

  const handleApplyDiscount = async () => {
    setDiscountError("");
    setAppliedVoucher(null);
    try {
      const response = await axios.get("https://moca.mom:2030/api/Discount");
      console.log("API Response Data:", response.data);
      const discounts = response.data.$values;
      console.log("Discounts array:", discounts);
      const foundVoucher = discounts.find(
        (discount) => discount.code === discountCode && discount.isActive
      );

      if (foundVoucher) {
        setAppliedVoucher(foundVoucher);
      } else {
        setDiscountError("Invalid or inactive discount code.");
      }
    } catch (error) {
      console.error("Error fetching discounts:", error);
      setDiscountError("Failed to apply discount. Please try again later.");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Payment Information */}
        <div className="payment-info-card">
          <h2 className="section-title">Payment information</h2>
          <form className="payment-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" placeholder="Nguyen Van A" />
            </div>
            <div className="form-group">
              <label htmlFor="taxCode">
                Tax code <span className="info-icon">i</span>
              </label>
              <input type="text" id="taxCode" placeholder="4455669935949" />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">
                Phone Number <span className="info-icon">i</span>
              </label>
              <input type="text" id="phoneNumber" placeholder="4455669935949" />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                Email <span className="info-icon">i</span>
              </label>
              <input type="email" id="email" placeholder="abc@gmail.com" />
            </div>
          </form>
        </div>

        {/* Payment Method */}
        <div className="payment-method-card">
          <h2 className="section-title">Payment method</h2>
          <div className="payment-method-options">
            <label
              className={`method-option ${
                paymentMethod === "card" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Pay-pal
              <span className="card-icons">
                <img src={paypal} alt="Visa" />
              </span>
            </label>
            <label
              className={`method-option ${
                paymentMethod === "momo" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={paymentMethod === "momo"}
                onChange={() => setPaymentMethod("momo")}
              />
              Momo e-wallet
              <span className="momo-icon">
                <img src={momo} alt="Momo" />
              </span>
            </label>
          </div>
          <div className="payment-help">
            Having trouble paying? <a href="#">See this article</a>
          </div>
        </div>

        {/* Order Details */}
        <div className="order-details-card">
          <h2 className="section-title">Order details</h2>
          <div className="membership-package">
            <div className="package-info">
              <span className="package-title">Membership Package</span>
              <span className="package-price">499.000đ</span>
            </div>
            <div className="package-desc">1 month</div>
            <div className="package-date">17/06/2025 - 17/06/2025</div>
          </div>
          <div className="form-group discount-input-group">
            <label htmlFor="discountCode">Discount code</label>
            <div className="input-with-button">
              <input
                type="text"
                id="discountCode"
                placeholder="MOCAEXE2"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                type="button"
                className="apply-discount-btn"
                onClick={handleApplyDiscount}
              >
                Apply
              </button>
            </div>
            {discountError && (
              <p className="discount-error-message">{discountError}</p>
            )}
            {appliedVoucher && (
              <div className="applied-voucher-info">
                <p>
                  Voucher: {appliedVoucher.code} - {appliedVoucher.description}
                </p>
                <p>Value: {appliedVoucher.value}{appliedVoucher.discountType === 0 ? "%" : " VND"}</p>
              </div>
            )}
          </div>
          <div className="order-total-row">
            <span>Total</span>
            <span className="order-total">499.000 VND</span>
          </div>
          <button className="confirm-payment-btn">
            Confirmation and Payment
          </button>
          <div className="order-note">
            Your subscription will automatically renew each month with a
            payment. By clicking 'Confirm and Pay' you agree to the Terms and
            Conditions
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
