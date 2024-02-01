import { Main } from './main';

export const wallet2bankTemplate = ({
  name,
  amount,
  destinationAccountName,
  destinationAccountNumber,
  destinationBankName,
  balance,
  date,
}) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
Your transfer ₦${amount} was successful.
</p>
<p style="font-size: 18px;  color: #98AD17;"><b>Payment details</b></p>
<p>Destination Name: ${destinationAccountName}</p>
<p>Destination Account: ${destinationAccountNumber}</p>
<p>Destination Bank: ${destinationBankName}</p>
<p>Amount: ₦${amount}</p>
<p>Figur Account Balance: ₦${balance}</p>
<p>Transaction Time: ${date}</p>`);
