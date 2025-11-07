Terme utiliser en Ubiquitous language
Un User est une personne qui est présent sur la plateforme sans être connecté
Un Customer est un User qui a créer un compte et qui peut faire des réservations
Un Admin est un Customer qui a des droits supplémentaires pour gérer la plateforme
Un Wallet est un porte-monnaie virtuel lié à un Customer
Une Room est une chambre d'hôtel
Une Reservation est une réservation faite par un Customer pour une ou plusieurs Room
Un Type de Room est une catégorie de chambre d'hôtel (standard room, deluxe room, suite)


Customer
    - firstName
    - lastName
    - email (UNIQUE)
    - phoneNumber
    - id
Wallet
    -  balance
    -  currency


Currencies : Euro Dollar Livre Sterling Yen Franc Suisse
conversion

Room : standard room | deluxe room | suite
    - roomNumber (UNIQUE)
    - type
    - pricePerNight
    - isAvailable
    - bed
    - duoBed
    - wifi
    - tv | flatScreenTv
    - minibar
    - airConditioning
    - bathtub
    - terrace

Reservation
    - id (UNIQUE)
    - idRoom[]
    - checkInDate
    - checkOutDate
    - totalPrice
    - reservationDate
    - numberOfNights
    - status (booked | confirmed | cancelled)

Admin
    - 
