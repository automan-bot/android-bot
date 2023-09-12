//屏幕信息
export interface IScreenInfo {
  rotation: number;
  width: number;
  height: number;
}

//内存信息
export interface IMemoryInfo {
  //手机内存总量（单位bit）
  total: number | any;
  //手机内存剩余空间总量（单位bit）
  free: number | any;
  //手机内存总量（单位GB，MB）
  totalStr: string | any;
  //手机内存剩余总量（单位GB，MB）
  freeStr: string | any;
}

//内存信息
export interface IDiskInfo {
  //内存卡总存储(单位byte)
  sdcardTotal: number | any;
  //内存卡剩余存储(单位byte)
  sdcardFree: number | any;
  //手机内部空间总存储(单位byte)
  phoneTotal: number | any;
  //手机内部空间剩余存储(单位byte)
  phoneFree: number | any;
  //手机内部空间总存储,单位（GB,MB）
  phoneTotalStr: string | any;
  //手机内部空间剩余存储,单位（GB,MB）
  phoneFreeStr: string | any;
  //内存卡总存储,单位（GB,MB）
  sdcardTotalStr: string | any;
  //内存卡剩余存储,单位（GB,MB）
  sdcardFreeStr: string | any;
}

export interface IIdInfo {
  //设备id
  meid: string;
  //根据硬件信息生成的ID
  pseudoID: string;
  //设备的imei信息
  imei: string;
  //android设备id
  deviceId: string;
}

export interface IDeviceInfo {
  //autobot client版本
  clientVersion: string;
  //厂商
  brand: string;
  id: string;
  display: string;
  product: string;
  device: string;
  board: string;
  manufacturer: string;
  //型号
  model: string;
  socManufacturer: string;
  //cpu型号
  socModel: string;
  bootloader: string;
  hardware: string;
  //序列号
  serial: string;
  //sdk版本
  sdkInt: string;
  //android版本
  release: string;
  //显示信息
  displayInfo: IScreenInfo;
  //内存信息
  memoryInfo: IMemoryInfo;
  //磁盘信息
  diskInfo: IDiskInfo;
  //设备id信息
  devicesInfo: IIdInfo;
}

export interface IUIObject {
  index: number | any;
  class: string | any;
  clickable: boolean | any;
  visibleToUser: boolean | any;
  enabled: boolean | any;
  checked: boolean | any;
  resourceId: string | any;
  text: string | any;
  bound: string | any;
  children?: Array<IUIObject> | null;
}

export interface IContact {
  number: string;
  name: string;
  id: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface IGesture {
  delay?: number;
  duration: number;
  points: Array<Point>;
}
export interface INotificationMessage {
  notification_package: string;
  notification_title: string;
  notification_content: string;
  intent_action: string;
  intent_scheme: string;
  intent_data: string;
  intent_packageName: string;
  intent_shortClassName: string;
  intent_uri: string;
  notification_extras_source_bundle: any;
  notification_intent_source_bundle: any;
}
/* export interface NotificationChangeCallback {
  (message: INotificationMessage): void;
} */
export type NotificationChangeCallback = (
  message: INotificationMessage
) => void;

export type ClipTextChangeCallback = (text: string) => void;

export type ErrListener = (err: string) => void;

export interface ScreenOrentationChangeCallback {
  (width: number, height: number, rotation: number, isLandscape: boolean): void;
}

export interface ScreenChangeCallback {
  (screenImage: any): void;
}

export class ScreenRotation {
  public mRotation: number;

  constructor(rotation: number | string) {
    this.mRotation = Number(rotation);
  }

  isLandscape(): boolean {
    return this.mRotation == 1 || this.mRotation == 3;
  }
}

export class ScreenInfo implements IScreenInfo {
  width: number;
  height: number;
  rotation: number;
  mRotation: ScreenRotation;

  constructor(iScreenInfo: IScreenInfo) {
    this.width = iScreenInfo.width;
    this.height = iScreenInfo.height;
    this.rotation = iScreenInfo.rotation;
    this.mRotation = new ScreenRotation(this.rotation);
  }

  isLandscape(): boolean {
    return this.mRotation.isLandscape();
  }
}
export interface ITopActivityInfo {
  shortClassName: string;
  className: string;
  main: string;
  packageName: string;
}
export class TopActivityInfo implements ITopActivityInfo {
  shortClassName: string;
  className: string;
  main: string;
  packageName: string;
  startPath: string;

  constructor(iTopInfo: ITopActivityInfo) {
    this.shortClassName = iTopInfo.shortClassName;
    this.className = iTopInfo.className;
    this.main = iTopInfo.main;
    this.packageName = iTopInfo.packageName;
    this.startPath = `${iTopInfo.packageName}/${iTopInfo.shortClassName}`;
  }
}

export interface IFileItem {
  isFile: boolean;
  name: string;
  path: string;
  size: number;
  isRead: boolean;
  isWrite: boolean;
  isExecute: boolean;
  lastModified: number;
}
export class FileItem {
  isFile: boolean;
  name: string;
  path: string;
  size: number;
  isRead: boolean;
  isWrite: boolean;
  isExecute: boolean;
  lastModified: number;
  constructor(iFileItem: IFileItem) {
    this.isFile = iFileItem.isFile;
    this.name = iFileItem.name;
    this.path = iFileItem.path;
    this.size = iFileItem.size;
    this.isRead = iFileItem.isRead;
    this.isWrite = iFileItem.isWrite;
    this.isExecute = iFileItem.isExecute;
    this.lastModified = iFileItem.lastModified;
  }
  public static convertFileItem(iFileItems: Array<IFileItem>): Array<FileItem> {
    return iFileItems.map((item) => new FileItem(item));
  }
}

export interface ActiveInfo {
  uid: string;
  serverTime: number;
  exptime: number;
  disabled: boolean;
  validate: boolean;
}

export class ShortPackageInfo {
  public packageName: string;
  public label: string;
  public icon: string;
  public versionCode: number;
  public versionName: string;
  public minSdkVersion: string;
  public targetSdkVersion: number;
  public firstInstallTime: number;
  public lastUpdateTime: number;
}
