import { Main } from './main';

export const dataTemplate = ({
  name,
  amount,
  serviceID,
  variation_code,
  reference,
  cashback,
  total,
  phone,
}) =>
  Main(`
<h4>Dear ${name}</h4>
<p>
    A payment of ₦${amount} was successful.
</p>
<p style="font-size: 18px;  color: #2260FF;"><b>Payment details</b></p>
<p>Type: Data top up</p>
<p>Network: ${serviceID}</p>
<p>Variation: ${variation_code}</p>
<p>Amount: ₦${amount.toLocaleString('en-US')}</p>
<p>Mobile: ${phone}</p>
<p>Transaction ID: ${reference}</p>
<p>Cashback: ₦${cashback.toLocaleString('en-US')}</p>
<p>Total: ₦${total.toLocaleString('en-US')}</p>`);
