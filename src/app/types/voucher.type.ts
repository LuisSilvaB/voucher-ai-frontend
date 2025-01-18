export type VoucherType = { 
  id: string;
  created_at: string;
  date: string;
  total: number;
  vendor: string;
  tax_amount: number;
  client: string;
  img_url: string;
  items: ItemType[];
};

export type ItemType = {
  code: string;
  name: string;
  quantity: number;
  unit_price: number; 
  total: number;
}