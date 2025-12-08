import { Request, Response } from 'express';
import { GetAllAdminsService } from '../../../../application/admin/GetAllAdminsService';

export class GetAllAdminsController {
  constructor(private readonly getAllAdminsService: GetAllAdminsService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const admins = await this.getAllAdminsService.execute();

      const response = admins.map(admin => ({
        id: admin.id,
        email: admin.email.value,
        firstname: admin.name.firstname,
        lastname: admin.name.lastname,
        fullname: admin.name.fullname,
        phoneNumber: admin.phoneNumber.value,
        role: admin.role.value,
        isActive: admin.isActive,
        hiredDate: admin.hiredDate
      }));

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
