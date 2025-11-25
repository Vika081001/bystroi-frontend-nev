export type OrderGood = {
    nomenclature_id: number;
    warehouse_id?: number;
    quantity?: number;
    is_from_cart?: boolean;
}

export type Cart = {
    contragent_phone: string;
    goods: string;
    total_count: string;
}