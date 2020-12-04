const storeApis = ["store1","store2","store3"];
export const allStores = ['Matrivandar','Radhuni_Square','Bashundhara','Super_admin'];

export const getStoreInfo = (id) => {
    switch (id) {
        case 0:
            return allStores[0];
        case 1:
            return allStores[1];
        case 2:
            return allStores[2];
        case 999:
            return allStores[0];
        default:
            return '';
    }
};

export const getStoreInfoByName = (name) => {
    switch (name) {
        case storeApis[0]:
            return allStores[0];
        case storeApis[1]:
            return allStores[1];
        case storeApis[2]:
            return allStores[2];
        default:
            return storeApis[0];
    }
};

export const getStoreApiPath = (id) => {
    switch (id) {
        case 0:
            return storeApis[0];
        case 1:
            return storeApis[1];
        case 2:
            return storeApis[2];
        case 999:
            return storeApis[0];
        default:
            return '';
    }
}
