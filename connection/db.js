const MongoClient = require('mongodb').MongoClient

const dbConnectionUrl = process.env.M_URL

const initialize = (
    dbName,
    dbCollectionName,
    successCallback,
    failureCallback
) => {
    MongoClient.connect(dbConnectionUrl, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`)
            failureCallback(err)
        } else {
            const dbObject = dbInstance.db(dbName)
            const dbCollection = dbObject.collection(dbCollectionName)
            console.log('[MongoDB connection] SUCCES')

            successCallback(dbCollection)
        }
    })
}

module.exports = {
    initialize,
}
