import { DeviceDBInterface } from "./device_interfaces";

export interface StorageUserDBInterface {
  /**
   * User name
   */
  // eslint-disable-next-line camelcase
  user_name: string;
  /**
   * User id
   */
  // eslint-disable-next-line camelcase
  user_id: string;
  /**
   * User's group id
   */
  group_id?: string;
  /**
   * User's coinbase
   */
  coinbase?: string;
}

/**
 * @deprecated this interface will be removed in the future
 */
export interface OwnerDBInterface {
  // eslint-disable-next-line camelcase
  user_id: string;
  // eslint-disable-next-line camelcase
  user_name: string;
  coinbase: string;
}

export interface StorageItemDBInterface {
  name: string;
  description: string;
  price: number;
  column: number;
  row: number;
  // eslint-disable-next-line camelcase
  qr_code: string;
  // eslint-disable-next-line camelcase
  created_time: Date;
  // eslint-disable-next-line camelcase
  owner_name?: OwnerDBInterface;
  // eslint-disable-next-line camelcase
  machine_type_name: null;
  // eslint-disable-next-line camelcase
  location_name: null;
  // eslint-disable-next-line camelcase
  position_name: null;
  // eslint-disable-next-line camelcase
  owner_id: string;
  images: any[];
  uuid: string;
  // eslint-disable-next-line camelcase
  images_objects: any[];
}

export interface StorageItemWithStatusDBInterface
  extends StorageItemDBInterface {
  /**
   * Realtime status of the device
   */
  status?: DeviceDBInterface;
}
