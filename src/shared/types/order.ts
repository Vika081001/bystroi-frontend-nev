export interface CreateOrderParams {
  entity_type: "docs_sales" | "view_events" | "favorites";
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_name: string;
  utm_phone: string;
  utm_email: string;
  utm_leadid: string;
  utm_yclientid: string;
  utm_gaclientid: string;
}
