export enum UPDATE_STATUS {
    ERROR = -1,
    START = 0,
    HAS_NEW_VERSION = 1,
    HAS_NOT_NEW_VERSION = 2,
    DOWNLOAD_PROGRESS = 3,
    DOWNLOAD_SUCCESS = 4,
}

export enum UPDATE_SIGNAL {
    CHECK_UPDATE = 'CHECK_UPDATE',
    CONFIRM_UPDATE = 'CONFIRM_UPDATE',
    UPDATE_MSG = 'UPDATE_MSG',
}

export enum HOT_UPDATE_STATUS {
    START_DOWNLOAD = 5,
    DOWNLOAD_PROGRESS = 6,
    DOWNLOAD_SUCCESS = 7,
    START_VERIFY_FILES = 8,
    VERIFY_FILE_ERROR = 9,
    START_MOVE_FILE = 10,
    SUCCESS = 11,

    HAS_NEW_VERSION = 12,
    HAS_NOT_NEW_VERSION = 13,
}

export enum HOT_UPDATE_SIGNAL {
    CHECK_HOT_UPDATE = 'CHECK_HOT_UPDATE',
    CONFIRM_HOT_UPDATE = 'CONFIRM_HOT_UPDATE',
    HOT_UPDATE_MSG = 'HOT_UPDATE_MSG',
}