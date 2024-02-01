import { Main } from './main';

export const airtimeTemplate = ({
  name,
  amount,
  serviceID,
  phone,
  reference,
  cashback,
  total,
}) =>
  Main(`
<h4>Dear ${name}</h4>
<p>
    A payment of ₦${amount} was successful.
</p>
<p style="font-size: 18px;  color: #2260FF;"><b>Payment details</b></p>
<p>Type: Airtime top up</p>
<p>Network: ${serviceID}</p>
<p>Amount: ₦${amount}</p>
<p>Mobile: ${phone}</p>
<p>Reference: ${reference}</p>
<p>Cashback: ${cashback}</p>
<p>Total: ${total}</p>`);
