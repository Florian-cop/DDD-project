import { Request, Response } from 'express';
import { GetAdminService } from '../../../../application/admin/GetAdminService';
import { GetAdminQuery } from '../../../../application/admin/GetAdminQuery';

export class GetAdminController {
  constructor(private readonly getAdminService: GetAdminService) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { adminId } = req.params;

      if (!adminId) {
        res.status(400).json({ error: 'Admin ID is required' });
        return;
      }

      const query = new GetAdminQuery(adminId);
      const admin = await this.getAdminService.execute(query);

      if (!admin) {
        res.status(404).json({ error: 'Admin not found' });
        return;
      }

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

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
