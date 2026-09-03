// Vercel serverless function. Verifies a Paystack transaction server-side using
// the secret key, which must never be exposed to the client. Set PAYSTACK_SECRET_KEY
// in the Vercel project's environment variables.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ verified: false, error: 'Method not allowed' });
  }

  const { reference, expectedAmount } = req.body || {};

  if (!reference || typeof reference !== 'string') {
    return res.status(400).json({ verified: false, error: 'Missing transaction reference' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY is not set');
    return res.status(500).json({ verified: false, error: 'Payment verification is not configured' });
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    const result = await paystackRes.json();

    if (!paystackRes.ok || !result.status) {
      return res.status(400).json({ verified: false, error: result.message || 'Verification failed' });
    }

    const tx = result.data;
    const isSuccessful = tx.status === 'success';
    const isCorrectCurrency = tx.currency === 'NGN';
    const isCorrectAmount =
      typeof expectedAmount === 'number' ? tx.amount === Math.round(expectedAmount * 100) : true;

    if (!isSuccessful || !isCorrectCurrency || !isCorrectAmount) {
      return res.status(400).json({
        verified: false,
        error: !isSuccessful
          ? 'Payment was not successful'
          : !isCorrectCurrency
          ? 'Unexpected currency'
          : 'Amount does not match the cart total',
      });
    }

    return res.status(200).json({
      verified: true,
      reference: tx.reference,
      amount: tx.amount,
      paidAt: tx.paid_at,
      email: tx.customer?.email,
    });
  } catch (error) {
    console.error('Paystack verification error:', error);
    return res.status(502).json({ verified: false, error: 'Could not reach Paystack' });
  }
}
