# Système de Réservation Hôtelière

Système de gestion de réservations hôtelières construit avec une architecture Domain-Driven Design (DDD).

## Architecture

Le projet suit une architecture en couches stricte :

- **Domain Layer** : Entités, Value Objects, Repositories (interfaces)
- **Application Layer** : Services applicatifs, Commands, Queries
- **Infrastructure Layer** : Implémentations concrètes (Prisma, Express, CLI)

### Bounded Contexts

- Customer : Gestion des clients et de leurs informations
- Wallet : Gestion des portefeuilles virtuels et paiements
- Room : Gestion de l'inventaire des chambres
- Reservation : Gestion du cycle de vie des réservations
- Admin : Administration de la plateforme


## Ubiquitous Language

### Entités Principales

**Customer**
Client enregistré sur la plateforme pouvant effectuer des réservations.
- Propriétés : firstName, lastName, email (unique), phoneNumber
- Relations : 1 Wallet, N Reservations

**Wallet**
Porte-monnaie virtuel lié à un Customer pour gérer les paiements.
- Propriétés : balance, currency
- Devises supportées : EUR, USD, GBP, JPY, CHF
- Conversion automatique en EUR

**Room**
Chambre d'hôtel avec caractéristiques et disponibilité.
- Types : STANDARD, DELUXE, SUITE
- Propriétés : roomNumber (unique), type, pricePerNight, isAvailable
- Accessoires : bed, wifi, tv/flatScreenTv, minibar, airConditioning, bathtub, terrace

**Reservation**
Réservation effectuée par un Customer pour une ou plusieurs Room.
- Propriétés : checkInDate, checkOutDate, totalPrice, reservationDate
- Statuts : BOOKED, CONFIRMED, CANCELLED
- Relations : 1 Customer, N Rooms

**Admin**
Customer avec droits étendus pour administrer la plateforme.
