const MongoClient = require('mongodb').MongoClient

const dbConnectionUrl = process.env.M_URL

const initialize = (dbName, successCallback, failureCallback) => {
    MongoClient.connect(dbConnectionUrl, (err, dbInstance) => {
        if (err) {
            console.log(`[MongoDB connection] ERROR: ${err}`)
            failureCallback(err)
        } else {
            const dbObject = dbInstance.db(dbName)
            console.log('[MongoDB connection] SUCCES')
            successCallback(dbObject)
        }
    })
}

module.exports = {
    initialize,
}
