import { Main } from './main';

export const sellGiftcardTemplate = ({
  name,
  type,
  currency,
  unitAmount,
  quantity,
  rate,
  status,
  payableNairaAmount,
  date,
}) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
  Your giftcard trade is in ${status}.
</p>
<p style="font-size: 18px;  color: #98AD17;"><b>Giftcard details</b></p>
<p>Status: ${status}</p>
<p>Type: ${type}</p>
<p>Currency: ${currency}</p>
<p>Unit Amount: ${unitAmount}</p>
<p>Quantity: ${quantity}</p>
<p>Rate: ₦${rate}</p>
<p>Payable Amount: ₦${payableNairaAmount}</p>
<p>Date: ${date}</p>
`);
