import { Main } from './main';

export const wallet2bankNipTemplate = ({ name, amount, balance, date }) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
NIP commission of ₦${amount} has been debited from your wallet.
</p>
<p style="font-size: 18px;  color: #98AD17;"><b>Payment details</b></p>
<p>Figur Account Balance: ₦${balance}</p>
<p>Transaction Time: ${date}</p>`);
