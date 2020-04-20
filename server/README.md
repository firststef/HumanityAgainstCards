# Backend server

## Quick Start

Requires [nodejs](https://nodejs.org/en/)

- ```npm start```
- Enjoy ! The server is now running on the port defined in the config file ^^

## Requests 
### Register : Post to "/auth/register"
Requires : body.username, body.password, body.email, body.nickname.
If all events were sucessfull an email with a confirmation code has been sent to body.email !

### Confirm account  : Post to "/confirm_account/:username/:code"
Returns a cookie session that the user can authentificate with in case of sucess

## Definition of done
### Sprint

- [x] Create and configurate a basic mongodb database 
- [x] Create a database schema for all the required objects
- [x] Create routes that allow addition of white & black cards
- [x] Create a basic filter for the inserted cardsa
- [x] Add routes to properly handle the game manager class
- [x] Populate the database with a given set of cards
- [x] Route to retrieve cards from thew database based on an id (an integer from 0 to .count())
- Next sprint ** [ ] Create a route (or a socket) that returns a list of all avaiable ongoing games
- Next sprint ** [ ] Create a route that allows autentification
- Next sprint ** [ ] Prepare for user page

### Auth 
- Using cookie sessions
- md5 password encoding 

#### Auth requirements
- [ ] Login module
- [ ] Logout route
- [x] Register module
- [ ] Password recovery module trough email
- [ ] Make the module togable

### Ongoing games route
- Returns an object containing an array, of all the ongoing games.
- In order to return 200 it requires the cookie session of the auth module.

#### Ongoing games requirements
- [ ] Allow a set of basic filters to pass trough the request
- [ ] Prepare for pagination (In case a page parameter has been provided as wel, as an elements per page parameter, return only the required numbers of elems)

### Prepare for user page
- Basic routes to return basic info about an user


## How to express
```js
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
```

### Notes
- The route callback function contains 2 objects (request and response)
Using the response methods data is beeing sent back to the chilent, while within the request object we have data about the request that has been made

## Features

  * Robust routing
  * Focus on high performance
  * Super-high test coverage
  * HTTP helpers (redirection, caching, etc)
  * View system supporting 14+ template engines
  * Content negotiation
  * Executable for generating applications quickly

## Docs & Community

  * [Website and Documentation](http://expressjs.com/) - [[website repo](https://github.com/expressjs/expressjs.com)]
  * [#express](https://webchat.freenode.net/?channels=express) on freenode IRC
  * [GitHub Organization](https://github.com/expressjs) for Official Middleware & Modules
  * Visit the [Wiki](https://github.com/expressjs/express/wiki)
  * [Google Group](https://groups.google.com/group/express-js) for discussion
  * [Gitter](https://gitter.im/expressjs/express) for support and discussion
  
  

## How to mongo 
| what          | where                                          |
|---------------|------------------------------------------------|
| documentation | http://mongodb.github.io/node-mongodb-native  |
| api-doc        | http://mongodb.github.io/node-mongodb-native/3.1/api  |
| source        | https://github.com/mongodb/node-mongodb-native |
| mongodb       | http://www.mongodb.org                        |

### Connect to MongoDB

Create a new **app.js** file and add the following code to try out some basic CRUD
operations using the MongoDB driver.

Add code to connect to the server and the database **myproject**:

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});
```

Run your app from the command line with:

```bash
node app.js
```

The application should print **Connected successfully to server** to the console.

### Insert a Document

Add to **app.js** the following function which uses the **insertMany**
method to add three documents to the **documents** collection.

```js
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
```

The **insert** command returns an object with the following fields:

* **result** Contains the result document from MongoDB
* **ops** Contains the documents inserted with added **_id** fields
* **connection** Contains the connection used to perform the insert

Add the following code to call the **insertDocuments** function:

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    client.close();
  });
});
```

Run the updated **app.js** file:

```bash
node app.js
```

The operation returns the following output:

```bash
Connected successfully to server
Inserted 3 documents into the collection
```

### Find All Documents

Add a query that returns all the documents.

```js
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
```

This query returns all the documents in the **documents** collection. Add the **findDocument** method to the **MongoClient.connect** callback:

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    findDocuments(db, function() {
      client.close();
    });
  });
});
```

### Find Documents with a Query Filter

Add a query filter to find only documents which meet the query criteria.

```js
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}
```

Only the documents which match ``'a' : 3`` should be returned.

### Update a document

The following operation updates a document in the **documents** collection.

```js
const updateDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
}
```

The method updates the first document where the field **a** is equal to **2** by adding a new field **b** to the document set to **1**. Next, update the callback function from **MongoClient.connect** to include the update method.

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    updateDocument(db, function() {
      client.close();
    });
  });
});
```

### Remove a document

Remove the document where the field **a** is equal to **3**.

```js
const removeDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}
```

Add the new method to the **MongoClient.connect** callback function.

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    updateDocument(db, function() {
      removeDocument(db, function() {
        client.close();
      });
    });
  });
});
```

### Index a Collection

[Indexes](https://docs.mongodb.org/manual/indexes/) can improve your application's
performance. The following function creates an index on the **a** field in the
**documents** collection.

```js
const indexCollection = function(db, callback) {
  db.collection('documents').createIndex(
    { "a": 1 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};
```

Add the ``indexCollection`` method to your app:

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

const dbName = 'myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    indexCollection(db, function() {
      client.close();
    });
  });
});
```


## How to *"git good"* :)

Downlaod git ```https://git-scm.com/downloads```

- Clone the github repository into a local folder
``` git clone "repo url"```
- Somewone pushed work, you curently don't have ? 
```
git pull
```

- After you have made a few desired changes in order to commit them pull first and then commit ^^
```
git pull
git add . #to add all the changes made to the repo. (or instead of "." passs a file with a relative path)
git commit -m "Some commit message"
git push origin master #or instead of the master branch the branch you wich to work on
```

- Did u make any undesired changes to the repo ? 
```
git stash # Moves all the curent changes you made, that arrent commited, on a separated memory stash.
git stash drop # drops the stashed memory
```

- Recover the stashed memory (You can store multiple changes in stashes)
```
git stash apply stash # apply top of stash stack
```

- Don't know if u amde any changes you need to commit  ? 
```
git status # see if there's anything you need to commit
```

- Want to change the branch you are currently working n ? 
```
git checkout "branch name"
```

- Want to see the branches that are being worked on locally ? 
```
git branch
```

- Create a new branch to store any new changes
```
git branch my-branch
```

- switch to that branch (line of development)
```
git checkout my-branch
```

- Merge lines of development together. 
This command is typically used to combine changes made on two distinct branches. 
For example, a developer would merge when they want to combine changes from a feature branch into the master branch for deployment.
```
git merge
```

## For more please check out https://guides.github.com/introduction/git-handbook/
