export class Constants {
  public static GROCERY = 'policy';
  public static CONTEXT_PATH = '/policyservice';
  public static HEALTH_CHECK = 'healthcheck';
  public static GROCERY_TABLE = 'policyItems';
  public static ORDERS = 'orders';
  public static COLUMNS = 'itemName, price, itemId, availableInventory, discount, unit';
  public static COLUMN_ARR = ["itemName", "price", "itemId", "availableInventory", "discount", "unit"];
  public static ORDER_COLUMNS = ["userId", "itemId", "itemCount", "orderId"];
}