export default {
    loadPrefab: (prefabURL) => {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(prefabURL, (err, prefab) => {
                if (err)
                    reject('err', err);

                resolve(prefab);
            });
        });
    }
};