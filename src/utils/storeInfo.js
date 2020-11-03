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
        case 999:
            return 'Super Admin';
        default:
            return '';
    }
};

export const allStores = ['Matrivandar Store','Radhuni Store','Square Store','Bashundhara Store'];