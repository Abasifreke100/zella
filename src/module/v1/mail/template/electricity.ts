import { Main } from './main';

export const electircityTemplate = ({
  cashback,
  name,
  total,
  variation,
  token,
  amount,
  unit,
  reference,
}) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>Your ${variation} electricity purchase was successful</p>
<p style="margin-top: 10px; margin-bottom: 10px;">
<span
style="
    background: #f7fafa;
    padding: 15px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 16px;
    color: #98ad17;
    font-size: 20px;
    width: auto;
"
>
${token}
</span>
</p>
<p>Amount: ₦${amount}</p>
<p>Units: ${unit}</p>
<p>Reference: ${reference}</p>
<p>Cashback: ${cashback}</p>
<p>Total: ${total}</p>`);
