import api from './api';
import type { ServiceCatalogResponse } from '../types';

export async function fetchServiceCatalog(): Promise<ServiceCatalogResponse> {
  const res = await api.get<ServiceCatalogResponse>('/catalog/services');
  return res.data;
}
