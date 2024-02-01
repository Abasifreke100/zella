import { Main } from './main';

export const businessApprovalTemplate = ({ name, businessName }) =>
  Main(`
<h4>Dear ${name}</h4>
<p>
  Your business ${businessName} has been approved.
</p>
<p>
  You can now have a dedicated business account, create invoice, track expense and more.
</p>
<p>FIGUR out your business.</p>`);
