import { Main } from './main';

export const wallet2WalletTemplate = ({
  name,
  amount,
  to,
  reference,
  balance,
  date,
}) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
  You transferred ₦${amount} was to ${to}.
</p>
<p style="font-size: 18px;  color: #98AD17;"><b>Payment details</b></p>
<p>Reference: ${reference}</p>
<p>Figur Account Balance: ${balance}</p>
<p>Transaction Time: ${date}</p>`);
