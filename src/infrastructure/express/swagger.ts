import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'XYZ Hotel API',
      version: '1.0.0',
      description: 'API de gestion d\'hôtel avec DDD - Réservations, Clients, Chambres et Portefeuilles',
      contact: {
        name: 'XYZ Hotel',
        email: 'contact@xyzhotel.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
      {
        url: 'http://localhost:3000',
        description: 'Serveur de production',
      },
    ],
    tags: [
      {
        name: 'Customers',
        description: 'Gestion des clients',
      },
      {
        name: 'Wallets',
        description: 'Gestion des portefeuilles (multi-devises)',
      },
      {
        name: 'Rooms',
        description: 'Gestion des chambres d\'hôtel',
      },
      {
        name: 'Reservations',
        description: 'Gestion des réservations (workflow booking)',
      },
      {
        name: 'Admin',
        description: 'Statistiques et rapports administrateur',
      },
      {
        name: 'Health',
        description: 'Santé de l\'application',
      },
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          required: ['id', 'email', 'firstname', 'lastname', 'phoneNumber'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique du client',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email (unique)',
              example: 'alice.smith@example.com',
            },
            firstname: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Prénom du client',
              example: 'Alice',
            },
            lastname: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nom de famille du client',
              example: 'Smith',
            },
            phoneNumber: {
              type: 'string',
              description: 'Numéro de téléphone',
              example: '+33612345678',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de dernière modification',
            },
          },
        },
        Wallet: {
          type: 'object',
          required: ['id', 'customerId', 'balance'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique du portefeuille',
            },
            customerId: {
              type: 'string',
              format: 'uuid',
              description: 'ID du client propriétaire',
            },
            balance: {
              type: 'number',
              format: 'decimal',
              description: 'Solde en euros',
              example: 1000.50,
            },
          },
        },
        Room: {
          type: 'object',
          required: ['id', 'roomNumber', 'type', 'pricePerNight', 'isAvailable'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            roomNumber: {
              type: 'string',
              description: 'Numéro de la chambre',
              example: '101',
            },
            type: {
              type: 'string',
              enum: ['STANDARD', 'DELUXE', 'SUITE'],
              description: 'Type de chambre',
              example: 'STANDARD',
            },
            pricePerNight: {
              type: 'number',
              description: 'Prix par nuit en EUR',
              example: 50,
            },
            isAvailable: {
              type: 'boolean',
              description: 'Disponibilité de la chambre',
              example: true,
            },
            accessories: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Équipements de la chambre',
              example: ['WiFi', 'TV', 'Lit 1 place'],
            },
          },
        },
        Reservation: {
          type: 'object',
          required: ['id', 'customerId', 'roomIds', 'checkInDate', 'checkOutDate', 'totalPrice', 'status'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            customerId: {
              type: 'string',
              format: 'uuid',
            },
            roomIds: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uuid',
              },
              description: 'IDs des chambres réservées',
            },
            checkInDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date d\'arrivée',
            },
            checkOutDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date de départ',
            },
            totalPrice: {
              type: 'number',
              description: 'Prix total en EUR',
              example: 300,
            },
            status: {
              type: 'string',
              enum: ['BOOKED', 'CONFIRMED', 'CANCELLED'],
              description: 'Statut de la réservation',
              example: 'BOOKED',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Message d\'erreur',
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/infrastructure/express/router/*.ts'], 
};

export const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Application): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'XYZ Hotel API Documentation',
  }));
}
