import axios from 'axios';

const MPESA_API_URL = process.env.MPESA_API_URL || 'https://sandbox.safaricom.co.ke';
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;

export async function initiateMpesaWithdrawal(
  phoneNumber: string,
  amount: number,
  accountReference: string
) {
  try {
    // Get access token
    const authResponse = await axios.get(
      `${MPESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        auth: {
          username: MPESA_CONSUMER_KEY!,
          password: MPESA_CONSUMER_SECRET!,
        },
      }
    );

    const accessToken = authResponse.data.access_token;

    // Format timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3);

    // Generate password
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    // Initiate B2C transaction
    const response = await axios.post(
      `${MPESA_API_URL}/mpesa/b2c/v1/paymentrequest`,
      {
        InitiatorName: 'testapi',
        SecurityCredential: password,
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: MPESA_SHORTCODE,
        PartyB: phoneNumber,
        Remarks: `Withdrawal for ${accountReference}`,
        QueueTimeOutURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/timeout`,
        ResultURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/result`,
        Occasion: 'Withdrawal',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('M-Pesa API Error:', error);
    throw new Error('Failed to initiate M-Pesa withdrawal');
  }
} 