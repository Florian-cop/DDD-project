import { Customer } from '../Customer';
import { Email } from '../../value-objects/Email';
import { PersonName } from '../../value-objects/PersonName';
import { PhoneNumber } from '../../value-objects/PhoneNumber';

describe('Customer Entity', () => {
  describe('create', () => {
    it('should create a valid customer', () => {
      const customer = Customer.create(
        'john.doe@example.com',
        'John',
        'Doe',
        '0612345678'
      );

      expect(customer.email.value).toBe('john.doe@example.com');
      expect(customer.firstname).toBe('John');
      expect(customer.lastname).toBe('Doe');
      expect(customer.fullname).toBe('John Doe');
      expect(customer.phoneNumber.value).toBe('0612345678');
      expect(customer.id).toBeDefined();
    });

    it('should create customer with specific ID', () => {
      const customId = 'custom-id-123';
      const customer = Customer.create(
        'john.doe@example.com',
        'John',
        'Doe',
        '0612345678',
        customId
      );

      expect(customer.id).toBe(customId);
    });

    it('should generate unique ID when not provided', () => {
      const customer1 = Customer.create('user1@example.com', 'User', 'One', '0612345678');
      const customer2 = Customer.create('user2@example.com', 'User', 'Two', '0698765432');

      expect(customer1.id).toBeDefined();
      expect(customer2.id).toBeDefined();
      expect(customer1.id).not.toBe(customer2.id);
    });

    it('should throw error for invalid email', () => {
      expect(() => Customer.create('invalid-email', 'John', 'Doe', '0612345678'))
        .toThrow('Email "invalid-email" is not valid');
    });

    it('should throw error for invalid name', () => {
      expect(() => Customer.create('john@example.com', '', 'Doe', '0612345678'))
        .toThrow('Firstname cannot be empty');
    });

    it('should throw error for invalid phone number', () => {
      expect(() => Customer.create('john@example.com', 'John', 'Doe', 'invalid'))
        .toThrow('Phone number "invalid" is not valid');
    });
  });

  describe('fromValueObjects', () => {
    it('should create customer from value objects', () => {
      const email = Email.create('john@example.com');
      const name = PersonName.create('John', 'Doe');
      const phone = PhoneNumber.create('0612345678');

      const customer = Customer.fromValueObjects({
        email,
        name,
        phoneNumber: phone
      });

      expect(customer.email).toBe(email);
      expect(customer.name).toBe(name);
      expect(customer.phoneNumber).toBe(phone);
    });
  });

  describe('email operations', () => {
    it('should change email', () => {
      const customer = Customer.create('old@example.com', 'John', 'Doe', '0612345678');
      const newEmail = Email.create('new@example.com');

      customer.changeEmail(newEmail);

      expect(customer.email).toBe(newEmail);
      expect(customer.email.value).toBe('new@example.com');
    });
  });

  describe('name operations', () => {
    it('should change name', () => {
      const customer = Customer.create('john@example.com', 'John', 'Doe', '0612345678');
      const newName = PersonName.create('Jane', 'Smith');

      customer.changeName(newName);

      expect(customer.name).toBe(newName);
      expect(customer.firstname).toBe('Jane');
      expect(customer.lastname).toBe('Smith');
      expect(customer.fullname).toBe('Jane Smith');
    });

    it('should return correct fullname', () => {
      const customer = Customer.create('john@example.com', 'John', 'Doe', '0612345678');
      expect(customer.fullname).toBe('John Doe');
    });
  });

  describe('phone number operations', () => {
    it('should change phone number', () => {
      const customer = Customer.create('john@example.com', 'John', 'Doe', '0612345678');
      const newPhone = PhoneNumber.create('0698765432');

      customer.changePhoneNumber(newPhone);

      expect(customer.phoneNumber).toBe(newPhone);
      expect(customer.phoneNumber.value).toBe('0698765432');
    });
  });

  describe('updateContactInfo', () => {
    it('should update email only', () => {
      const customer = Customer.create('old@example.com', 'John', 'Doe', '0612345678');
      const newEmail = Email.create('new@example.com');

      customer.updateContactInfo(newEmail);

      expect(customer.email.value).toBe('new@example.com');
      expect(customer.firstname).toBe('John');
      expect(customer.phoneNumber.value).toBe('0612345678');
    });

    it('should update name only', () => {
      const customer = Customer.create('john@example.com', 'John', 'Doe', '0612345678');
      const newName = PersonName.create('Jane', 'Smith');

      customer.updateContactInfo(undefined, newName);

      expect(customer.email.value).toBe('john@example.com');
      expect(customer.firstname).toBe('Jane');
      expect(customer.lastname).toBe('Smith');
    });

    it('should update phone number only', () => {
      const customer = Customer.create('john@example.com', 'John', 'Doe', '0612345678');
      const newPhone = PhoneNumber.create('0698765432');

      customer.updateContactInfo(undefined, undefined, newPhone);

      expect(customer.email.value).toBe('john@example.com');
      expect(customer.firstname).toBe('John');
      expect(customer.phoneNumber.value).toBe('0698765432');
    });

    it('should update all contact info at once', () => {
      const customer = Customer.create('old@example.com', 'John', 'Doe', '0612345678');
      const newEmail = Email.create('new@example.com');
      const newName = PersonName.create('Jane', 'Smith');
      const newPhone = PhoneNumber.create('0698765432');

      customer.updateContactInfo(newEmail, newName, newPhone);

      expect(customer.email.value).toBe('new@example.com');
      expect(customer.firstname).toBe('Jane');
      expect(customer.lastname).toBe('Smith');
      expect(customer.phoneNumber.value).toBe('0698765432');
    });

    it('should not update when no parameters provided', () => {
      const customer = Customer.create('john@example.com', 'John', 'Doe', '0612345678');
      const originalEmail = customer.email.value;
      const originalName = customer.fullname;
      const originalPhone = customer.phoneNumber.value;

      customer.updateContactInfo();

      expect(customer.email.value).toBe(originalEmail);
      expect(customer.fullname).toBe(originalName);
      expect(customer.phoneNumber.value).toBe(originalPhone);
    });
  });

  describe('entity identity', () => {
    it('should consider customers with same ID as equal', () => {
      const id = 'customer-123';
      const customer1 = Customer.create('john@example.com', 'John', 'Doe', '0612345678', id);
      const customer2 = Customer.create('jane@example.com', 'Jane', 'Smith', '0698765432', id);

      expect(customer1.equals(customer2)).toBe(true);
    });

    it('should consider customers with different IDs as not equal', () => {
      const customer1 = Customer.create('john@example.com', 'John', 'Doe', '0612345678');
      const customer2 = Customer.create('john@example.com', 'John', 'Doe', '0612345678');

      expect(customer1.equals(customer2)).toBe(false);
    });
  });

  describe('business rules', () => {
    it('should maintain email uniqueness constraint concept', () => {
      // Note: Repository doit vérifier l'unicité de l'email en base
      const email = 'unique@example.com';
      const customer1 = Customer.create(email, 'John', 'Doe', '0612345678');
      const customer2 = Customer.create(email, 'Jane', 'Smith', '0698765432');

      // Les deux customers peuvent avoir le même email au niveau du domaine
      // mais le repository doit empêcher la persistance du doublon
      expect(customer1.email.value).toBe(customer2.email.value);
    });

    it('should normalize data through value objects', () => {
      const customer = Customer.create(
        'JOHN.DOE@EXAMPLE.COM',
        'john',
        'doe',
        '06 12 34 56 78'
      );

      expect(customer.email.value).toBe('john.doe@example.com'); // lowercase
      expect(customer.firstname).toBe('John'); // capitalized
      expect(customer.lastname).toBe('Doe'); // capitalized
      expect(customer.phoneNumber.value).toBe('0612345678'); // no spaces
    });
  });
});
