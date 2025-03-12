import useApi from 'src/composable/UseApi';
import { RoleResponse } from 'src/model/role.interface';

export const roleService = {
  async list(): Promise<RoleResponse[]> {
    return await useApi('/api/v1/roles').list();
  },
};
