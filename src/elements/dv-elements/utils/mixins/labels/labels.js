if (!window.DcacheViewMixins) {
  window.DcacheViewMixins = {};
}

DcacheViewMixins.LABELS =  Polymer.dedupingMixin((base) =>
{
  return class extends base {
    fileMetadataPromise(message)
    {
      return new Promise((resolve, reject) => {
        const fileMetaDataWorker = new Worker('./scripts/tasks/file-metadata-task-labels.js');
        fileMetaDataWorker.addEventListener('message', (e) => {
          resolve(e.data);
          fileMetaDataWorker.terminate();
        }, false);
        fileMetaDataWorker.addEventListener('error', (err) => {
          reject(err);
          fileMetaDataWorker.terminate();
        }, false);
        fileMetaDataWorker.postMessage(message);
      });
    }
  }
});