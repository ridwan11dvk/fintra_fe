export const PROFIT_CENTER_BASE = "profit-center";
export const PROFIT_CENTER_LIST_PAGE_TITLE = "Profit Center";
export const PROFIT_CENTER_URL = `/master-data/${PROFIT_CENTER_BASE}`;
export const PROFIT_CENTER_CREATE_URL = `${PROFIT_CENTER_URL}/create`;
export const PROFIT_CENTER_LIST_PERMISSION = "profit-center:list";
export const PROFIT_CENTER_CREATE_PERMISSION = "profit-center:create";
export const PROFIT_CENTER_EDIT_PERMISSION = "profit-center:edit";
export const PROFIT_CENTER_DETAIL_PERMISSION = "profit-center:detail";

export const profitCenterDetailUrl = (id: string) => `${PROFIT_CENTER_URL}/${encodeURIComponent(id)}`;
export const profitCenterEditUrl = (id: string) => `${profitCenterDetailUrl(id)}/edit`;
