import { z } from 'zod';

export const createCustomerSchema = z.object({
  email: z.string().email('Email invalide'),
  firstname: z.string().min(1, 'Le prénom est requis').max(100),
  lastname: z.string().min(1, 'Le nom est requis').max(100),
  phoneNumber: z.string().regex(/^\+?[0-9\s\-()]+$/, 'Numéro de téléphone invalide'),
});

export const updateCustomerSchema = z.object({
  email: z.string().email('Email invalide').optional(),
  firstname: z.string().min(1).max(100).optional(),
  lastname: z.string().min(1).max(100).optional(),
  phoneNumber: z.string().regex(/^\+?[0-9\s\-()]+$/).optional(),
});

export const updateWalletSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  currency: z.enum(['EUR', 'USD', 'GBP', 'JPY', 'CHF']),
});

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, 'Le numéro de chambre est requis'),
  type: z.enum(['STANDARD', 'DELUXE', 'SUITE']),
  isAvailable: z.boolean().default(true),
});

export const updateRoomSchema = z.object({
  roomNumber: z.string().min(1).optional(),
  type: z.enum(['STANDARD', 'DELUXE', 'SUITE']).optional(),
  isAvailable: z.boolean().optional(),
});

export const createReservationSchema = z.object({
  customerId: z.string().uuid('ID client invalide'),
  roomIds: z.array(z.string().uuid('ID chambre invalide')).min(1, 'Au moins une chambre requise'),
  checkInDate: z.string().datetime('Date de check-in invalide'),
  checkOutDate: z.string().datetime('Date de check-out invalide'),
  totalPrice: z.number().positive('Le prix total doit être positif'),
  currency: z.enum(['EUR', 'USD', 'GBP', 'JPY', 'CHF']).default('EUR'),
}).refine(
  (data) => new Date(data.checkOutDate) > new Date(data.checkInDate),
  { message: 'La date de check-out doit être après le check-in', path: ['checkOutDate'] }
).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return checkIn >= now;
  },
  { message: 'La date de check-in ne peut pas être dans le passé', path: ['checkInDate'] }
).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights <= 30;
  },
  { message: 'La durée maximale de réservation est de 30 nuits', path: ['checkOutDate'] }
);

export const updateReservationSchema = z.object({
  checkInDate: z.string().datetime().optional(),
  checkOutDate: z.string().datetime().optional(),
  status: z.enum(['BOOKED', 'CONFIRMED', 'CANCELLED']).optional(),
}).refine(
  (data) => {
    if (data.checkInDate && data.checkOutDate) {
      return new Date(data.checkOutDate) > new Date(data.checkInDate);
    }
    return true;
  },
  { message: 'La date de check-out doit être après le check-in', path: ['checkOutDate'] }
);

export const confirmReservationSchema = z.object({
  id: z.string().uuid('ID réservation invalide'),
});

export const cancelReservationSchema = z.object({
  id: z.string().uuid('ID réservation invalide'),
});

export const releaseRoomSchema = z.object({
  customerId: z.string().uuid('ID client invalide'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const roomFilterSchema = z.object({
  type: z.enum(['STANDARD', 'DELUXE', 'SUITE']).optional(),
  available: z.coerce.boolean().optional(),
});

export const reservationFilterSchema = z.object({
  customerId: z.string().uuid().optional(),
  status: z.enum(['BOOKED', 'CONFIRMED', 'CANCELLED']).optional(),
  checkInDate: z.string().datetime().optional(),
  checkOutDate: z.string().datetime().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type ConfirmReservationInput = z.infer<typeof confirmReservationSchema>;
export type CancelReservationInput = z.infer<typeof cancelReservationSchema>;
export type ReleaseRoomInput = z.infer<typeof releaseRoomSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type RoomFilterInput = z.infer<typeof roomFilterSchema>;
export type ReservationFilterInput = z.infer<typeof reservationFilterSchema>;
