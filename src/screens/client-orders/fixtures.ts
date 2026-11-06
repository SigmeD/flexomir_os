import { DEMO_ORDERS } from '@/demo/order-fixtures'

export const CLIENT_DEMO_COMPANY = 'Компания 01'
/** Fixed demo context only. The real server must enforce company access independently. */
export const CLIENT_ORDERS_DEMO = DEMO_ORDERS.filter(order => order.company === CLIENT_DEMO_COMPANY)
