import { Main } from './main';

export const transferTransfer = ({
  name,
  amount,
  sourceAccountName,
  sourceAccountNumber,
  sourceBankName,
  balance,
  date,
}) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
A wallet top up of ₦${amount} was successful.
</p>
<p style="font-size: 18px;  color: #98AD17;"><b>Payment details</b></p>
<p>Source Name: ${sourceAccountName}</p>
<p>Source Account: ${sourceAccountNumber}</p>
<p>Source Bank: ${sourceBankName}</p>
<p>Amount: ₦${amount}</p>
<p>Figur Account Balance: ₦${balance}</p>
<p>Transaction Time: ${date}</p>`);
