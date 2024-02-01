import { Main } from './main';

export const otpTemplate = ({ otp }) =>
  Main(`
    <h4>Hi,</h4>
    <p>Your one time password is:</p>
    <p
        style="
        background-color: #edf2ff;
        border: 1px dashed #032b69;
        width: 70px;
        padding: 7px 15px;
        letter-spacing: 5px;
        font-size: 14px;
        font-weight: bold;
        margin: 9px 0;
        text-align: center;
        "
    >
    ${otp}
    </p>
`);

export const jobTemplate = ({ message }): string => {
  return `
    <h4>Hi</h4>
    <p>New Job Notification</p>
    <p
        style="
        background-color: #edf2ff;
        border: 1px dashed #032b69;
        width: 70px;
        padding: 7px 15px;
        letter-spacing: 5px;
        font-size: 14px;
        font-weight: bold;
        margin: 9px 0;
        text-align: center;
        "
    >
    ${message}
    </p>
  `;
};
