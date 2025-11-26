export type Warehouse = {
  warehouse_id: number;
  organization_id: number;
  warehouse_name: string;
  warehouse_address?: string;
  latitude?: number;
  longitude?: number;
  distance_to_client?: number;
};
