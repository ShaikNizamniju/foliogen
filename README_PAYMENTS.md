# Foliogen Production Payment System Setup

Follow these exact steps to secure and deploy the new payment system. **Do not use test keys or test mode.**

## 1. Get LIVE keys from Razorpay Dashboard
1. Go to Razorpay Dashboard → Settings → API Keys.
2. Generate Live Mode Keys.
3. Copy your **Key ID** (`rzp_live_...`) and **Key Secret**.

## 2. Add to Client Environment Variables (.env)
Set the LIVE Key ID in your client `.env` file.
```env
VITE_RAZORPAY_LIVE_KEY_ID=rzp_live_XXXXXXXXXXXXXX
```
*Note: NEVER put the Live Secret Key on the client side.*

## 3. Add to Supabase server secrets
Use the Supabase CLI to securely store your Razorpay keys for the Edge Functions.
```bash
supabase secrets set RAZORPAY_LIVE_KEY_ID=rzp_live_XXXXXXXXXXXXXX
supabase secrets set RAZORPAY_LIVE_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXX
```

## 4. Deploy Edge Functions
Deploy both Edge functions required for secure execution:
```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-payment
```

## 5. Run Database Migration
Push the database schema (Tables & RLS) up to Supabase:
```bash
supabase db push
```

## 6. Configure Webhooks in Razorpay
In Razorpay Dashboard → Settings → Webhooks:
- Add webhook URL: `https://your-project.supabase.co/functions/v1/verify-payment`
- Select events: `payment.captured`, `payment.failed`
- Copy the webhook secret if you intend to add an additional verification layer later (the HMAC verification provides initial security).

## 7. Go Live
Test with a real ₹1 transaction before fully going live.
(Razorpay allows live test transactions like ₹1, which you can immediately refund from the dashboard directly.)
