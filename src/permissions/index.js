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

export function getPermissionLabels(permissions) {
    const permissionLabels = [];

    permissions.forEach(permission => {
        switch (permission) {
            case permissions.ReadUsers:
                permissionLabels.push('Read Users');
                break;
            case permissions.WriteUsers:
                permissionLabels.push('Write Users');
                break;
            case permissions.DeleteUsers:
                permissionLabels.push('Delete Users');
                break;
            case permissions.WriteSchedules:
                permissionLabels.push('Write Schedules');
                break;
            case permissions.DeleteSchedules:
                permissionLabels.push('Delete Schedules');
                break;
            case permissions.WriteCollectionPoints:
                permissionLabels.push('Write Collection Points');
                break;
            case permissions.DeleteCollectionPoints:
                permissionLabels.push('Delete Collection Points');
                break;
            case permissions.ReadUserStatistics:
                permissionLabels.push('Read User Statistics');
                break;
            case permissions.WriteUserStatistics:
                permissionLabels.push('Write User Statistics');
                break;
            case permissions.DeleteUserStatistics:
                permissionLabels.push('Delete User Statistics');
                break;
        }
    });

    return permissionLabels;
}
