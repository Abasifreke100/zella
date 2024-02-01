import { Main } from './main';

export const invoiceTemplate = ({ name }) =>
  Main(`
<p style="margin-top: 40px">Dear ${name}</p>
<p>
   Please find attached the invoice from Figur.
</p>
<p>
   Thanks.
</p>
`);
