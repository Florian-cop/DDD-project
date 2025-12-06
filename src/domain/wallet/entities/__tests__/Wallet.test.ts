import { Wallet } from '../Wallet';
import { Money } from '../../value-objects/Money';
import { Currency } from '../../value-objects/Currency';

describe('Wallet Entity', () => {
  describe('create', () => {
    it('should create a wallet with zero balance', () => {
      const customerId = 'customer-123';
      const wallet = Wallet.create(customerId);

      expect(wallet.balanceInEuros).toBe(0);
      expect(wallet.balance).toBe(0);
      expect(wallet.idCustomer).toBe(customerId);
      expect(wallet.id).toBeDefined();
    });

    it('should create wallet with specific ID', () => {
      const customerId = 'customer-123';
      const walletId = 'wallet-456';
      const wallet = Wallet.create(customerId, walletId);

      expect(wallet.id).toBe(walletId);
      expect(wallet.idCustomer).toBe(customerId);
    });
  });

  describe('addFunds', () => {
    it('should add funds in EUR', () => {
      const wallet = Wallet.create('customer-123');
      const money = Money.create(100, Currency.EUR);

      wallet.addFunds(money);

      expect(wallet.balanceInEuros).toBe(100);
    });

    it('should add funds in USD and convert to EUR', () => {
      const wallet = Wallet.create('customer-123');
      const money = Money.create(100, Currency.USD); // 100 USD = 92 EUR

      wallet.addFunds(money);

      expect(wallet.balanceInEuros).toBe(92);
    });

    it('should add funds in GBP and convert to EUR', () => {
      const wallet = Wallet.create('customer-123');
      const money = Money.create(100, Currency.GBP); // 100 GBP = 117 EUR

      wallet.addFunds(money);

      expect(wallet.balanceInEuros).toBe(117);
    });

    it('should add funds in JPY and convert to EUR', () => {
      const wallet = Wallet.create('customer-123');
      const money = Money.create(1000, Currency.JPY); // 1000 JPY = 6.3 EUR

      wallet.addFunds(money);

      expect(wallet.balanceInEuros).toBe(6.3);
    });

    it('should add funds in CHF and convert to EUR', () => {
      const wallet = Wallet.create('customer-123');
      const money = Money.create(100, Currency.CHF); // 100 CHF = 106 EUR

      wallet.addFunds(money);

      expect(wallet.balanceInEuros).toBe(106);
    });

    it('should accumulate multiple additions', () => {
      const wallet = Wallet.create('customer-123');
      const money1 = Money.create(100, Currency.EUR);
      const money2 = Money.create(50, Currency.EUR);

      wallet.addFunds(money1);
      wallet.addFunds(money2);

      expect(wallet.balanceInEuros).toBe(150);
    });

    it('should accumulate additions in different currencies', () => {
      const wallet = Wallet.create('customer-123');
      const eurMoney = Money.create(100, Currency.EUR);
      const usdMoney = Money.create(100, Currency.USD); // 92 EUR

      wallet.addFunds(eurMoney);
      wallet.addFunds(usdMoney);

      expect(wallet.balanceInEuros).toBe(192);
    });

    it('should throw error when adding zero or negative amount', () => {
      const wallet = Wallet.create('customer-123');
      const money = Money.create(0, Currency.EUR);

      expect(() => wallet.addFunds(money)).toThrow('Amount to add must be positive');
    });
  });

  describe('deduct', () => {
    it('should deduct funds from wallet', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const money = Money.create(30, Currency.EUR);
      wallet.deduct(money);

      expect(wallet.balanceInEuros).toBe(70);
    });

    it('should deduct funds in different currency', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(200, Currency.EUR));

      const money = Money.create(100, Currency.USD); // 92 EUR
      wallet.deduct(money);

      expect(wallet.balanceInEuros).toBe(108);
    });

    it('should throw error when deducting more than balance', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(50, Currency.EUR));

      const money = Money.create(100, Currency.EUR);

      expect(() => wallet.deduct(money)).toThrow('Insufficient balance');
    });

    it('should throw error when deducting zero or negative amount', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const money = Money.create(0, Currency.EUR);

      expect(() => wallet.deduct(money)).toThrow('Amount to deduct must be positive');
    });

    it('should allow deducting exact balance', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      wallet.deduct(Money.create(100, Currency.EUR));

      expect(wallet.balanceInEuros).toBe(0);
    });
  });

  describe('hasSufficientFunds', () => {
    it('should return true when balance is sufficient', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const money = Money.create(50, Currency.EUR);

      expect(wallet.hasSufficientFunds(money)).toBe(true);
    });

    it('should return false when balance is insufficient', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(50, Currency.EUR));

      const money = Money.create(100, Currency.EUR);

      expect(wallet.hasSufficientFunds(money)).toBe(false);
    });

    it('should return true when balance equals required amount', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const money = Money.create(100, Currency.EUR);

      expect(wallet.hasSufficientFunds(money)).toBe(true);
    });

    it('should handle different currencies correctly', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(100, Currency.EUR));

      const moneyUSD = Money.create(100, Currency.USD); // 92 EUR

      expect(wallet.hasSufficientFunds(moneyUSD)).toBe(true);
    });

    it('should return false for zero balance', () => {
      const wallet = Wallet.create('customer-123');
      const money = Money.create(10, Currency.EUR);

      expect(wallet.hasSufficientFunds(money)).toBe(false);
    });
  });

  describe('getBalanceAsMoney', () => {
    it('should return balance as Money object in EUR', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(150, Currency.EUR));

      const balanceMoney = wallet.getBalanceAsMoney();

      expect(balanceMoney.amount).toBe(150);
      expect(balanceMoney.currency).toBe(Currency.EUR);
    });

    it('should return zero balance as Money', () => {
      const wallet = Wallet.create('customer-123');

      const balanceMoney = wallet.getBalanceAsMoney();

      expect(balanceMoney.amount).toBe(0);
      expect(balanceMoney.currency).toBe(Currency.EUR);
    });
  });

  describe('entity identity', () => {
    it('should consider wallets with same ID as equal', () => {
      const walletId = 'wallet-123';
      const wallet1 = Wallet.create('customer-1', walletId);
      const wallet2 = Wallet.create('customer-2', walletId);

      expect(wallet1.equals(wallet2)).toBe(true);
    });

    it('should consider wallets with different IDs as not equal', () => {
      const wallet1 = Wallet.create('customer-123');
      const wallet2 = Wallet.create('customer-123');

      expect(wallet1.equals(wallet2)).toBe(false);
    });
  });

  describe('business rules - hotel wallet system', () => {
    it('should support reservation deposit workflow', () => {
      const wallet = Wallet.create('customer-123');
      
      // Client alimente son portefeuille
      wallet.addFunds(Money.create(300, Currency.EUR));
      expect(wallet.balanceInEuros).toBe(300);

      // Réservation de 200 EUR, débit de la moitié (100 EUR)
      const reservationTotal = Money.create(200, Currency.EUR);
      const deposit = Money.create(100, Currency.EUR);
      
      expect(wallet.hasSufficientFunds(deposit)).toBe(true);
      wallet.deduct(deposit);
      expect(wallet.balanceInEuros).toBe(200);

      // Confirmation: paiement de l'autre moitié (100 EUR)
      expect(wallet.hasSufficientFunds(deposit)).toBe(true);
      wallet.deduct(deposit);
      expect(wallet.balanceInEuros).toBe(100);
    });

    it('should prevent reservation when insufficient funds', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(50, Currency.EUR));

      const depositAmount = Money.create(100, Currency.EUR);

      expect(wallet.hasSufficientFunds(depositAmount)).toBe(false);
      expect(() => wallet.deduct(depositAmount)).toThrow('Insufficient balance');
    });

    it('should support multi-currency deposits', () => {
      const wallet = Wallet.create('customer-123');

      // Client dépose différentes devises
      wallet.addFunds(Money.create(100, Currency.EUR));
      wallet.addFunds(Money.create(100, Currency.USD)); // 92 EUR
      wallet.addFunds(Money.create(100, Currency.GBP)); // 117 EUR

      // Total: 100 + 92 + 117 = 309 EUR
      expect(wallet.balanceInEuros).toBe(309);
    });

    it('should handle cancellation without refund', () => {
      const wallet = Wallet.create('customer-123');
      wallet.addFunds(Money.create(200, Currency.EUR));

      // Débit de la moitié pour réservation
      wallet.deduct(Money.create(100, Currency.EUR));
      expect(wallet.balanceInEuros).toBe(100);

      // Annulation: pas de remboursement selon les règles métier
      // Le solde reste à 100 EUR
      expect(wallet.balanceInEuros).toBe(100);
    });
  });
});
