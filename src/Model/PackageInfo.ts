export class MyApplicationInfo {
  public appComponentFactory: string;
  public backupAgentName: string;
  public category: number;
  public className: string;
  public compatibleWidthLimitDp: number;
  public compileSdkVersion: number;
  public compileSdkVersionCodename: string;
  public dataDir: string;
  public descriptionRes: number;
  public deviceProtectedDataDir: string;
  public enabled: boolean;
  public flags: number;
  public largestWidthLimitDp: number;
  public manageSpaceActivityName: string;
  public minSdkVersion: number;
  public nativeLibraryDir: string;
  public permission: string;
  public processName: string;
  public publicSourceDir: string;
  public requiresSmallestWidthDp: number;
  public sharedLibraryFiles: string[];
  public sourceDir: string;
  public splitNames: string[];
  public splitPublicSourceDirs: string[];
  public splitSourceDirs: string[];
  public storageUuid: string;
  public targetSdkVersion: number;
  public taskAffinity: string;
  public theme: number;
  public uiOptions: number;
  public uid: number;
}

export class MyActivityInfo {
  public banner: number;
  public icon: number;
  public labelRes: number;
  public logo: number;
  public metaData: string;
  public name: string;
  public nonLocalizedLabel: string;
  public packageName: string;

  public applicationInfo: string;
  public attributionTags: string;
  public descriptionRes: number[];
  public directBootAware: boolean;
  public enabled: boolean;
  public exported: boolean;
  public processName: string;
  public splitName: string;

  public colorMode: number;
  public configChanges: number;
  public documentLaunchMode: number;
  public flags: number;
  public launchMode: number;
  public maxRecents: number;
  public parentActivityName: string;
  public permission: string;
  public persistableMode: number;
  public requiredDisplayCategory: string;
  public screenOrientation: number;
  public softInputMode: number;
  public targetActivity: string;
  public taskAffinity: string;
  public theme: number;
  public uiOptions: number;
  public windowLayout: string;
}

export class MyProviderInfo {
  public banner: number;
  public icon: number;
  public labelRes: number;
  public logo: number;
  public metaData: string;
  public name: string;
  public nonLocalizedLabel: string;
  public packageName: string;

  public applicationInfo: string;
  public attributionTags: string[];
  public descriptionRes: number;
  public directBootAware: boolean;
  public enabled: boolean;
  public exported: boolean;
  public processName: string;
  public splitName: string;

  public authority: string;
  public flags: number;
  public forceUriPermissions: boolean;
  public grantUriPermissions: boolean;
  public initOrder: number;
  public isSyncable: boolean;
  public multiprocess: boolean;
  public pathPermissions: string;
  public readPermission: string;
  public uriPermissionPatterns: string;
  public writePermission: string;
}

export class MyServiceInfo {
  public banner: number;
  public icon: number;
  public labelRes: number;
  public logo: number;
  public metaData: string;
  public name: string;
  public nonLocalizedLabel: string;
  public packageName: string;

  public applicationInfo: string;
  public attributionTags: string[];
  public descriptionRes: number;
  public directBootAware: boolean;
  public enabled: boolean;
  public exported: boolean;
  public processName: string;
  public splitName: string;

  public flags: number;
  public permission: string;
}

export class MyPermissionInfo {
  public banner: number;
  public icon: number;
  public labelRes: number;
  public logo: number;
  public metaData: string;
  public name: string;
  public nonLocalizedLabel: string;
  public packageName: string;

  public descriptionRes: number;
  public flags: number;
  public group: string;
  public nonLocalizedDescription: string;
  public protectionLevel: number;
}

export class MyFeatureInfo {
  public flags: number;
  public name: string;
  public reqGlEsVersion: number;
  public version: number;
}

export class SubPackageInfo {
  public attributions: string;
  public baseRevisionCode: number;
  public configPreferences: string;
  public featureGroups: string;
  public firstInstallTime: number;
  public gids: number[];
  public installLocation: number;
  public instrumentation: string;
  public isApex: boolean;
  public lastUpdateTime: number;
  public packageName: string;
  public requestedPermissionsFlags: number[];
  public services: string;
  public sharedUserId: string;
  public sharedUserLabel: number;
  public splitNames: string[];
  public splitRevisionCodes: number[];
  public versionCode: number;
  public versionName: string;
  public label: string;
  public icon: string;
}
export class PackageInfo {
  public applicationInfo: MyApplicationInfo;
  public activities: Array<MyActivityInfo>;
  public receivers: Array<MyActivityInfo>;
  public services: Array<MyServiceInfo>;
  public permissions: Array<MyPermissionInfo>;
  public requestedPermissions: string[];
  public reqFeatures: Array<MyFeatureInfo>;
  public providers: Array<MyProviderInfo>;
  public packageInfo: SubPackageInfo;
  public singnatures: string;
}
