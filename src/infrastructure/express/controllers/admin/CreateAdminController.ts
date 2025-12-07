import { Request, Response } from 'express';
import { CreateAdminService } from '../../../../application/admin/CreateAdminService';
import { CreateAdminCommand } from '../../../../application/admin/CreateAdminCommand';

export class CreateAdminController {
  constructor(private readonly createAdminService: CreateAdminService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { email, firstname, lastname, phoneNumber, role } = req.body;

      const command = new CreateAdminCommand(
        email,
        firstname,
        lastname,
        phoneNumber,
        role
      );

      const admin = await this.createAdminService.execute(command);

      const response = {
        id: admin.id,
        email: admin.email.value,
        firstname: admin.name.firstname,
        lastname: admin.name.lastname,
        fullname: admin.name.fullname,
        phoneNumber: admin.phoneNumber.value,
        role: admin.role.value,
        isActive: admin.isActive,
        hiredDate: admin.hiredDate
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
