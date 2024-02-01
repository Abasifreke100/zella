import { Main } from './main';

export const tvTemplate = ({
  name,
  cashback,
  total,
  variation_code,
  serviceID,
  amount,
  reference,
}) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
  A payment of ₦${amount} was successful.
</p>
<p style="font-size: 18px;  color: #98AD17;"><b>Payment details</b></p>
<p>Type: ${variation_code}</p>
<p>Brand: ${serviceID}</p>
<p>Amount: ₦${amount}</p>
<p>Reference: ${reference}</p>
<p>Cashback: ${cashback}</p>
<p>Reference: ${total}</p>
`);
