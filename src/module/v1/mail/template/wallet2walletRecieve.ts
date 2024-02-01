import { Main } from './main';

export const wallet2walletRecieveTemplate = ({
  name,
  amount,
  from,
  reference,
  balance,
  date,
}) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
  You recieved ₦${amount} was from ${from}.
</p>
<p style="font-size: 18px;  color: #98AD17;"><b>Payment details</b></p>
<p>Reference: ${reference}</p>
<p>Figur Account Balance: ${balance}</p>
<p>Transaction Time: ${date}</p>`);
