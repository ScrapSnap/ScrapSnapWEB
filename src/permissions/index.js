import { useStore } from "@/store";

export const permissions = {
    /* Users */
    ReadUsers: 100,
    WriteUsers: 101,
    DeleteUsers: 102,

    /* Schedules */
    WriteSchedules: 201,
    DeleteSchedules: 202,

    /* Collection Points */
    WriteCollectionPoints: 301,
    DeleteCollectionPoints: 302,

    /* User Statistics */
    ReadUserStatistics: 401,
    WriteUserStatistics: 402,
    DeleteUserStatistics: 403,
}

export function hasPermission(permission) {
    const store = useStore();
    if (!store.getUserPermissions()) {
        return false;
    }

    return store.getUserPermissions().includes(permission);
}

export function checkPermissions(requiredPermissions) {
    if (!requiredPermissions) {
        return true;
    }

    if (typeof requiredPermissions === 'number') {
        return hasPermission(requiredPermissions);
    }

    if (Array.isArray(requiredPermissions)) {
        for (const permission of requiredPermissions) {
            if (!hasPermission(permission)) {
                return false;
            }
        }

        return true;
    }

    return false;
}

export function getPermissionLabel(permission) {
    switch (permission) {
        case permissions.ReadUsers:
            return 'Read Users';
        case permissions.WriteUsers:
            return 'Write Users';
        case permissions.DeleteUsers:
            return 'Delete Users';
        case permissions.WriteSchedules:
            return 'Write Schedules';
        case permissions.DeleteSchedules:
            return 'Delete Schedules';
        case permissions.WriteCollectionPoints:
            return 'Write Collection Points';
        case permissions.DeleteCollectionPoints:
            return 'Delete Collection Points';
        case permissions.ReadUserStatistics:
            return 'Read User Statistics';
        case permissions.WriteUserStatistics:
            return 'Write User Statistics';
        case permissions.DeleteUserStatistics:
            return 'Delete User Statistics';
    }
}

export function getPermissionLabels(permissions) {
    const permissionLabels = [];

    permissions.forEach(permission => {
        permissionLabels.push(getPermissionLabel(permission));
    });

    return permissionLabels;
}
