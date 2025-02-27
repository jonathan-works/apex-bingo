import { api } from 'boot/axios';

export default function useApi(url: string) {
  const list = async () => {
    const { data } = await api.get(url, {});
    return data;
  };
  const post = async (param: any, header: any = null) => {
    const { data } = await api.post(url, param, header);
    return data;
  };
  const update = async (param: any, id: number) => {
    const { data } = await api.put(`${url}/${id}`, param);
    return data;
  };
  const remove = async (codigo: number) => {
    const { data } = await api.delete(`${url}/${codigo}`);
    return data;
  };

  const patch = async (param: any) => {
    const { data } = await api.patch(`${url}`, param);
    return data;
  };

  return {
    list,
    post,
    update,
    remove,
    patch,
  };
}
