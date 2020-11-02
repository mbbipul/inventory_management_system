export const getStoreInfo = (id) => {
    switch (id) {
        case 0:
            return 'Matrivandar Store';
        case 1:
            return 'Radhuni Store';
        case 2:
            return 'Square Store';
        case 3:
            return 'Bashundhara Store';
        default:
            return 'Super Admin';
    }
}