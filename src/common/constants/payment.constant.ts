export const MAKE_PAYMENT = 'Payment successfully processed.';

export enum CurrencyEnum {
  NGN = 'NGN',
  USD = 'USD',
  BTC = 'BTC',
}

export enum PAYMENT_PERCENTAGE_ENUM {
  ONE_POINT_FIVE_PERCENT = 1.5,
}

export enum TypeEnum {
  STATIC = 'static',
  EXPRESS = 'express',
}

/** Transaction */
export enum TransactionTypeEnum {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export enum TransactionCategoryEnum {
  REF_BONUS = 'refBonus',
  TNX = 'tnx',
}

export const SUM_TRANSACTION = 'Referral bonus fetch successfully.';
export const FETCH_USER_TRANSACTION = 'Transactions fetch successfully.';
