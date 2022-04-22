import moment from "moment";
import { StorageUserDBInterface } from "../interfaces/db-interfaces";
import { Configurations } from "../configs";

export const MockStorageUserId = "mock_user";
export const MockStorageUserId2 = "mock_user_2";
export const MockDeviceID = "mock_device_id_1";
export const MockDeviceID2 = "mock_device_id_2";
export const MockDeviceID3 = "mock_device_id_3";
export const MockDeviceName = "mock_device_name_1";
export const MockDeviceName2 = "mock_device_name_2";
export const MockAdminVersion = "1.6.0";

export const MockUser: StorageUserDBInterface = {
  user_name: "test",
  user_id: MockStorageUserId,
  coinbase: "a",
};

export const MockUser2: StorageUserDBInterface = {
  user_name: "test_2",
  user_id: MockStorageUserId2,
  coinbase: "b",
};

export const MockStorageItem = {
  column: 0,
  created_time: new Date(),
  description: "",
  images: [],
  images_objects: [],
  location_name: null,
  machine_type_name: null,
  name: "device-1",
  owner_id: MockStorageUserId,
  price: 0,
  qr_code: MockDeviceID,
  row: 0,
  uuid: "",
};

export const MockStorageItem2 = {
  column: 0,
  created_time: new Date(),
  description: "",
  images: [],
  images_objects: [],
  name: "device-2",
  owner_id: MockStorageUserId,
  price: 0,
  qr_code: MockDeviceID2,
  row: 0,
  uuid: "",
  networkSettings: {
    localIpAddress: "192.168.1.2",
    remoteIpAddress: "170.1.1.1",
  },
};

export const MockStorageItem3 = {
  column: 0,
  created_time: new Date(),
  description: "",
  images: [],
  images_objects: [],
  name: "device-3",
  owner_id: MockStorageUserId2,
  price: 0,
  qr_code: MockDeviceID3,
  row: 0,
  uuid: "",
  networkSettings: {
    localIpAddress: "192.168.1.0",
    remoteIpAddress: "170.1.1.2",
  },
};

/**
 * Online mock device
 */
export const MockDeviceStatus = {
  adminVersion: MockAdminVersion,
  data: undefined,
  docker: undefined,
  id: MockDeviceID,
  lastSeen: moment(),
  name: MockDeviceName,
  user: MockStorageUserId,
  networkSettings: {
    localIpAddress: "192.168.1.1",
    remoteIpAddress: "170.1.1.1",
  },
};

/**
 * Offline mock device
 */
export const MockDeviceStatus2 = {
  adminVersion: MockAdminVersion,
  data: undefined,
  docker: undefined,
  id: MockDeviceID2,
  lastSeen: moment().subtract(
    Configurations.maximumNotSeenDuration * 2,
    "seconds"
  ),
  name: MockDeviceName2,
  user: MockStorageUserId,
  networkSettings: {
    localIpAddress: "192.168.1.2",
    remoteIpAddress: "170.1.1.1",
  },
};

/**
 * Offline mock device
 */
export const MockDeviceStatus3 = {
  adminVersion: MockAdminVersion,
  data: undefined,
  docker: undefined,
  id: MockDeviceID3,
  lastSeen: moment().subtract(
    Configurations.maximumNotSeenDuration * 2,
    "seconds"
  ),
  name: MockDeviceName2,
  user: MockStorageUserId,
  networkSettings: {
    localIpAddress: "192.168.1.1",
    remoteIpAddress: "170.1.1.2",
  },
};

/**
 * Online mock device
 */
export const MockDeviceStatusWithDocker = {
  adminVersion: MockAdminVersion,
  data: undefined,
  docker: {
    containers: [
      {
        logs: "mock_log",
      },
    ],
  },
  id: MockDeviceID,
  lastSeen: moment(),
  name: MockDeviceName,
  user: MockStorageUserId,
};
