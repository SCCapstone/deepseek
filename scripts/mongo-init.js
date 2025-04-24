// creating text index so that users can be searched for
db = new Mongo().getDB('appdb');
db.createCollection('users');
db.users.createIndex({username: 'text', name: 'text', bio: 'text'});