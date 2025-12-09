export interface CreateOrderDto {
  goods: Array<{
    nomenclature_id: number;
    warehouse_id?: number;
    quantity: number;
    is_from_cart: boolean;
  }>;
  delivery: {
    address: string;
    delivery_date?: number;
    delivery_price?: number;
    recipient: {
      name: string;
      surname: string;
      phone: string;
    };
    note?: string;
  };
  contragent_phone: string;
  client_lat?: number;
  client_lon?: number;
  additional_data?: Array<Record<string, any>>;
}

export interface CreateOrderParams extends CreateOrderDto {
  entity_type?: "docs_sales" | "view_events" | "favorites";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_name?: string;
  utm_phone?: string;
  utm_email?: string;
  utm_leadid?: string;
  utm_yclientid?: string;
  utm_gaclientid?: string;
}

export interface CreateOrderResponse {
  message: string;
  processing_time_ms: number;
}