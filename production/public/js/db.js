const DB = {
  db: firebase.firestore(),
  post: async (path, data) => await DB.db.collection(path).add(data),
}
