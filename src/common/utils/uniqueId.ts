import * as moment from 'moment';

export const { floor, random } = Math;

export const generateUpperCaseLetter = () => {
  return randomCharacterFromArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
};

function randomCharacterFromArray(array: any) {
  return array[floor(random() * array.length)];
}

export function randomFourDigitNumber() {
  let result = 0;
  for (let i = 0; i < 4; i++) {
    const digit = floor(random() * 10);
    result += digit;
  }
  return result;
}

const identifiers: any[] = [];

export const generateIdentifier: any = () => {
  const identifier = [
    ...moment().utcOffset('+01:00').format('YYYYMMDDHHmmss'),
    ...Array.from({ length: 8 }, generateUpperCaseLetter),
  ].join('');

  return (
    identifiers.includes(identifier)
      ? generateIdentifier()
      : identifiers.push(identifier),
    identifier
  );
};

export function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

export async function generateReference() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let reference = '';
  for (let i = 0; i < 32; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
}

export async function calculatePercentages(amount: number, percentage: number) {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100');
  }

  const calculatedValue = (percentage / 100) * amount;

  const formattedValue = calculatedValue.toFixed(1);

  return parseFloat(formattedValue);
}
